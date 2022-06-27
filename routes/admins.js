const express = require("express");
const router = express.Router();

router.get("/r1/:action?/:id?", (req, res) => {
    res.json({
        code: 1,
        params: req.params,
        baseUrl: req.baseUrl,
        originUrl: req.originalUrl,
    });
});
router.get("/r2/:action?/:id?", (req, res) => {
    res.json({
        code: 2,
        params: req.params,
        baseUrl: req.baseUrl,
        originUrl: req.originalUrl,
    });
});

module.exports = router;
