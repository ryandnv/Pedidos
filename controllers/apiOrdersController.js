const {
  createOrderFromApi,
  findOrderById,
  listAllOrders,
  updateOrderFromApi,
  deleteOrder,
  mapDatabaseToOutput
} = require("../services/orderService");

async function createOrder(req, res) {
  try {
    const order = await createOrderFromApi(req.body);
    return res.status(201).json(mapDatabaseToOutput(order));
  } catch (error) {
    const status = error.message === "Pedido já existe" ? 409 : 400;
    return res.status(status).json({ error: error.message });
  }
}

async function getOrderById(req, res) {
  try {
    const orderId = req.params.orderId.trim();

    const order = await findOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        error: "Pedido não encontrado",
        searchedOrderId: orderId
      });
    }

    return res.status(200).json(mapDatabaseToOutput(order));
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar pedido" });
  }
}

async function listOrders(req, res) {
  try {
    const orders = await listAllOrders();
    return res.status(200).json(orders.map(mapDatabaseToOutput));
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar pedidos" });
  }
}

async function updateOrder(req, res) {
  try {
    const order = await updateOrderFromApi(req.params.orderId, req.body);
    return res.status(200).json(mapDatabaseToOutput(order));
  } catch (error) {
    const status = error.message === "Pedido não encontrado" ? 404 : 400;
    return res.status(status).json({ error: error.message });
  }
}

async function removeOrder(req, res) {
  try {
    await deleteOrder(req.params.orderId);
    return res.status(200).json({ message: "Pedido removido com sucesso" });
  } catch (error) {
    const status = error.message === "Pedido não encontrado" ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  removeOrder
};