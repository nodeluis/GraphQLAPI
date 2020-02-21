const mongoose=require('mongoose');

mongoose.connect('mongodb://:27017/graphql');

module.exports=mongoose;
