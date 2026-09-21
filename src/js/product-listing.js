import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

const list = new ProductList(category, dataSource, listElement);
list.init();

document.querySelector(".title").textContent = `Top Products: ${category}`;
