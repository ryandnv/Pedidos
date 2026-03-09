const { DataTypes } = require("sequelize");
const connection = require("../database/database");

const Order = connection.define("Order", {
  orderId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: "orders",
  freezeTableName: true,
  timestamps: false
});

module.exports = Order;