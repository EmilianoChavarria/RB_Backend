const express = require('express');
const router = express.Router();
const { confirmInvitationValidator, confirmInvitationValidatorUpdate } = require('../validators/ConfirmInvitationValidator');
const confirmInvitationController = require('../controllers/ConfirmInvitationController');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, success: false });
    next();
}

router.post('/', validate(confirmInvitationValidator), confirmInvitationController.saveConfirmation);
router.get('/:guestId', confirmInvitationController.findOne);
router.put('/:guestUuid',validate(confirmInvitationValidatorUpdate) ,confirmInvitationController.updateConfirmation)

module.exports = router;