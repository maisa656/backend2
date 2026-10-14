
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());


function getProducts() {
  const data = fs.readFileSync("products.json", "utf8");
  return JSON.parse(data);
}


function saveProducts(products) {
  fs.writeFileSync(
    "products.json",
    JSON.stringify(products, null, 2)
  );
}


app.get("/products", (req, res) => {
  const products = getProducts();
  res.json(products);
});


app.get("/products/:id", (req, res) => {
  const products = getProducts();

  const product = products.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
});


app.post("/products", (req, res) => {
  const products = getProducts();

  const { name, price, description } = req.body;

  if (!name || price === undefined || !description) {
    return res.status(400).json({
      message: "Please provide name, price and description",
    });
  }

  const newProduct = {
    id: products.length
      ? Math.max(...products.map((item) => item.id)) + 1
      : 1,
    name,
    price,
    description,
  };

  products.push(newProduct);
  saveProducts(products);

  res.status(201).json(newProduct);
});


app.put("/products/:id", (req, res) => {
  const products = getProducts();

  const id = Number(req.params.id);

  const index = products.findIndex(
    (item) => item.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const { name, price, description } = req.body;

  if (!name || price === undefined || !description) {
    return res.status(400).json({
      message: "Please provide name, price and description",
    });
  }

  products[index] = {
    id,
    name,
    price,
    description,
  };

  saveProducts(products);

  res.json(products[index]);
});


app.delete("/products/:id", (req, res) => {
  const products = getProducts();

  const id = Number(req.params.id);

  const index = products.findIndex(
    (item) => item.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  products.splice(index, 1);
  saveProducts(products);

  res.json({
    message: "Product deleted successfully",
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
