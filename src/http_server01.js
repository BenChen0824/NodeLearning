const http = require("http");
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html",
    });
    res.end(`<h2>Hello World</h2><br><br><p>${req.url}</p>`);
});

server.listen(1234);
