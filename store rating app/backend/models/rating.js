module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define("Rating", {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      userId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      storeId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: { min: 1, max: 5 } // Ratings between 1 and 5
      }
  }, {
      tableName: "Ratings",
      timestamps: true
  });
  Rating.associate = (models) => {
    Rating.belongsTo(models.User, { foreignKey: "userId" });
    Rating.belongsTo(models.Store, { foreignKey: "storeId" });
};
return Rating;
};
