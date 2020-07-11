var express= require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
var app=express();
var fs =require('fs');

// default options
app.use(fileUpload());

app.put('/:tipo/:id',(req,res,next)=>{

    var tipo=req.params.tipo;
    var id= req.params.id;

    //tipos de coleccion
    var tiposValidos=['hospitales','medicos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){

        return res.status(400).json({
            ok:false,
            mensaje:'Tipo de colección no es válida!',
            error:{message:'Tipo de colección no es valida'}     
        });
    }

    if(!req.files){

        return res.status(400).json({
            ok:false,
            mensaje:'No selecciono nada!',
            error:{message:'Debe de seleccionar una imagen'}     
        });
    }

    //Obtener nombre del archivo
    var archivo=req.files.imagen;
    var nombreCortado=archivo.name.split('.');
    var extensionArchivo=nombreCortado[nombreCortado.length-1];
    

    //Solo estas extensiones aceptamos
    var extensionesValidas=['png','jpg','gif','jpeg'];
    if(extensionesValidas.indexOf(extensionArchivo)<0){

        return res.status(400).json({
            ok:false,
            mensaje:'Extension no valida',
            error:{message:'Las extensiones validas son '+extensionesValidas.join(', ')}     
        });
    }

    //Nombre de archivo personalizado

    var nombreArchivo=`${ id }-${ new Date().getMilliseconds()}.${ extensionArchivo }`;

    //Mover el archivo del temporal a un path

    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path,err=>{
        
        if(err){

            return res.status(400).json({
                ok:false,
                mensaje:'Error al mover archivo!',
                error:err 
            });
        }

        subirPorTipo(tipo,id,nombreArchivo,res)
        
    });

    
});

function subirPorTipo(tipo,id,nombreArchivo,res){

    if(tipo==='usuarios'){

        Usuario.findById(id,(err,usuario)=>{
            if(err){

                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al consultar el usuario!',
                    error:err 
                });
            }

            var pathViejo='./uploads/usuarios/'+usuario.img;
            //Si existe eliminar la imagen anterior
            if(fs.existsSync(pathViejo)){
                
                fs.unlinkSync(pathViejo);
            }

            usuario.img=nombreArchivo;
            usuario.save((err,usuarioActualizado)=>{

                if(err){

                    return res.status(400).json({
                        ok:false,
                        mensaje:'Error al actualizar el usuario!',
                        error:err 
                    });
                }
                usuarioActualizado.password=':)';

                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de usuario actualizada',
                    usuario:usuarioActualizado
                });
            });
        });
    }

    if(tipo==='medicos'){

        Medico.findById(id,(err,medico)=>{
            if(err){

                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al consultar el medico!',
                    error:err 
                });
            }

            var pathViejo='./uploads/medicos/'+medico.img;
            //Si existe eliminar la imagen anterior
            if(fs.existsSync(pathViejo)){
                
                fs.unlinkSync(pathViejo);
            }

            medico.img=nombreArchivo;
            medico.save((err,medicoActualizado)=>{

                if(err){

                    return res.status(400).json({
                        ok:false,
                        mensaje:'Error al actualizar el medico!',
                        error:err 
                    });
                }

                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de medico actualizada',
                    medico:medicoActualizado
                });
            });
        });
        
    }

    if(tipo==='hospitales'){

        Hospital.findById(id,(err,hospital)=>{
            if(err){

                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al consultar el hospital!',
                    error:err 
                });
            }

            var pathViejo='./uploads/hospitales/'+hospital.img;
            //Si existe eliminar la imagen anterior
            if(fs.existsSync(pathViejo)){
                
                fs.unlinkSync(pathViejo);
            }

            hospital.img=nombreArchivo;
            hospital.save((err,hospitalActualizado)=>{

                if(err){

                    return res.status(400).json({
                        ok:false,
                        mensaje:'Error al actualizar el hospital!',
                        error:err 
                    });
                }

                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de hospital actualizada',
                    hospital:hospitalActualizado
                });
            });
        });
        
    }
}

module.exports = app;