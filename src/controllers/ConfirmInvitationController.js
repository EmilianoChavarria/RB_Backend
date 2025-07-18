const confirmInvitationService = require('../services/ConfirmInvitationService');

exports.saveConfirmation = async (req, res) => {
    try {
        const confirmationData = req.body;
        const result = await confirmInvitationService.saveConfirmation(confirmationData);
        res.status(201).json({
            message: 'Confirmación guardada correctamente',
            data: result,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: 'Error al guardar la confirmación',
            error: err.message
        });
    }
}
exports.findOne = async (req, res) => {
    try {
        const guestId = req.params.guestId;
        const confirmation = await confirmInvitationService.findOne(guestId);
        res.json({
            message: 'Confirmación encontrada',
            data: confirmation,
            error: false
        });
    } catch (err) {
        res.status(404).json({
            message: 'Error al encontrar la confirmación',
            error: err.message
        });
    }
};
exports.updateConfirmation  = async (req,res)=>{
    try {
        const confirmationData = req.body;
        const uuid = req.params.guestUuid;
        console.log("uuid en el controlador",uuid)
        const updatedConfirmation = await confirmInvitationService.updateConfirmation(confirmationData, uuid);
        res.json({
            message: 'Confirmación actualizada correctamente',
            data: updatedConfirmation,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: 'Error al actualizar la confirmación',
            error: err.message
        });
    }
}