const express = require("express");
const db = require(__dirname + "/../modules/mysql_connect");
const { toDateString, toDatetimeString } = require(__dirname +
    "/../modules/date_tools");
//這邊是閏改變日期呈現的模組

const router = express.Router();

//只要會用到資料庫這邊就是加async 下面才可以用await
const getListHandler = async (req, res) => {
    let output = {
        perPage: 20,
        page: 1,
        totalRows: 0,
        totalPages: 0,
        code: 0, // 辨識狀態
        error: "",
        rows: [],
        query: {},
    };

    let page = +req.query.page || 1;
    //這邊的+是?page=5 跳轉第五頁時 讓他page呈現為num而不是預設的str
    //用戶沒有給第幾頁時預設為第一頁
    //這邊的query是一種屬性

    let search = req.query.search || "";
    let where = " WHERE 1 ";
    if (search) {
        where += ` AND name LIKE ${db.escape("%" + search + "%")} `;
        //跳脫用
        output.query.search = search;
        output.showtest = db.escape("%" + search + "%");
        //在api那邊做確認
    }

    if (page < 1) {
        output.code = 420;
        output.error = "頁碼太小";
        return output;
        //這邊的redirect部分一定要用return得 不然會跟下面的res.json卡住
        //如果page<第一頁 都跳轉到第一頁
    }

    //查看總比數並以TotalRows來代表
    const sqlCount = `SELECT COUNT(1) TotalRows FROM address_book ${where} `;
    // const [TotalRows] = await db.query(sqlCount);
    //這個拿到就是一個array
    // const [[TotalRows]] = await db.query(sqlCount);
    //這個拿到是一個obj
    const [[{ TotalRows }]] = await db.query(sqlCount);
    //這裡的query()是一種方法
    // 展開設定 所以這個拿到的是一個純數字(字串)
    let Totalpages = 0;
    if (TotalRows) {
        Totalpages = Math.ceil(TotalRows / output.perPage);
        if (page > Totalpages) {
            output.code = 430;
            output.error = "頁碼太大";
            output.Totalpages = Totalpages;
            return output;
            //如果>最大頁面以最大頁面來呈現
            //這邊的redirect部分一定要用return得 不然會跟下面的res.json卡住
        }

        const sql = `SELECT * FROM address_book ${where} ORDER BY sid DESC LIMIT ${
            (page - 1) * output.perPage
        }, ${output.perPage}`;
        //取得所有資料在address book裡的 並限制範圍為第n-1頁->第n頁的範圍 並看一頁有多少就放多少資料
        const [result2] = await db.query(sql);
        // result2.forEach((element) => {
        //     element.birthday = toDateString(element.birthday);
        //     //這邊是把日期依照日期模組改變後 重新存入該變數 如果還需要原本的也可以存到一個新的變數之中
        // });
        output.rows = result2;
    }
    output.code = 200;
    output = { ...output, page, TotalRows, Totalpages };
    return output;
};

router.get("/", async (req, res) => {
    const output = await getListHandler(req, res);
    switch (output.code) {
        case 420:
            return res.redirect(`?page=1`);
            break;
        case 430:
            return res.redirect(`?page=${output.Totalpages}`);
            break;
    }
    res.render("address_book/main", output);
});
router.get("/api", async (req, res) => {
    const output = await getListHandler(req, res);
    res.json(output);
});

module.exports = router;
