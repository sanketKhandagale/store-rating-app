module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define("Store", {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      name: {
          type: DataTypes.STRING,
          allowNull: false
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      address: {
          type: DataTypes.STRING,
          allowNull: false
      }
  }, {
      timestamps: true
  });

  Store.associate = (models) => {
    Store.hasMany(models.Rating, { foreignKey: "storeId", onDelete: "CASCADE" });
};


  return Store;
};
