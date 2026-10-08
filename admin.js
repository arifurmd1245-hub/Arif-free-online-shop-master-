/* =========================================================
   ARIF FASHION HOUSE - ADMIN PANEL
   Product + Settings + Orders + Status + Print
   + Admin Login + Password Setup + Reset + Change Password
   ========================================================= */

const DATA_KEY = "afh_v3_data";
const ORDER_KEY = "afh_orders";

const ADMIN_PASSWORD_KEY = "afh_admin_password_hash";
const ADMIN_SESSION_KEY = "afh_admin_session";


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


/* =========================================================
   ADMIN AUTHENTICATION
   ========================================================= */

/* SHA-256 Password Hash */

async function hashPassword(password) {

  const data = new TextEncoder().encode(password);

  const hashBuffer =
    await crypto.subtle.digest("SHA-256", data);

  const hashArray =
    Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}


/* Show Admin App */

function showAdminApp() {

  const loginScreen =
    document.getElementById("loginScreen");

  const adminApp =
    document.getElementById("adminApp");

  if (loginScreen) {
    loginScreen.classList.add("hidden");
  }

  if (adminApp) {
    adminApp.classList.remove("hidden");
  }
}


/* Show Login Screen */

function showLoginScreen() {

  const loginScreen =
    document.getElementById("loginScreen");

  const adminApp =
    document.getElementById("adminApp");

  if (loginScreen) {
    loginScreen.classList.remove("hidden");
  }

  if (adminApp) {
    adminApp.classList.add("hidden");
  }
}


/* First-time Setup / Existing Login */

function initializeAdminAuth() {

  const passwordHash =
    localStorage.getItem(ADMIN_PASSWORD_KEY);

  const session =
    localStorage.getItem(ADMIN_SESSION_KEY);

  const setupArea =
    document.getElementById("setupArea");

  const loginArea =
    document.getElementById("loginArea");

  const loginTitle =
    document.getElementById("loginTitle");

  const loginMessage =
    document.getElementById("loginMessage");


  /* Already logged in */

  if (passwordHash && session === "1") {

    showAdminApp();

    return;
  }


  /* No password yet */

  if (!passwordHash) {

    showLoginScreen();

    if (setupArea) {
      setupArea.classList.remove("hidden");
    }

    if (loginArea) {
      loginArea.classList.add("hidden");
    }

    if (loginTitle) {
      loginTitle.textContent =
        "🔐 Create Admin Password";
    }

    if (loginMessage) {
      loginMessage.textContent =
        "প্রথমবার Admin Panel ব্যবহার করতে নতুন Password তৈরি করুন।";
    }

    return;
  }


  /* Password exists */

  showLoginScreen();

  if (setupArea) {
    setupArea.classList.add("hidden");
  }

  if (loginArea) {
    loginArea.classList.remove("hidden");
  }

  if (loginTitle) {
    loginTitle.textContent =
      "🔐 Admin Login";
  }

  if (loginMessage) {
    loginMessage.textContent =
      "Admin Panel-এ প্রবেশ করতে Password দিন।";
  }
}


/* Create First Admin Password */

async function createAdminPassword() {

  const newPassword =
    value("newPassword");

  const confirmPassword =
    value("confirmPassword");


  if (!newPassword) {
    alert("⚠️ নতুন Password দিন।");
    return;
  }


  if (newPassword.length < 6) {
    alert("⚠️ Password কমপক্ষে 6 অক্ষরের হতে হবে।");
    return;
  }


  if (newPassword !== confirmPassword) {
    alert("⚠️ Password দুইটি একই নয়।");
    return;
  }


  try {

    const hash =
      await hashPassword(newPassword);

    localStorage.setItem(
      ADMIN_PASSWORD_KEY,
      hash
    );

    localStorage.setItem(
      ADMIN_SESSION_KEY,
      "1"
    );


    alert("✅ Admin Password তৈরি হয়েছে।");

    showAdminApp();

    loadSettings();
    renderProducts();
    renderOrders();
    updateDashboard();

  } catch (error) {

    console.error(error);

    alert(
      "❌ Password তৈরি করা যায়নি। আবার চেষ্টা করুন।"
    );
  }
}


/* Admin Login */

async function adminLogin() {

  const password =
    value("adminPassword");


  if (!password) {
    alert("⚠️ Admin Password দিন।");
    return;
  }


  const savedHash =
    localStorage.getItem(
      ADMIN_PASSWORD_KEY
    );


  if (!savedHash) {

    alert(
      "⚠️ এখনো Admin Password তৈরি করা হয়নি।"
    );

    initializeAdminAuth();

    return;
  }


  try {

    const enteredHash =
      await hashPassword(password);


    if (enteredHash !== savedHash) {

      alert("❌ ভুল Admin Password।");
      return;
    }


    localStorage.setItem(
      ADMIN_SESSION_KEY,
      "1"
    );


    const input =
      document.getElementById("adminPassword");

    if (input) {
      input.value = "";
    }


    showAdminApp();

    loadSettings();
    renderProducts();
    renderOrders();
    updateDashboard();

  } catch (error) {

    console.error(error);

    alert(
      "❌ Login করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
    );
  }
}


/* Admin Logout */

function adminLogout() {

  localStorage.removeItem(
    ADMIN_SESSION_KEY
  );

  showLoginScreen();

  initializeAdminAuth();
}


/* =========================================================
   PASSWORD RESET
   ========================================================= */

/*
   Reset শুধু Admin Password reset করবে।
   Product / Order / Settings data delete করবে না.
*/

function resetAdminPassword() {

  const ok = confirm(
    "Admin Password reset করতে চান?\n\n" +
    "শুধু Admin Login Password reset হবে।\n" +
    "Product, Order ও Settings data মুছবে না।"
  );


  if (!ok) return;


  localStorage.removeItem(
    ADMIN_PASSWORD_KEY
  );

  localStorage.removeItem(
    ADMIN_SESSION_KEY
  );


  alert(
    "✅ Password reset হয়েছে।\n\n" +
    "এখন নতুন Admin Password তৈরি করুন।"
  );


  showLoginScreen();

  initializeAdminAuth();
}


/* =========================================================
   CHANGE ADMIN PASSWORD
   ========================================================= */

async function changeAdminPassword() {

  const currentPassword =
    prompt("বর্তমান Admin Password দিন:");

  if (currentPassword === null) {
    return;
  }


  const savedHash =
    localStorage.getItem(
      ADMIN_PASSWORD_KEY
    );


  if (!savedHash) {

    alert(
      "⚠️ Admin Password পাওয়া যায়নি।"
    );

    return;
  }


  try {

    const currentHash =
      await hashPassword(currentPassword);


    if (currentHash !== savedHash) {

      alert(
        "❌ বর্তমান Password সঠিক নয়।"
      );

      return;
    }


    const newPassword =
      prompt(
        "নতুন Admin Password দিন:\n(কমপক্ষে 6 অক্ষর)"
      );


    if (newPassword === null) {
      return;
    }


    if (newPassword.length < 6) {

      alert(
        "⚠️ Password কমপক্ষে 6 অক্ষরের হতে হবে।"
      );

      return;
    }


    const confirmPassword =
      prompt("নতুন Password আবার লিখুন:");


    if (confirmPassword === null) {
      return;
    }


    if (newPassword !== confirmPassword) {

      alert(
        "❌ নতুন Password দুইটি একই নয়।"
      );

      return;
    }


    const newHash =
      await hashPassword(newPassword);


    localStorage.setItem(
      ADMIN_PASSWORD_KEY,
      newHash
    );


    alert(
      "✅ Admin Password সফলভাবে পরিবর্তন হয়েছে।"
    );

  } catch (error) {

    console.error(error);

    alert(
      "❌ Password পরিবর্তন করা যায়নি।"
    );
  }
}


/* =========================
   SETTINGS
   ========================= */

function loadSettings() {

  const data = getData();
  const s = data.settings || {};

  const brand =
    document.getElementById("setBrand");

  const hero =
    document.getElementById("setHero");

  const shipping =
    document.getElementById("setShipping");

  const warning =
    document.getElementById("setWarning");

  const cod =
    document.getElementById("codOn");

  const advance =
    document.getElementById("advanceOn");


  if (brand) {
    brand.value = s.brand || "";
  }

  if (hero) {
    hero.value = s.hero || "";
  }

  if (shipping) {
    shipping.value = s.shipping ?? 0;
  }

  if (warning) {
    warning.value = s.warning || "";
  }

  if (cod) {
    cod.checked = s.cod !== false;
  }

  if (advance) {
    advance.checked = s.advance !== false;
  }
}


function saveSettings() {

  const data = getData();

  data.settings = {
    ...(data.settings || {}),

    brand:
      value("setBrand") ||
      "Arif Fashion House",

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

  alert(
    "✅ Website Settings saved successfully!"
  );

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

  const name =
    value("pName");

  const category =
    value("pCat") || "men";

  const image =
    value("pImage");

  const price =
    Number(value("pPrice")) || 0;

  const oldPrice =
    Number(value("pOld")) || 0;

  const colors =
    csv(value("pColors"));

  const sizes =
    csv(value("pSizes"));

  const video =
    value("pVideo");

  const description =
    value("pDesc");


  if (!name) {

    alert(
      "⚠️ Product name দিন।"
    );

    return;
  }


  if (!price) {

    alert(
      "⚠️ Product price দিন।"
    );

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
    data.products.findIndex(
      p => String(p.id) === String(id)
    );


  if (existingIndex >= 0) {

    data.products[existingIndex] = {
      ...data.products[existingIndex],
      ...product
    };

    alert(
      "✅ Product updated successfully!"
    );

  } else {

    data.products.push(product);

    alert(
      "✅ Product added successfully!"
    );
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

    const el =
      document.getElementById(id);

    if (el) {
      el.value = "";
    }
  });


  const cat =
    document.getElementById("pCat");

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

    alert(
      "Product পাওয়া যায়নি।"
    );

    return;
  }


  const set = (elementId, val) => {

    const el =
      document.getElementById(elementId);

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

  set(
    "pImage",
    product.image
  );

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

  const products =
    data.products || [];


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
        product.image || "";


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
            ${escapeHtml(
              product.name ||
              "Unnamed Product"
            )}
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
              product.oldPrice ||
              product.old
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
                  ${escapeHtml(
                    colors.join(", ")
                  )}
                </p>
              `
              : ""
          }


          ${
            sizes.length
              ? `
                <p>
                  📏 Sizes:
                  ${escapeHtml(
                    sizes.join(", ")
                  )}
                </p>
              `
              : ""
          }


          ${
            product.youtube ||
            product.video
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
         
