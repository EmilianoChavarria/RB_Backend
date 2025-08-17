const { saveTemp, deleteByUser, getByUser, getByInvitationId } = require('../services/tempInvitationService');
const fs = require('fs').promises;
const path = require('path');

// Crear directorio si no existe
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`📁 Directorio creado: ${dirPath}`);
  }
};

const saveTempController = async (req, res) => {
  try {
    console.log('🔄 Iniciando guardado de invitación temporal...');
    console.log('Body recibido:', {
      user_id: req.body.user_id,
      invitation_id: req.body.invitation_id,
      elements_positions: req.body.elements_positions ? 'Presente' : 'No presente'
    });
    console.log('Archivo recibido:', req.file ? 'Sí' : 'No');
    
    let invitation_image = null;
    let file_path = null;
    
    // Manejar la imagen recibida
    if (req.file) {
      console.log('📥 Procesando archivo subido...');
      
      // Crear directorio temporal si no existe
      const tempDir = path.join(__dirname, '../../temp_images');
      await ensureDirectoryExists(tempDir);
      
      // Generar nombre único para el archivo
      const fileName = `invitation_${req.body.invitation_id}_${Date.now()}.png`;
      file_path = path.join(tempDir, fileName);
      
      // Guardar archivo en disco
      await fs.writeFile(file_path, req.file.buffer);
      console.log(`💾 Archivo guardado en: ${file_path}`);
      
      // También convertir a base64 para la base de datos (opcional)
      invitation_image = req.file.buffer.toString('base64');
      
    } else if (req.body.invitation_image) {
      console.log('📥 Procesando imagen base64...');
      invitation_image = req.body.invitation_image;
    } else {
      console.log('⚠️ No se recibió imagen');
    }
    
    // Validar y parsear elements_positions
    let elements_positions = null;
    try {
      if (req.body.elements_positions) {
        elements_positions = typeof req.body.elements_positions === 'string'
          ? JSON.parse(req.body.elements_positions)
          : req.body.elements_positions;
        console.log('✅ Elements positions parseados correctamente');
      }
    } catch (error) {
      console.error('❌ Error parsing elements_positions:', error);
      throw new Error('Formato inválido para las posiciones de los elementos');
    }
    
    // Guardar en la base de datos
    const saved = await saveTemp({
      user_id: parseInt(req.body.user_id),
      invitation_id: parseInt(req.body.invitation_id),
      invitation_image: invitation_image,
      elements_positions: elements_positions,
      file_path: file_path
    });
    
    console.log('✅ Invitación temporal guardada exitosamente');
    
    res.json({
      success: true,
      message: 'Invitación temporal guardada correctamente',
      data: {
        id: saved.id,
        user_id: saved.user_id,
        invitation_id: saved.invitation_id,
        file_path: saved.file_path,
        elements_positions: saved.elements_positions,
        created_at: saved.created_at,
        updated_at: saved.updated_at
      }
    });
    
  } catch (err) {
    console.error('❌ Error en saveTempController:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error al guardar la invitación temporal'
    });
  }
};

const deleteTempController = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    const result = await deleteByUser(userId);
    res.json({ 
      success: true, 
      message: 'Invitaciones temporales eliminadas correctamente',
      data: result 
    });
  } catch (err) {
    console.error('❌ Error en deleteTempController:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Error al eliminar invitaciones temporales' 
    });
  }
};

const getTempController = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    const result = await getByUser(userId);
    res.json({ 
      success: true, 
      data: result,
      message: `${result.length} invitaciones temporales encontradas`
    });
  } catch (err) {
    console.error('❌ Error en getTempController:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Error al obtener invitaciones temporales' 
    });
  }
};

const getTempByInvitationController = async (req, res) => {
  try {
    const invitationId = parseInt(req.params.invitationId);
    if (!invitationId) {
      return res.status(400).json({
        success: false,
        message: 'ID de invitación inválido'
      });
    }
    
    const result = await getByInvitationId(invitationId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Invitación temporal no encontrada'
      });
    }
    
    res.json({ 
      success: true, 
      data: result,
      message: 'Invitación temporal encontrada'
    });
  } catch (err) {
    console.error('❌ Error en getTempByInvitationController:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Error al obtener invitación temporal' 
    });
  }
};

module.exports = {
  saveTempController,
  deleteTempController,
  getTempController,
  getTempByInvitationController
};