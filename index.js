require("dotenv").config();
const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

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
