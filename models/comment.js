'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User,{
        foreignKey:'UserId'
      });
      
      Comment.belongsTo(models.Photo,{
        foreignKey:'PhotoId'
      });
    }
  }
  Comment.init({
    UserId: {
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
    },
    PhotoId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
          notNull: {
              msg: "PhotoId cannot be omitted",
          },
          notEmpty: {
              msg: "PhotoId cannot be an empty string",
          },
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
          notNull: {
              msg: "Comment cannot be omitted",
          },
          notEmpty: {
              msg: "Comment cannot be an empty string",
          }
      },
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};