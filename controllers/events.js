const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {

    const events = await Event.find()
                              .populate('user', 'name');

    res.json({
        ok: true,
        events
    });
}

const createEvent = async (req, res = response) => {

    const event = new Event( req.body );

    try {

        event.user = req.uid;

        const eventSave = await event.save();

        res.json({
            ok: true,
            event: eventSave
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const updateEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const event = await Event.findById( eventId );

        // Validar si el evento existe por el ID
        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        // Validar que el usuario sea la misma que creo el event
        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        // Se habilita la edicion del event
        const newEvent = {
            ...req.body,
            user: uid
        }

        // Actualizar el event
        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent,{ new: true } );

        res.json({
            ok: true,
            event: eventUpdated
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const deleteEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const event = await Event.findById( eventId );

        // Validar si el evento existe por el ID
        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        // Validar que el usuario sea la misma que creo el event
        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento'
            });
        }

        // Eliminar el event
        await Event.findOneAndDelete( eventId );

        res.json({
            ok: true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}