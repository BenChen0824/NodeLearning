const LinePay = require("line-pay-v3");
const pay = function () {
    let linePay = new LinePay({
        channelId: 1657216441,
        channelSecret: "407efe35caedc7c572db5306540986bf",
        uri: "https://sandbox-api-pay.line.me",
    });

    const order = {
        amount: 1200,
        currency: "TWD",
        orderId: "Order2022070700001",
        packages: [
            {
                id: "Item20191015001",
                amount: 200,
                name: "生鮮商品",
                products: [
                    {
                        name: "apple",
                        quantity: 2,
                        price: 100,
                    },
                ],
            },
            {
                id: "Item20191015001",
                amount: 1000,
                name: "客製化商品",
                products: [
                    {
                        name: "bento",
                        quantity: 4,
                        price: 250,
                    },
                ],
            },
        ],
        redirectUrls: {
            confirmUrl: "https://google.com",
            cancelUrl: "https://example.com/cancelUrl",
        },
    };

    linePay
        .request(order)
        .then((res) => {
            console.log(JSON.stringify(res));
            const checkURL = res.info.paymentUrl.web;
            //TODO 把checkURL抓到實際畫面之中
            console.log(checkURL);
            console.log(JSON.stringify(res.info.transactionId));
            return res;
        })
        .then((res) => {
            setTimeout(() => {
                // console.log(JSON.stringify(res.info.transactionId));

                const confirm = {
                    amount: 1200,
                    currency: "TWD",
                };
                let confirmId = res.info.transactionId;

                linePay.confirm(confirm, confirmId).then((res) => {
                    console.log(res);
                });
            }, 20000);
        });
};

module.exports = pay;
