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
    page.drawText(safeText(doctorName), { x: 410, y: height - 267, size: fontSize, font, color });
    
    // Pacient Name
    page.drawText(safeText(order.nume_pacient), { x: 410, y: height - 309, size: fontSize, font, color });
    
    // Culoare
    page.drawText(safeText(order.culoare_vita), { x: 390, y: height - 342, size: fontSize, font, color });
    
    // Termen de livrare
    page.drawText(safeText(formatDate(order.data_livrare_estimata)), { x: 410, y: height - 395, size: fontSize, font, color });

    // Material (Checkmarks)
    const matY = height - 415; // Centered inside the box
    const drawCheck = (xPos: number) => {
        page.drawText('X', { x: xPos, y: matY, size: 14, font, color });
    }
    
    const matText = (order.tip_lucrare || '').toLowerCase().replace(/\s+/g, '');
    let matchedMaterial = false;
    // Păstrăm coordonatele vechi în caz că PDF-ul vechi e încă folosit parțial,
    // dar cel mai probabil va trebui să ajustezi coordonatele X și Y pentru noul șablon.
    if (matText.includes('zirconiu')) { drawCheck(78); matchedMaterial = true; }
    else if (matText.includes('aur')) { drawCheck(168); matchedMaterial = true; }
    else if (matText.includes('crco') || matText.includes('cr-co')) { drawCheck(228); matchedMaterial = true; }
    else if (matText.includes('cr.ni') || matText.includes('crni')) { drawCheck(305); matchedMaterial = true; }
    else if (matText.includes('titan')) { drawCheck(393); matchedMaterial = true; }

    if (!matchedMaterial && order.tip_lucrare) {
        // Draw the text manually if it's not one of the pre-defined checkboxes
        page.drawText(safeText(order.tip_lucrare), { x: 450, y: matY, size: fontSize, font, color });
    }

    // Notite
    // Multi-line text for instructions
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
