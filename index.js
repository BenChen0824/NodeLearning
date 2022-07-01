require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const session = require("express-session");
const MysqlStore = require("express-mysql-session")(session);
const db = require(__dirname + "/modules/mysql_connect");
// const upload = multer({ dest: "tmp_upload/" });
const upload = require(__dirname + "/modules/upload_imgs");
const moment = require("moment-timezone");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const sessionStore = new MysqlStore({}, db);

const { toDateString, toDatetimeString } = require(__dirname +
    "/modules/date_tools");

app.set("view engine", "ejs");

app.set("case sensitive routing", true);
//將url得大小寫區隔開來 預設大小寫匯市不同的url

//TOP LEVEL Middleware

const corsOptions = {
    credentials: true,
    origin: (origin, cb) => {
        // console.log({ origin });
        cb(null, true);
    },
};

app.use(cors(corsOptions));
app.use(
    session({
        saveUninitialized: false,
        resave: false,
        secret: "asdaspv;olkc;l,masdkjasd;lk;as",
        store: sessionStore,
        cookie: {
            maxAge: 120000,
        },
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", (req, res, next) => {
    //template helper functions
    res.locals.toDateString = toDateString;
    res.locals.toDatetimeString = toDatetimeString;

    res.locals.session = req.session;
    //這邊能成功是基於下面有定義req.session 沒有的話無法使用
    //也因為這邊是最高的middleware 所以所有都會經過這邊 在跳轉頁面時也不會登出

    next();
});

// middleware: 中介軟體 (function)
const bodyparser = express.urlencoded({ extended: false });
app.post("/try-post", bodyparser, (req, res) => {
    res.json({ ...req.body, age: req.body.age * 2 });
});

app.route("/try-post-form")
    .get((req, res) => {
        res.render("try-post-form");
    })
    .post((req, res) => {
        const { email, password } = req.body;
        res.render("try-post-form", { email, password });
    });

app.post("/try-upload", upload.single("avatar"), (req, res) => {
    res.json(req.file);
});

app.post("/try-uploads", upload.array("photos"), (req, res) => {
    res.json(req.files);
});

app.get("/try-params1/:action/:id", (req, res) => {
    res.json({ code: 2, params: req.params });
    // 這邊的要求是最嚴謹的 要放最上面
});
app.get("/try-params1/:action", (req, res) => {
    res.json({ code: 3, params: req.params });
});
app.get("/try-params1/:action?/:id?", (req, res) => {
    res.json({ code: 1, params: req.params });
    // 這邊的參數要求是最鬆的 有沒有放參數都能進來 放最後
});

app.get("/try-session", (req, res) => {
    req.session.sessionCount = req.session.sessionCount || 0;
    req.session.sessionCount++;
    res.json({
        sessionCount: req.session.sessionCount,
        session: req.session,
    });
});

app.get(/^\/hi\/?/i, (req, res) => {
    res.send({ url: req.url });
});
app.get(["/aaa", "/bbb/"], (req, res) => {
    res.send({ url: req.url, code: "array", type: typeof req });
});

const adminsRouter = require(__dirname + "/routes/admins");
//prefix前綴路徑
app.use("/admins", adminsRouter);
app.use(adminsRouter);
//兩者差異在baseUrl而已 但無相關性

app.get("/try-qs", (req, res) => {
    res.json(req.query);
});

app.get("/try-json", (req, res) => {
    const data = require(__dirname + "/data/data01");
    console.log(data);
    res.locals.rows = data;
    res.render("try-json");
});

app.get("/try-moment", (req, res) => {
    const fm = "YYYY-MM-DD HH:mm:ss";
    const moment1 = moment();
    const moment2 = moment("2022-02-28");

    res.json({
        "local-moment1": moment1.format(fm),
        "local-moment2": moment2.format(fm),
        "Sydney-moment1": moment1.tz("Australia/Sydney").format(fm),
        "Sydney-moment2": moment2.tz("Australia/Sydney").format(fm),
    });
});

app.use("/address_book", require(__dirname + "/routes/address_book"));
app.use("/carts", require(__dirname + "/routes/carts"));

app.get("/yahoo", (req, res) => {
    axios
        .get("https://tw.yahoo.com/")
        //yahoo本身事全後端網站 所以圖片路徑那些都是絕對路徑才讀的到
        //如果有前端框架舊址譨吃到一層沒辦法全部顯示
        .then(function (response) {
            // handle success
            console.log(response);
            res.send(response.data);
        });
});

//--------------登入帳密-----------------
app.route("/login")
    .get(async (req, res) => {
        res.render("login");
    })
    .post(async (req, res) => {
        const output = {
            success: false,
            error: "",
        };
        const sql = "SELECT * FROM admins WHERE account=?";
        const [r1] = await db.query(sql, req.body.account);

        if (!r1.length) {
            output.code = 401;
            output.error = "帳號錯誤";
            return res.json(output);
        }
        output.success = await bcrypt.compare(
            req.body.password,
            r1[0].pass_hash
        );

        if (!output.success) {
            output.code = 402;
            output.error = "密碼錯誤";
            return res.json(output);
        } else {
            req.session.admin = {
                sid: r1[0].sid,
                account: r1[0].account,
            };
        }

        res.json(output);
    });

app.get("/logout", (req, res) => {
    delete req.session.admin;
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.render("main", { name: "Ben" });
});

//---------static---------------------
app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use("/joi", express.static("node_modules/joi/dist"));

app.use((req, res) => {
    res.send(
        `Page404<br> <img width="75%" height=auto src="/images/avatar04.jpg" >`
    );
});

app.listen(process.env.PORT, () => {
    console.log(`Server started:${process.env.PORT}`);
});
