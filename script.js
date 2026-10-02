const CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbzfAGTQsCSPxzcNWEppOdDFPnxCzFquHdwGyeGgumftrA4ZXS1HclIrO1U5cgVKCNfx9A/exec", // Google Apps Script Web App URL
  whatsappNumber: "8801881245159", // আপনার WhatsApp নম্বর
  bkashNumber: "01XXXXXXXXX",      // আপনার personal bKash নম্বর
  nagadNumber: "01XXXXXXXXX",      // আপনার personal Nagad নম্বর
  dhakaDelivery: 60,
  outsideDhakaDelivery: 120
};

const demoData = {
  products: [
    {id:1, name:"Women's Three Piece", category:"Women", price:1290, old:1590, discount:"19%", image:"", sizes:"M/L/XL", colors:"Pink, Black, Red", stock:10, description:"নতুন কালেকশনের সুন্দর থ্রি পিস।", youtube:""},
    {id:2, name:"Men's Panjabi", category:"Men", price:1190, old:1490, discount:"20%", image:"", sizes:"M/L/XL/XXL", colors:"White, Black, Navy", stock:10, description:"আরামদায়ক ও স্টাইলিশ পাঞ্জাবি।", youtube:""},
    {id:3, name:"Kids Dress", category:"Kids", price:790, old:990, discount:"20%", image:"", sizes:"2Y/4Y/6Y/8Y", colors:"Pink, Blue, Yellow", stock:10, description:"শিশুদের জন্য সুন্দর ড্রেস।", youtube:""},
    {id:4, name:"Women's Kurti", category:"Women", price:890, old:1090, discount:"18%", image:"", sizes:"M/L/XL", colors:"Maroon, Black, Green", stock:10, description:"দৈনন্দিন ও ক্যাজুয়াল ব্যবহারের জন্য।", youtube:""},
    {id:5, name:"Men's Shirt", category:"Men", price:950, old:1150, discount:"17%", image:"", sizes:"M/L/XL/XXL", colors:"White, Blue, Black", stock:10, description:"স্মার্ট ক্যাজুয়াল শার্ট।", youtube:""},
    {id:6, name:"Kids Panjabi Set", category:"Kids", price:690, old:850, discount:"19%", image:"", sizes:"2Y/4Y/6Y/8Y", colors:"Black, White, Green", stock:10, description:"উৎসবের জন্য শিশুদের পাঞ্জাবি সেট।", youtube:""}
  ],
  settings: {whatsappNumber:"8801XXXXXXXXX", bkashNumber:"01XXXXXXXXX", nagadNumber:"01XXXXXXXXX", dhakaDelivery:60, outsideDhakaDelivery:120},
  reviews: []
};
let shopData = JSON.parse(localStorage.getItem("arifShopData")||"null") || demoData;
let products = shopData.products || demoData.products;
let CONFIG_DATA = shopData.settings || demoData.settings;
let cart = JSON.parse(localStorage.getItem("arifCart")||"[]");
function applyShopData(d){ if(!d||!Array.isArray(d.products)||d.products.length===0)return; shopData=d; products=d.products; CONFIG_DATA=d.settings||demoData.settings; localStorage.setItem("arifShopData",JSON.stringify(d)); renderProducts(); updateCart(); renderReviews(); }
function loadOnlineData(){
  const url=localStorage.getItem('arifApiUrl')||CONFIG.apiUrl;
  if(!url)return;
  const cb='arifCb_'+Date.now(); window[cb]=(d)=>{try{applyShopData(d)}finally{delete window[cb];script.remove()}};
  const script=document.createElement('script'); script.src=url+(url.includes('?')?'&':'?')+'callback='+cb; script.onerror=()=>{delete window[cb];script.remove()}; document.head.appendChild(script);
}
function postOnline(payload){
  const url=localStorage.getItem('arifApiUrl')||CONFIG.apiUrl;
  if(!url)return;
  try{fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)})}catch(e){}
}


function money(n){return new Intl.NumberFormat("en-BD").format(n)}
function renderProducts(list=products){
  const box=document.getElementById("products");
  box.innerHTML=list.map(p=>`
    <article class="product">
      <div class="product-img">${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">` : "Product Photo Here"}</div>
      <div class="product-body">
        <span class="discount">${p.discount} OFF</span>
        <h3>${p.name}</h3>
        <div class="meta">${p.category} • Size: ${p.sizes}</div>
        <div class="meta">🎨 Color: ${p.colors}</div><p class="meta">${p.description||""}</p>${p.youtube?`<a href="${p.youtube}" target="_blank" rel="noopener">▶️ Product Video</a>`:""}
        <div class="price"><strong>৳${money(p.price)}</strong> <span class="old">৳${money(p.old)}</span></div>
        <div class="buy-row">
          <label class="mini">Size
            <select id="size-${p.id}">${p.sizes.split("/").map(x=>`<option>${x}</option>`).join("")}</select>
          </label>
          <label class="mini">Color
            <select id="color-${p.id}">${p.colors.split(", ").map(c=>`<option>${c}</option>`).join("")}</select>
          </label>
          <label class="mini">Qty
            <input id="qty-${p.id}" type="number" min="1" max="${p.stock||1}" value="1">
          </label>
        </div>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </article>`).join("");
}
function filterProducts(cat,btn){
  document.querySelectorAll(".categories button").forEach(b=>b.classList.remove("active"));
  if(btn) btn.classList.add("active");
  renderProducts(cat==="All"?products:products.filter(p=>cat==="Offers"?p.discount:p.category===cat));
}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  if(!p)return;
  const requested=Math.max(1, parseInt(document.getElementById(`qty-${id}`).value||"1"));
  const available=Number(p.stock)||0;
  const qty=Math.min(requested, available);
  if(available<1){alert("এই Product-এর Stock শেষ।");return;}
  const color=document.getElementById(`color-${id}`).value;
  const size=document.getElementById(`size-${id}`).value;
  const key=`${id}-${color}-${size}`;
  const item=cart.find(x=>x.key===key);
  if(item){
    item.qty=Math.min(item.qty+qty, available);
    if(item.qty===available && requested>qty) alert(`Stock অনুযায়ী সর্বোচ্চ ${available}টি যোগ করা হয়েছে।`);
  }else cart.push({...p,key,qty,color,size});
  localStorage.setItem("arifCart",JSON.stringify(cart));
  updateCart();
  alert(`${p.name} | Color: ${color} | Quantity: ${qty} — Cart-এ যোগ হয়েছে`);
}
function changeCartQty(encodedKey, delta){
  const key=decodeURIComponent(encodedKey);
  const item=cart.find(x=>x.key===key);
  if(!item)return;
  const product=products.find(p=>p.id===item.id);
  const stock=Math.max(1, Number(product?.stock||item.stock||1));
  const next=item.qty+delta;
  if(next<1){ removeFromCart(encodedKey); return; }
  if(next>stock){ alert(`Stock অনুযায়ী সর্বোচ্চ ${stock}টি রাখা যাবে।`); return; }
  item.qty=next;
  updateCart();
}
function removeFromCart(encodedKey){
  const key=decodeURIComponent(encodedKey);
  cart=cart.filter(x=>x.key!==key);
  updateCart();
}
function updateCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>{
    const encodedKey=encodeURIComponent(x.key);
    return `
    <div class="cart-line">
      <div class="cart-product">
        ${x.image ? `<img src="${x.image}" alt="${x.name}">` : `<div class="cart-placeholder">Photo</div>`}
        <span>${x.name}<br><small>Color: ${x.color} • Size: ${x.size}</small>
          <span class="cart-controls">
            <button type="button" onclick="changeCartQty('${encodedKey}',-1)">−</button>
            <b>${x.qty}</b>
            <button type="button" onclick="changeCartQty('${encodedKey}',1)">+</button>
            <button type="button" class="cart-remove" onclick="removeFromCart('${encodedKey}')">❌</button>
          </span>
        </span>
      </div>
      <b>৳${money(x.price*x.qty)}</b>
    </div>`;
  }).join(""):"Cart খালি";
  document.getElementById("cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
  localStorage.setItem("arifCart",JSON.stringify(cart));
}
function openCart(){updateCart();document.getElementById("cartModal").classList.remove("hidden")}
function closeCart(){document.getElementById("cartModal").classList.add("hidden")}
function goToOrder(){
  if(!cart.length){alert("আগে Product নির্বাচন করুন");return}
  closeCart();
  renderOrderSummary();
  togglePaymentFields();
  document.getElementById("orderModal").classList.remove("hidden");
}
function renderOrderSummary(){
  const box=document.getElementById("orderSummary");
  const areaEl=document.getElementById("deliveryArea");
  const area=areaEl ? areaEl.value : "Dhaka";
  const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const delivery=area==="Dhaka"?Number(CONFIG_DATA.dhakaDelivery):Number(CONFIG_DATA.outsideDhakaDelivery);
  const total=subtotal+delivery;
  box.innerHTML=`<h3>আপনার Order</h3>`+cart.map(x=>`
    <div class="order-item">
      ${x.image ? `<img src="${x.image}" alt="${x.name}">` : `<div class="order-placeholder">Product Photo</div>`}
      <div><b>${x.name}</b><br>
      <span>Color: ${x.color}</span><br>
      <span>Size: ${x.size}</span><br>
      <span>Quantity: ${x.qty}</span></div>
      <strong>৳${money(x.price*x.qty)}</strong>
    </div>`).join("")+
    `<div class="order-subtotal">
      Product Total: ৳${money(subtotal)}<br>
      Delivery Charge: ৳${money(delivery)}<br>
      <strong>Grand Total: ৳${money(total)}</strong>
    </div>`;
}
function updateOrderTotals(){
  renderOrderSummary();
}
function togglePaymentFields(){
  const method=document.getElementById("paymentMethod").value;
  const fields=document.getElementById("paymentFields");
  const instructions=document.getElementById("paymentInstructions");
  if(method==="COD"){
    fields.classList.add("hidden");
  }else{
    fields.classList.remove("hidden");
    instructions.textContent = method==="bKash"
      ? "bKash নম্বর: 01XXXXXXXXX — আগে payment করে Transaction ID দিন।"
      : "Nagad নম্বর: 01XXXXXXXXX — আগে payment করে Transaction ID দিন।";
  }
}
function closeOrder(){document.getElementById("orderModal").classList.add("hidden")}

document.getElementById("deliveryArea").addEventListener("change",updateOrderTotals);
document.getElementById("orderForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("customerName").value.trim();
  const phone=document.getElementById("customerPhone").value.trim();
  const area=document.getElementById("deliveryArea").value;
  const address=document.getElementById("address").value.trim();
  const payment=document.getElementById("paymentMethod").value;
  const paymentPhone=document.getElementById("paymentPhone").value.trim();
  const transactionId=document.getElementById("transactionId").value.trim();
  const delivery=area==="Dhaka"?Number(CONFIG_DATA.dhakaDelivery):Number(CONFIG_DATA.outsideDhakaDelivery);
  const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const total=subtotal+delivery;
  const items=cart.map(x=>`${x.name} | Color: ${x.color} | Size: ${x.size} | Qty: ${x.qty} = ৳${x.price*x.qty}`).join("\n");
  const msg=`Arif Fashion House - New Order\n\nCustomer: ${name}\nMobile: ${phone}\nArea: ${area}\nAddress: ${address}\n\nProducts:\n${items}\n\nSubtotal: ৳${subtotal}\nDelivery: ৳${delivery}\nTotal: ৳${total}\nPayment: ${payment}\nPayment Mobile: ${paymentPhone || "N/A"}\nTransaction ID: ${transactionId || "N/A"}`;
  postOnline({action:"order",order:{timestamp:new Date().toISOString(),orderId:"AFH-"+Date.now(),customerName:name,customerPhone:phone,area:area,address:address,items:items,subtotal:subtotal,delivery:delivery,total:total,payment:payment,paymentPhone:paymentPhone,transactionId:transactionId,status:"New"}});
  const waNumber = (CONFIG_DATA.whatsappNumber && !CONFIG_DATA.whatsappNumber.includes("X")) ? CONFIG_DATA.whatsappNumber : CONFIG.whatsappNumber;
  if(!waNumber || waNumber.includes("X")){
    alert("আগে script.js ফাইলে আপনার WhatsApp নম্বর বসান।");
    return;
  }
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`,"_blank");
  cart=[];
  localStorage.setItem("arifCart","[]");
  updateCart();
  closeOrder();
  alert("Order পাঠানো হয়েছে। ধন্যবাদ!");
});

renderProducts();
updateCart();
renderReviews();
loadOnlineData();

function renderReviews(){const box=document.getElementById('reviewList'); if(!box)return; const rs=(shopData.reviews||[]).filter(r=>r.approved===true||String(r.approved).toLowerCase()==='true'); box.innerHTML=rs.length?rs.map(r=>`<article class="review-card"><div>${'★'.repeat(Number(r.rating)||5)}${'☆'.repeat(5-(Number(r.rating)||5))}</div><p>${r.review||''}</p><small>${r.verified===true||String(r.verified).toLowerCase()==='true'?'Verified Purchase':'Customer Review'}${r.customerName?' — '+r.customerName:''}</small></article>`).join(''):'<article class="review-card"><p>এখনও কোনো approved review নেই।</p></article>'; }


document.getElementById("reviewForm")?.addEventListener("submit",e=>{
 e.preventDefault();
 const review={timestamp:new Date().toISOString(),productId:Number(document.getElementById("reviewProductId").value),customerName:document.getElementById("reviewCustomerName").value.trim(),rating:Number(document.getElementById("reviewRating").value),review:document.getElementById("reviewText").value.trim(),photo:"",verified:false,approved:false};
 postOnline({action:"review",review});
 alert("Review জমা হয়েছে। Admin approval-এর পর এটি প্রকাশ হবে।");
 e.target.reset();
});
