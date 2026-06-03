const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const appointmentForm = document.querySelector(".contact-form");
const contactMessageForm = document.querySelector(".contact-message-form");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const priceGrid = document.querySelector("#price-grid");
const priceUpdated = document.querySelector("#price-updated");
const galleryFilter = document.querySelector("#gallery-filter");
const galleryGrid = document.querySelector("#gallery-grid");
const adminLoginForm = document.querySelector(".admin-login-form");
const adminLoginStatus = document.querySelector("#admin-login-status");
const adminTools = document.querySelector(".admin-tools");
const adminLogout = document.querySelector("#admin-logout");
const goldPriceForm = document.querySelector("#gold-price-form");
const categoryForm = document.querySelector("#category-form");
const uploadForm = document.querySelector("#upload-form");
const uploadCategory = document.querySelector("#upload-category");
const uploadStatus = document.querySelector("#upload-status");

const ADMIN_USERNAME_HASH = "4e129f4bb55341b97b18ec28aa6321140f5a88a563e4cf93de9d57c0aeb0fd4c";
const ADMIN_PASSWORD_HASH = "a208b545295701f87f4cf5100b7a99c05c426c91a359a4abe7ff2e09b4d9004f";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Bhawani@2026";

const defaultCategories = ["Bridal Sets", "Gold Bangles", "Diamond Rings", "Temple Jewellery"];
const defaultPrices = {
  gold22: 6850,
  gold24: 7470,
  silver: 92,
  updatedAt: new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }),
};

const defaultJewellery = [
  {
    name: "Kundan Bridal Necklace",
    category: "Bridal Sets",
    weight: "Approx 64 gram",
    image: "",
  },
  {
    name: "Classic Gold Bangles",
    category: "Gold Bangles",
    weight: "Approx 38 gram pair",
    image: "",
  },
  {
    name: "Solitaire Diamond Ring",
    category: "Diamond Rings",
    weight: "Approx 5 gram",
    image: "",
  },
  {
    name: "Antique Temple Haar",
    category: "Temple Jewellery",
    weight: "Approx 72 gram",
    image: "",
  },
];

const readStoredData = (key, fallback) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : fallback;
};

const writeStoredData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const hashText = async (value) => {
  const encodedValue = new TextEncoder().encode(String(value));
  const digest = await crypto.subtle.digest("SHA-256", encodedValue);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const formatCurrency = (value) => `₹${Math.round(Number(value)).toLocaleString("en-IN")}`;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

let categories = readStoredData("bhawaniCategories", defaultCategories);
let prices = readStoredData("bhawaniPrices", defaultPrices);
let jewelleryItems = readStoredData("bhawaniJewellery", defaultJewellery);
let activeCategory = "All";

const closeMobileMenu = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  navLinks?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks?.classList.toggle("is-open");
  document.body.classList.toggle("menu-open");
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    const targetPanel = event.target.hash.replace("#", "");
    if (["gold-prices", "gallery", "contact", "admin-panel"].includes(targetPanel)) {
      showTab(targetPanel);
    }
    closeMobileMenu();
  }
});

const showTab = (panelId) => {
  tabButtons.forEach((button) => {
    const isSelected = button.getAttribute("aria-controls") === panelId;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-selected", String(isSelected));
  });

  tabPanels.forEach((panel) => {
    const isSelected = panel.id === panelId;
    panel.classList.toggle("is-active", isSelected);
    panel.hidden = !isSelected;
  });
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panelId = button.getAttribute("aria-controls");
    if (panelId) {
      showTab(panelId);
      history.replaceState(null, "", `#${panelId}`);
    }
  });
});

const requestedPanel = window.location.hash.replace("#", "");
if (["gold-prices", "gallery", "contact", "admin-panel"].includes(requestedPanel)) {
  showTab(requestedPanel);
}

const renderPrices = () => {
  if (!priceGrid) return;

  const gold22 = Number(prices.gold22);
  const gold24 = Number(prices.gold24);
  const silver = Number(prices.silver);
  const tolaInGrams = 11.664;

  priceUpdated.textContent = `Updated: ${prices.updatedAt}`;
  priceGrid.innerHTML = [
    ["1 gram 22K", gold22, "22K gold per gram"],
    ["10 gram 22K", gold22 * 10, "Auto-calculated from 22K per gram"],
    ["10 gram 24K", gold24 * 10, "Auto-calculated from 24K per gram"],
    ["1 tola 22K", gold22 * tolaInGrams, "1 tola = 11.664 gram"],
    ["1 gram silver", silver, "Silver rate for Sindhari"],
  priceUpdated.textContent = `Updated: ${prices.updatedAt}`;
  priceGrid.innerHTML = [
    ["22K Gold", prices.gold22, "Most popular for jewellery"],
    ["24K Gold", prices.gold24, "Pure gold reference rate"],
    ["Silver", prices.silver, "Silver rate for Sindhari"],
  ]
    .map(
      ([label, value, helpText]) => `
        <article class="price-card">
          <span>${label}</span>
          <strong>${formatCurrency(value)}</strong>
          <small>${helpText}</small>
          <strong>₹${Number(value).toLocaleString("en-IN")}</strong>
          <small>${helpText} • per gram</small>
        </article>
      `,
    )
    .join("");
};

const renderCategoryOptions = () => {
  if (!uploadCategory) return;

  uploadCategory.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("");
};

const renderGalleryFilters = () => {
  if (!galleryFilter) return;

  const filterCategories = ["All", ...categories];
  galleryFilter.innerHTML = filterCategories
    .map(
      (category) => `
        <button class="filter-chip ${category === activeCategory ? "is-active" : ""}" type="button" data-category="${escapeHtml(category)}">
          ${escapeHtml(category)}
        </button>
      `,
    )
    .join("");
};

const renderGallery = () => {
  if (!galleryGrid) return;

  const visibleItems = jewelleryItems.filter(
    (item) => activeCategory === "All" || item.category === activeCategory,
  );

  if (!visibleItems.length) {
    galleryGrid.innerHTML = '<div class="empty-state">No jewellery images in this category yet. Admin can upload new items from the Admin Panel tab.</div>';
    return;
  }

  galleryGrid.innerHTML = visibleItems
    .map((item) => {
      const imageMarkup = item.image
        ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" />`
        : `<div class="jewellery-placeholder" aria-hidden="true">${escapeHtml(item.name.charAt(0))}</div>`;

      return `
        <article class="jewellery-card">
          ${imageMarkup}
          <div class="jewellery-card-content">
            <span>${escapeHtml(item.category)}</span>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.weight)}</p>
          </div>
        </article>
      `;
    })
    .join("");
};

const refreshStorefront = () => {
  renderPrices();
  renderCategoryOptions();
  renderGalleryFilters();
  renderGallery();
};

galleryFilter?.addEventListener("click", (event) => {
  const filterButton = event.target.closest(".filter-chip");
  if (!filterButton) return;

  activeCategory = filterButton.dataset.category;
  renderGalleryFilters();
  renderGallery();
});

appointmentForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(appointmentForm);
  const name = formData.get("name") || "guest";
  appointmentForm.reset();
  appointmentForm.querySelector("button").textContent = `Thank you, ${name}!`;
});

contactMessageForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitButton = contactMessageForm.querySelector("button");
  contactMessageForm.reset();
  submitButton.textContent = "Message received";
});

adminLoginForm?.addEventListener("submit", async (event) => {
adminLoginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const username = formData.get("username");
  const password = formData.get("password");
  const [usernameHash, passwordHash] = await Promise.all([hashText(username), hashText(password)]);
  const isAdmin = usernameHash === ADMIN_USERNAME_HASH && passwordHash === ADMIN_PASSWORD_HASH;
  const isAdmin = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;

  adminLoginStatus.textContent = isAdmin
    ? "Login successful. Admin features are now available."
    : "Invalid admin username or password.";
  adminTools.hidden = !isAdmin;

  if (isAdmin) {
    adminLoginForm.reset();
  }
});

adminLogout?.addEventListener("click", () => {
  adminTools.hidden = true;
  adminLoginStatus.textContent = "Admin logged out.";
});

goldPriceForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(goldPriceForm);
  prices = {
    gold22: Number(formData.get("gold22")),
    gold24: Number(formData.get("gold24")),
    silver: Number(formData.get("silver")),
    updatedAt: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };
  writeStoredData("bhawaniPrices", prices);
  renderPrices();
});

categoryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(categoryForm);
  const newCategory = String(formData.get("categoryName") || "").trim();

  if (newCategory && !categories.includes(newCategory)) {
    categories = [...categories, newCategory].sort((first, second) => first.localeCompare(second));
    writeStoredData("bhawaniCategories", categories);
    renderCategoryOptions();
    renderGalleryFilters();
  }

  categoryForm.reset();
});

uploadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(uploadForm);
  const imageFile = formData.get("itemImage");

  if (!(imageFile instanceof File) || !imageFile.size) {
    uploadStatus.textContent = "Please choose a jewellery image.";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const newItem = {
      name: String(formData.get("itemName")),
      category: String(formData.get("itemCategory")),
      weight: String(formData.get("itemWeight")),
      image: String(reader.result),
    };

    jewelleryItems = [...jewelleryItems, newItem].sort((first, second) =>
      first.category.localeCompare(second.category),
    );
    writeStoredData("bhawaniJewellery", jewelleryItems);
    activeCategory = newItem.category;
    refreshStorefront();
    uploadForm.reset();
    uploadStatus.textContent = `${newItem.name} uploaded and arranged under ${newItem.category}.`;
  });
  reader.readAsDataURL(imageFile);
});

if (goldPriceForm) {
  goldPriceForm.elements.gold22.value = prices.gold22;
  goldPriceForm.elements.gold24.value = prices.gold24;
  goldPriceForm.elements.silver.value = prices.silver;
}

refreshStorefront();
