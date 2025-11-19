import "dotenv/config";
import { sequelize } from "../src/config/configdb";
import ProductModel from "../src/models/product";

const Product = ProductModel(sequelize);

const products = [
  {
    productName: "Laptop Dell XPS 13",
    brand: "Dell",
    category: "Laptop",
    address: "Hanoi",
    price: 2500.0,
    image: "https://example.com/images/dell-xps13.jpg",
  },
  {
    productName: "MacBook Pro 16",
    brand: "Apple",
    category: "Laptop",
    address: "Hanoi",
    price: 3200.0,
    image: "https://example.com/images/macbook-pro16.jpg",
  },
  {
    productName: "iPhone 15 Pro",
    brand: "Apple",
    category: "Phone",
    address: "HCMC",
    price: 1200.0,
    image: "https://example.com/images/iphone15pro.jpg",
  },
  {
    productName: "Samsung Galaxy S23",
    brand: "Samsung",
    category: "Phone",
    address: "HCMC",
    price: 999.0,
    image: "https://example.com/images/galaxy-s23.jpg",
  },
  {
    productName: "HP Spectre x360",
    brand: "HP",
    category: "Laptop",
    address: "Da Nang",
    price: 1800.0,
    image: "https://example.com/images/hp-spectre.jpg",
  },
  {
    productName: "Lenovo ThinkPad X1",
    brand: "Lenovo",
    category: "Laptop",
    address: "Hanoi",
    price: 2000.0,
    image: "https://example.com/images/thinkpad-x1.jpg",
  },
  {
    productName: "iPad Pro 12.9",
    brand: "Apple",
    category: "Tablet",
    address: "HCMC",
    price: 1100.0,
    image: "https://example.com/images/ipad-pro.jpg",
  },
  {
    productName: "Samsung Galaxy Tab S9",
    brand: "Samsung",
    category: "Tablet",
    address: "Da Nang",
    price: 950.0,
    image: "https://example.com/images/galaxy-tab.jpg",
  },
  {
    productName: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    address: "Hanoi",
    price: 400.0,
    image: "https://example.com/images/sony-wh1000xm5.jpg",
  },
  {
    productName: "Bose QuietComfort 45",
    brand: "Bose",
    category: "Headphones",
    address: "HCMC",
    price: 380.0,
    image: "https://example.com/images/bose-qc45.jpg",
  },
  {
    productName: "Canon EOS R6",
    brand: "Canon",
    category: "Camera",
    address: "Da Nang",
    price: 2500.0,
    image: "https://example.com/images/canon-eos-r6.jpg",
  },
  {
    productName: "Nikon Z7 II",
    brand: "Nikon",
    category: "Camera",
    address: "Hanoi",
    price: 3000.0,
    image: "https://example.com/images/nikon-z7.jpg",
  },
  {
    productName: "GoPro Hero 12",
    brand: "GoPro",
    category: "Camera",
    address: "HCMC",
    price: 500.0,
    image: "https://example.com/images/gopro-hero12.jpg",
  },
  {
    productName: "Apple Watch Series 9",
    brand: "Apple",
    category: "Wearable",
    address: "Hanoi",
    price: 450.0,
    image: "https://example.com/images/apple-watch9.jpg",
  },
  {
    productName: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    category: "Wearable",
    address: "HCMC",
    price: 400.0,
    image: "https://example.com/images/galaxy-watch6.jpg",
  },
  {
    productName: "Microsoft Surface Pro 9",
    brand: "Microsoft",
    category: "Tablet",
    address: "Da Nang",
    price: 1300.0,
    image: "https://example.com/images/surface-pro9.jpg",
  },
  {
    productName: "Xiaomi Mi 13",
    brand: "Xiaomi",
    category: "Phone",
    address: "Hanoi",
    price: 700.0,
    image: "https://example.com/images/xiaomi-mi13.jpg",
  },
  {
    productName: "Asus ROG Zephyrus G15",
    brand: "Asus",
    category: "Laptop",
    address: "HCMC",
    price: 2200.0,
    image: "https://example.com/images/asus-rog-g15.jpg",
  },
  {
    productName: "Dell Inspiron 15",
    brand: "Dell",
    category: "Laptop",
    address: "Da Nang",
    price: 1200.0,
    image: "https://example.com/images/dell-inspiron15.jpg",
  },
  {
    productName: "Canon PowerShot G7 X",
    brand: "Canon",
    category: "Camera",
    address: "Hanoi",
    price: 700.0,
    image: "https://example.com/images/canon-g7x.jpg",
  },
];

const seedProducts = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    await Product.sync({ alter: true });
    console.log("Product table synced");

    await Product.bulkCreate(products, { ignoreDuplicates: true });
    console.log("20 products added successfully");
  } catch (error) {
    console.error("Failed to seed products:", error);
  } finally {
    await sequelize.close();
  }
};

seedProducts();
