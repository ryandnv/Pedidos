const {
  createOrderFromWeb,
  findOrderById,
  listAllOrders,
  updateOrderFromWeb,
  deleteOrder
} = require("../services/orderService");

async function index(req, res) {
  try {
    const orders = await listAllOrders();
    res.render("orders/index", { orders });
  } catch (error) {
    res.render("orders/index", { orders: [] });
  }
}

function newForm(req, res) {
  res.render("orders/new");
}

async function save(req, res) {
  try {
    await createOrderFromWeb(req.body);
    res.redirect("/order/list-page");
  } catch (error) {
    res.redirect("/order/new");
  }
}

async function show(req, res) {
  try {
    const order = await findOrderById(req.params.orderId);

    if (!order) {
      return res.redirect("/order/list-page");
    }

    res.render("orders/show", { order });
  } catch (error) {
    res.redirect("/order/list-page");
  }
}

async function editForm(req, res) {
  try {
    const order = await findOrderById(req.params.orderId);

    if (!order) {
      return res.redirect("/order/list-page");
    }

    res.render("orders/edit", { order });
  } catch (error) {
    res.redirect("/order/list-page");
  }
}

async function update(req, res) {
  try {
    await updateOrderFromWeb(req.params.orderId, req.body);
    res.redirect("/order/list-page");
  } catch (error) {
    res.redirect("/order/list-page");
  }
}

async function remove(req, res) {
  try {
    await deleteOrder(req.params.orderId);
    res.redirect("/order/list-page");
  } catch (error) {
    res.redirect("/order/list-page");
  }
}

module.exports = {
  index,
  newForm,
  save,
  show,
  editForm,
  update,
  remove
};