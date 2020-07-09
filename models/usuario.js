var moongoose= require('mongoose');
var uniqueValidator=require('mongoose-unique-validator');

var Schema = moongoose.Schema;

var rolesValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un role permitido'
}

var usuarioSchema = new Schema({

    nombre:{type:String,required:[true,'El nombre es necesario']},
    email:{type:String,unique:true,required:[true,'El email es necesario']},
    password:{type:String,required:[true,'La contraseña es necesaria']},
    img:{type:String,required:false},
    role:{type:String,required:false,default:'USER_ROLE',enum:rolesValidos}
});

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe de ser unico.'})

module.exports = moongoose.model('usuario',usuarioSchema);