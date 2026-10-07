/* =========================================================
   ARIF FASHION HOUSE - ADMIN PANEL
   Product + Settings + Orders + Status + Print
   ========================================================= */

const DATA_KEY = "afh_v3_data";
const ORDER_KEY = "afh_orders";


/* =========================
   DATA
   ========================= */

function getData() {

  let data = {};

  try {
    data = JSON.parse(localStorage.getItem(DATA_KEY)) || {};
  } catch (e) {
    data = {};
  }

  if (!data.settings) {
    data.settings = {
      brand: "Arif Fashion House",
      hero: "Trendy • Stylish • Quality Clothing",
      shipping: 80,
      cod: true,
      advance: true,
      warning:
        "Order Confirmation: অনুগ্রহ করে Product, Size/Color, Address এবং Mobile Number ভালোভাবে যাচাই করে Order Confirm করুন।"
    };
  }

  if (!Array.isArray(data.products)) {
    data.products = [];
  }

  return data;
}


function saveData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}


function money(amount) {
  return "৳" + Number(amount || 0).toLocaleString("en-BD");
}


function value(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}


function csv(text) {
  return String(text || "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean);
}


/* =========================
   SETTINGS
   ========================= */

function loadSettings() {

  const data = getData();
  const s = data.settings || {};

  const brand = document.getElementById("setBrand");
  const hero = document.getElementById("setHero");
  const shipping = document.getElementById("setShipping");
  const warning = document.getElementById("setWarning");
  const cod = document.getElementById("codOn");
  const advance = document.getElementById("advanceOn");

  if (brand) brand.value = s.brand || "";
  if (hero) hero.value = s.hero || "";
  if (shipping) shipping.value = s.shipping ?? 0;
  if (warning) warning.value = s.warning || "";
  if (cod) cod.checked = s.cod !== false;
  if (advance) advance.checked = s.advance !== false;
}


function saveSettings() {

  const data = getData();

  data.settings = {
    ...(data.settings || {}),

    brand: value("setBrand") || "Arif Fashion House",

    hero:
      value("setHero") ||
      "Trendy • Stylish • Quality Clothing",

    shipping:
      Number(value("setShipping")) || 0,

    warning:
      value("setWarning") ||
      "Order Confirmation: অনুগ্রহ করে Product, Size/Color, Address এবং Mobile Number ভালোভাবে যাচাই করে Order Confirm করুন।",

    cod:
      document.getElementById("codOn")
        ? document.getElementById("codOn").checked
        : true,

    advance:
      document.getElementById("advanceOn")
        ? document.getElementById("advanceOn").checked
        : true
  };

  saveData(data);

  alert("✅ Website Settings saved successfully!");

  loadSettings();
}


/* =========================
   PRODUCT
   ========================= */

function saveProduct() {

  const data = getData();

  const id =
    value("pId") ||
    "p" + Date.now();

  const name = value("pName");
  const category = value("pCat") || "men";
  const image = value("pImage");
  const price = Number(value("pPrice")) || 0;
  const oldPrice = Number(value("pOld")) || 0;

  const colors = csv(value("pColors"));
  const sizes = csv(value("pSizes"));

  const video = value("pVideo");
  const description = value("pDesc");

  if (!name) {
    alert("⚠️ Product name দিন।");
    return;
  }

  if (!price) {
    alert("⚠️ Product price দিন।");
    return;
  }

  const product = {

    id: id,

    name: name,

    cat: category,
    category: category,

    price: price,

    old: oldPrice,
    oldPrice: oldPrice,

    colors: colors,
    sizes: sizes,

    image: image,

    youtube: video,
    video: video,

    desc: description,
    description: description
  };


  const existingIndex =
    data.products.findIndex(p => String(p.id) === String(id));


  if (existingIndex >= 0) {

    data.products[existingIndex] = {
      ...data.products[existingIndex],
      ...product
    };

    alert("✅ Product updated successfully!");

  } else {

    data.products.push(product);

    alert("✅ Product added successfully!");
  }


  saveData(data);

  clearProduct();

  renderProducts();

  updateDashboard();
}


/* =========================
   CLEAR PRODUCT FORM
   ========================= */

function clearProduct() {

  const ids = [
    "pId",
    "pName",
    "pImage",
    "pPrice",
    "pOld",
    "pColors",
    "pSizes",
    "pVideo",
    "pDesc"
  ];

  ids.forEach(id => {

    const el = document.getElementById(id);

    if (el) el.value = "";
  });


  const cat = document.getElementById("pCat");

  if (cat) {
    cat.value = "men";
  }
}


/* =========================
   EDIT PRODUCT
   ========================= */

function editProduct(id) {

  const data = getData();

  const product =
    data.products.find(
      p => String(p.id) === String(id)
    );

  if (!product) {
    alert("Product পাওয়া যায়নি।");
    return;
  }


  const set = (elementId, val) => {

    const el = document.getElementById(elementId);

    if (el) {
      el.value = val ?? "";
    }
  };


  set("pId", product.id);

  set("pName", product.name);

  set(
    "pCat",
    product.cat ||
    product.category ||
    "men"
  );

  set("pImage", product.image);

  set(
    "pPrice",
    product.price
  );

  set(
    "pOld",
    product.oldPrice ??
    product.old
  );

  set(
    "pColors",
    Array.isArray(product.colors)
      ? product.colors.join(", ")
      : product.colors || ""
  );

  set(
    "pSizes",
    Array.isArray(product.sizes)
      ? product.sizes.join(", ")
      : product.sizes || ""
  );

  set(
    "pVideo",
    product.youtube ||
    product.video ||
    ""
  );

  set(
    "pDesc",
    product.description ||
    product.desc ||
    ""
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================
   DELETE PRODUCT
   ========================= */

function deleteProduct(id) {

  const data = getData();

  const product =
    data.products.find(
      p => String(p.id) === String(id)
    );

  if (!product) return;


  const ok = confirm(
    "আপনি কি এই Product delete করতে চান?\n\n" +
    product.name
  );

  if (!ok) return;


  data.products =
    data.products.filter(
      p => String(p.id) !== String(id)
    );


  saveData(data);

  renderProducts();

  updateDashboard();

  alert("✅ Product deleted.");
}


/* =========================
   HTML SAFETY
   ========================= */

function escapeHtml(text) {

  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================
   PRODUCT RENDER
   ========================= */

function renderProducts() {

  const box =
    document.getElementById("adminProducts");

  if (!box) return;


  const data = getData();

  const products = data.products || [];


  if (!products.length) {

    box.innerHTML =
      '<div class="box">' +
      '<p>📦 এখনো কোনো Product নেই।</p>' +
      '</div>';

    return;
  }


  box.innerHTML =
    products.map(product => {

      const colors =
        Array.isArray(product.colors)
          ? product.colors
          : csv(product.colors);

      const sizes =
        Array.isArray(product.sizes)
          ? product.sizes
          : csv(product.sizes);


      const image =
        product.image ||
        "";


      return `

        <div class="card box">

          ${
            image
              ? `
                <img
                  src="${escapeHtml(image)}"
                  alt="${escapeHtml(product.name)}"
                  style="
                    width:100%;
                    max-height:220px;
                    object-fit:cover;
                    border-radius:12px;
                    margin-bottom:10px;
                  "
                  onerror="this.style.display='none'"
                >
              `
              : ""
          }


          <h3>
            ${escapeHtml(product.name || "Unnamed Product")}
          </h3>


          <p>
            Category:
            <b>
              ${escapeHtml(
                product.cat ||
                product.category ||
                ""
              )}
            </b>
          </p>


          <p>
            Price:
            <strong>
              ${money(product.price)}
            </strong>

            ${
              product.oldPrice || product.old
                ? `
                  <del>
                    ${money(
                      product.oldPrice ||
                      product.old
                    )}
                  </del>
                `
                : ""
            }
          </p>


          ${
            colors.length
              ? `
                <p>
                  🎨 Colors:
                  ${escapeHtml(colors.join(", "))}
                </p>
              `
              : ""
          }


          ${
            sizes.length
              ? `
                <p>
                  📏 Sizes:
                  ${escapeHtml(sizes.join(", "))}
                </p>
              `
              : ""
          }


          ${
            product.youtube || product.video
              ? `
                <p>
                  🎬 Video:
                  <a
                    href="${escapeHtml(
                      product.youtube ||
                      product.video
                    )}"
                    target="_blank"
                    rel="noopener"
                  >
                    Open Video
                  </a>
                </p>
              `
              : ""
          }


          ${
            product.description ||
            product.desc
              ? `
                <p>
                  ${escapeHtml(
                    product.description ||
                    product.desc
                  )}
                </p>
              `
              : ""
          }


          <div
            style="
              display:flex;
              gap:8px;
              flex-wrap:wrap;
              margin-top:12px;
            "
          >

            <button
              type="button"
              onclick="editProduct('${escapeHtml(product.id)}')"
            >
              ✏️ Edit
            </button>


            <button
              type="button"
              onclick="deleteProduct('${escapeHtml(product.id)}')"
            >
              🗑️ Delete
            </button>

          </div>

        </div>

      `;

    }).join("");
}


/* =========================
   ORDERS
   ========================= */

function getOrders() {

  try {

    return JSON.parse(
      localStorage.getItem(ORDER_KEY)
    ) || [];

  } catch (e) {

    return [];
  }
}


/* =========================
   ORDER STATUS
   ========================= */

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned"
];


/* =========================
   RENDER ORDERS
   ========================= */

function renderOrders() {

  const box =
    document.getElementById("orders");

  if (!box) return;


  const orders = getOrders();


  if (!orders.length) {

    box.innerHTML =
      '<div class="box">' +
      '<p>📋 এখনো কোনো Order নেই।</p>' +
      '</div>';

    return;
  }


  box.innerHTML =
    orders.map((order, index) => {

      const customer =
        order.customer ||
        order.name ||
        order.customerName ||
        "Customer";


      const phone =
        order.phone ||
        order.mobile ||
        "";


      const address =
        order.address ||
        "";


      const product =
        order.product ||
        order.productName ||
        order.items ||
        "";


      const qty =
        order.qty ||
        order.quantity ||
        1;


      const payment =
        order.payment ||
        order.paymentMethod ||
        "COD";


      const total =
        order.total ||
        order.grandTotal ||
        0;


      const status =
        order.status ||
        "Pending";


      return `

        <div class="box order-card">

          <h3>
            🛒 Order #${index + 1}
          </h3>


          <p>
            <b>Customer:</b>
            ${escapeHtml(customer)}
          </p>


          <p>
            <b>Phone:</b>
            ${escapeHtml(phone)}
          </p>


          <p>
            <b>Address:</b>
            ${escapeHtml(address)}
          </p>


          <p>
            <b>Product:</b>
            ${escapeHtml(
              typeof product === "string"
                ? product
                : JSON.stringify(product)
            )}
          </p>


          <p>
            <b>Quantity:</b>
            ${escapeHtml(qty)}
          </p>


          <p>
            <b>Payment:</b>
            ${escapeHtml(payment)}
          </p>


          <p>
            <b>Total:</b>
            <strong>
              ${money(total)}
            </strong>
          </p>


          <label>
            <b>Order Status:</b>

            <select
              onchange="updateStatus(${index}, this.value)"
            >

              ${
                ORDER_STATUSES.map(
                  s => `
                    <option
                      value="${s}"
                      ${s === status ? "selected" : ""}
                    >
                      ${s}
                    </option>
                  `
                ).join("")
              }

            </select>

          </label>


          <div
            style="
              margin-top:12px;
              display:flex;
              gap:8px;
              flex-wrap:wrap;
            "
          >

            <button
              type="button"
              onclick="printOrder(${index})"
            >
              🖨️ Print
            </button>

          </div>

        </div>

      `;

    }).join("");
}


/* =========================
   UPDATE ORDER STATUS
   ========================= */

function updateStatus(index, status) {

  const orders = getOrders();

  if (!orders[index]) return;


  orders[index].status = status;


  localStorage.setItem(
    ORDER_KEY,
    JSON.stringify(orders)
  );


  renderOrders();

  updateDashboard();
}


/* =========================
   PRINT ORDER
   ========================= */

function printOrder(index) {

  const orders = getOrders();

  const order = orders[index];

  if (!order) {
    alert("Order পাওয়া যায়নি।");
    return;
  }


  const customer =
    order.customer ||
    order.name ||
    order.customerName ||
    "";


  const phone =
    order.phone ||
    order.mobile ||
    "";


  const address =
    order.address ||
    "";


  const product =
    order.product ||
    order.productName ||
    "";


  const qty =
    order.qty ||
    order.quantity ||
    1;


  const payment =
    order.payment ||
    order.paymentMethod ||
    "COD";


  const total =
    order.total ||
    order.grandTotal ||
    0;


  const status =
    order.status ||
    "Pending";


  const orderDate =
    order.date ||
    order.createdAt ||
    new Date().toLocaleString("en-BD");


  const printWindow =
    window.open(
      "",
      "_blank",
      "width=800,height=700"
    );


  if (!printWindow) {

    alert(
      "Popup blocked হয়েছে। Browser থেকে popup allow করুন।"
    );

    return;
  }


  printWindow.document.write(`

<!doctype html>

<html lang="bn">

<head>

<meta charset="utf-8">

<title>Order Print</title>

<style>

body{
  font-family:Arial,sans-serif;
  padding:30px;
  color:#222;
}

.container{
  max-width:700px;
  margin:auto;
  border:1px solid #ddd;
  padding:25px;
  border-radius:12px;
}

h1{
  margin-top:0;
}

table{
  width:100%;
  border-collapse:collapse;
  margin-top:20px;
}

td,th{
  border:1px solid #ddd;
  padding:10px;
  text-align:left;
}

.total{
  font-size:20px;
  font-weight:bold;
}

.footer{
  margin-top:30px;
  text-align:center;
}

@media print{

  body{
    padding:0;
  }

  .container{
    border:0;
  }

}

</style>

</head>


<body>

<div class="container">

<h1>Arif Fashion House</h1>

<h2>Customer Delivery Form</h2>


<table>

<tr>
<th>Order Date</th>
<td>${escapeHtml(orderDate)}</td>
</tr>


<tr>
<th>Customer</th>
<td>${escapeHtml(customer)}</td>
</tr>


<tr>
<th>Phone</th>
<td>${escapeHtml(phone)}</td>
</tr>


<tr>
<th>Address</th>
<td>${escapeHtml(address)}</td>
</tr>


<tr>
<th>Product</th>
<td>${escapeHtml(
  typeof product === "string"
    ? product
    : JSON.stringify(product)
)}</td>
</tr>


<tr>
<th>Quantity</th>
<td>${escapeHtml(qty)}</td>
</tr>


<tr>
<th>Payment</th>
<td>${escapeHtml(payment)}</td>
</tr>


<tr>
<th>Total</th>
<td class="total">${money(total)}</td>
</tr>


<tr>
<th>Status</th>
<td>${escapeHtml(status)}</td>
</tr>

</table>


<div class="footer">

<p>Thank you for shopping with Arif Fashion House.</p>

</div>

</div>


<script>

window.onload = function(){

  window.print();

};

<\/script>

</body>

</html>

  `);


  printWindow.document.close();
}


/* =========================
   DASHBOARD
   ========================= */

function updateDashboard() {

  const data = getData();

  const orders = getOrders();


  const productCount =
    document.getElementById("productCount");

  const orderCount =
    document.getElementById("orderCount");

  const pendingCount =
    document.getElementById("pendingCount");


  if (productCount) {

    productCount.textContent =
      data.products.length;
  }


  if (orderCount) {

    orderCount.textContent =
      orders.length;
  }


  if (pendingCount) {

    pendingCount.textContent =
      orders.filter(
        o =>
          !o.status ||
          o.status === "Pending"
      ).length;

  }
}


/* =========================
   INITIAL LOAD
   ========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadSettings();

    renderProducts();

    renderOrders();

    updateDashboard();

  }
);
