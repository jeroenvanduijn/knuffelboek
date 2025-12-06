"""
Email Service - Versturen van notificatie emails
"""
import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

logger = logging.getLogger(__name__)


class EmailService:
    """Service voor het versturen van emails via SMTP"""

    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("SMTP_FROM", self.smtp_user)
        self.from_name = os.getenv("SMTP_FROM_NAME", "Knuffelboek")

    @property
    def is_configured(self) -> bool:
        """Check of email service is geconfigureerd"""
        return bool(self.smtp_user and self.smtp_password)

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """
        Verstuur een email.

        Returns:
            True als succesvol, False bij fout
        """
        if not self.is_configured:
            logger.warning("Email service niet geconfigureerd - email niet verstuurd")
            return False

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = to_email

            # Plain text fallback
            if text_content:
                part1 = MIMEText(text_content, "plain", "utf-8")
                msg.attach(part1)

            # HTML content
            part2 = MIMEText(html_content, "html", "utf-8")
            msg.attach(part2)

            # Connect and send
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.from_email, to_email, msg.as_string())

            logger.info(f"Email verstuurd naar {to_email}: {subject}")
            return True

        except Exception as e:
            logger.error(f"Fout bij versturen email naar {to_email}: {e}")
            return False

    def send_book_completed_notification(
        self,
        to_email: str,
        child_name: str,
        book_title: str,
        book_id: str,
        base_url: str
    ) -> bool:
        """
        Stuur een notificatie dat een boek klaar is.

        Args:
            to_email: Email adres van de gebruiker
            child_name: Naam van het kind
            book_title: Titel van het boek
            book_id: ID van het boek
            base_url: Basis URL van de applicatie (bijv. https://example.ngrok.io)
        """
        subject = f"Het boek van {child_name} is klaar!"

        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #8B4513;
        }}
        .header h1 {{
            color: #8B4513;
            margin: 0;
        }}
        .content {{
            padding: 30px 0;
        }}
        .button {{
            display: inline-block;
            background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
            color: white !important;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
        }}
        .button:hover {{
            background: linear-gradient(135deg, #A0522D 0%, #8B4513 100%);
        }}
        .footer {{
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }}
        .emoji {{
            font-size: 48px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Knuffelboek</h1>
    </div>

    <div class="content">
        <p class="emoji" style="text-align: center;">🎉📖</p>

        <h2 style="text-align: center;">Het boek van {child_name} is klaar!</h2>

        <p>Goed nieuws! We zijn klaar met het maken van <strong>"{book_title}"</strong>.</p>

        <p>Je kunt nu:</p>
        <ul>
            <li>Het boek bekijken in de preview</li>
            <li>Het boek downloaden als PDF</li>
            <li>Een fysiek hardcover of softcover boek bestellen</li>
        </ul>

        <p style="text-align: center;">
            <a href="{base_url}/#my-books" class="button">Bekijk je boek</a>
        </p>

        <p>Heb je vragen? Reply gewoon op deze email.</p>
    </div>

    <div class="footer">
        <p>Dit is een automatisch bericht van Knuffelboek.</p>
        <p>Je ontvangt dit bericht omdat je een boek hebt aangemaakt op {base_url}</p>
    </div>
</body>
</html>
"""

        text_content = f"""
Het boek van {child_name} is klaar!

Goed nieuws! We zijn klaar met het maken van "{book_title}".

Je kunt nu:
- Het boek bekijken in de preview
- Het boek downloaden als PDF
- Een fysiek hardcover of softcover boek bestellen

Bekijk je boek: {base_url}/#my-books

Dit is een automatisch bericht van Knuffelboek.
"""

        return self.send_email(to_email, subject, html_content, text_content)

    def send_book_queued_notification(
        self,
        to_email: str,
        child_name: str,
        toy_name: str,
        queue_position: int,
        estimated_minutes: int,
        base_url: str
    ) -> bool:
        """
        Stuur een notificatie dat een boek in de wachtrij staat.

        Args:
            to_email: Email adres van de gebruiker
            child_name: Naam van het kind
            toy_name: Naam van de knuffel
            queue_position: Positie in de wachtrij (1 = wordt nu gemaakt)
            estimated_minutes: Geschatte wachttijd in minuten
            base_url: Basis URL van de applicatie
        """
        if queue_position <= 1:
            status_text = "wordt nu gemaakt"
            emoji = "🎨"
        else:
            status_text = f"staat op positie {queue_position} in de wachtrij"
            emoji = "⏳"

        subject = f"Je boek voor {child_name} {status_text}!"

        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #8B4513;
        }}
        .header h1 {{
            color: #8B4513;
            margin: 0;
        }}
        .content {{
            padding: 30px 0;
        }}
        .status-box {{
            background: #FFF8DC;
            border: 2px solid #DEB887;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }}
        .status-emoji {{
            font-size: 48px;
        }}
        .button {{
            display: inline-block;
            background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
            color: white !important;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
        }}
        .footer {{
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Knuffelboek</h1>
    </div>

    <div class="content">
        <div class="status-box">
            <p class="status-emoji">{emoji}</p>
            <h2>Je boek {status_text}!</h2>
            <p>We maken een bijzonder verhaal over <strong>{child_name}</strong> en <strong>{toy_name}</strong>.</p>
            <p>Geschatte tijd: <strong>~{estimated_minutes} minuten</strong></p>
        </div>

        <p>Wat gebeurt er nu?</p>
        <ul>
            <li>We schrijven een uniek verhaal speciaal voor {child_name}</li>
            <li>We maken prachtige illustraties met {toy_name}</li>
            <li>Je krijgt een email zodra het boek klaar is!</li>
        </ul>

        <p style="text-align: center;">
            <a href="{base_url}/#my-books" class="button">Bekijk voortgang</a>
        </p>

        <p><em>Je kunt dit tabblad sluiten - we mailen je wanneer het klaar is.</em></p>
    </div>

    <div class="footer">
        <p>Dit is een automatisch bericht van Knuffelboek.</p>
    </div>
</body>
</html>
"""

        text_content = f"""
Je boek voor {child_name} {status_text}!

We maken een bijzonder verhaal over {child_name} en {toy_name}.
Geschatte tijd: ~{estimated_minutes} minuten

Wat gebeurt er nu?
- We schrijven een uniek verhaal speciaal voor {child_name}
- We maken prachtige illustraties met {toy_name}
- Je krijgt een email zodra het boek klaar is!

Bekijk voortgang: {base_url}/#my-books

Je kunt dit tabblad sluiten - we mailen je wanneer het klaar is.

Dit is een automatisch bericht van Knuffelboek.
"""

        return self.send_email(to_email, subject, html_content, text_content)


# Singleton instance
email_service = EmailService()
