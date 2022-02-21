/* 
    Event routes / Event
    host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getEvents, createEvent, deleteEvent, updateEvent } = require('../controllers/events');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Todas tienen que pasar por la validacion del JWT
router.use(validateJWT);

// Obtener eventos
router.get('/', getEvents);

// Crear nuevo evento
router.post(
    '/',
    [
        check('title', 'title is required').not().isEmpty(),
        check('start', 'date start is required').custom(isDate),
        check('end', 'date end is required').custom(isDate),
        validateFields
    ],
    createEvent
);

// Actualizar evento
router.put(
    '/:id',
    [
        check('id', 'Id is not valid').isMongoId(),
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validateFields
    ],
    updateEvent
);

// Borrar evento
router.delete('/:id', deleteEvent);

module.exports = router;