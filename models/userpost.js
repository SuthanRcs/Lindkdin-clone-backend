const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");


module.exports = sequelize.define("userpost", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    postname : {
        type : DataTypes.STRING
    },
    content : {
        type : DataTypes.STRING
    },
    image : {
        type : DataTypes.STRING
    },
    
        isActive: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }

},{
    timestamps :true,
    tableName : "user-posts"
})