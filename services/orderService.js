const connection = require("../database/database");
const Order = require("../models/Order");
const Item = require("../models/Item");

function mapInputToDatabase(body, orderIdFromUrl = null) {
  const orderId = orderIdFromUrl || body.numeroPedido;

  if (!orderId) throw new Error("numeroPedido é obrigatório");
  if (body.valorTotal === undefined || body.valorTotal === null) throw new Error("valorTotal é obrigatório");
  if (!body.dataCriacao) throw new Error("dataCriacao é obrigatória");
  if (!Array.isArray(body.items) || body.items.length === 0) throw new Error("items deve conter ao menos 1 item");

  const parsedDate = new Date(body.dataCriacao);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("dataCriacao inválida");
  }

  const order = {
    orderId,
    value: Number(body.valorTotal),
    creationDate: parsedDate
  };

  const items = body.items.map(item => {
    if (
      item.idItem === undefined ||
      item.quantidadeItem === undefined ||
      item.valorItem === undefined
    ) {
      throw new Error("Cada item deve ter idItem, quantidadeItem e valorItem");
    }

    return {
      orderId,
      productId: Number(item.idItem),
      quantity: Number(item.quantidadeItem),
      price: Number(item.valorItem)
    };
  });

  return { order, items };
}

function mapDatabaseToOutput(orderInstance) {
  return {
    orderId: orderInstance.orderId,
    value: orderInstance.value,
    creationDate: orderInstance.creationDate,
    items: (orderInstance.items || []).map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }))
  };
}

async function createOrderFromApi(body) {
  const transaction = await connection.transaction();

  try {
    const { order, items } = mapInputToDatabase(body);

    const existingOrder = await Order.findByPk(order.orderId, { transaction });
    if (existingOrder) {
      throw new Error("Pedido já existe");
    }

    await Order.create(order, { transaction });
    await Item.bulkCreate(items, { transaction });

    await transaction.commit();

    return await Order.findByPk(order.orderId, {
      include: [{ model: Item, as: "items" }]
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function createOrderFromWeb(body) {
  const transaction = await connection.transaction();

  try {
    const orderId = body.orderId;
    const value = Number(body.value);
    const creationDate = new Date(body.creationDate);

    if (!orderId || !value || Number.isNaN(creationDate.getTime())) {
      throw new Error("Dados inválidos");
    }

    const existingOrder = await Order.findByPk(orderId, { transaction });
    if (existingOrder) {
      throw new Error("Pedido já existe");
    }

    await Order.create({
      orderId,
      value,
      creationDate
    }, { transaction });

    await Item.create({
      orderId,
      productId: Number(body.productId),
      quantity: Number(body.quantity),
      price: Number(body.price)
    }, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function findOrderById(orderId) {
  return await Order.findByPk(orderId, {
    include: [{ model: Item, as: "items" }]
  });
}

async function listAllOrders() {
  return await Order.findAll({
    include: [{ model: Item, as: "items" }],
    order: [["creationDate", "DESC"]]
  });
}

async function updateOrderFromApi(orderId, body) {
  const transaction = await connection.transaction();

  try {
    const existingOrder = await Order.findByPk(orderId, { transaction });
    if (!existingOrder) {
      throw new Error("Pedido não encontrado");
    }

    const { order, items } = mapInputToDatabase(body, orderId);

    await Order.update({
      value: order.value,
      creationDate: order.creationDate
    }, {
      where: { orderId },
      transaction
    });

    await Item.destroy({
      where: { orderId },
      transaction
    });

    await Item.bulkCreate(items, { transaction });

    await transaction.commit();

    return await findOrderById(orderId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function updateOrderFromWeb(oldOrderId, body) {
  const transaction = await connection.transaction();

  try {
    const existingOrder = await Order.findByPk(oldOrderId, { transaction });
    if (!existingOrder) {
      throw new Error("Pedido não encontrado");
    }

    const newOrderId = body.orderId;
    const value = Number(body.value);
    const creationDate = new Date(body.creationDate);

    await Item.destroy({
      where: { orderId: oldOrderId },
      transaction
    });

    if (oldOrderId !== newOrderId) {
      await Order.destroy({
        where: { orderId: oldOrderId },
        transaction
      });

      await Order.create({
        orderId: newOrderId,
        value,
        creationDate
      }, { transaction });
    } else {
      await Order.update({
        value,
        creationDate
      }, {
        where: { orderId: oldOrderId },
        transaction
      });
    }

    await Item.create({
      orderId: newOrderId,
      productId: Number(body.productId),
      quantity: Number(body.quantity),
      price: Number(body.price)
    }, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function deleteOrder(orderId) {
  const transaction = await connection.transaction();

  try {
    const existingOrder = await Order.findByPk(orderId, { transaction });
    if (!existingOrder) {
      throw new Error("Pedido não encontrado");
    }

    await Item.destroy({
      where: { orderId },
      transaction
    });

    await Order.destroy({
      where: { orderId },
      transaction
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  mapDatabaseToOutput,
  createOrderFromApi,
  createOrderFromWeb,
  findOrderById,
  listAllOrders,
  updateOrderFromApi,
  updateOrderFromWeb,
  deleteOrder
};