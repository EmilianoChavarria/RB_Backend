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
        // 1. Obtener datos del invitado
        const guest = await trx('guest').where('id_guest', guestId).first();
        if (!guest) throw new Error('Invitado no encontrado');

        // 2. Obtener ID de invitación
        const invitationId = guest.invitation_id || guest.invitation_id_invitation;
        if (!invitationId) throw new Error('El invitado no tiene invitación asociada');

        // 3. Buscar la invitación principal
        const invitation = await trx('invitation')
            .where('id_invitation', invitationId)
            .first();
        if (!invitation) throw new Error('Invitación principal no encontrada');

        // 4. Buscar imagen temporal
        const tempInvitation = await trx('temp_invitations')
            .where('invitation_id', invitationId)
            .first();

        if (!tempInvitation) {
            throw new Error('No se encontró diseño de invitación temporal');
        }

        // 5. Procesamiento de imagen
        const attachments = [];
        
        if (tempInvitation.file_path) {
            // Usar ruta de archivo
            attachments.push({
                filename: 'invitacion.png',
                path: tempInvitation.file_path,
                cid: 'invitationImage'
            });
        } 
        else if (tempInvitation.invitation_image) {
            // Usar imagen base64
            const base64Data = tempInvitation.invitation_image.replace(/^data:image\/\w+;base64,/, '');
            attachments.push({
                filename: 'invitacion.png',
                content: Buffer.from(base64Data, 'base64'),
                contentType: 'image/png',
                cid: 'invitationImage'
            });
        } 
        else {
            throw new Error('No se encontró imagen en el diseño temporal');
        }

        // 6. Configurar el correo
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: guest.email,
            subject: `Invitación a ${invitation.event_name || 'nuestro evento'}`,
            html: this.generateInvitationTemplate(guest, invitation),
            text: this.generateTextVersion(guest, invitation),
            attachments: attachments
        };

        // 7. Enviar el correo
        const info = await this.transporter.sendMail(mailOptions);
        
        // 8. Actualizar estado (solo si las columnas existen)
        try {
            // Verificar qué columnas existen para marcar como enviado
            const guestColumns = await trx('guest').columnInfo();
            const updateData = {};
            
            if (guestColumns.invitation_sent) {
                updateData.invitation_sent = true;
            }
            if (guestColumns.invitation_sent_at) {
                updateData.invitation_sent_at = new Date();
            }
            if (guestColumns.status) {
                updateData.status = 'invitation_sent';
            }
            
            if (Object.keys(updateData).length > 0) {
                await trx('guest').where('id_guest', guestId).update(updateData);
            }
        } catch (updateError) {
            console.warn('No se pudo actualizar el estado del invitado:', updateError.message);
        }

        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error(`Error enviando invitación a ${guestId}:`, error);
        throw new Error(`Error al enviar invitación: ${error.message}`);
    }
}

    generateInvitationTemplate(guest, invitation) {
      const url = `${process.env.FRONTEND_URL}/confirm-/${token}`;
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 650px; margin: 30px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
    .header { background-color: #6a1b9a; color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
    .content { padding: 30px; }
    .content p { font-size: 16px; color: #444; margin-bottom: 20px; }
    .details { background-color: #f9f9f9; border-left: 4px solid #6a1b9a; padding: 20px; margin: 20px 0; border-radius: 6px; }
    .details h3 { margin-top: 0; color: #6a1b9a; }
    .details p { margin: 5px 0; color: #333; font-weight: 500; }
    .button { display: inline-block; padding: 14px 26px; background-color: #6a1b9a; color: #fff !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; transition: background-color 0.3s ease; }
    .button:hover { background-color: #53127d; }
    .footer { font-size: 12px; color: #999; text-align: center; padding: 20px; }
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
      <img src="cid:invitationImage" alt="Invitación" style="max-width: 100%; height: auto; margin-bottom: 20px;"/>
      <div class="details">
        <h3>Detalles del evento:</h3>
        <p><strong>Fecha:</strong> ${new Date(invitation.scheduled_at).toLocaleDateString()}</p>
        <p><strong>Hora:</strong> ${new Date(invitation.scheduled_at).toLocaleTimeString()}</p>
        <p><strong>Lugar:</strong> ${invitation.address}</p>
        ${invitation.additional_notes ? `<p><strong>Notas:</strong> ${invitation.additional_notes}</p>` : ''}
      </div>
      <p style="text-align:center;">
      <a  href="${url}" class="button">Confirmar Asistencia</a>
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

const sendRecoveryEmail = async (to, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    });

    const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to,
        subject: "Recuperación de contraseña",
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px; }
    h2 { color: #ff1becff; }
    p { color: #333; font-size: 16px; }
    .button { display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #ff1becff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .footer { margin-top: 40px; font-size: 12px; color: #888; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Restablecimiento de Contraseña</h2>
    <p>Hola,</p>
    <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
    <p>Haz clic en el siguiente botón para continuar:</p>
    <a href="${url}" class="button">Restablecer contraseña</a>
    <p>Este enlace expirará en 15 minutos por seguridad.</p>
    <div class="footer">Si tú no solicitaste este cambio, puedes ignorar este correo.</div>
  </div>
</body>
</html>`
    });
};

module.exports = {
    EmailService,
    emailService: new EmailService(),
    sendRecoveryEmail
};
