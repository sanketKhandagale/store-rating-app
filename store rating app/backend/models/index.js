const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database"); // Use the existing database instance
const Sequelize = require("sequelize");

const db = {};

// Load all models dynamically
fs.readdirSync(__dirname)
    .filter(file => file !== "index.js")
    .forEach(file => {
        console.log(`Loading model from file: ${file}`); // Debug log
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
       
        db[model.name] = model;
        
    });
    

// Set up associations if they exist
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize; // Use the same Sequelize instance everywhere
db.Sequelize = Sequelize;

module.exports = db;
