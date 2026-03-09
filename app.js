const express = require("express");
const path = require("path");
const connection = require("./database/database");
const Order = require("./models/Order");
const Item = require("./models/Item");
const webRoutes = require("./routes/webRoutes");

const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  removeOrder
} = require("./controllers/apiOrdersController");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

Order.hasMany(Item, {
  foreignKey: "orderId",
  sourceKey: "orderId",
  as: "items"
});

Item.belongsTo(Order, {
  foreignKey: "orderId",
  targetKey: "orderId"
});

app.use("/", webRoutes);

app.post("/order", createOrder);
app.get("/order/list", listOrders);
app.get("/order/:orderId", getOrderById);
app.put("/order/:orderId", updateOrder);
app.delete("/order/:orderId", removeOrder);

async function start() {
  try {
    await connection.authenticate();
    console.log("Banco conectado com sucesso");

    
    await connection.sync({ alter: true });

    console.log("Tabelas sincronizadas com sucesso");

    app.listen(3000, () => {
      console.log("Servidor rodando em http://localhost:3000");
    });
  } catch (error) {
    console.error("Erro ao iniciar aplicação:", error);
  }
}

start();