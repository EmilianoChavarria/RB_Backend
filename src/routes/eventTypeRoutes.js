const express = require('express');
const router = express.Router();
const eventTypeController = require('../controllers/eventTypeController');
const { eventTypeSchema, updateEventTypeSchema } = require('../validators/eventTypeValidator');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message, success: false });
  next();
};

router.get('/', eventTypeController.getAllEventTypes);
router.post('/', validate(eventTypeSchema), eventTypeController.createEventType);
router.put('/:id', validate(updateEventTypeSchema), eventTypeController.updateEventType);
router.delete('/:id', eventTypeController.deleteEventType);
router.get('/:id', eventTypeController.findOne);

module.exports = router;