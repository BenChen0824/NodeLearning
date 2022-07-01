

req.query

req.body

req.params

req.file
req.files

req.session
------------------------------------
res.end()

res.send()

res.json()

res.render()

res.redirect()
------------------------------------
# RESTful API

# CRUD


# 列表 (GET)
/products
/products?page=2
/products?page=2&search=找東西

# 單一商品 (GET)
/products/:id

# 新增商品 (POST)
/products

# 修改商品 (PUT)
/products/:id

# 刪除商品 (DELETE)
/products/:id



/products/:category_id/:product_id

------------------------------------
cart table 購物車的資料表參考
----------------
PK

item_type: product, event, ticket

user_id

item_id :12

quantity

created_at
----------------------------------

同源政策 Same-origin policy

協定 protocal
http/https

埠號 port

網域 domain
主機名稱會看成字串來比對  所以如果是 127.0.0.1 localhost 
這兩個都算是本機端 但在判定上是不同源



三個都要是一樣的才算是同源









