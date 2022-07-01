const express = require("express");
const db = require(__dirname + "/../modules/mysql_connect");
const { toDateString, toDatetimeString } = require(__dirname +
    "/../modules/date_tools");
//這邊是閏改變日期呈現的模組
const moment = require("moment-timezone");
const Joi = require("joi");
const upload = require(__dirname + "/../modules/upload_imgs");

const router = express.Router();
const fake_user = 3;

const getUserCart = async (user_id) => {
    const sql = `SELECT p.*, c.qty 
    FROM carts c 
    JOIN products p 
    ON c.product_id=p.sid 
    WHERE user_id=?
    ORDER BY c.created_at`;

    const [r] = await db.query(sql, [user_id]);
    return r;
};

//CRUD

router.post("/", async (req, res) => {
    const output = {
        success: false,
        error: "",
    };
    if (!req.body.product_id || !req.body.quantity) {
        output.error = "參數不足";
        return res.json(output);
    }
    const sql = `SELECT * FROM products WHERE sid=?`;
    const [r1] = await db.query(sql, [req.body.product_id]);
    if (!r1.length) {
        output.error = "沒有這個商品";
        return res.json(output);
    }
    if (+req.body.quantity < 1) {
        output.error = "請確認數量並重新加入購物車";
        return res.json(output);
    }

    // 判斷該商品是否已經加入購物車 有加入不該為新增 而是使用UPDATE
    const sql3 = `SELECT COUNT(1) num FROM carts WHERE product_id=? AND user_id=?`;
    const [[{ num }]] = await db.query(sql3, [req.body.product_id, fake_user]);
    if (num > 0) {
        output.error = "購物車內已經有這項商品";
        return res.json(output);
    }

    const sql2 =
        "INSERT INTO `carts`(`user_id`, `product_id`, `qty`) VALUES (?,?,?)";

    const [r2] = await db.query(sql2, [
        fake_user,
        req.body.product_id,
        req.body.quantity,
    ]);

    // console.log(r2.affectedRows);
    if (r2.affectedRows) {
        output.success = true;
    }

    output.cart = await getUserCart(fake_user);
    res.json(output);
    //sid qty
});
router.get("/", async (req, res) => {
    res.json(await getUserCart(fake_user));
});

router.put("/", async (req, res) => {
    // body: product_id, quantity
    const output = {
        success: false,
        error: "",
    };
    if (!req.body.product_id || !req.body.quantity) {
        output.error = "參數不足";
        return res.json(output);
    }

    if (+req.body.quantity < 1) {
        output.error = "數量不能小於 1";
        return res.json(output);
    }

    // 判斷該商品是否已經加入購物車
    const sql3 = `SELECT COUNT(1) num FROM carts WHERE product_id=? AND user_id=?`;
    const [[{ num }]] = await db.query(sql3, [req.body.product_id, fake_user]);
    if (num <= 0) {
        output.error = "購物車內沒有這項商品";
        return res.json(output);
    }

    const sql2 = "UPDATE `carts` SET `qty`=? WHERE product_id=? AND user_id=?";
    const [r2] = await db.query(sql2, [
        req.body.quantity,
        req.body.product_id,
        fake_user,
    ]);
    output.r2 = r2;

    if (r2.affectedRows && r2.changedRows) {
        output.success = true;
    }

    output.cart = await getUserCart(fake_user);
    res.json(output);
    //sid qty
});
router.delete("/", async (req, res) => {
    // product_id
    const sql = "DELETE FROM carts WHERE user_id=? AND product_id=?";
    await db.query(sql, [fake_user, req.body.product_id]);

    res.json(await getUserCart(fake_user));
});

module.exports = router;
