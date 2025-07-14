const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const User = require("./User");

const Thinking = db.define("Thinking", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

Thinking.belongsTo(User);
User.hasMany(Thinking);

module.exports = Thinking;
