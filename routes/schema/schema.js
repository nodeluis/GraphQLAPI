const graphql=require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList}=graphql;
const _=require('lodash');

//middelware schema que va decir como estan relacionados nuestros objetos
//solo estamos definiendo nuestro esquema de consulta
//1.-estamos definiendo los tipos
//2.-ahora definir relaciones
const EstudianteType=new GraphQLObjectType({
  name:'Estudiante',
  fields:()=>({
    id:{type:GraphQLID},
    nombre:{type:GraphQLString},
    apellido:{type:GraphQLString},
    direccion:{type:GraphQLString},
    correo:{type:GraphQLString},
    fecha_nacimiento:{type:GraphQLString},
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
    id:{type:GraphQLInt},
    password:{type:GraphQLString},
    estudiante:{
      type:EstudianteType,
      resolve(parent,args){
        return _.find(estudiante,{userid:parent.id});
      }
    }
  })
});

//pruebas con el esquema
const estudiante=[
  {id:'1',apellido:'1A',direccion:'D1',correo:'C1',fecha_nacimiento:'F1',userid:'1'},
  {id:'2',apellido:'2A',direccion:'D2',correo:'C2',fecha_nacimiento:'F2',userid:'2'},
  {id:'3',apellido:'13',direccion:'D3',correo:'C3',fecha_nacimiento:'F3',userid:'1'}
];

const user=[
  {id:'1',password:'1A'},
  {id:'2',password:'2A'}
];

//ahora definimos saltos a objetos especificos dentro de la bd

const RootQuery=new GraphQLObjectType({
  name:'RootQueryType',
  fields:{
    //desde aqui se llama a las consultas
    estudiante:{
      type:EstudianteType,
      // estudiante(id:1) con esto estamos llamando a un estudiante en especifico
      //y dentro podemos llamar a los demas datos q contine ese estudiante
      args:{id:{type:GraphQLID}},
      resolve(parent,args){
        //codigo para devolver datos de la bd
        return _.find(estudiante,{id:args.id});
      }
    },
    user:{
      type:UserType,
      // estudiante(id:1) con esto estamos llamando a un estudiante en especifico
      //y dentro podemos llamar a los demas datos q contine ese estudiante
      args:{id:{type:GraphQLID}},
      resolve(parent,args){
        //codigo para devolver datos de la bd
        return _.find(user,{id:args.id});
      }
    }
  }
});

module.exports=new GraphQLSchema({
  query:RootQuery
});
