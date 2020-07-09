var express= require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app=express();
var Usuario= require('../models/usuario');

//=====================================================
// Obtener todos los usuarios
//=====================================================

app.post('/',(req,res)=>{

    var body = req.body;

    Usuario.findOne({ email: body.email}, (err,usuarioDB) => {

        
        if(err){

            return res.status(500).json({
                ok:true,
                mensaje:'Error al buscar usuario!',
                error:err                
            });
        }

        if(!usuarioDB){

            return res.status(400).json({
                ok:true,
                mensaje:'Credenciales incorrectas - email.',
                error:{message:'No existe el usuario'}              
            });            
        }

        if(!bcrypt.compareSync(body.password,usuarioDB.password)){

            return res.status(400).json({
                ok:true,
                mensaje:'Credenciales incorrectas - password.',
                error:{message:'Credenciales incorrectas'}              
            });  
        }

        //Crear un token!!!
        usuarioDB.password=':)';
        var token = jwt.sign({usuario:usuarioDB},SEED,{expiresIn:14400});

        res.status(200).json({
            ok:true,
            usuario:usuarioDB,
            token:token,
            id:usuarioDB.id
        });

        
    });   
});

module.exports = app;