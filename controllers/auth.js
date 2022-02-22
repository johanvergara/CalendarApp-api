const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        user = new User( req.body );

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // Guarda en la bd el user
        await user.save();

        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        // Respuesta exitosa del registro
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Please speak to the administrator'
        });
    }
}

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los password
        const validPassoword = bcrypt.compareSync(password, user.password);

        if( !validPassoword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password invalid'
            });
        }

        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Please speak to the administrator'
        });
    }
}

const revalidateToken = async (req, res) => {

    const { uid, name } = req;

    // Generar JWT
    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}