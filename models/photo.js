'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Photo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Photo.belongsTo(models.User,{
                foreignKey:'UserId'
            });
            
            Photo.hasMany(models.Comment,{
                as:"Comment",
                foreignKey:"PhotoId",
                onDelete: 'cascade',
                hooks:true
            });
        }
    }
    Photo.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Title cannot be omitted",
                },
                notEmpty: {
                    msg: "Title cannot be an empty string",
                }
            },
        },
        caption: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Caption cannot be omitted",
                },
                notEmpty: {
                    msg: "Caption cannot be an empty string",
                }
            },
        },
        poster_image_url: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Poster image url cannot be omitted",
                },
                notEmpty: {
                    msg: "Poster image url cannot be an empty string",
                },
                isUrl: {
                    msg: "Poster image url format is wrong",
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
        modelName: 'Photo',
    });
    return Photo;
};