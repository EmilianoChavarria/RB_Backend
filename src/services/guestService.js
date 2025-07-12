const db = require('../database/dbConnection');

const createGuests = async (guestsArray, invitationId) => {
  return await db.transaction(async trx => {
    const emails = guestsArray.map(g => g.email?.toLowerCase());

    // Guest unico por email
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
      email: guest.email?.toLowerCase(),
      invitation_id_invitation: invitationId,
      status: true
    }));

    return await trx('guest').insert(guestsWithInvitation);
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

module.exports = {
  createGuests,
  getGuestsByInvitation,
  toggleGuestStatus
};