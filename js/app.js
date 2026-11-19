import { products, formatPrice } from "./products.js";
import { initProductViewer } from "./viewer3d.js";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let activeFilter = "Tümü";
let cart = [];
let favorites = new Set();
let heroIndex = 0;
let heroTimer;
const grid = $("#productGrid");

function renderProducts(list=products){
  grid.innerHTML = list.map(p=>`
    <article class="product-card">
      <div class="product-image" data-view="${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.tag?`<span class="product-tag">${p.tag}</span>`:""}
        <button class="favorite ${favorites.has(p.id)?"active":""}" data-fav="${p.id}" aria-label="Favorilere ekle">${favorites.has(p.id)?"♥":"♡"}</button>
        <button class="quick-view" data-view="${p.id}">Hızlı incele ↗</button>
      </div>
      <div class="product-meta"><div><h3>${p.name}</h3><p>${p.material}</p></div><span class="product-price">${formatPrice(p.price)}</span></div>
      <button class="add-mini" data-add="${p.id}">＋ Sepete ekle</button>
    </article>`).join("");
}
function filtered(){
  let list=activeFilter==="Tümü"?[...products]:products.filter(p=>p.category===activeFilter);
  const sort=$("#sortSelect").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  renderProducts(list);
}
function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2100)}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({...p,qty:1});updateCart();toast(`${p.name} sepete eklendi`)}
function updateCart(){
  const count=cart.reduce((s,p)=>s+p.qty,0),total=cart.reduce((s,p)=>s+p.price*p.qty,0);
  $("#cartCount").textContent=count;$("#drawerCount").textContent=`(${count})`;$("#cartTotal").textContent=formatPrice(total);
  $("#cartItems").innerHTML=cart.length?cart.map(p=>`<div class="cart-row"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><p>${formatPrice(p.price)}</p><div class="quantity"><button data-qty="${p.id}" data-delta="-1">−</button><span>${p.qty}</span><button data-qty="${p.id}" data-delta="1">＋</button></div></div><button class="remove-item" data-remove="${p.id}">Sil</button></div>`).join(""):`<div class="empty-cart">Sepetiniz henüz boş.<br><a href="#products" id="continueShopping">Koleksiyonu keşfedin ↗</a></div>`;
}
function openCart(){ $("#overlay").classList.add("open");$("#cartDrawer").classList.add("open") }
function closePanels(){$("#overlay").classList.remove("open");$("#cartDrawer").classList.remove("open")}
function openProduct(id){
 const p=products.find(x=>x.id===id);if(!p)return;
 $("#productModalContent").innerHTML=`<img src="${p.image}" alt="${p.name}"><div class="modal-details"><p class="eyebrow">${p.category.toUpperCase()} · NOVA COLLECTION</p><h2>${p.name}</h2><p class="modal-price">${formatPrice(p.price)}</p><p>${p.description}</p><p style="font-size:10px;color:#85837c">${p.material}</p><button class="button button-dark" data-add="${p.id}">Sepete ekle <span>↗</span></button></div>`;
 $("#productModal").classList.add("open");
}
function closeModal(id){$("#"+id).classList.remove("open")}
function showHero(index){
 const videos=$$(".hero-video");heroIndex=(index+videos.length)%videos.length;
 videos.forEach((v,i)=>{v.classList.toggle("active",i===heroIndex);if(i===heroIndex){v.currentTime=0;v.play().catch(()=>{})}else v.pause()});
 const titles=[["Yaşam alanına","yeni bir bakış."],["Sadelikte saklı","bir güzellik."],["Her anın için","iyi tasarım."]];
 const desc=["Sade çizgiler, doğal dokular ve her anınıza eşlik edecek zamansız tasarımlar.","Dingin formlar ve özenle seçilmiş malzemelerle evinizde kendinize yer açın.","Günün ritmine uyum sağlayan, uzun yıllar sizinle kalacak parçalar."];
 $("#heroTitle").innerHTML=`${titles[heroIndex][0]}<br><em>${titles[heroIndex][1]}</em>`;$("#heroDesc").textContent=desc[heroIndex];$("#heroIndex").textContent=`0${heroIndex+1}`;$("#heroProgress").style.width=`${(heroIndex+1)*33.33}%`;
}
function startHero(){clearInterval(heroTimer);heroTimer=setInterval(()=>showHero(heroIndex+1),7000)}
renderProducts();updateCart();showHero(0);startHero();
$("#filterTabs").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;$$(".filter-tab").forEach(x=>x.classList.toggle("active",x===b));filtered()});
$("#sortSelect").addEventListener("change",filtered);
grid.addEventListener("click",e=>{
 const fav=e.target.closest("[data-fav]"),add=e.target.closest("[data-add]"),view=e.target.closest("[data-view]");
 if(fav){const id=+fav.dataset.fav;favorites.has(id)?favorites.delete(id):favorites.add(id);filtered();return}
 if(add){addToCart(+add.dataset.add);return}
 if(view)openProduct(+view.dataset.view);
});
$("#cartToggle").addEventListener("click",openCart);$("#cartClose").addEventListener("click",closePanels);$("#overlay").addEventListener("click",closePanels);
$("#cartItems").addEventListener("click",e=>{
 const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");
 if(q){const item=cart.find(x=>x.id===+q.dataset.qty);item.qty+=+q.dataset.delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);updateCart()}
 if(r){cart=cart.filter(x=>x.id!==+r.dataset.remove);updateCart()}
});
$("#cartItems").addEventListener("click",e=>{if(e.target.id==="continueShopping")closePanels()});
$("#heroPrev").addEventListener("click",()=>{showHero(heroIndex-1);startHero()});$("#heroNext").addEventListener("click",()=>{showHero(heroIndex+1);startHero()});
$("#searchToggle").addEventListener("click",()=>{$("#searchPanel").classList.toggle("open");$("#searchInput").focus()});$("#searchClose").addEventListener("click",()=>$("#searchPanel").classList.remove("open"));
$("#searchInput").addEventListener("input",e=>{const q=e.target.value.toLocaleLowerCase("tr");activeFilter="Tümü";$$(".filter-tab").forEach(x=>x.classList.toggle("active",x.dataset.filter==="Tümü"));renderProducts(products.filter(p=>(p.name+" "+p.category+" "+p.material).toLocaleLowerCase("tr").includes(q)));$("#products").scrollIntoView({behavior:"smooth"})});
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));$("#mainNav").addEventListener("click",e=>{if(e.target.tagName==="A")$("#mainNav").classList.remove("open")});
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
$$(".category-card").forEach(c=>c.addEventListener("click",()=>{activeFilter=c.dataset.category;$$(".filter-tab").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));filtered()}));
$("#productModal").addEventListener("click",e=>{if(e.target===e.currentTarget)closeModal("productModal");const a=e.target.closest("[data-add]");if(a)addToCart(+a.dataset.add)});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();$("#newsletterMsg").textContent="Teşekkürler! Bülten listemize eklendiniz.";e.target.reset()});
$("#checkoutBtn").addEventListener("click",()=>toast(cart.length?"Demo mağaza: ödeme entegrasyonu henüz bağlı değil.":"Sepetiniz boş."));
$("#open3D").addEventListener("click",()=>{$("#modelModal").classList.add("open");initProductViewer();});
window.addEventListener("keydown",e=>{if(e.key==="Escape"){closePanels();closeModal("productModal");closeModal("modelModal")}});
