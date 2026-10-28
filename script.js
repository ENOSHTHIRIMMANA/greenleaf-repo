// ---------- Product data (edit names, prices, photos here) ----------
const PRODUCTS = [
  { id: "p1",  cat: "indoor",     name: "Giant Elephant Ear",        price: 4500, img: "elephant-giant.jpg",      desc: "Big, glossy leaves that make a bold statement." },
  { id: "p2",  cat: "indoor",     name: "Alocasia in Terracotta",    price: 3800, img: "elephant-terracotta.jpg", desc: "Dark, veined leaves in a classic clay pot." },
  { id: "p3",  cat: "herbs",      name: "Herb Starter Set",          price: 2800, img: "herbs-set.jpg",           desc: "Six potted kitchen herbs, ready to harvest.", pos: "50% 70%" },
  { id: "p4",  cat: "herbs",      name: "Herb Jar Trio",             price: 1800, img: "herbs-jars.jpg",          desc: "Coriander, rosemary and lemon thyme in jars." },
  { id: "p5",  cat: "herbs",      name: "Sweet Basil Pot",           price: 650,  img: "basil.jpg",               desc: "Fragrant leaves for pasta, salads and curries." },
  { id: "p6",  cat: "succulents", name: "Succulent Mix (6 pots)",    price: 3200, img: "succulents-mix.jpg",      desc: "A colourful set of small succulents." },
  { id: "p7",  cat: "succulents", name: "Moonstone Echeveria",       price: 850,  img: "echeveria.jpg",           desc: "A pale rosette in a green ceramic pot." },
  { id: "p8",  cat: "succulents", name: "Echeveria & Jade Tray",     price: 2400, img: "succulents-tray.jpg",     desc: "Six easy-care plants, delivered in a tray." },
  { id: "p9",  cat: "garden",     name: "Garden Flower Pack",        price: 1900, img: "gardener-planting.jpg",   desc: "Seasonal flowering plants to brighten your garden." },
  { id: "p10", cat: "garden",     name: "Young Garden Plants (3)",   price: 1500, img: "garden-potting.jpg",      desc: "Healthy young plants ready to repot." },
  { id: "p11", cat: "garden",     name: "Kitchen Garden Bundle",     price: 3500, img: "garden-sunset.jpg",       desc: "Mixed seedlings in clay pots for a small veggie patch." },
  { id: "p12", cat: "garden",     name: "Flower Seed Collection",    price: 600,  img: "seeds.jpg",               desc: "Zinnia, sunflower, coneflower and daisy seeds.", pos: "50% 30%" }
];

let wish = {};
try { wish = JSON.parse(localStorage.getItem("greenleaf-wish")) || {}; } catch (e) { wish = {}; }

const CAT_LABEL = { indoor: "Indoor", herbs: "Herbs", succulents: "Succulents", garden: "Garden" };
const money = (n) => "Rs. " + n.toLocaleString("en-US");
const $ = (id) => document.getElementById(id);

// ---------- Mobile menu ----------
const nav = $("nav"), menuBtn = $("menuBtn");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); })
);

// ---------- Header shadow + back-to-top ----------
const toTop = $("toTop");
window.addEventListener("scroll", () => {
  $("header").classList.toggle("scrolled", window.scrollY > 20);
  toTop.classList.toggle("show", window.scrollY > 600);
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
}

// ---------- Shop: render, filter, search, sort ----------
let state = { cat: "all", q: "", sort: "default" };

function renderProducts() {
  let list = PRODUCTS.filter((p) =>
    (state.cat === "all" || p.cat === state.cat) &&
    p.name.toLowerCase().includes(state.q.toLowerCase())
  );
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

  $("products").innerHTML = list.map((p) => `
    <article class="product">
      <div class="product-img" data-view="${p.id}">
        <button class="heart ${wish[p.id] ? "on" : ""}" data-heart="${p.id}" aria-label="Add to wishlist">${wish[p.id] ? "♥" : "♡"}</button>
        <span class="quick">Quick view</span>
        <img src="images/${p.img}" alt="${p.name}" loading="lazy" style="object-position:${p.pos || "50% 50%"}">
      </div>
      <div class="product-body">
        <span class="cat-tag">${CAT_LABEL[p.cat]}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-foot">
          <strong>${money(p.price)}</strong>
          <button class="btn btn-small add" data-id="${p.id}">Add to cart</button>
        </div>
      </div>
    </article>`).join("");
  $("noResults").hidden = list.length > 0;
  revealAll();
}

function setCategory(cat) {
  state.cat = cat;
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === cat));
  renderProducts();
}
document.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => setCategory(c.dataset.filter)));
document.querySelectorAll(".cat").forEach((c) => c.addEventListener("click", () => setCategory(c.dataset.filter)));
$("search").addEventListener("input", (e) => { state.q = e.target.value; renderProducts(); });
$("sort").addEventListener("change", (e) => { state.sort = e.target.value; renderProducts(); });

// ---------- Cart (saved in the browser, demo only) ----------
let cart = {};
try { cart = JSON.parse(localStorage.getItem("greenleaf-cart")) || {}; } catch (e) { cart = {}; }

const drawer = $("drawer"), overlay = $("overlay");
function openCart() { drawer.classList.add("open"); overlay.classList.add("show"); }
function closeCart() { drawer.classList.remove("open"); overlay.classList.remove("show"); }
$("cartBtn").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); closeModal(); } });

function saveCart() {
  try { localStorage.setItem("greenleaf-cart", JSON.stringify(cart)); } catch (e) {}
}

function renderCart() {
  const ids = Object.keys(cart);
  let count = 0, total = 0;
  const box = $("cartItems");
  box.innerHTML = ids.length ? "" : '<li class="empty">Your cart is empty. Add a plant to get started.</li>';

  ids.forEach((id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) { delete cart[id]; return; }
    const qty = cart[id];
    count += qty;
    total += qty * p.price;
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="images/${p.img}" alt="">
      <div class="info">${p.name}<small>${money(p.price)}</small></div>
      <div class="qty">
        <button data-act="minus" data-id="${id}" aria-label="Decrease">−</button>
        <span>${qty}</span>
        <button data-act="plus" data-id="${id}" aria-label="Increase">+</button>
      </div>`;
    box.appendChild(li);
  });
  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(total);
  updateShipping(total);
  saveCart();
}

$("cartItems").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  cart[btn.dataset.id] += btn.dataset.act === "plus" ? 1 : -1;
  if (cart[btn.dataset.id] <= 0) delete cart[btn.dataset.id];
  renderCart();
});

$("products").addEventListener("click", (e) => {
  const btn = e.target.closest(".add");
  if (!btn) return;
  const id = btn.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  $("cartMsg").textContent = "";
  toast("Added to cart 🌿");
  btn.textContent = "Added ✓";
  btn.classList.add("added");
  setTimeout(() => { btn.textContent = "Add to cart"; btn.classList.remove("added"); }, 1200);
});

$("clearCart").addEventListener("click", () => { cart = {}; renderCart(); });
$("checkoutBtn").addEventListener("click", () => {
  $("cartMsg").textContent = Object.keys(cart).length
    ? "Thank you! Please contact us to confirm your order."
    : "Add a plant to your cart first.";
});

// ---------- Contact form (demo, no backend) ----------
$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("formMsg").textContent = "Thank you! Your message has been sent. We will reply soon.";
  e.target.reset();
});

$("year").textContent = new Date().getFullYear();



// =====================================================
// Extra features
// =====================================================

// ---------- Free delivery progress ----------
const FREE_SHIP = 5000;
function updateShipping(total) {
  const left = FREE_SHIP - total;
  $("shipFill").style.width = Math.min(100, (total / FREE_SHIP) * 100) + "%";
  $("shipText").textContent = total === 0
    ? "Free delivery on orders over " + money(FREE_SHIP)
    : left > 0
      ? "Add " + money(left) + " more for free delivery"
      : "🎉 You get free delivery!";
}

// ---------- Wishlist hearts ----------
$("products").addEventListener("click", (e) => {
  const h = e.target.closest(".heart");
  if (!h) return;
  e.stopPropagation();
  const id = h.dataset.heart;
  if (wish[id]) delete wish[id]; else wish[id] = true;
  h.classList.toggle("on", !!wish[id]);
  h.textContent = wish[id] ? "♥" : "♡";
  toast(wish[id] ? "Saved to wishlist ♥" : "Removed from wishlist");
  try { localStorage.setItem("greenleaf-wish", JSON.stringify(wish)); } catch (err) {}
});

// ---------- Quick view modal ----------
const CARE = {
  indoor:     ["☀️ Bright, indirect light", "💧 Water when top soil is dry", "📏 Grows 60–120 cm"],
  herbs:      ["☀️ 5–6 hours of sunlight", "💧 Keep soil lightly moist", "✂️ Harvest often to grow bushier"],
  succulents: ["☀️ Bright light, some direct sun", "💧 Water every 10–14 days", "🪴 Use well-draining soil"],
  garden:     ["☀️ Full sun to partial shade", "💧 Water in the morning", "🌼 Feed once a month with compost"]
};
let modalId = null, modalQty = 1;
const modal = $("modal");

function openModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  modalId = id; modalQty = 1;
  $("mImg").src = "images/" + p.img;
  $("mImg").alt = p.name;
  $("mImg").style.objectPosition = p.pos || "50% 50%";
  $("mCat").textContent = CAT_LABEL[p.cat];
  $("mName").textContent = p.name;
  $("mDesc").textContent = p.desc;
  $("mCare").innerHTML = CARE[p.cat].map((t) => "<li>" + t + "</li>").join("");
  $("mPrice").textContent = money(p.price);
  $("mQty").textContent = 1;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
}
function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lock");
}
$("products").addEventListener("click", (e) => {
  const box = e.target.closest("[data-view]");
  if (box && !e.target.closest(".heart")) openModal(box.dataset.view);
});
$("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
$("mMinus").addEventListener("click", () => { modalQty = Math.max(1, modalQty - 1); $("mQty").textContent = modalQty; });
$("mPlus").addEventListener("click", () => { modalQty++; $("mQty").textContent = modalQty; });
$("mAdd").addEventListener("click", () => {
  cart[modalId] = (cart[modalId] || 0) + modalQty;
  renderCart();
  closeModal();
  toast("Added " + modalQty + " to cart 🌿");
});

// ---------- Scroll progress bar ----------
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  $("progress").style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
});

// ---------- Active nav link ----------
const links = [...nav.querySelectorAll("a")];
const navObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
["home", "about", "categories", "shop", "why", "contact"].forEach((id) => navObs.observe($(id)));

// ---------- Scroll reveal ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revObs.unobserve(en.target); } });
}, { threshold: 0.12 });

function revealAll() {
  if (reduceMotion) return;
  document.querySelectorAll(".section h2, .sub, .cat, .benefit, .product, .gallery img, .about-img, .about > div:last-child, .contact > *, .slider").forEach((el, i) => {
    if (el.classList.contains("in") || el.classList.contains("reveal")) return;
    el.classList.add("reveal");
    el.style.transitionDelay = (i % 4) * 70 + "ms";
    revObs.observe(el);
  });
}

// ---------- Animated counters ----------
function runCounters() {
  const els = document.querySelectorAll("[data-count]");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, end = Number(el.dataset.count), suf = el.dataset.suffix || "";
      const t0 = performance.now(), dur = 1200;
      (function tick(now) {
        const k = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf;
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
      obs.unobserve(el);
    });
  });
  els.forEach((el) => { if (!reduceMotion) { el.textContent = "0" + (el.dataset.suffix || ""); obs.observe(el); } });
}

// ---------- Testimonial slider ----------
(function () {
  const slides = document.querySelectorAll(".slide");
  const dots = $("dots");
  let i = 0, timer;
  slides.forEach((_, n) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Show review " + (n + 1));
    b.addEventListener("click", () => { show(n); start(); });
    dots.appendChild(b);
  });
  function show(n) {
    i = n;
    slides.forEach((s, k) => s.classList.toggle("active", k === n));
    [...dots.children].forEach((d, k) => d.classList.toggle("on", k === n));
  }
  function start() { clearInterval(timer); timer = setInterval(() => show((i + 1) % slides.length), 5000); }
  $("slider").addEventListener("mouseenter", () => clearInterval(timer));
  $("slider").addEventListener("mouseleave", start);
  show(0); start();
})();

// ---------- Newsletter ----------
$("newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("newsEmail").value.trim();
  $("newsMsg").textContent = "Thanks! Plant care tips will be sent to " + email + ".";
  e.target.reset();
});

// ---------- Start ----------
$("statPlants").dataset.count = PRODUCTS.length;
renderProducts();
renderCart();
runCounters();
