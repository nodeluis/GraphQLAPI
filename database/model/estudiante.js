const mongoose=require('../connect');

const estudiante={
    nombre:String,
    apellido:String,
    direccion:String,
    correo:String,
    fecha_nacimiento:String
}

const estModel=mongoose.model('estudiante',estudiante);

module.exports=estModel;
