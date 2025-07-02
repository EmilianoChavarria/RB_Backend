const templateService = require('../services/templateService');

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await templateService.getAllTemplates();
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const result = await templateService.getTemplateImage(req.params.id);
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        error: 'Template not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        template_name: result.template_name,
        image: result.image,
        mime_type: result.mime_type
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const newTemplate = await templateService.createTemplate(req.body);
    res.status(201).json({ success: true, data: newTemplate[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const updatedTemplate = await templateService.updateTemplate(
      req.params.id,
      req.body
    );
    
    if (!updatedTemplate.length) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    
    res.json({ success: true, data: updatedTemplate[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const deleted = await templateService.deleteTemplate(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
