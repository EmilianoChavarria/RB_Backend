const db = require('../database/dbConnection');


const save = async (invitationData) => {

    const user = await db('user').where({ id_user: invitationData.user_id_user }).first();
    if (!user) throw new Error('Usuario no encontrado');
    if (!user.status) throw new Error('Usuario eliminado o no activo');


    const template = await db('templates').where({ id_templates: invitationData.templates_id_templates }).first();
    if (!template) throw new Error('Plantilla no encontrada');
    if (!template.status) throw new Error('Plantilla no disponible');


    invitationData.scheduled_at = new Date(invitationData.scheduled_at)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

    invitationData.status = 1;

    const [id] = await db('invitation').insert(invitationData);
    const savedInvitation = await db('invitation').where({ id_invitation: id }).first();

    return savedInvitation;
};

const update = async (invitationData, id) => {
    // 1. Validación básica del ID y datos recibidos
    if (!id || isNaN(Number(id))) throw new Error('ID de invitación inválido');
    if (!invitationData || Object.keys(invitationData).length === 0) {
        throw new Error('No se proporcionaron datos para actualizar');
    }

    // 2. Verificar que la invitación exista y esté activa
    const invitation = await db('invitation').where({ id_invitation: id }).first();
    if (!invitation) throw new Error('La invitación que intentas actualizar no existe');
    if (invitation.status === 0) throw new Error('La invitación está desactivada y no puede modificarse');

    // 3. Preparar objeto para actualización (copiamos solo los campos permitidos)
    const dataToUpdate = {};

    // 4. Validación y conversión de campos
    if (invitationData.address !== undefined) {
        dataToUpdate.address = invitationData.address;
    }

    if (invitationData.scheduled_at !== undefined) {
        dataToUpdate.scheduled_at = new Date(invitationData.scheduled_at)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

        // Validar que la nueva fecha no sea en el pasado
        if (new Date(dataToUpdate.scheduled_at) < new Date()) {
            throw new Error('La fecha programada no puede estar en el pasado');
        }
    }

    if (invitationData.user_id_user !== undefined) {
        const user = await db('user').where({ id_user: invitationData.user_id_user }).first();
        if (!user) throw new Error('Usuario no encontrado');
        if (!user.status) throw new Error('Usuario desactivado');
        dataToUpdate.user_id_user = invitationData.user_id_user;
    }

    if (invitationData.templates_id_templates !== undefined) {
        const template = await db('templates').where({ id_templates: invitationData.templates_id_templates }).first();
        if (!template) throw new Error('Plantilla no encontrada');
        if (!template.status) throw new Error('Plantilla desactivada');
        dataToUpdate.templates_id_templates = invitationData.templates_id_templates;
    }

    // 5. Validar que haya campos para actualizar
    if (Object.keys(dataToUpdate).length === 0) {
        throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    // 6. Ejecutar la actualización
    await db('invitation').where({ id_invitation: id }).update(dataToUpdate);

    // 7. Devolver la invitación actualizada
    return await db('invitation').where({ id_invitation: id }).first();
};

const findById = async (id) => {
    const invitation = await db('invitation').where({ id_invitation: id }).first();
    if (!invitation || invitation.status === 0) {
        throw new Error('Invitación no encontrada o no disponible');
    }
    return invitation;
};

const findByUser = async (id) => {
    const user = await db('user').where({ id_user: id }).first();
    if (!user) throw new Error('El usuario no existe');

    const invitations = await db('invitation').where({ user_id_user: id });
    return invitations;
};

const deleteInvitation = async (id) => {
    const invitation = await db('invitation').where({ id_invitation: id }).first();
    if (!invitation || invitation.status === 0) {
        throw new Error('Invitación no encontrada o no disponible');
    }

    await db('invitation').where({ id_invitation: id }).update({ status: 0 });

    const deletedInvitation = await db('invitation').where({ id_invitation: id }).first();
    return deletedInvitation;
};


module.exports = { save, findById, update, findByUser,deleteInvitation };
