const invitationService = require('../services/invitationService')

exports.save = async (req, res) =>{
    try {
        const invitation = await invitationService.save(req.body)
        return res.status(201).json({
            success:true,
            message:'invitación creada correctamente',
            data:invitation
        })
    }catch (e) {
        return res.status(500).json({
            success : false,
            message: 'error al crear invitacion',
            error: e.message
        })
    }
}

exports.findByUser = async (req, res) => {
    try {
        const invitations = await invitationService.findByUser(req.params.id);
        return res.status(200).json({
            success: true,
            data: invitations
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: e.message
        });
    }
};

exports.update = async (req,res) =>{

    try {
        const invitation= await invitationService.update(req.body,req.params.id);
        return res.status(200).json({
            success:true,
            message:'invitación actualizada con éxito',
            data:invitation
        })
    }catch (e) {
        return res.status(400).json({
            success: false,
            message:'error al intentar actualizar',
            error: e.message
        });
    }
}

exports.findById = async (req,res)=>{
    try {
        const invitation = await invitationService.findById(req.params.id)
        return res.status(200).json({
            success:true,
            data:invitation
        })
    }catch (e) {
        return res.status(400).json({
            success: false,
            message:'error al intentar consultar',
            error: e.message
        });
    }
}

exports.delete = async (req,res)=>{
    try {
        const invitation = await invitationService.deleteInvitation(req.params.id)
        return res.status(200).json({
            success:true,
            message:'invitación eliminada correctamente',
            data:invitation
        })
    }catch (e) {
        return res.status(400).json({
            success: false,
            message:'error al intentar eliminar',
            error: e.message
        });
    }
}


