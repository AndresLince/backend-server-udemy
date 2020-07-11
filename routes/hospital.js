var express= require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app=express();
var Hospital= require('../models/hospital');
var mdAutenticacion = require('../middlewares/autenticacion');

//=====================================================
// Obtener todos los hospitales.
//=====================================================

app.get('/',(req,res,next)=>{

    var desde = req.query.desde||0;
    desde = Number(desde);

    Hospital.find({})
    .limit(5)
    .skip(desde)
    .populate('usuario','nombre email').exec((err,hospitales)=>{
        
        if(err){

            return res.status(500).json({
                ok:true,
                mensaje:'Error cargando usuario!',
                error:err                
            });
        }

        Hospital.count({},(err,conteo)=>{

            if(err){

                return res.status(500).json({
                    ok:true,
                    mensaje:'Error al contar los hospitales!',
                    error:err                
                });
            }

            res.status(200).json({
                ok:true,
                hospitales:hospitales,
                conteo:conteo
            });  

        });
                
    });
});

//=====================================================
//Crear un nuevo hospital
//=====================================================

app.post('/',mdAutenticacion.verificarToken,(req,res)=>{

    var body = req.body;

    var hospital= new Hospital({
        nombre:body.nombre,
        img:body.img,
        usuario:req.usuario._id
    });

    hospital.save((err,hospitalGuardado)=>{

        if(err){

            return res.status(400).json({
                ok:true,
                mensaje:'Error al crear hospital!',
                error:err                
            });
        }

        res.status(201).json({
            ok:true,
            hospital:hospitalGuardado,
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

    Hospital.findById(id,(err,hospital)=>{

        if(err){

            return res.status(500).json({
                ok:true,
                mensaje:'Error al buscar hospital!',
                error:err                
            });
        }

        if(!hospital){

            return res.status(400).json({
                ok:true,
                mensaje:'El hospital con el id: '+id+' no existe.',
                error:{message:'No existe un hospital con ese ID'}              
            });
            
        }
        hospital.nombre=body.nombre;
        hospital.img=body.img;        
        hospital.save((err,hospitalGuardado)=>{
            if(err){
                return res.status(400).json({
                    
                    ok:true,
                    mensaje:'Error al actualizar el hospital.',
                    error:err,
                    body                             
                });
            }    

            res.status(200).json({
                ok:true,
                hospital:hospitalGuardado
            });
        })
         
    });    
});

//=====================================================
//Eliminar un nuevo usuario
//=====================================================

app.delete('/:id',mdAutenticacion.verificarToken,(req,res)=>{
    var id=req.params.id;
    
    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{

        if(err){

            return res.status(500).json({
                ok:true,
                mensaje:'Error al borrar hospital!',
                error:err                
            });
        }

        if(!hospitalBorrado){

            return res.status(500).json({
                ok:true,
                mensaje:'No existe un hospital con id: '+id,
                error:{message:'El hospitalno existe.'}                
            });
        }

        res.status(200).json({
            ok:true,
            hospital:hospitalBorrado
        });

    });

});

module.exports = app;