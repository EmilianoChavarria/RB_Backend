const { v4: uuidv4 } = require('uuid');
const db = require('../database/dbConnection');
const emailService = require('./emailService');

const createGuests = async (guestsArray, invitationId) => {
  return await db.transaction(async trx => {
    const emails = guestsArray.map(g => g.email?.toLowerCase());

    const existingGuests = await trx('guest')
        .where('invitation_id_invitation', invitationId)
        .whereIn('email', emails.filter(e => e))
        .select('email');

    if (existingGuests.length > 0) {
      const existingEmails = existingGuests.map(g => g.email);
      throw new Error(`Los siguientes correos ya están registrados para esta invitación: ${existingEmails.join(', ')}`);
    }

    const guestsWithInvitation = guestsArray.map(guest => ({
      ...guest,
      uuid_guest: uuidv4(), // Aquí generas el UUID
      email: guest.email?.toLowerCase(),
      invitation_id_invitation: invitationId,
      status: true
    }));

    const insertResult = await trx('guest').insert(guestsWithInvitation);

    const firstId = insertResult[0];
    for (let i = 0; i < guestsWithInvitation.length; i++) {
      const guestId = firstId + i;
      await emailService.sendInvitation(guestId, trx);
    }

    return { success: true };
  });
};

const getGuestsByInvitation = async (invitationId) => {
  return await db('guest')
    .where({ 
      invitation_id_invitation: invitationId,
      status: true 
    })
    .select('*');
};

const toggleGuestStatus = async (guestId) => {
  const guest = await db('guest').where({ id_guest: guestId }).first();
  if (!guest) throw new Error('Invitado no encontrado');

  return await db('guest')
    .where({ id_guest: guestId })
    .update({ status: !guest.status });
};

const updateGuest = async (guestId, guestData) => {
  const guest = await db('guest').where({ id_guest: guestId }).first();
  if (!guest) throw new Error('Invitado no encontrado');

  // Si se está actualizando el email, verificar que no exista en la misma invitación
  if (guestData.email) {
    const normalizedEmail = guestData.email.toLowerCase();
    const existingGuest = await db('guest')
      .where('invitation_id_invitation', guest.invitation_id_invitation)
      .where('email', normalizedEmail)
      .whereNot('id_guest', guestId)
      .first();

    if (existingGuest) {
      throw new Error('El correo electrónico ya está registrado para otro invitado en esta invitación');
    }

    guestData.email = normalizedEmail;
  }

  return await db('guest')
    .where({ id_guest: guestId })
    .update(guestData);
};

const findGuestsByEvent = async (idEvent) => {

  if (typeof idEvent !== 'number' || isNaN(idEvent)) {
    throw new Error('El idEvent debe ser un número válido');
  }

  // Validar que sea un entero positivo
  if (!Number.isInteger(idEvent) || idEvent <= 0) {
    throw new Error('El idEvent debe ser un entero positivo');
  }


  const event = await db('invitation').where({id_invitation: idEvent}).first();
    if (!event){
      throw new Error('El envento no existe');
    }
  const guests = await db('guest').where({invitation_id_invitation:idEvent});
  if (guests.length<1){
    throw new Error('No hay invitados asignados a este evento');
  }

  return guests;
};

module.exports = {
  createGuests,
  getGuestsByInvitation,
  toggleGuestStatus,
  updateGuest,
   findGuestsByEvent
};