const guestService = require('../services/guestService');
const { EmailService, sendRecoveryEmail } = require('../services/emailService');

// Crear una instancia del servicio de email
const emailService = new EmailService();

exports.getAll = async (req, res) => {
  try {
    const guests = await guestService.getAll();
    res.json({ data: guests, error: false });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener todos los invitados', error: err.message });
  }
};

exports.createGuests = async (req, res) => {
  try {
    const { guests, invitationId } = req.body;
    await guestService.createGuests(guests, invitationId);
    res.status(201).json({ message: 'Invitados creados correctamente', error: false });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear invitados', error: err.message });
  }
};

exports.updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    await guestService.updateGuest(id, req.body);
    res.json({ message: 'Invitado actualizado correctamente', error: false });
  } catch (err) {
    res.status(500).json({ message: err.message, error: true });
  }
};

exports.getGuests = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const guests = await guestService.getGuestsByInvitation(invitationId);
    res.json({ data: guests, error: false });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener invitados', error: err.message });
  }
};

exports.toggleGuest = async (req, res) => {
  try {
    const { id } = req.params;
    await guestService.toggleGuestStatus(id);
    res.json({ message: 'Estado de invitado actualizado', error: false });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar invitado', error: err.message });
  }
};

exports.findGuestsByEvent = async (req, res) => {
  try {
    const data = await guestService.findGuestsByEvent(req.params.id_event);
    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: 'Error al consultar los invitados del evento',
      error: e.message
    });
  }
};

exports.sendInvitationEmail = async (req, res) => {
  try {
    const { id } = req.params; // id del invitado
    
    // Verificar que el servicio esté inicializado correctamente
    if (!emailService || !(emailService instanceof EmailService)) {
      throw new Error('Servicio de email no inicializado correctamente');
    }

    const result = await emailService.sendInvitation(id);
    res.json({ 
      success: true, 
      message: 'Invitación enviada correctamente', 
      messageId: result.messageId 
    });
  } catch (error) {
    console.error('Error en sendInvitationEmail:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};