var express= require('express');
var app=express();
const path=require('path');
const fs=require('fs');

app.get('/:tipo/:img',(req,res,next)=>{

    var tipo=req.params.tipo;
    var img=req.params.img;

    var pathImagen=path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImagen)){

        res.sendFile(pathImagen);
    }else{
        
        var pathNoImagen=path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImagen);
    }
});

module.exports = app;
//366412109200-9jkdccdoj2qnrc5sa587gt24b9ij5u9l.apps.googleusercontent.com
//izYFOZB3LHNvHXoXfwUz2NQX