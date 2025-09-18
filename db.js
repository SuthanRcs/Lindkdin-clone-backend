const sequelize = require('sequelize');
const{Sequelize} = require('sequelize')


console.log("DB_NAME",process.env.DB_NAME);

module.exports= new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{

    host : process.env.DB_HOST,
    dialect : 'mysql'

});
