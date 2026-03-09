const { DataTypes } = require("sequelize");
const connection = require("../database/database");

const Item = connection.define("Item", {
  orderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: "items",
  freezeTableName: true,
  timestamps: false
});

Item.removeAttribute("id");

module.exports = Item;