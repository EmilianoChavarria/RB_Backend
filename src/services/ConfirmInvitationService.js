const db = require('../database/dbConnection');

const saveConfirmation = async (confirmationData) => {
    const guest = await db('guest')
        .where({ id_guest: confirmationData.guest_id_guest })
        .first();

    if (!guest) {
        throw new Error('El invitado no existe');
    }

    const today = new Date().toISOString().split('T')[0];

    const dataToInsert = {
        ...confirmationData,
        guest_id_guest: guest.id_guest,
        response_date: today

    };

    const [insertedId] = await db('confirmed_guests').insert(dataToInsert);

    const newRecord = await db('confirmed_guests')
        .where({ id_confirmed_guests: insertedId })
        .first();

    return newRecord;
};

const findOne = async (guestId) => {
    const confirmation = await db('confirmed_guests')
        .where({ guest_id_guest: guestId })
        .first();

    if (!confirmation) {
        throw new Error('No se encontró la confirmación para este invitado');
    }

    return confirmation;
};

const updateConfirmation = async (confirmationData, uuid) => {
    console.log("uuid del ivitado"    , uuid);
    const guest = await db('guest')
        .where({ uuid_guest: uuid })
        .first();

    console.log("objeto del invitado encontrado",guest)
    if (!guest) throw new Error('El invitado no existe');

    await db('confirmed_guests')
        .where({ guest_id_guest: guest.id_guest })
        .update(confirmationData);

    const updated = await db('confirmed_guests')
        .where({ guest_id_guest: guest.id_guest })
        .first();

    return updated;
};

module.exports = {
    saveConfirmation,
    findOne,
    updateConfirmation
};
