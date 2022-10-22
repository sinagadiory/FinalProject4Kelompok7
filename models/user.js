'use strict';
const {
  Model
} = require('sequelize');
const { hash } = require("./../helpers/hash");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Photo,{
        as:"Photo",
        foreignKey:"UserId",
        onDelete:'CASCADE',
        hooks:true
      });
      
      User.hasMany(models.Comment,{
        as:"Comment",
        foreignKey:"UserId",
        onDelete: 'cascade',
        hooks:true
      });

      User.hasMany(models.Medsos,{
        as:"Medsos",
        foreignKey:"UserId",
        onDelete: 'cascade',
        hooks:true
      });
      // define association here
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Full name cannot be omitted",
        },
        notEmpty: {
          msg: "Full name cannot be an empty string",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email cannot be omitted",
        },
        notEmpty: {
          msg: "Email cannot be an empty string",
        },
        isEmail: {
          msg: "Email format wrong",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Username cannot be omitted",
        },
        notEmpty: {
          msg: "Username cannot be an empty string",
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password cannot be omitted",
        },
        notEmpty: {
          msg: "Password cannot be an empty string",
        },
        is:{
          args:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          msg:"Password minimum delapan karakter, setidaknya satu huruf besar, satu huruf kecil, satu angka dan satu karakter khusus"
        }
      },
    },
    profile_image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Profile image url cannot be omitted",
        },
        notEmpty: {
          msg: "Profile image url cannot be an empty string",
        },
        isUrl: {
          msg: "Profile image url format is wrong",
        }
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Age cannot be omitted",
        },
        notEmpty: {
          msg: "Age cannot be an empty string",
        },
        isNumeric: {
          msg: "Age format must be numeric"
        }
      },
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Phone number cannot be omitted",
        },
        notEmpty: {
          msg: "Phone number cannot be an empty string",
        },
        isNumeric: {
          msg: "Phone number format must be numeric"
        }
      },
    }
  }, {
    hooks: {
      beforeCreate(user) {
        user.password = hash(user.password);
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};