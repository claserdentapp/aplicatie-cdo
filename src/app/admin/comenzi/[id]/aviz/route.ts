import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import { PDF_TEMPLATE_BASE64 } from "@/lib/pdf-template";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    // Fetch order
    const { data: order, error } = await supabase
      .from("orders")
      .select("id,nume_pacient,tip_lucrare,material,culoare_vita,data_intrare,data_livrare_estimata,instructiuni,doctor_id,doctor:profiles(nume_doctor,nume_clinica)")
      .eq("id", id)
      .maybeSingle();

    if (error || !order) return new NextResponse('Not found', { status: 404 });

    const docObj = Array.isArray((order as any).doctor) ? (order as any).doctor[0] : (order as any).doctor;
    const doctorName = docObj?.nume_doctor ?? order.doctor_id;

    // Load PDF
    const pdfDoc = await PDFDocument.load(PDF_TEMPLATE_BASE64);
    const page = pdfDoc.getPages()[0];
    const { height } = page.getSize(); // Standard A4 is height 842, width 595

    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Helper to draw text. (Origin 0,0 is BOTTOM-LEFT in PDF). 
    const fontSize = 11;
    const color = rgb(0.1, 0.1, 0.1); // slight off-black for premium look

    // Remove Romanian diacritics because standard PDF fonts (WinAnsi) don't support them
    const safeText = (str: any) => {
      if (!str) return '';
      return String(str)
        .replace(/ț/g, 't').replace(/Ț/g, 'T')
        .replace(/ș/g, 's').replace(/Ș/g, 'S')
        .replace(/ă/g, 'a').replace(/Ă/g, 'A')
        .replace(/î/g, 'i').replace(/Î/g, 'I')
        .replace(/â/g, 'a').replace(/Â/g, 'A');
    };

    const formatDate = (dateStr: any) => {
      if (!dateStr) return '';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('ro-RO');
      } catch {
        return dateStr;
      }
    };

    // Doctor Name
    page.drawText(safeText(doctorName), { x: 420, y: height - 257, size: fontSize, font, color });
    
    // Pacient Name (Considerat okay)
    page.drawText(safeText(order.nume_pacient), { x: 420, y: height - 297, size: fontSize, font, color });
    
    // Culoare (Ajustat în sus pentru a intra în căsuță)
    page.drawText(safeText(order.culoare_vita), { x: 375, y: height - 312, size: fontSize, font, color });
    
    // Termen de livrare (Ajustat puțin mai sus conform cerinței)
    page.drawText(safeText(formatDate(order.data_livrare_estimata)), { x: 420, y: height - 357, size: fontSize, font, color });

    // Tip Lucrare (Checkmarks)
    const matText = (order.tip_lucrare || '').toLowerCase().replace(/\s+/g, '');
    let matchedMaterial = false;

    // Y coordinates (ridicate cu 4 unități pentru a fi centrate perfect vertical)
    const row1Y = height - 323; 
    const row2Y = height - 343; 
    const row3Y = height - 363; 

    // X coordinates (mutate cu 5 unități la dreapta pentru a fi centrate orizontal)
    const col1X = 95;
    const col2X = 160;
    const col3X = 225;
    const col4X = 290;

    const drawCheck = (xPos: number, yPos: number) => {
        page.drawText('X', { x: xPos, y: yPos, size: 14, font, color });
    }

    // Rândul 1 (MC Basic, MC Pers, Zr + e.max)
    if (matText.includes('mcbasic')) { drawCheck(col2X, row1Y); matchedMaterial = true; }
    else if (matText.includes('mcpers')) { drawCheck(col3X, row1Y); matchedMaterial = true; }
    else if (matText.includes('zr.+e.max') || matText.includes('zremax')) { drawCheck(col4X, row1Y); matchedMaterial = true; }
    
    // Rândul 2 (Monolitici, PMMA, Fateta dent, Scheletata)
    else if (matText.includes('monolitici')) { drawCheck(col1X, row2Y); matchedMaterial = true; }
    else if (matText.includes('pmma')) { drawCheck(col2X, row2Y); matchedMaterial = true; }
    else if (matText.includes('fateta')) { drawCheck(col3X, row2Y); matchedMaterial = true; }
    else if (matText.includes('scheletata')) { drawCheck(col4X, row2Y); matchedMaterial = true; }
    
    // Rândul 3 (DCR Zr, DCR CrCo, Onlay/Inlay, All On X)
    else if (matText.includes('dcrzr')) { drawCheck(col1X, row3Y); matchedMaterial = true; }
    else if (matText.includes('dcrcrco')) { drawCheck(col2X, row3Y); matchedMaterial = true; }
    else if (matText.includes('onlay') || matText.includes('inlay')) { drawCheck(col3X, row3Y); matchedMaterial = true; }
    else if (matText.includes('allonx')) { drawCheck(col4X, row3Y); matchedMaterial = true; }

    if (!matchedMaterial && order.tip_lucrare) {
        // Dacă e un tip de lucrare manual care nu e în listă, îl printăm sub tabel
        page.drawText(safeText(order.tip_lucrare), { x: 40, y: height - 392, size: fontSize, font, color });
    }

    // Notite
    const notesY = height - 510;
    if (order.instructiuni) {
       page.drawText(safeText(order.instructiuni).substring(0, 500), { 
           x: 330, 
           y: notesY, 
           size: 10, 
           font,
           color,
           maxWidth: 220,
           lineHeight: 14
       });
    }

    const modifiedPdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(modifiedPdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Fisa_Laborator_${order.nume_pacient || 'Comanda'}.pdf"`
      }
    });

  } catch (err: any) {
    console.error(err);
    return new NextResponse(`Eroare de generare PDF: ${err.message}\n${err.stack}`, { status: 500 });
  }
}
