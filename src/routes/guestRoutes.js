const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const router = express.Router();
const guestController = require('../controllers/guestController');
const { guestsArraySchema, guestSchema } = require('../validators/GuestValidator');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message, success:false });
  next();
};

// Configura el transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // O el proveedor SMTP que uses
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
router.get('/', guestController.getAll);
router.post('/', validate(guestsArraySchema), guestController.createGuests);
router.put('/:id', validate(guestSchema), guestController.updateGuest);
router.get('/:invitationId', guestController.getGuests);
router.patch('/toggle/:id', guestController.toggleGuest);
router.get('/findByEvent/:id_event',guestController.findGuestsByEvent);
router.post('/send-invitation/:id', guestController.sendInvitationEmail);

module.exports = router;