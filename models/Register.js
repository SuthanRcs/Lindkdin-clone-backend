const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db')

module.exports = sequelize.define(
    'Register',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            unique:true
        },
        password: {
            type: DataTypes.STRING,
            unique: true
        },

        isActive: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    },
    {
        tableName: 'user-deatils',
        timestamps: true
    }
)