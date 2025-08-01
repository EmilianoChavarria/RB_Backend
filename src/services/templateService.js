const db = require('../database/dbConnection');

const processImage = (image, mime_type) => {
    if (typeof image === 'string' && image.startsWith('data:')) {
        const base64Data = image.split(',')[1];
        return {
            buffer: Buffer.from(base64Data, 'base64'),
            mime_type: mime_type || image.match(/^data:(image\/\w+);/)[1]
        };
    }
    return { buffer: image, mime_type };
};

const getAllTemplates = async () => {
    const templates = await db('templates')
        .select(
            'templates.id_templates',
            'templates.template_name',
            'templates.mime_type',
            'templates.status',
            'templates.image',
            'event_type.id_event_type',
            'event_type.name as event_type_name'
        )
        .leftJoin('event_type', 'templates.id_event_type', 'event_type.id_event_type');

    return templates.map(template => ({
        id_templates: template.id_templates,
        template_name: template.template_name,
        mime_type: template.mime_type,
        status: template.status,
        event_type: {
            id_event_type: template.id_event_type,
            name: template.event_type_name
        },
        image: template.image ? `data:${template.mime_type};base64,${template.image.toString('base64')}` : null
    }));
};

const getTemplateById = async (id) => {
    const template = await db('templates')
        .select(
            'templates.id_templates',
            'templates.template_name',
            'templates.mime_type',
            'templates.status',
            'templates.image',
            'event_type.id_event_type',
            'event_type.name as event_type_name'
        )
        .leftJoin('event_type', 'templates.id_event_type', 'event_type.id_event_type')
        .where('templates.id_templates', id)
        .first();

    if (!template) return null;

    return {
        id_templates: template.id_templates,
        template_name: template.template_name,
        mime_type: template.mime_type,
        status: template.status,
        event_type: {
            id_event_type: template.id_event_type,
            name: template.event_type_name
        },
        image: template.image ? `data:${template.mime_type};base64,${template.image.toString('base64')}` : null
    };
};

const getTemplateImage = async (id) => {
    const template = await db('templates')
        .select('template_name', 'image', 'mime_type')
        .where({ id_templates: id })
        .first();

    if (!template) return null;

    return {
        template_name: template.template_name,
        image: template.image ? `data:${template.mime_type};base64,${template.image.toString('base64')}` : null,
        mime_type: template.mime_type
    };
};

const createTemplate = async (templateData) => {
    const { image, ...rest } = templateData;
    const processed = processImage(image, rest.mime_type);

    const eventType = await db('event_type')
        .where({ id_event_type: rest.id_event_type, status: true })
        .first();
    
    if (!eventType) {
        throw new Error('Tipo de evento no encontrado o inactivo');
    }

    return await db('templates')
        .insert({ 
            ...rest, 
            image: processed.buffer, 
            mime_type: processed.mime_type 
        })
        .returning(['id_templates', 'template_name', 'mime_type', 'status', 'id_event_type']);
};

const updateTemplate = async (id, templateData) => {
    const { image, ...rest } = templateData;
    let updateData = rest;

    if (image) {
        const processed = processImage(image, rest.mime_type);
        updateData = { ...rest, image: processed.buffer, mime_type: processed.mime_type };
    }

    if (updateData.id_event_type) {
        const eventType = await db('event_type')
            .where({ id_event_type: updateData.id_event_type, status: true })
            .first();
        
        if (!eventType) {
            throw new Error('Tipo de evento no encontrado o inactivo');
        }
    }

    return await db('templates')
        .where({ id_templates: id })
        .update(updateData)
        .returning(['id_templates', 'template_name', 'mime_type', 'status', 'id_event_type']);
};

const deleteTemplate = async (id) => {
    return await db('templates')
        .where({ id_templates: id })
        .del();
};

module.exports = {
    getAllTemplates,
    getTemplateById,
    getTemplateImage,
    createTemplate,
    updateTemplate,
    deleteTemplate
};