const products = [
  {id:1,name:"Luminária LED de Mesa",category:"Home Office",price:89.90,old:129.90,discount:31,rating:4.9,image:"https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80"},
  {id:2,name:"Organizador Multiuso Minimalista",category:"Casa & Decor",price:39.90,old:59.90,discount:33,rating:4.8,image:"https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80"},
  {id:3,name:"Moletom Street Flash",category:"Vestuário",price:119.90,old:169.90,discount:29,rating:4.9,image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80"},
  {id:4,name:"Caderno Criativo Premium",category:"Papelaria",price:34.90,old:49.90,discount:30,rating:4.7,image:"https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80"},
  {id:5,name:"Fone Bluetooth Pocket",category:"Home Office",price:149.90,old:199.90,discount:25,rating:4.8,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"},
  {id:6,name:"Kit Potes Herméticos",category:"Casa & Decor",price:69.90,old:99.90,discount:30,rating:4.9,image:"https://images.unsplash.com/photo-1584990347449-ae6a4a0a8e44?auto=format&fit=crop&w=900&q=80"},
  {id:7,name:"Camiseta Básica Oversized",category:"Vestuário",price:59.90,old:79.90,discount:25,rating:4.8,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"},
  {id:8,name:"Kit Canetas Coloridas",category:"Papelaria",price:24.90,old:34.90,discount:29,rating:4.8,image:"https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80"},
  {id:9,name:"Boneco Astronauta Kids",category:"Kids",price:79.90,old:109.90,discount:27,rating:4.7,image:"https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=900&q=80"},
  {id:10,name:"Mouse Sem Fio Slim",category:"Home Office",price:64.90,old:89.90,discount:28,rating:4.9,image:"https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80"},
  {id:11,name:"Vaso Decorativo Geométrico",category:"Casa & Decor",price:44.90,old:69.90,discount:36,rating:4.6,image:"https://images.unsplash.com/photo-1523419409543-6f6a0b55bb3a?auto=format&fit=crop&w=900&q=80"},
  {id:12,name:"Jaqueta Leve Urban",category:"Vestuário",price:159.90,old:219.90,discount:27,rating:4.9,image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"}
];

const categories = [
  {name:"Casa & Decor",icon:"🏠",desc:"Organização e estilo",cls:"cat-yellow"},
  {name:"Home Office",icon:"💻",desc:"Seu espaço melhor",cls:"cat-blue"},
  {name:"Kids",icon:"🧸",desc:"Diversão garantida",cls:"cat-pink"},
  {name:"Vestuário",icon:"👕",desc:"Estilo em alta",cls:"cat-purple"},
  {name:"Papelaria",icon:"✏️",desc:"Para criar mais",cls:"cat-green"}
];

let cart = JSON.parse(localStorage.getItem("flashmarket_cart") || "[]");
let favorites = JSON.parse(localStorage.getItem("flashmarket_favorites") || "[]");
let coupon = localStorage.getItem("flashmarket_coupon") || "";
let loggedUser = localStorage.getItem("flashmarket_user") || "";

const money = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function saveState(){
  localStorage.setItem("flashmarket_cart",JSON.stringify(cart));
  localStorage.setItem("flashmarket_favorites",JSON.stringify(favorites));
  if(coupon) localStorage.setItem("flashmarket_coupon",coupon);
  else localStorage.removeItem("flashmarket_coupon");
}

function toast(msg){
  const el=$("#toast");
  el.textContent=msg;
  el.classList.add("show");
  clearTimeout(window._toast);
  window._toast=setTimeout(()=>el.classList.remove("show"),2500);
}

function card(p){
  const fav=favorites.includes(p.id);
  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="sale-badge">${p.discount}% OFF</span>
        <button class="wish ${fav?"active":""}" data-fav="${p.id}" aria-label="Favoritar">${fav?"♥":"♡"}</button>
      </div>
      <div class="product-info">
        <span class="cat">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="rating">★★★★★ <span>${p.rating}</span></div>
        <div class="price-row"><span class="old-price">${money(p.old)}</span><strong class="price">${money(p.price)}</strong></div>
        <span class="installments">ou em até 3x sem juros</span>
        <button class="add-cart" data-add="${p.id}">ADICIONAR AO CARRINHO</button>
        <button class="detail-btn" data-detail="${p.id}">VER DETALHES</button>
      </div>
    </article>`;
}

function renderCategories(){
  $("#categoryGrid").innerHTML=categories.map(c=>`
    <button class="category-card ${c.cls}" data-category="${c.name}">
      <span>${c.icon}</span><strong>${c.name}</strong><small>${c.desc}</small>
    </button>`).join("");
}

function renderFeatured(){
  $("#featuredGrid").innerHTML=products.slice(0,8).map(card).join("");
}

function populateCategoryFilter(){
  const values=[...new Set(products.map(p=>p.category))].sort();
  $("#categoryFilter").innerHTML='<option value="all">Todas as categorias</option>'+values.map(v=>`<option value="${v}">${v}</option>`).join("");
}

function renderProducts(){
  const category=$("#categoryFilter").value;
  const sort=$("#sortFilter").value;
  const search=$("#searchInput").value.trim().toLowerCase();
  let list=products.filter(p=>
    (category==="all" || p.category===category) &&
    (!search || `${p.name} ${p.category}`.toLowerCase().includes(search))
  );
  if(sort==="priceAsc") list.sort((a,b)=>a.price-b.price);
  if(sort==="priceDesc") list.sort((a,b)=>b.price-a.price);
  if(sort==="rating") list.sort((a,b)=>b.rating-a.rating);
  
  $("#productGrid").innerHTML=list.map(card).join("");
  $("#emptyState").style.display=list.length?"none":"block";
}

function cartItemsCount(){
  return cart.reduce((s,i)=>s+i.qty,0);
}
function subtotal(){
  return cart.reduce((s,i)=>{
    const p=products.find(x=>x.id===i.id);
    return s+(p?p.price*i.qty:0);
  },0);
}
function discount(){
  return coupon==="FLASH10" ? subtotal()*0.10 : 0;
}
function shipping(){
  const value=subtotal()-discount();
  return value===0?0:(value>=199?0:19.90);
}
function total(){
  return subtotal()-discount()+shipping();
}

function updateHeader(){
  $("#cartCount").textContent=cartItemsCount();
  $("#favCount").textContent=favorites.length;
  $("#accountText").textContent=loggedUser?loggedUser.split(" ")[0].toUpperCase():"ENTRAR";
  const balanceEl=$("#balanceBtn b");
  if(balanceEl) balanceEl.textContent=money(total());
}

function renderCart(){
  const el=$("#cartItems");
  if(!cart.length){
    el.innerHTML='<div style="padding:45px;text-align:center;color:#777">Seu carrinho está vazio.<br><br>Adicione alguns produtos para começar.</div>';
  } else {
    el.innerHTML=cart.map(item=>{
      const p=products.find(x=>x.id===item.id);
      return `
        <div class="cart-row">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <h4>${p.name}</h4><p>${money(p.price)}</p>
            <div class="qty">
              <button data-dec="${p.id}">−</button><b>${item.qty}</b><button data-inc="${p.id}">+</button>
            </div>
            <button class="remove-cart" data-remove="${p.id}">Remover</button>
          </div>
          <strong>${money(p.price*item.qty)}</strong>
        </div>`;
    }).join("");
  }
  $("#cartSubtotal").textContent=money(subtotal());
  $("#cartDiscount").textContent=money(discount());
  $("#cartShipping").textContent=shipping()===0?"Grátis":money(shipping());
  $("#cartTotal").textContent=money(total());
  $("#couponInput").value=coupon;
  $("#couponMsg").textContent=coupon==="FLASH10"?"Cupom FLASH10 aplicado: 10% OFF.":"";
  updateHeader();
}

function renderFavorites(){
  const list=products.filter(p=>favorites.includes(p.id));
  $("#favGrid").innerHTML=list.length?list.map(card).join(""):'<div style="grid-column:1/-1;text-align:center;padding:40px;color:#777">Você ainda não salvou produtos.</div>';
}

function addToCart(id){
  const found=cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  saveState(); renderCart(); toast("Produto adicionado ao carrinho!");
}
function changeQty(id,delta){
  const item=cart.find(i=>i.id===id);
  if(!item) return;
  item.qty+=delta;
  if(item.qty<=0) cart=cart.filter(i=>i.id!==id);
  saveState(); renderCart();
}
function removeFromCart(id){
  cart=cart.filter(i=>i.id!==id);
  saveState(); renderCart();
  toast("Produto removido.");
}
function toggleFavorite(id){
  if(favorites.includes(id)) favorites=favorites.filter(x=>x!==id);
  else favorites.push(id);
  saveState(); updateHeader(); renderFeatured(); renderProducts(); renderFavorites();
  toast(favorites.includes(id)?"Adicionado aos favoritos!":"Removido dos favoritos.");
}

function openModal(id){
  $("#"+id).classList.add("open");
  document.body.classList.add("modal-open");
}
function closeModal(id){
  $("#"+id).classList.remove("open");
  if(!$$(".modal.open").length) document.body.classList.remove("modal-open");
}

function showAccount(){
  $("#authContent").innerHTML=`
    <div class="auth-tabs">
      <button class="active" data-auth-tab="login">ENTRAR</button>
      <button data-auth-tab="register">CRIAR CONTA</button>
    </div>
    <section class="auth-panel active" id="loginPanel">
      <h3>Bem-vindo de volta 👋</h3>
      <p>Acompanhe seus pedidos e salve seus favoritos.</p>
      <form id="loginForm">
        <input type="email" placeholder="Seu e-mail" required>
        <input type="password" placeholder="Sua senha" required>
        <button class="btn yellow full">ENTRAR</button>
      </form>
    </section>
    <section class="auth-panel" id="registerPanel">
      <h3>Crie sua conta</h3>
      <p>Cadastre-se em poucos segundos.</p>
      <form id="registerForm">
        <input type="text" placeholder="Seu nome" required>
        <input type="email" placeholder="Seu e-mail" required>
        <input type="password" placeholder="Sua senha" minlength="6" required>
        <button class="btn yellow full">CRIAR CONTA</button>
      </form>
    </section>
    <p class="auth-note" id="authNote"></p>`;
  openModal("accountModal");
}

function showDetail(id){
  const p=products.find(x=>x.id===id);
  $("#detail").innerHTML=`
    <img src="${p.image}" alt="${p.name}" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px">
    <span class="section-label" style="display:block;margin-top:16px">${p.category}</span>
    <h2>${p.name}</h2>
    <div class="rating">★★★★★ ${p.rating}</div>
    <p style="margin:13px 0;color:#666;font-size:13px">Produto em destaque FlashMarket com desconto especial por tempo limitado.</p>
    <div class="price-row"><span class="old-price">${money(p.old)}</span><strong class="price">${money(p.price)}</strong></div>
    <button class="btn yellow full" style="margin-top:16px" data-add-detail="${p.id}">ADICIONAR AO CARRINHO</button>`;
  openModal("detailModal");
}

function applyFiltersFromCategory(cat){
  $("#categoryFilter").value=cat;
  renderProducts();
  document.querySelector("#produtos").scrollIntoView({behavior:"smooth"});
}

document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");
  if(add){ addToCart(Number(add.dataset.add)); return; }

  const addDetail=e.target.closest("[data-add-detail]");
  if(addDetail){ addToCart(Number(addDetail.dataset.addDetail)); closeModal("detailModal"); return; }

  const fav=e.target.closest("[data-fav]");
  if(fav){ toggleFavorite(Number(fav.dataset.fav)); return; }

  const inc=e.target.closest("[data-inc]");
  if(inc){ changeQty(Number(inc.dataset.inc),1); return; }

  const dec=e.target.closest("[data-dec]");
  if(dec){ changeQty(Number(dec.dataset.dec),-1); return; }

  const rem=e.target.closest("[data-remove]");
  if(rem){ removeFromCart(Number(rem.dataset.remove)); return; }

  const det=e.target.closest("[data-detail]");
  if(det){ showDetail(Number(det.dataset.detail)); return; }

  const cat=e.target.closest(".category-card");
  if(cat){ applyFiltersFromCategory(cat.dataset.category); return; }

  const close=e.target.closest("[data-close]");
  if(close){ closeModal(close.dataset.close); return; }

  if(e.target.classList.contains("modal")){ closeModal(e.target.id); }
});

$("#searchForm").addEventListener("submit",e=>{
  e.preventDefault();
  renderProducts();
  $("#produtos").scrollIntoView({behavior:"smooth"});
});

$("#searchInput").addEventListener("input",renderProducts);
$("#categoryFilter").addEventListener("change",renderProducts);
$("#sortFilter").addEventListener("change",renderProducts);

$("#cartBtn").addEventListener("click",()=>{renderCart();openModal("cartModal")});
$("#favBtn").addEventListener("click",()=>{renderFavorites();openModal("favModal")});
$("#accountBtn").addEventListener("click",showAccount);

$("#applyCoupon").addEventListener("click",()=>{
  const val=$("#couponInput").value.trim().toUpperCase();
  if(val==="FLASH10"){
    coupon="FLASH10"; saveState(); renderCart(); toast("Cupom FLASH10 aplicado!");
  }else{
    coupon=""; saveState(); renderCart(); $("#couponMsg").textContent="Cupom inválido. Use FLASH10.";
  }
});

$("#checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){toast("Adicione produtos ao carrinho antes de finalizar.");return;}
  openModal("checkoutModal");
});

$("#checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  $("#checkoutNote").textContent=`Pedido demo realizado com sucesso! Total: ${money(total())}.`;
  cart=[]; coupon=""; saveState(); renderCart(); updateHeader();
  $("#authNote").textContent="Pedido finalizado em modo demonstração.";
});

$("#newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();
  const email=$("#newsletterEmail").value.trim();
  localStorage.setItem("flashmarket_newsletter",email);
  $("#newsletterForm").reset();
  toast("Cadastro realizado! Cupom de 10% reservado para você.");
});

document.addEventListener("click",e=>{
  const tab=e.target.closest("[data-auth-tab]");
  if(!tab)return;
  $$(".auth-tabs button").forEach(b=>b.classList.remove("active"));
  tab.classList.add("active");
  $$(".auth-panel").forEach(p=>p.classList.remove("active"));
  $("#"+(tab.dataset.authTab==="login"?"loginPanel":"registerPanel")).classList.add("active");
});

document.addEventListener("submit",e=>{
  if(e.target.id==="loginForm"){
    e.preventDefault();
    const email=e.target.querySelector("input[type=email]").value;
    loggedUser=email.split("@")[0];
    localStorage.setItem("flashmarket_user",loggedUser);
    $("#authNote").textContent="Login demonstrativo realizado com sucesso!";
    updateHeader();
  }
  if(e.target.id==="registerForm"){
    e.preventDefault();
    const name=e.target.querySelector("input[type=text]").value;
    loggedUser=name;
    localStorage.setItem("flashmarket_user",loggedUser);
    $("#authNote").textContent="Conta criada no modo demonstração!";
    updateHeader();
  }
});

$("#mobileToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));

document.querySelectorAll(".main-nav a").forEach(a=>{
  a.addEventListener("click",()=>$("#mainNav").classList.remove("open"));
});

// Countdown visual: reinicia a cada 12h45m30s.
let countdownSeconds=(12*3600)+(45*60)+30;
setInterval(()=>{
  countdownSeconds--;
  if(countdownSeconds<0) countdownSeconds=(12*3600)+(45*60)+30;
},1000);

renderCategories();
populateCategoryFilter();
renderFeatured();
renderProducts();
renderCart();
renderFavorites();
updateHeader();
