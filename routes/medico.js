var express= require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app=express();
var Medico= require('../models/medico');
var mdAutenticacion = require('../middlewares/autenticacion');

//=====================================================
// Obtener todos los medicos.
//=====================================================

app.get('/',(req,res,next)=>{

    var desde = req.query.desde||0;
    desde = Number(desde);

    Medico.find({})
    .limit(5)
    .skip(desde)
    .populate('usuario','nombre email').populate('hospital').exec((err,medicos)=>{
        
        if(err){

            return res.status(500).json({
                ok:true,
                mensaje:'Error cargando usuario!',
                error:err                
            });
        }

        Medico.count({},(err,conteo)=>{

            if(err){

                return res.status(500).json({
                    ok:true,
                    mensaje:'Error al contar los medicos!',
                    error:err                
                });
            }

            res.status(200).json({
                ok:true,
                medicos:medicos,
                conteo:conteo
            }); 
        });
                  
    });
});

//=====================================================
//Crear un nuevo medico
//=====================================================

app.post('/',mdAutenticacion.verificarToken,(req,res)=>{

    var body = req.body;

    var medico= new Medico({
        nombre:body.nombre,
        img:body.img,
        usuario:req.usuario._id,
        hospital:body.hospital
    });

    medico.save((err,medicoGuardado)=>{

        if(err){

            return res.status(400).json({
                ok:true,
                mensaje:'Error al crear medico!',
                error:err                
            });
        }

        res.status(201).json({
            ok:true,
            medico:medicoGuardado,
            usuarioToken:req.usuario
        });
    })       
});

//=====================================================
//Actualizar un nuevo usuario
//=====================================================

app.put('/:id',mdAutenticacion.verificarToken,(req,res)=>{

    var id= req.params.id;
    var body = req.body;

    Medico.findById(id,(err,medico)=>{

        if(err){

            return res.status(500).json({
                ok:true,
                mensaje:'Error al buscar medico!',
                error:err                
            });
        }

        if(!medico){

            return res.status(400).json({
                ok:true,
                mensaje:'El medico con el id: '+id+' no existe.',
                error:{message:'No existe un medico con ese ID'}              
            });
            
        }
        medico.nombre=body.nombre;
        medico.img=body.img;   
        medico.hospital=body.hospital;     
        medico.save((err,medicoGuardado)=>{
            if(err){
                return res.status(400).json({
                    
                    ok:true,
                    mensaje:'Error al actualizar el medico.',
                    error:err,
                    body                             
                });
            }    

            res.status(200).json({
                ok:true,
                medico:medicoGuardado
            });
        })
         
    });    
});

//=====================================================
//Eliminar un nuevo usuario
//=====================================================

app.delete('/:id',mdAutenticacion.verificarToken,(req,res)=>{
    var id=req.params.id;
    
    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{

        if(err){

            return res.status(500).json({
                ok:true,
                mensaje:'Error al borrar medico!',
                error:err                
            });
        }

        if(!medicoBorrado){

            return res.status(500).json({
                ok:true,
                mensaje:'No existe un medico con id: '+id,
                error:{message:'El medicono existe.'}                
            });
        }

        res.status(200).json({
            ok:true,
            medico:medicoBorrado
        });

    });

});

module.exports = app;