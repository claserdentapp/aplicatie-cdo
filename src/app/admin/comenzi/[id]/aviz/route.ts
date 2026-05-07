import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, rgb } from 'pdf-lib';
import { readFileSync } from 'fs';
import path from 'path';

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

    const doctor = (order as any).doctor?.[0] ?? null;
    const doctorName = doctor?.nume_doctor ?? order.doctor_id;

    // Load PDF
    const pdfPath = path.join(process.cwd(), 'public', 'fise_de_laborator.pdf');
    const pdfBytes = readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];
    const { height } = page.getSize(); // Standard A4 is height 842, width 595

    // Helper to draw text. (Origin 0,0 is BOTTOM-LEFT in PDF). 
    // The image has lines where we need to draw.
    // Approximate coordinates (can be tweaked later):
    const fontSize = 12;
    const color = rgb(0, 0, 0);

    // X coordinates (from left edge). The right column seems to start around X=300
    const colRightX = 300;
    
    // Y coordinates (from bottom). 
    // If we assume standard proportions:
    // Doctor Name
    page.drawText(doctorName, { x: colRightX + 100, y: height - 265, size: fontSize, color });
    
    // Pacient Name
    page.drawText(order.nume_pacient || '', { x: colRightX + 110, y: height - 315, size: fontSize, color });
    
    // Culoare
    page.drawText(order.culoare_vita || '', { x: colRightX + 60, y: height - 365, size: fontSize, color });
    
    // Termen de livrare
    page.drawText(order.data_livrare_estimata || '', { x: colRightX + 110, y: height - 415, size: fontSize, color });

    // Material (Checkmarks)
    // "Zirconiu", "Aur", "CrCo", "Cr.Ni", "Titan"
    // The material section is a full width row, Y is around 380 from bottom.
    const matY = height - 460;
    const drawCheck = (xPos: number) => {
        page.drawText('X', { x: xPos, y: matY, size: 14, color });
    }
    
    const matText = (order.material || '').toLowerCase();
    if (matText.includes('zirconiu')) drawCheck(85);
    else if (matText.includes('aur')) drawCheck(155);
    else if (matText.includes('crco') || matText.includes('cr-co')) drawCheck(225);
    else if (matText.includes('cr.ni') || matText.includes('crni')) drawCheck(295);
    else if (matText.includes('titan')) drawCheck(365);

    // Notite
    // Multi-line text for instructions
    const notesY = height - 530;
    if (order.instructiuni) {
       // A very basic text wrap could be done, or just print as is if short.
       page.drawText(order.instructiuni.substring(0, 500), { 
           x: 350, 
           y: notesY, 
           size: 10, 
           color,
           maxWidth: 200,
           lineHeight: 14
       });
    }

    const modifiedPdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(modifiedPdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Fisa_Laborator_${order.nume_pacient}.pdf"`
      }
    });

  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
