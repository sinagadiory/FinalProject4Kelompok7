'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Medsos extends Model {
        static associate(models) {
            Medsos.belongsTo(models.User,{
                foreignKey:'UserId'
            });
        }
    }
    Medsos.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "name cannot be omitted",
                },
                notEmpty: {
                    msg: "name cannot be an empty string",
                }
            },
        },
        social_media_url: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Social media url cannot be omitted",
                },
                notEmpty: {
                    msg: "Social media url cannot be an empty string",
                },
                isUrl: {
                    msg: "Social media url format is wrong",
                }
            },
        },
        UserId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notNull: {
                    msg: "UserId cannot be omitted",
                },
                notEmpty: {
                    msg: "UserId cannot be an empty string",
                },
            }
        }
    },{
        sequelize,
        modelName: 'Medsos',
    });
    return Medsos;
};