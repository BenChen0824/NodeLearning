require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "tmp_upload/" });

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

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

app.get("/try-qs", (req, res) => {
    res.json(req.query);
});

app.get("/", (req, res) => {
    res.render("main", { name: "Ben" });
});

app.use((req, res) => {
    res.send(
        `Page404<br> <img width="75%" height=auto src="/images/avatar04.jpg" >`
    );
});

app.listen(process.env.DB_PORT, () => {
    console.log(`Server started:${process.env.DB_PORT}`);
});
