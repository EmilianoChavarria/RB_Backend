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
  return await db('templates')
    .select('id_templates', 'template_name', 'mime_type', 'status');
};

const getTemplateImage = async (id) => {
  return await db('templates')
    .select('image', 'mime_type')
    .where({ id_templates: id })
    .first();
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