import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'E-mail service is niet geconfigureerd' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht' },
        { status: 400 }
      );
    }

    // Map subject values to readable text
    const subjectMap: Record<string, string> = {
      order: 'Vraag over mijn bestelling',
      product: 'Vraag over het product',
      technical: 'Technisch probleem',
      feedback: 'Feedback of suggestie',
      business: 'Zakelijk voorstel',
      other: 'Anders',
    };

    const subjectText = subjectMap[subject] || subject;

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: 'Knuffelboek Contact <noreply@knuffelboek.nl>',
      to: ['info@knuffelboek.nl'],
      replyTo: email,
      subject: `[Contact] ${subjectText} - ${name}`,
      html: `
        <h2>Nieuw contactformulier bericht</h2>
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Onderwerp:</strong> ${subjectText}</p>
        <hr />
        <h3>Bericht:</h3>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Er ging iets mis bij het verzenden' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verzenden' },
      { status: 500 }
    );
  }
}
