const templateService = require('../services/templateService');

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await templateService.getAllTemplates();
    res.json({ 
      success: true, 
      data: templates 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        error: 'Plantilla no encontrada' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: template
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getTemplateImage = async (req, res) => {
  try {
    const result = await templateService.getTemplateImage(req.params.id);
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        error: 'Plantilla no encontrada' 
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
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const newTemplate = await templateService.createTemplate(req.body);
    res.status(201).json({ 
      success: true, 
      data: newTemplate[0] 
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const updatedTemplate = await templateService.updateTemplate(
      req.params.id,
      req.body
    );
    
    if (!updatedTemplate.length) {
      return res.status(404).json({ 
        success: false, 
        error: 'Plantilla no encontrada' 
      });
    }
    
    res.json({ 
      success: true, 
      data: updatedTemplate[0] 
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const deleted = await templateService.deleteTemplate(req.params.id);
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'Plantilla no encontrada' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Plantilla eliminada correctamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getTemplateUsageStats = async (req, res) => {
  try {
    const stats = await templateService.getTemplateUsageByEventType();
    
    // Formatear datos para la gráfica
    const formattedData = {
      labels: stats.map(item => item.event_type_name || 'Sin categoría'),
      datasets: [{
        data: stats.map(item => item.template_count),
      }],
      rawData: stats
    };

    res.json({ 
      success: true, 
      data: formattedData 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};