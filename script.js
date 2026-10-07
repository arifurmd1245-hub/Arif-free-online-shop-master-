const CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbzfAGTQsCSPxzcNWEppOdDFPnxCzFquHdwGyeGgumftrA4ZXS1HclIrO1U5cgVKCNfx9A/exec",
  whatsappNumber: "8801881245159",
  bkashNumber: "01XXXXXXXXX",
  nagadNumber: "01XXXXXXXXX",
  dhakaDelivery: 60,
  outsideDhakaDelivery: 120
};

const demoData = {
  products: [
    {
      id: 1,
      name: "Women's Three Piece",
      category: "Women",
      price: 1290,
      old: 1590,
      discount: "19%",
      image: "",
      sizes: "M/L/XL",
      colors: "Pink, Black, Red",
      stock: 10,
      description: "নতুন কালেকশনের সুন্দর থ্রি পিস।",
      youtube: ""
    },
    {
      id: 2,
      name: "Men's Panjabi",
      category: "Men",
      price: 1190,
      old: 1490,
      discount: "20%",
      image: "",
      sizes: "M/L/XL/XXL",
      colors: "White, Black, Navy",
      stock: 10,
      description: "আরামদায়ক ও স্টাইলিশ পাঞ্জাবি।",
      youtube: ""
    },
    {
      id: 3,
      name: "Kids Dress",
      category: "Kids",
      price: 790,
      old: 990,
      discount: "20%",
      image: "",
      sizes: "2Y/4Y/6Y/8Y",
      colors: "Pink, Blue, Yellow",
      stock: 10,
      description: "শিশুদের জন্য সুন্দর ড্রেস।",
      youtube: ""
    },
    {
      id: 4,
      name: "Women's Kurti",
      category: "Women",
      price: 890,
      old: 1090,
      discount: "18%",
      image: "",
      sizes: "M/L/XL",
      colors: "Maroon, Black, Green",
      stock: 10,
      description: "দৈনন্দিন ও ক্যাজুয়াল ব্যবহারের জন্য।",
      youtube: ""
    },
    {
      id: 5,
      name: "Men's Shirt",
      category: "Men",
      price: 950,
      old: 1150,
      discount: "17%",
      image: "",
      sizes: "M/L/XL/XXL",
      colors: "White, Blue, Black",
      stock: 10,
      description: "স্মার্ট ক্যাজুয়াল শার্ট।",
      youtube: ""
    },
    {
      id: 6,
      name: "Kids Panjabi Set",
      category: "Kids",
      price: 690,
      old: 850,
      discount: "19%",
      image: "",
      sizes: "2Y/4Y/6Y/8Y",
      colors: "Black, White, Green",
      stock: 10,
      description: "উৎসবের জন্য শিশুদের পাঞ্জাবি সেট।",
      youtube: ""
    }
  ],

  settings: {
    whatsappNumber: "8801XXXXXXXXX",
    bkashNumber: "01XXXXXXXXX",
    nagadNumber: "01XXXXXXXXX",
    dhakaDelivery: 60,
    outsideDhakaDelivery: 120
  },

  reviews: []
};

let shopData =
  JSON.parse(localStorage.getItem("arifShopData") || "null") || demoData;

let products = shopData.products || demoData.products;

let CONFIG_DATA =
  shopData.settings || demoData.settings;

let cart =
  JSON.parse(localStorage.getItem("arifCart") || "[]");


function money(n) {
  return new Intl.NumberFormat("en-BD").format(Number(n) || 0);
}


function normalizeList(value, separator) {
  if (Array.isArray(value)) {
    return value
      .map(x => String(x).trim())
      .filter(Boolean);
  }

  if (value === null || value === undefined) {
    return [];
  }

  const text = String(value).trim();

  if (!text) {
    return [];
  }

  return text
    .split(separator)
    .map(x => x.trim())
    .filter(Boolean);
}


function getSizes(product) {
  return normalizeList(product?.sizes, "/");
}


function getColors(product) {
  return normalizeList(product?.colors, ",");
}


function hasSizes(product) {
  return getSizes(product).length > 0;
}


function hasColors(product) {
  return getColors(product).length > 0;
}


function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function applyShopData(d) {
  if (!d || !Array.isArray(d.products) || d.products.length === 0) {
    return;
  }

  shopData = d;
  products = d.products;
  CONFIG_DATA = d.settings || demoData.settings;

  localStorage.setItem(
    "arifShopData",
    JSON.stringify(d)
  );

  renderProducts();
  updateCart();
  renderReviews();
}


function loadOnlineData() {
  const url =
    localStorage.getItem("arifApiUrl") ||
    CONFIG.apiUrl;

  if (!url) {
    return;
  }

  const cb = "arifCb_" + Date.now();

  window[cb] = d => {
    try {
      applyShopData(d);
    } finally {
      delete window[cb];

      if (script) {
        script.remove();
      }
    }
  };

  const script = document.createElement("script");

  script.src =
    url +
    (url.includes("?") ? "&" : "?") +
    "callback=" +
    cb;

  script.onerror = () => {
    delete window[cb];

    if (script) {
      script.remove();
    }
  };

  document.head.appendChild(script);
}


function postOnline(payload) {
  const url =
    localStorage.getItem("arifApiUrl") ||
    CONFIG.apiUrl;

  if (!url) {
    return;
  }

  try {
    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {}
}


function renderProducts(list = products) {
  const box = document.getElementById("products");

  if (!box) {
    return;
  }

  box.innerHTML = list.map(p => {
    const sizes = getSizes(p);
    const colors = getColors(p);

    const sizeMeta = sizes.length
      ? `<div class="meta">Size: ${escapeHtml(sizes.join(" / "))}</div>`
      : "";

    const colorMeta = colors.length
      ? `<div class="meta">🎨 Color: ${escapeHtml(colors.join(", "))}</div>`
      : "";

    const sizeOptions = sizes.length
      ? `
        <div class="option-block">
          <div class="option-title">Size</div>
          <div class="option-buttons" id="size-options-${p.id}">
            ${sizes.map((x, i) => `
              <button
                type="button"
                class="option-pill ${i === 0 ? "active" : ""}"
                onclick='selectProductOption(${p.id},"size",${JSON.stringify(x)})'
              >${escapeHtml(x)}</button>
            `).join("")}
          </div>
        </div>
      `
      : "";

    const colorOptions = colors.length
      ? `
        <div class="option-block">
          <div class="option-title">Color</div>
          <div class="option-buttons" id="color-options-${p.id}">
            ${colors.map((c, i) => `
              <button
                type="button"
                class="option-pill ${i === 0 ? "active" : ""}"
                onclick='selectProductOption(${p.id},"color",${JSON.stringify(c)})'
              >${escapeHtml(c)}</button>
            `).join("")}
          </div>
        </div>
      `
      : "";

    const discount = p.discount
      ? `<span class="discount">${escapeHtml(p.discount)} OFF</span>`
      : "";

    const oldPrice =
      Number(p.old) > Number(p.price)
        ? `<span class="old">৳${money(p.old)}</span>`
        : "";

    const imageHtml = p.image
      ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" style="width:100%;height:100%;object-fit:cover">`
      : "Product Photo Here";

    const videoHtml = p.youtube
      ? `<a href="${escapeHtml(p.youtube)}" target="_blank" rel="noopener">▶️ Product Video</a>`
      : "";

    return `
      <article class="product">

        <div class="product-img">
          ${imageHtml}
        </div>

        <div class="product-body">

          ${discount}

          <h3>${escapeHtml(p.name)}</h3>

          <div class="meta">
            ${escapeHtml(p.category || "")}
          </div>

          ${sizeMeta}
          ${colorMeta}

          <p class="meta">
            ${escapeHtml(p.description || "")}
          </p>

          ${videoHtml}

          <div class="price">
            <strong>৳${money(p.price)}</strong>
            ${oldPrice}
          </div>

          <div class="product-options">

            ${sizeOptions}

            ${colorOptions}

            <div class="option-block qty-block">
              <div class="option-title">Quantity</div>

              <div class="qty-stepper">
                <button
                  type="button"
                  onclick="changeProductQty(${p.id},-1)"
                >−</button>

                <span id="qty-${p.id}">1</span>

                <button
                  type="button"
                  onclick="changeProductQty(${p.id},1)"
                >+</button>
              </div>
            </div>

          </div>

          <button onclick="addToCart(${p.id})">
            Add to Cart
          </button>

        </div>

      </article>
    `;
  }).join("");
}


function filterProducts(cat, btn) {
  document
    .querySelectorAll(".categories button")
    .forEach(b => b.classList.remove("active"));

  if (btn) {
    btn.classList.add("active");
  }

  const filtered =
    cat === "All"
      ? products
      : products.filter(p =>
          cat === "Offers"
            ? p.discount
            : p.category === cat
        );

  renderProducts(filtered);
}


function selectProductOption(id, type, value) {
  const wrap =
    document.getElementById(`${type}-options-${id}`);

  if (!wrap) {
    return;
  }

  wrap
    .querySelectorAll(".option-pill")
    .forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.textContent.trim() === String(value).trim()
      );
    });
}


function getProductOption(id, type) {
  const wrap =
    document.getElementById(`${type}-options-${id}`);

  if (!wrap) {
    return "";
  }

  const active =
    wrap.querySelector(".option-pill.active");

  return active
    ? active.textContent.trim()
    : "";
}


function changeProductQty(id, delta) {
  const p = products.find(x => x.id === id);

  const el =
    document.getElementById(`qty-${id}`);

  if (!p || !el) {
    return;
  }

  const max =
    Math.max(1, Number(p.stock) || 1);

  const current =
    parseInt(el.textContent, 10) || 1;

  const next =
    Math.min(
      max,
      Math.max(1, current + delta)
    );

  el.textContent = next;
    }
function addToCart(id) {
  const p = products.find(x => x.id === id);

  if (!p) {
    return;
  }

  const qtyElement =
    document.getElementById(`qty-${id}`);

  const requested =
    Math.max(
      1,
      parseInt(qtyElement?.textContent || "1", 10)
    );

  const available =
    Number(p.stock) || 0;

  if (available < 1) {
    alert("এই Product-এর Stock শেষ।");
    return;
  }

  const qty =
    Math.min(requested, available);

  const color =
    hasColors(p)
      ? getProductOption(id, "color")
      : "";

  const size =
    hasSizes(p)
      ? getProductOption(id, "size")
      : "";

  const key =
    `${id}-${color}-${size}`;

  const item =
    cart.find(x => x.key === key);

  if (item) {
    const newQty =
      Math.min(
        item.qty + qty,
        available
      );

    item.qty = newQty;

    if (
      newQty === available &&
      requested > qty
    ) {
      alert(
        `Stock অনুযায়ী সর্বোচ্চ ${available}টি যোগ করা হয়েছে।`
      );
    }
  } else {
    cart.push({
      ...p,
      key,
      qty,
      color,
      size
    });
  }

  localStorage.setItem(
    "arifCart",
    JSON.stringify(cart)
  );

  updateCart();

  let optionText = "";

  if (color) {
    optionText += ` | Color: ${color}`;
  }

  if (size) {
    optionText += ` | Size: ${size}`;
  }

  alert(
    `${p.name}${optionText} | Quantity: ${qty} — Cart-এ যোগ হয়েছে`
  );
}


function changeCartQty(encodedKey, delta) {
  const key =
    decodeURIComponent(encodedKey);

  const item =
    cart.find(x => x.key === key);

  if (!item) {
    return;
  }

  const product =
    products.find(p => p.id === item.id);

  const stock =
    Math.max(
      1,
      Number(product?.stock || item.stock || 1)
    );

  const next =
    item.qty + delta;

  if (next < 1) {
    removeFromCart(encodedKey);
    return;
  }

  if (next > stock) {
    alert(
      `Stock অনুযায়ী সর্বোচ্চ ${stock}টি রাখা যাবে।`
    );
    return;
  }

  item.qty = next;

  updateCart();
}


function removeFromCart(encodedKey) {
  const key =
    decodeURIComponent(encodedKey);

  cart =
    cart.filter(x => x.key !== key);

  updateCart();
}


function updateCart() {
  const cartCount =
    document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent =
      cart.reduce(
        (sum, item) => sum + item.qty,
        0
      );
  }

  const cartItems =
    document.getElementById("cartItems");

  if (!cartItems) {
    return;
  }

  if (!cart.length) {
    cartItems.innerHTML = "Cart খালি";

    const totalElement =
      document.getElementById("cartTotal");

    if (totalElement) {
      totalElement.textContent = "0";
    }

    localStorage.setItem(
      "arifCart",
      JSON.stringify(cart)
    );

    return;
  }

  cartItems.innerHTML =
    cart.map(x => {

      const encodedKey =
        encodeURIComponent(x.key);

      const optionLines = [];

      if (x.color) {
        optionLines.push(
          `Color: ${escapeHtml(x.color)}`
        );
      }

      if (x.size) {
        optionLines.push(
          `Size: ${escapeHtml(x.size)}`
        );
      }

      const optionText =
        optionLines.length
          ? `<small>${optionLines.join(" • ")}</small>`
          : "";

      const image =
        x.image
          ? `<img src="${escapeHtml(x.image)}" alt="${escapeHtml(x.name)}">`
          : `<div class="cart-placeholder">Photo</div>`;

      return `
        <div class="cart-line">

          <div class="cart-product">

            ${image}

            <span>
              ${escapeHtml(x.name)}
              <br>

              ${optionText}

              <span class="cart-controls">

                <button
                  type="button"
                  onclick="changeCartQty('${encodedKey}',-1)"
                >−</button>

                <b>${x.qty}</b>

                <button
                  type="button"
                  onclick="changeCartQty('${encodedKey}',1)"
                >+</button>

                <button
                  type="button"
                  class="cart-remove"
                  onclick="removeFromCart('${encodedKey}')"
                >❌</button>

              </span>
            </span>

          </div>

          <b>
            ৳${money(x.price * x.qty)}
          </b>

        </div>
      `;
    }).join("");

  const total =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );

  const totalElement =
    document.getElementById("cartTotal");

  if (totalElement) {
    totalElement.textContent =
      money(total);
  }

  localStorage.setItem(
    "arifCart",
    JSON.stringify(cart)
  );
}


function openCart() {
  updateCart();

  const modal =
    document.getElementById("cartModal");

  if (modal) {
    modal.classList.remove("hidden");
  }
}


function closeCart() {
  const modal =
    document.getElementById("cartModal");

  if (modal) {
    modal.classList.add("hidden");
  }
}


function goToOrder() {
  if (!cart.length) {
    alert("আগে Product নির্বাচন করুন");
    return;
  }

  closeCart();

  renderOrderSummary();
  togglePaymentFields();

  const modal =
    document.getElementById("orderModal");

  if (modal) {
    modal.classList.remove("hidden");
  }
}


function renderOrderSummary() {
  const box =
    document.getElementById("orderSummary");

  if (!box) {
    return;
  }

  const areaEl =
    document.getElementById("deliveryArea");

  const area =
    areaEl
      ? areaEl.value
      : "Dhaka";

  const subtotal =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );

  const delivery =
    area === "Dhaka"
      ? Number(CONFIG_DATA.dhakaDelivery)
      : Number(CONFIG_DATA.outsideDhakaDelivery);

  const chargeDisplay =
    document.getElementById(
      "deliveryChargeDisplay"
    );

  if (chargeDisplay) {
    chargeDisplay.textContent =
      `Delivery Charge: ৳${money(delivery)}`;
  }

  const total =
    subtotal + delivery;

  const itemsHtml =
    cart.map(x => {

      const optionLines = [];

      if (x.color) {
        optionLines.push(
          `<span>Color: ${escapeHtml(x.color)}</span>`
        );
      }

      if (x.size) {
        optionLines.push(
          `<span>Size: ${escapeHtml(x.size)}</span>`
        );
      }

      const image =
        x.image
          ? `<img src="${escapeHtml(x.image)}" alt="${escapeHtml(x.name)}">`
          : `<div class="order-placeholder">Product Photo</div>`;

      return `
        <div class="order-item">

          ${image}

          <div>
            <b>${escapeHtml(x.name)}</b>

            ${optionLines.length
              ? `<br>${optionLines.join("<br>")}`
              : ""}

            <br>
            <span>Quantity: ${x.qty}</span>
          </div>

          <strong>
            ৳${money(x.price * x.qty)}
          </strong>

        </div>
      `;
    }).join("");

  box.innerHTML = `
    <h3>আপনার Order</h3>

    ${itemsHtml}

    <div class="order-subtotal">

      Product Total:
      ৳${money(subtotal)}

      <br>

      Delivery Charge:
      ৳${money(delivery)}

      <br>

      <strong>
        Grand Total:
        ৳${money(total)}
      </strong>

    </div>
  `;
}


function updateOrderTotals() {
  renderOrderSummary();
}


function togglePaymentFields() {
  const methodElement =
    document.getElementById("paymentMethod");

  const fields =
    document.getElementById("paymentFields");

  const instructions =
    document.getElementById("paymentInstructions");

  if (!methodElement || !fields || !instructions) {
    return;
  }

  const method =
    methodElement.value;

  if (method === "COD") {
    fields.classList.add("hidden");
    return;
  }

  fields.classList.remove("hidden");

  const bkash =
    (
      CONFIG_DATA.bkashNumber &&
      !String(CONFIG_DATA.bkashNumber).includes("X")
    )
      ? CONFIG_DATA.bkashNumber
      : CONFIG.bkashNumber;

  const nagad =
    (
      CONFIG_DATA.nagadNumber &&
      !String(CONFIG_DATA.nagadNumber).includes("X")
    )
      ? CONFIG_DATA.nagadNumber
      : CONFIG.nagadNumber;

  if (method === "bKash") {
    instructions.textContent =
      `bKash নম্বর: ${bkash} — আগে payment করে Transaction ID দিন.`;
  } else {
    instructions.textContent =
      `Nagad নম্বর: ${nagad} — আগে payment করে Transaction ID দিন.`;
  }
}


function closeOrder() {
  const modal =
    document.getElementById("orderModal");

  if (modal) {
    modal.classList.add("hidden");
  }
}
document
  .getElementById("deliveryArea")
  ?.addEventListener("change", updateOrderTotals);


document
  .getElementById("orderForm")
  ?.addEventListener("submit", e => {

    e.preventDefault();

    const name =
      document
        .getElementById("customerName")
        .value
        .trim();

    const phone =
      document
        .getElementById("customerPhone")
        .value
        .trim();

    const area =
      document
        .getElementById("deliveryArea")
        .value;

    const address =
      document
        .getElementById("address")
        .value
        .trim();

    const payment =
      document
        .getElementById("paymentMethod")
        .value;

    const paymentPhone =
      document
        .getElementById("paymentPhone")
        .value
        .trim();

    const transactionId =
      document
        .getElementById("transactionId")
        .value
        .trim();


    const delivery =
      area === "Dhaka"
        ? Number(CONFIG_DATA.dhakaDelivery)
        : Number(CONFIG_DATA.outsideDhakaDelivery);


    const subtotal =
      cart.reduce(
        (sum, item) =>
          sum + item.price * item.qty,
        0
      );


    const total =
      subtotal + delivery;


    const items =
      cart
        .map(x => {

          const options = [];

          if (x.color) {
            options.push(
              `Color: ${x.color}`
            );
          }

          if (x.size) {
            options.push(
              `Size: ${x.size}`
            );
          }

          options.push(
            `Qty: ${x.qty}`
          );

          return `${x.name} | ${options.join(" | ")} = ৳${x.price * x.qty}`;

        })
        .join("\n");


    const msg =
`Arif Fashion House - New Order

Customer: ${name}
Mobile: ${phone}
Area: ${area}
Address: ${address}

Products:
${items}

Subtotal: ৳${subtotal}
Delivery: ৳${delivery}
Total: ৳${total}
Payment: ${payment}
Payment Mobile: ${paymentPhone || "N/A"}
Transaction ID: ${transactionId || "N/A"}`;


    postOnline({
      action: "order",

      order: {
        timestamp: new Date().toISOString(),

        orderId:
          "AFH-" + Date.now(),

        customerName:
          name,

        customerPhone:
          phone,

        area:
          area,

        address:
          address,

        items:
          items,

        subtotal:
          subtotal,

        delivery:
          delivery,

        total:
          total,

        payment:
          payment,

        paymentPhone:
          paymentPhone,

        transactionId:
          transactionId,

        status:
          "New"
      }
    });


    const waNumber =
      (
        CONFIG_DATA.whatsappNumber &&
        !String(CONFIG_DATA.whatsappNumber).includes("X")
      )
        ? CONFIG_DATA.whatsappNumber
        : CONFIG.whatsappNumber;


    if (
      !waNumber ||
      waNumber.includes("X")
    ) {

      alert(
        "আগে script.js ফাইলে আপনার WhatsApp নম্বর বসান."
      );

      return;
    }


    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );


    cart = [];

    localStorage.setItem(
      "arifCart",
      "[]"
    );

    updateCart();

    closeOrder();


    alert(
      "Order পাঠানো হয়েছে। ধন্যবাদ!"
    );

  });


function renderReviews() {

  const box =
    document.getElementById("reviewList");

  if (!box) {
    return;
  }


  const reviews =
    (shopData.reviews || [])
      .filter(
        r =>
          r.approved === true ||
          String(r.approved).toLowerCase() === "true"
      );


  if (!reviews.length) {

    box.innerHTML =
      `
        <article class="review-card">
          <p>এখনও কোনো approved review নেই।</p>
        </article>
      `;

    return;
  }


  box.innerHTML =
    reviews
      .map(r => {

        const rating =
          Math.min(
            5,
            Math.max(
              1,
              Number(r.rating) || 5
            )
          );


        const stars =
          "★".repeat(rating) +
          "☆".repeat(5 - rating);


        const verified =
          r.verified === true ||
          String(r.verified).toLowerCase() === "true";


        const customer =
          r.customerName
            ? ` — ${escapeHtml(r.customerName)}`
            : "";


        return `
          <article class="review-card">

            <div>
              ${stars}
            </div>

            <p>
              ${escapeHtml(r.review || "")}
            </p>

            <small>
              ${
                verified
                  ? "Verified Purchase"
                  : "Customer Review"
              }${customer}
            </small>

          </article>
        `;

      })
      .join("");
}


document
  .getElementById("reviewForm")
  ?.addEventListener("submit", e => {

    e.preventDefault();


    const review = {

      timestamp:
        new Date().toISOString(),

      productId:
        Number(
          document
            .getElementById("reviewProductId")
            .value
        ),

      customerName:
        document
          .getElementById("reviewCustomerName")
          .value
          .trim(),

      rating:
        Number(
          document
            .getElementById("reviewRating")
            .value
        ),

      review:
        document
          .getElementById("reviewText")
          .value
          .trim(),

      photo:
        "",

      verified:
        false,

      approved:
        false
    };


    postOnline({
      action: "review",
      review: review
    });


    alert(
      "Review জমা হয়েছে। Admin approval-এর পর এটি প্রকাশ হবে."
    );


    e.target.reset();

  });


renderProducts();

updateCart();

renderReviews();

loadOnlineData();
