const guestService = require('../services/guestService');

exports.createGuests = async (req, res) => {
  try {
    const { guests, invitationId } = req.body;
    await guestService.createGuests(guests, invitationId);
    res.status(201).json({ message: 'Invitados creados correctamente', error: false });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear invitados', error: err.message });
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