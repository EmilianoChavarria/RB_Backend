const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const { guestsArraySchema } = require('../validators/GuestValidator');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message, success:false });
  next();
};

router.post('/', validate(guestsArraySchema), guestController.createGuests);
router.get('/:invitationId', guestController.getGuests);
router.patch('/toggle/:id', guestController.toggleGuest);

module.exports = router;