
const products = [
  { id: 1, name: "Collar Aurora", category: "Collares", price: 69.90, symbol: "◉", tag: "MÁS VENDIDO" },
  { id: 2, name: "Aretes Brisa", category: "Aretes", price: 39.90, symbol: "◌", tag: "NUEVO" },
  { id: 3, name: "Pulsera Sol", category: "Pulseras", price: 45.00, symbol: "∞", tag: "FAVORITO" },
  { id: 4, name: "Collar Perla", category: "Collares", price: 79.90, symbol: "✧", tag: "EDICIÓN" },
  { id: 5, name: "Aretes Alba", category: "Aretes", price: 35.00, symbol: "✦", tag: "NUEVO" },
  { id: 6, name: "Pulsera Aura", category: "Pulseras", price: 49.90, symbol: "〰", tag: "FAVORITO" },
  { id: 7, name: "Collar Luna", category: "Collares", price: 59.90, symbol: "☾", tag: "CLÁSICO" },
  { id: 8, name: "Aretes Nube", category: "Aretes", price: 42.00, symbol: "♡", tag: "EDICIÓN" }
];

let cart = [];

const $ = id => document.getElementById(id);

const money = amount =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN"
  }).format(amount);

// Mostrar productos en el catálogo
function renderProducts(filter = "Todos") {
  const list = products.filter(product =>
    filter === "Todos" || product.category === filter
  );

  $("products").innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-visual">
        <span class="tag">${product.tag}</span>
        <span class="product-symbol">${product.symbol}</span>
      </div>

      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>

        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button
            class="add-button"
            data-add="${product.id}"
            aria-label="Añadir ${product.name} al carrito"
          >+</button>
        </div>
      </div>
    </article>
  `).join("");
}

// Actualizar el carrito y el total
function renderCart() {
  const count = cart.reduce((total, item) => total + item.qty, 0);

  $("cartCount").textContent = count;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  $("cartTotal").textContent = money(total);

  if (cart.length === 0) {
    $("cartItems").innerHTML = `
      <p class="empty-cart">
        Tu carrito está esperando algo bonito.
      </p>
    `;
    return;
  }

  $("cartItems").innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <small>
          ${money(item.price)} · Cantidad: ${item.qty}
        </small>
      </div>

      <div class="quantity">
        <button
          data-change="${item.id}"
          data-delta="-1"
          aria-label="Reducir cantidad"
        >−</button>

        <span>${item.qty}</span>

        <button
          data-change="${item.id}"
          data-delta="1"
          aria-label="Aumentar cantidad"
        >+</button>
      </div>
    </div>
  `).join("");
}

// Mostrar mensajes
function toast(message) {
  const element = $("toast");

  element.textContent = message;
  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 2400);
}

// Abrir o cerrar el carrito
function setCart(open) {
  $("cartDrawer").classList.toggle("open", open);
  $("overlay").classList.toggle("open", open);

  $("cartDrawer").setAttribute("aria-hidden", String(!open));

  document.body.style.overflow = open ? "hidden" : "";
}

// Agregar productos y filtrar el catálogo
document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");

  if (addButton) {
    const product = products.find(
      item => item.id === Number(addButton.dataset.add)
    );

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    renderCart();
    toast(`${product.name} añadido al carrito`);
  }

  const changeButton = event.target.closest("[data-change]");

  if (changeButton) {
    const item = cart.find(
      product => product.id === Number(changeButton.dataset.change)
    );

    item.qty += Number(changeButton.dataset.delta);

    if (item.qty <= 0) {
      cart = cart.filter(product => product.id !== item.id);
    }

    renderCart();
  }

  const filterButton = event.target.closest("[data-filter]");

  if (filterButton) {
    document.querySelectorAll(".filter").forEach(button => {
      button.classList.remove("active");
    });

    filterButton.classList.add("active");
    renderProducts(filterButton.dataset.filter);
  }
});

// Controles del carrito
$("openCart").addEventListener("click", () => setCart(true));

$("closeCart").addEventListener("click", () => setCart(false));

$("overlay").addEventListener("click", () => setCart(false));

// Proceso de pago simulado
$("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    toast("Añade un producto antes de continuar");
    return;
  }

  toast("¡Pedido de demostración listo! No se ha realizado ningún cobro.");
});

// Menú para celulares
$("menuToggle").addEventListener("click", () => {
  const open = $("nav").classList.toggle("open");

  $("menuToggle").setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    $("nav").classList.remove("open");
    $("menuToggle").setAttribute("aria-expanded", "false");
  });
});

// Formulario de registro
$("registerForm").addEventListener("submit", event => {
  event.preventDefault();

  $("registerMessage").textContent =
    "¡Registro de demostración completado! Los datos no se almacenaron.";

  event.target.reset();
});

// Formulario de contacto
$("contactForm").addEventListener("submit", event => {
  event.preventDefault();

  $("contactMessage").textContent =
    "¡Gracias! El formulario se validó correctamente (demo sin servidor).";

  event.target.reset();
});

// Cargar la página
renderProducts();
renderCart();
