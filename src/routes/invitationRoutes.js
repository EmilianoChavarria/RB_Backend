const express = require('express')
const router = express.Router()
const invitationController= require('../controllers/InivitationController')
const {invitationSchema} = require('../validators/InvitationValidator')

const validate = (schema) =>(req, res, next) =>{
    const {error} = schema.validate(req.body)
    if (error) return res.status(400).json({success:false, error:error.details[0].message})
    next();
}

router.post('/',validate(invitationSchema), invitationController.save)
router.get('/findByUser/:id',invitationController.findByUser)
router.put('/:id', validate(invitationSchema),invitationController.update)
router.get('/:id',invitationController.findById)
router.delete('/:id',invitationController.delete)

module.exports = router