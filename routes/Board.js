const express = require("express");

const { BoardController: controller } = require("../controller");

const router = express.Router();

router.post("/post", controller.Post);

router.post("/search", controller.Search);

router.post("/delete", controller.Delete);

router.post("/update", controller.Update);

router.get("/get", controller.Get);

module.exports = router;
