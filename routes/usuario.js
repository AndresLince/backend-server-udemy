var express= require('express');
const bcrypt = require('bcrypt');
var app=express();
var Usuario= require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');
//=====================================================
//Obtener todos los usuarios
//=====================================================
app.get('/',(req,res,next)=>{

    Usuario.find({},'nombre email img role').exec((err,usuarios)=>{
        
        if(err){

            return res.status(500).json({
                ok:true,
                mensaje:'Error cargando usuario!',
                error:err                
            });
        }
        res.status(200).json({
            ok:true,
            usuarios:usuarios
        });
           
    });

   
});



//=====================================================
//Actualizar un nuevo usuario
//=====================================================

app.put('/:id',mdAutenticacion.verificarToken,(req,res)=>{

    var id= req.params.id;
    var body = req.body;

    Usuario.findById(id,(err,usuario)=>{

        if(err){

            return res.status(500).json({
                ok:true,
                mensaje:'Error al buscar usuario!',
                error:err                
            });
        }

        if(!usuario){

            return res.status(400).json({
                ok:true,
                mensaje:'El usuario con el id: '+id+' no existe.',
                error:{message:'No existe un usuario con ese ID'}              
            });
            
        }
        usuario.nombre=body.nombre;
        usuario.email=body.email;
        usuario.role=body.role;
        usuario.save((err,usuarioGuardado)=>{
            if(err){
                return res.status(400).json({
                    
                    ok:true,
                    mensaje:'Error al actualizar el usuario.',
                    error:err,
                    body                             
                });
            }

            usuarioGuardado.password=':)';

            res.status(200).json({
                ok:true,
                usuario:usuarioGuardado
            });
        })
         
    });    
})

//=====================================================
//Crear un nuevo usuario
//=====================================================

app.post('/',mdAutenticacion.verificarToken,(req,res)=>{

    var body = req.body;

    var usuario= new Usuario({
        nombre:body.nombre,
        email:body.email,
        password: bcrypt.hashSync(body.password,10),
        img:body.img,
        role:body.role
    });

    usuario.save((err,usuarioGuardado)=>{

        if(err){

            return res.status(400).json({
                ok:true,
                mensaje:'Error al crear usuario!',
                error:err                
            });
        }

        res.status(201).json({
            ok:true,
            usuario:usuarioGuardado,
            usuarioToken:req.usuario
        });

    })

    
       
});

//=====================================================
//Eliminar un nuevo usuario
//=====================================================

app.delete('/:id',mdAutenticacion.verificarToken,(req,res)=>{
    var id=req.params.id;
    
    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{

        if(err){

            return res.status(500).json({
                ok:true,
                mensaje:'Error al borrar usuario!',
                error:err                
            });
        }

        if(!usuarioBorrado){

            return res.status(500).json({
                ok:true,
                mensaje:'No existe un usuario con id: '+id,
                error:{message:'El usuariono existe.'}                
            });
        }

        res.status(200).json({
            ok:true,
            usuario:usuarioBorrado
        });

    });

})

module.exports = app;