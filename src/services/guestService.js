const db = require('../database/dbConnection');

const createGuests = async (guestsArray, invitationId) => {
  return await db.transaction(async trx => {
    const guestsWithInvitation = guestsArray.map(guest => ({
      ...guest,
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