const eventTypeService = require('../services/eventTypeService');

exports.getAllEventTypes = async (req, res) => {
    try {
        const eventTypes = await eventTypeService.getAll();
        res.json({ data: eventTypes, error: false, status: 200 });
    } catch (err) {
        res.status(500).json({ message: 'Error:', error: err.message });
    }
};

exports.createEventType = async (req, res) => {
    try {
        const eventType = await eventTypeService.createEventType(req.body);
        res.status(201).json({ message: 'Tipo de evento creado exitosamente', id: eventType[0] });
    } catch (err) {
        res.status(500).json({ message: 'Error creando el tipo de evento', error: err.message });
    }
};

exports.updateEventType = async (req, res) => {
    try {
        const { id } = req.params;
        await eventTypeService.updateEventType(id, req.body);
        res.json({ message: 'Tipo de evento actualizado correctamente', error: false });
    } catch (err) {
        res.status(500).json({ message: 'Error actualizando el tipo de evento', error: err.message });
    }
};

exports.deleteEventType = async (req, res) => {
    try {
        const { id } = req.params;
        await eventTypeService.deleteEventType(id);
        res.json({ message: 'Tipo de evento eliminado correctamente', error: false });
    } catch (err) {
        res.status(500).json({ message: 'Error eliminando el tipo de evento', error: err.message });
    }
};

exports.findOne = async (req, res) => {
    try {
       const eventType = await eventTypeService.findOne(req.params.id);
       return res.status(200).json({
           success: true,
           data: eventType
       });
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Error encontrando el tipo de evento',
            error: e.message
        });
    }
};