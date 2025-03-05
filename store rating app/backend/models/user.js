const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // ✅ Auto-increment ID
        primaryKey: true
      },
      name: {
          type: DataTypes.STRING,
          allowNull: false
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
              isEmail: true
          }
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false
      },
      address: {
          type: DataTypes.STRING,
          allowNull: true
      },
      role: {
          type: DataTypes.ENUM("user", "admin"),
          defaultValue: "user"
      }
  }, {
      timestamps: true
  });

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
User.associate = (models) => {
    User.hasMany(models.Rating, { foreignKey: "userId", onDelete: "CASCADE" });
};


  return User;
};
