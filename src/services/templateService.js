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
        .select('id_templates', 'template_name', 'mime_type', 'status', 'image');

    // Convertir imágenes a base64 para los de front
    return templates.map(template => ({
        id_templates: template.id_templates,
        template_name: template.template_name,
        mime_type: template.mime_type,
        status: template.status,
        image: template.image ? `data:${template.mime_type};base64,${template.image.toString('base64')}` : null
    }));
};

// Igual convierte la image a base64
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

    return await db('templates')
        .insert({ ...rest, image: processed.buffer, mime_type: processed.mime_type })
        .returning(['id_templates', 'template_name', 'mime_type', 'status']);
};

const updateTemplate = async (id, templateData) => {
    const { image, ...rest } = templateData;
    let updateData = rest;

    if (image) {
        const processed = processImage(image, rest.mime_type);
        updateData = { ...rest, image: processed.buffer, mime_type: processed.mime_type };
    }

    return await db('templates')
        .where({ id_templates: id })
        .update(updateData)
        .returning(['id_templates', 'template_name', 'mime_type', 'status']);
};

const deleteTemplate = async (id) => {
    return await db('templates')
        .where({ id_templates: id })
        .del();
};

module.exports = {
    getAllTemplates,
    getTemplateImage,
    createTemplate,
    updateTemplate,
    deleteTemplate
};