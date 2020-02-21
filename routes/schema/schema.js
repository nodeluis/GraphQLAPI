const graphql=require('graphql');
const Estudiante=require('../../database/model/estudiante');
const User=require('../../database/model/user');
const empty=require('is-empty');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull}=graphql;
const _=require('lodash');

//middelware schema que va decir como estan relacionados nuestros objetos
//solo estamos definiendo nuestro esquema de consulta
//1.-estamos definiendo los tipos
//2.-ahora definir relaciones
const EstudianteType=new GraphQLObjectType({
  name:'Estudiante',
  fields:()=>({
    _id:{type:GraphQLID},
    nombre:{type:GraphQLString},
    apellido:{type:GraphQLString},
    direccion:{type:GraphQLString},
    correo:{type:GraphQLString},
    fecha_nacimiento:{type:GraphQLString}
    /*user:{
      type:new GraphQLList(UserType),
      resolve(parent,args){
        console.log(parent);
        return _.find(user,{userid:parent.id});
      }
    }*/
  })
});

const UserType=new GraphQLObjectType({
  name:'User',
  fields:()=>({
    _id:{type:GraphQLInt},
    nick:{type:GraphQLString},
    password:{type:GraphQLString},
    /*estudiante:{
      type:EstudianteType,
      resolve(parent,args){
        //return _.find(estudiante,{userid:parent.id});
      }
    }*/
  })
});

const ValidType=new GraphQLObjectType({
  name:'Valid',
  fields:()=>({
    _id:{type:GraphQLInt},
    message:{type:GraphQLString}
    /*estudiante:{
      type:EstudianteType,
      resolve(parent,args){
        //return _.find(estudiante,{userid:parent.id});
      }
    }*/
  })
});

//pruebas con el esquema
/*const estudiante=[
  {id:'1',apellido:'1A',direccion:'D1',correo:'C1',fecha_nacimiento:'F1',userid:'1'},
  {id:'2',apellido:'2A',direccion:'D2',correo:'C2',fecha_nacimiento:'F2',userid:'2'},
  {id:'3',apellido:'13',direccion:'D3',correo:'C3',fecha_nacimiento:'F3',userid:'1'}
];

const user=[
  {id:'1',password:'1A'},
  {id:'2',password:'2A'}
];*/


//ahora definimos saltos a objetos especificos dentro de la bd

const RootQuery=new GraphQLObjectType({
  name:'RootQueryType',
  fields:{
    //desde aqui se llama a las consultas
    estudiante:{
      type:EstudianteType,
      // estudiante(id:1) con esto estamos llamando a un estudiante en especifico
      //y dentro podemos llamar a los demas datos q contine ese estudiante
      args:{_id:{type:GraphQLID}},
      resolve(parent,args){
        //codigo para devolver datos de la bd
        //return _.find(estudiante,{id:args.id});
        return Estudiante.findById(args._id);
      }
    },
    user:{
      type:UserType,
      // estudiante(id:1) con esto estamos llamando a un estudiante en especifico
      //y dentro podemos llamar a los demas datos q contine ese estudiante
      args:{_id:{type:GraphQLID}},
      resolve(parent,args){
        //codigo para devolver datos de la bd
        //return _.find(user,{id:args.id});
        return User.findById(args._id);
      }
    },
    estudiantes:{
      type:new GraphQLList(EstudianteType),
      resolve(parent,args){
        //return estudiante;
        return Estudiante.find({});
      }
    },
    users:{
      type:new GraphQLList(UserType),
      resolve(parent,args){
        //return user;
        return User.find({});
      }
    },
    validation:{
      type:UserType,
      args:{
        nick:{type:new GraphQLNonNull(GraphQLString)},
        password:{type:new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent,args){
         let g=User.findOne({nick:args.nick,password:args.password},(err,doc)=>{
          if(!empty(doc)){
            return User.findById(doc._id);
          }else{
            return [];
          }
        });
        return g;
      }
    }
  }
});

const Mutation=new GraphQLObjectType({
  name:'Mutation',
  fields:{
    addEstudiante:{
      //que es lo q vamos a insertar
      type:EstudianteType,
      args:{
        /*nombre:{type:GraphQLString},
        apellido:{type:GraphQLString},
        direccion:{type:GraphQLString},
        correo:{type:GraphQLString},
        fecha_nacimiento:{type:GraphQLString}*/
        nombre:{type:new GraphQLNonNull(GraphQLString)},
        apellido:{type:new GraphQLNonNull(GraphQLString)},
        direccion:{type:new GraphQLNonNull(GraphQLString)},
        correo:{type:new GraphQLNonNull(GraphQLString)},
        fecha_nacimiento:{type:new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent,args){
        let ins=new Estudiante({
          nombre:args.nombre,
          apellido:args.apellido,
          direccion:args.direccion,
          correo:args.correo,
          fecha_nacimiento:args.fecha_nacimiento
        });
        return ins.save();
      }
    },
    addUser:{
      //que es lo q vamos a insertar
      type:UserType,
      args:{
        nick:{type:new GraphQLNonNull(GraphQLString)},
        password:{type:new GraphQLNonNull(GraphQLString)},
      },
      resolve(parent,args){
        let ins=new User(args);
        return ins.save();
      }
    },
    estudianteUpdate:{
      //que es lo q vamos a insertar
      type:EstudianteType,
      args:{
        _id:{type:new GraphQLNonNull(GraphQLString)},
        nombre:{type:GraphQLString},
        apellido:{type:GraphQLString},
        direccion:{type:GraphQLString},
        correo:{type:GraphQLString},
        fecha_nacimiento:{type:GraphQLString}
      },
      resolve(parent,args){
        return Estudiante.findByIdAndUpdate(args._id,args,(err,Estudiante)=>{
          return
        });
      }
    }
  }
});

module.exports=new GraphQLSchema({
  query:RootQuery,
  mutation:Mutation
});
