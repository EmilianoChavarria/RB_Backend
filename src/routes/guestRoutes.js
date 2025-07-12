const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const { guestsArraySchema } = require('../validators/GuestValidator');
const validate = require('../middlewares/validate');

router.post('/', validate(guestsArraySchema), guestController.createGuests);
router.get('/:invitationId', guestController.getGuests);
router.patch('/toggle/:id', guestController.toggleGuest);

module.exports = router;