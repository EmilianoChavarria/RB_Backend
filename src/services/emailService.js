require('dotenv').config();
const nodemailer = require('nodemailer');
const db = require('../database/dbConnection');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async sendInvitation(guestId, trx = db) {
        try {
            const guest = await trx('guest').where('id_guest', guestId).first();
            if (!guest) throw new Error('Invitado no encontrado');

            if (!guest.invitation_id_invitation)
                throw new Error('El invitado no está asociado a ninguna invitación');

            const invitation = await trx('invitation')
                .where('id_invitation', guest.invitation_id_invitation)
                .first();

            if (!invitation)
                throw new Error('Invitación no encontrada');

            // Obtener el template relacionado
            const template = await trx('templates')
                .where('id_templates', invitation.templates_id_templates)
                .first();

            if (!template || !template.image || !template.mime_type)
                throw new Error('Plantilla inválida o sin imagen');

            const mailOptions = {
                from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
                to: guest.email,
                subject: `Invitación a ${invitation.event_name || 'nuestro evento'}`,
                html: this.generateInvitationTemplate(guest, invitation),
                text: this.generateTextVersion(guest, invitation),
                attachments: [
                    {
                        filename: 'imagen-template.png',
                        content: template.image, // debe ser un Buffer
                        contentType: template.mime_type,
                        cid: 'templateImage' // Content-ID usado en el <img src="cid:templateImage">
                    }
                ]
            };

            const info = await this.transporter.sendMail(mailOptions);

            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(`Error enviando invitación a ${guestId}:`, error);
            throw error;
        }
    }

    generateInvitationTemplate(guest, invitation) {
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 650px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #6a1b9a;
      color: white;
      padding: 40px 30px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: 1px;
    }

    .content {
      padding: 30px;
    }

    .content p {
      font-size: 16px;
      color: #444;
      margin-bottom: 20px;
    }

    .content img {
      display: block;
      margin: 0 auto 25px auto;
      max-width: 250px;
      border-radius: 10px;
    }

    .details {
      background-color: #f9f9f9;
      border-left: 4px solid #6a1b9a;
      padding: 20px;
      margin: 20px 0;
      border-radius: 6px;
    }

    .details h3 {
      margin-top: 0;
      color: #6a1b9a;
    }

    .details p {
      margin: 5px 0;
      color: #333;
      font-weight: 500;
    }

    .button {
      display: inline-block;
      padding: 14px 26px;
      background-color: #6a1b9a;
      color: #fff !important;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background-color: #53127d;
    }

    .footer {
      font-size: 12px;
      color: #999;
      text-align: center;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Estás invitado!</h1>
    </div>
    <div class="content">
      <p>Hola ${guest.name} ${guest.lastname} ${guest.surname},</p>
      <p>Te invitamos cordialmente a nuestro evento especial. ¡Será un gusto contar con tu presencia!</p>

      <img src="cid:templateImage" alt="Imagen del evento" />

      <div class="details">
        <h3>Detalles del evento:</h3>
        <p><strong>Fecha:</strong> ${new Date(invitation.scheduled_at).toLocaleDateString()}</p>
        <p><strong>Hora:</strong> ${new Date(invitation.scheduled_at).toLocaleTimeString()}</p>
        <p><strong>Lugar:</strong> ${invitation.address}</p>
        ${invitation.additional_notes ? `<p><strong>Notas:</strong> ${invitation.additional_notes}</p>` : ''}
      </div>

      <p style="text-align:center;">
        <a href="#" class="button">Confirmar Asistencia</a>
      </p>

      <p style="font-size: 14px; color: #666;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
      <small>#</small></p>

      <p style="margin-top: 40px;">Atentamente,<br><strong>El equipo organizador</strong></p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Todos los derechos reservados.
    </div>
  </div>
</body>
</html>`;

    }

    generateTextVersion(guest, invitation) {
        return `
Hola ${guest.name},

¡Estás invitado a nuestro evento!

Detalles:
- Fecha: ${new Date(invitation.scheduled_at).toLocaleDateString()}
- Hora: ${new Date(invitation.scheduled_at).toLocaleTimeString()}
- Lugar: ${invitation.address}
${invitation.additional_notes ? `- Notas: ${invitation.additional_notes}\n` : ''}

Atentamente,
El equipo organizador`;
    }
}

module.exports = new EmailService();
