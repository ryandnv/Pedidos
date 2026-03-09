const express = require("express");
const { home } = require("../controllers/homeController");
const {
  index,
  newForm,
  save,
  show,
  editForm,
  update,
  remove
} = require("../controllers/webOrdersController");

const router = express.Router();

router.get("/", home);

router.get("/order/list-page", index);
router.get("/order/new", newForm);
router.post("/order/save", save);
router.get("/order/show/:orderId", show);
router.get("/order/edit/:orderId", editForm);
router.post("/order/update/:orderId", update);
router.post("/order/delete/:orderId", remove);

module.exports = router;