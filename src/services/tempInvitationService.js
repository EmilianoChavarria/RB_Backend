const db = require('../database/dbConnection');
const fs = require('fs').promises;
const path = require('path');

const saveTemp = async (tempData) => {
  const { user_id, invitation_id, invitation_image, elements_positions, file_path } = tempData;
  
  // Validaciones básicas
  if (!user_id) throw new Error('El ID de usuario es requerido');
  if (!invitation_id) throw new Error('El ID de invitación es requerido');
  
  // Validar usuario
  const user = await db('user').where({ id_user: user_id }).first();
  if (!user || !user.status) throw new Error('Usuario no encontrado o desactivado');
  
  // Validar invitación
  const invitation = await db('invitation').where({ id_invitation: invitation_id }).first();
  if (!invitation) throw new Error('Invitación no encontrada');
  
  // Validar y formatear el JSON de posiciones
  let positionsJson = null;
  if (elements_positions) {
    try {
      positionsJson = typeof elements_positions === 'string' 
        ? elements_positions 
        : JSON.stringify(elements_positions);
    } catch (error) {
      throw new Error('Formato inválido para las posiciones de los elementos');
    }
  }
  
  try {
    // Verificar si ya existe un registro
    const existing = await db('temp_invitations')
      .where({ user_id, invitation_id })
      .first();
    
    if (existing) {
      // Actualizar registro existente
      await db('temp_invitations')
        .where({ user_id, invitation_id })
        .update({
          invitation_image: invitation_image || existing.invitation_image,
          elements_positions: positionsJson || existing.elements_positions,
          file_path: file_path || existing.file_path,
          updated_at: new Date()
        });
      
      console.log(`✅ Registro actualizado para user_id: ${user_id}, invitation_id: ${invitation_id}`);
    } else {
      // Crear nuevo registro
      await db('temp_invitations').insert({
        user_id,
        invitation_id,
        invitation_image,
        elements_positions: positionsJson,
        file_path,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      console.log(`✅ Nuevo registro creado para user_id: ${user_id}, invitation_id: ${invitation_id}`);
    }
    
    // Obtener el registro actualizado/creado
    const saved = await db('temp_invitations')
      .where({ user_id, invitation_id })
      .first();
    
    // Parsear el JSON para la respuesta
    if (saved.elements_positions) {
      try {
        saved.elements_positions = JSON.parse(saved.elements_positions);
      } catch (error) {
        console.error('Error parsing saved elements_positions:', error);
        saved.elements_positions = null;
      }
    }
    
    return saved;
    
  } catch (error) {
    console.error('❌ Error en saveTemp:', error);
    throw error;
  }
};

const deleteByUser = async (userId) => {
  if (!userId) throw new Error('ID de usuario requerido');
  
  try {
    // Obtener las rutas de archivos antes de eliminar
    const records = await db('temp_invitations').where({ user_id: userId });
    
    // Eliminar archivos físicos si existen
    for (const record of records) {
      if (record.file_path) {
        try {
          await fs.unlink(record.file_path);
          console.log(`🗑️ Archivo eliminado: ${record.file_path}`);
        } catch (fileError) {
          console.warn(`⚠️ No se pudo eliminar el archivo: ${record.file_path}`, fileError.message);
        }
      }
    }
    
    // Eliminar registros de la base de datos
    const deletedCount = await db('temp_invitations').where({ user_id: userId }).del();
    
    return { 
      message: `${deletedCount} invitaciones temporales del usuario ${userId} eliminadas`,
      deletedCount 
    };
  } catch (error) {
    console.error('❌ Error en deleteByUser:', error);
    throw error;
  }
};

const getByUser = async (userId) => {
  if (!userId) throw new Error('ID de usuario requerido');
  
  try {
    const results = await db('temp_invitations')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
    
    return results.map(item => ({
      ...item,
      elements_positions: item.elements_positions 
        ? JSON.parse(item.elements_positions) 
        : null
    }));
  } catch (error) {
    console.error('❌ Error en getByUser:', error);
    throw error;
  }
};

const getByInvitationId = async (invitationId) => {
  if (!invitationId) throw new Error('ID de invitación requerido');
  
  try {
    const result = await db('temp_invitations')
      .where({ invitation_id: invitationId })
      .first();
    
    if (result && result.elements_positions) {
      result.elements_positions = JSON.parse(result.elements_positions);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error en getByInvitationId:', error);
    throw error;
  }
};

module.exports = { 
  saveTemp, 
  deleteByUser, 
  getByUser, 
  getByInvitationId 
};