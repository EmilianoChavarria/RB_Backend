const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  saveTempController,
  deleteTempController,
  getTempController,
  getTempByInvitationController
} = require('../controllers/tempInvitationController');

// Configuración de multer mejorada
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    fieldSize: 10 * 1024 * 1024  // 10MB para campos
  },
  fileFilter: (req, file, cb) => {
    // Validar que sea una imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 10MB.'
      });
    }
  }
  
  if (error.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Rutas
router.post('/save', upload.single('image'), handleMulterError, saveTempController);
router.get('/get/:userId', getTempController);
router.get('/invitation/:invitationId', getTempByInvitationController);
router.delete('/delete/:userId', deleteTempController);

module.exports = router;