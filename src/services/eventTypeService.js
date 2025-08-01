const db = require('../database/dbConnection');

const getAll = async () => {
    return await db('event_type').select('*').where('status', true);
};

const createEventType = async (eventTypeData) => {
    const { name } = eventTypeData;

    // Verificar nombre único
    const existingType = await db('event_type').where({ name }).first();
    if (existingType) {
        throw new Error('El nombre del tipo de evento ya existe');
    }

    const newEventType = {
        name,
        status: true
    };

    return await db('event_type').insert(newEventType);
};

const updateEventType = async (id_event_type, eventTypeData) => {
    const eventType = await db('event_type').where({ id_event_type }).first();
    if (!eventType) throw new Error('Tipo de evento no encontrado');

    return await db('event_type')
        .where({ id_event_type })
        .update(eventTypeData);
};

const deleteEventType = async (id_event_type) => {
    const eventType = await db('event_type').where({ id_event_type }).first();
    if (!eventType) throw new Error('Tipo de evento no encontrado');

    return await db('event_type')
        .where({ id_event_type })
        .update({ status: false });
};

const findOne = async (id) => {
    const numericId = Number(id);

    const eventType = await db('event_type').where({ id_event_type: numericId }).first();

    if (!eventType) {
        throw new Error('Tipo de evento no encontrado');
    }

    return eventType;
};

module.exports = {
    getAll,
    createEventType,
    updateEventType,
    deleteEventType,
    findOne
};