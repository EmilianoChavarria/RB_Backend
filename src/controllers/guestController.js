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

exports.findGuestsByEvent = async  (req, res) =>{
  try {

    const data = await  guestService.findGuestsByEvent(req.params.id_event);

    return res.status(200).json({
      success:true,
      data:data
    })

  }catch (e){
    return res.status(400).json({
      success:false,
      message : 'error al consultar los iinvitados del evento',
      error: e.message
    })
  }
}