const db = require(__dirname + "/../modules/mysql_connect");

(async () => {
    const sql = "SELECT * FROM `address_book` LIMIT 5";
    const [results, fields] = await db.query(sql);
    console.log(results);
    process.exit();
    //結束行程
})();
