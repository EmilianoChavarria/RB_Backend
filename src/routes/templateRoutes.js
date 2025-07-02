const express = require('express');
const router = express.Router();
const multer = require('multer');
const templateController = require('../controllers/templateController');
const { templateSchema, updateTemplateSchema } = require('../validators/templateValidator');

// Configuración de multer para multipart/form-data
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Middleware para procesar tanto JSON como multipart
const processRequest = (req, res, next) => {
  if (req.file) {
    req.body = {
      ...req.body,
      image: req.file.buffer,
      mime_type: req.file.mimetype
    };
  }
  next();
};

// Middleware de validación
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ 
    error: error.details[0].message, 
    success: false 
  });
  next();
};

// Rutas
router.get('/', templateController.getAllTemplates);
router.get('/:id/image', templateController.getTemplateById);

router.post(
  '/',
  upload.single('image'), // Middleware para archivos
  processRequest,         // Procesar la request
  validate(templateSchema), // Validar
  templateController.createTemplate
);

router.put(
  '/:id',
  upload.single('image'),
  processRequest,
  validate(updateTemplateSchema),
  templateController.updateTemplate
);

router.delete('/:id', templateController.deleteTemplate);

module.exports = router;