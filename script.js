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
const gallerySearchForm = document.querySelector("#gallery-search");
const jewellerySearchInput = document.querySelector("#jewellery-search-input");
const clearSearchButton = document.querySelector("#clear-search");
const priceBreakupForm = document.querySelector("#price-breakup-form");
const breakupResult = document.querySelector("#breakup-result");
const adminLoginForm = document.querySelector(".admin-login-form");
const adminLoginStatus = document.querySelector("#admin-login-status");
const adminTools = document.querySelector(".admin-tools");
const adminLogout = document.querySelector("#admin-logout");
const metalPriceForm = document.querySelector("#gold-price-form");
const categoryForm = document.querySelector("#category-form");
const uploadForm = document.querySelector("#upload-form");
const uploadCategory = document.querySelector("#upload-category");
const uploadStatus = document.querySelector("#upload-status");
const forgotPasswordButton = document.querySelector("#forgot-password");
const staffForm = document.querySelector("#staff-form");
const staffList = document.querySelector("#staff-list");
const adminUserForm = document.querySelector("#admin-user-form");
const adminUserList = document.querySelector("#admin-user-list");

const ADMIN_USERNAME_HASH = "14cd7def31ded1e1e420c78c104dce4641e22c01a01a1db03eeac3a71e121c94";
const ADMIN_PASSWORD_HASH = "14a096ed21f302bca494cb8e970a8afb46fc218dd728865ddf4037dbbab7e4ca";
const tabPanelIds = ["gold-prices", "gallery", "contact", "admin-panel"];
const TOLA_IN_GRAMS = 11.664;

const formatDate = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const defaultCategories = ["Bridal Sets", "Gold Bangles", "Diamond Rings", "Temple Jewellery", "Silver Items"];
const defaultPrices = {
  gold22Per10Gram: 68500,
  gold24Per10Gram: 74700,
  silverPerKg: 92000,
  updatedAt: formatDate(),
};

const defaultJewellery = [
  {
    name: "Kundan Bridal Necklace",
    category: "Bridal Sets",
    description: "Handcrafted bridal necklace with kundan-inspired detail for wedding ceremonies.",
    metal: "gold22",
    weightGram: 64,
    image: "",
  },
  {
    name: "Classic Gold Bangles",
    category: "Gold Bangles",
    description: "Traditional pair of 22K gold bangles for daily and festive wear.",
    metal: "gold22",
    weightGram: 38,
    image: "",
  },
  {
    name: "Solitaire Diamond Ring",
    category: "Diamond Rings",
    description: "Elegant ring design with approximate gold weight shown for estimate.",
    metal: "gold22",
    weightGram: 5,
    image: "",
  },
  {
    name: "Silver Pooja Thali",
    category: "Silver Items",
    description: "Silver article estimate linked with the current silver per-kg rate.",
    metal: "silver",
    weightGram: 120,
    image: "",
  },
];

const defaultStaff = [
  { name: "Bhaira Ram", role: "Contact", phone: "+91 88905 99101" },
  { name: "Sawai Ram", role: "Contact", phone: "+91 63677 08444" },
];

const readStoredData = (key, fallback) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

const writeStoredData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const hashText = async (value) => {
  const encodedValue = new TextEncoder().encode(String(value));
  const digest = await crypto.subtle.digest("SHA-256", encodedValue);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const formatCurrency = (value) => `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;
const formatWeight = (grams) => `${Number(grams || 0).toLocaleString("en-IN", { maximumFractionDigits: 3 })} g`;
const formatTola = (grams) => `${(Number(grams || 0) / TOLA_IN_GRAMS).toLocaleString("en-IN", { maximumFractionDigits: 3 })} tola`;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

let categories = readStoredData("bhawaniCategories", defaultCategories);
let prices = { ...defaultPrices, ...readStoredData("bhawaniPrices", defaultPrices) };
let jewelleryItems = readStoredData("bhawaniJewellery", defaultJewellery);
let staffMembers = readStoredData("bhawaniStaff", defaultStaff);
let adminUsers = readStoredData("bhawaniAdminUsers", []);
let activeCategory = "All";
let activeSearch = "";

const getGold22PerGram = () => Number(prices.gold22Per10Gram || prices.gold22 * 10 || defaultPrices.gold22Per10Gram) / 10;
const getGold24PerGram = () => Number(prices.gold24Per10Gram || prices.gold24 * 10 || defaultPrices.gold24Per10Gram) / 10;
const getSilverPerGram = () => Number(prices.silverPerKg || prices.silver * 1000 || defaultPrices.silverPerKg) / 1000;

const getMetalRate = (metal) => {
  if (metal === "gold24") return getGold24PerGram();
  if (metal === "silver") return getSilverPerGram();
  return getGold22PerGram();
};

const getMetalLabel = (metal) => {
  if (metal === "gold24") return "24K Gold";
  if (metal === "silver") return "Silver";
  return "22K Gold";
};

const closeMobileMenu = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  navLinks?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

const showTab = (panelId) => {
  if (!tabPanelIds.includes(panelId)) return;

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

const showTabFromHash = (hash) => showTab(hash.replace("#", ""));

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks?.classList.toggle("is-open");
  document.body.classList.toggle("menu-open");
});

navLinks?.addEventListener("click", closeMobileMenu);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panelId = button.getAttribute("aria-controls");
    if (panelId) {
      showTab(panelId);
      history.replaceState(null, "", `#${panelId}`);
    }
  });
});

document.addEventListener("click", (event) => {
  const clickedElement = event.target instanceof Element ? event.target : event.target?.parentElement;
  const anchor = clickedElement?.closest('a[href^="#"]');
  const panelId = anchor?.hash.replace("#", "");
  if (panelId && tabPanelIds.includes(panelId)) showTab(panelId);
});

window.addEventListener("hashchange", () => showTabFromHash(window.location.hash));
showTabFromHash(window.location.hash);

const renderPrices = () => {
  if (!priceGrid || !priceUpdated) return;

  const gold22PerGram = getGold22PerGram();
  const gold24PerGram = getGold24PerGram();
  const silverPerGram = getSilverPerGram();

  priceUpdated.textContent = `Updated: ${prices.updatedAt}`;
  priceGrid.innerHTML = [
    ["Gold 22K • 1 gram", gold22PerGram, "Auto-synced from 10 gram price"],
    ["Gold 22K • 10 gram", gold22PerGram * 10, "Admin enters this main gold rate"],
    ["Gold 22K • 1 tola", gold22PerGram * TOLA_IN_GRAMS, "1 tola = 11.664 gram"],
    ["Gold 24K • 1 gram", gold24PerGram, "Pure gold reference"],
    ["Gold 24K • 10 gram", gold24PerGram * 10, "Auto-synced display"],
    ["Silver • 1 gram", silverPerGram, "Auto-synced from 1 kg price"],
    ["Silver • 1 tola", silverPerGram * TOLA_IN_GRAMS, "1 tola = 11.664 gram"],
    ["Silver • 1 kg", silverPerGram * 1000, "Admin enters this main silver rate"],
  ]
    .map(
      ([label, value, helpText]) => `
        <article class="price-card">
          <span>${label}</span>
          <strong>${formatCurrency(value)}</strong>
          <small>${helpText}</small>
        </article>
      `,
    )
    .join("");
};

const renderCategoryOptions = () => {
  if (!uploadCategory) return;
  uploadCategory.innerHTML = categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
};

const renderGalleryFilters = () => {
  if (!galleryFilter) return;
  galleryFilter.innerHTML = ["All", ...categories]
    .map(
      (category) => `
        <button class="filter-chip ${category === activeCategory ? "is-active" : ""}" type="button" data-category="${escapeHtml(category)}">
          ${escapeHtml(category)}
        </button>
      `,
    )
    .join("");
};

const buildWhatsAppLink = (item) => {
  const message = encodeURIComponent(`Namaste Bhawani Jewellers, I am interested in ${item.name} (${item.category}).`);
  return `https://wa.me/918890599101?text=${message}`;
};

const renderGallery = () => {
  if (!galleryGrid) return;

  const query = activeSearch.trim().toLowerCase();
  const filteredItems = jewelleryItems
    .filter((item) => activeCategory === "All" || item.category === activeCategory)
    .filter((item) => [item.name, item.category, item.description, item.metal].some((value) => String(value || "").toLowerCase().includes(query)))
    .sort((first, second) => first.category.localeCompare(second.category) || first.name.localeCompare(second.name));

  if (!filteredItems.length) {
    galleryGrid.innerHTML = `<div class="empty-state">No jewellery found. Try another search or category.</div>`;
    return;
  }

  galleryGrid.innerHTML = filteredItems
    .map((item) => {
      const weightGram = Number(item.weightGram || String(item.weight || "").match(/[\d.]+/)?.[0] || 0);
      const metal = item.metal || "gold22";
      const metalValue = weightGram * getMetalRate(metal);
      const imageMarkup = item.image
        ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" />`
        : `<div class="gallery-placeholder" aria-hidden="true"><span>${escapeHtml(item.name.slice(0, 2).toUpperCase())}</span></div>`;

      return `
        <article class="gallery-card">
          <div class="gallery-image">${imageMarkup}</div>
          <div class="gallery-card-body">
            <span class="category-pill">${escapeHtml(item.category)}</span>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.description || "Visit the store for final design, making charges, and availability.")}</p>
            <dl class="item-meta">
              <div><dt>Metal</dt><dd>${getMetalLabel(metal)}</dd></div>
              <div><dt>Weight</dt><dd>${formatWeight(weightGram)} / ${formatTola(weightGram)}</dd></div>
              <div><dt>Metal value</dt><dd>${formatCurrency(metalValue)}</dd></div>
            </dl>
            <a class="text-link" href="${buildWhatsAppLink(item)}">Ask on WhatsApp</a>
          </div>
        </article>
      `;
    })
    .join("");
};

const renderStaffList = () => {
  if (!staffList) return;
  staffList.innerHTML = staffMembers
    .map(
      (staff, index) => `
        <div class="management-item">
          <span><strong>${escapeHtml(staff.name)}</strong> ${escapeHtml(staff.role)} • ${escapeHtml(staff.phone)}</span>
          <button class="link-button" type="button" data-staff-index="${index}">Remove</button>
        </div>
      `,
    )
    .join("");
};

const renderAdminUserList = () => {
  if (!adminUserList) return;
  adminUserList.innerHTML = adminUsers.length
    ? adminUsers
        .map(
          (admin, index) => `
            <div class="management-item">
              <span><strong>${escapeHtml(admin.username)}</strong> password hidden</span>
              <button class="link-button" type="button" data-admin-index="${index}">Remove</button>
            </div>
          `,
        )
        .join("")
    : `<div class="empty-state compact">No extra admins added yet.</div>`;
};

const refreshStorefront = () => {
  renderPrices();
  renderCategoryOptions();
  renderGalleryFilters();
  renderGallery();
  renderStaffList();
  renderAdminUserList();
};

const calculatePriceBreakup = () => {
  if (!priceBreakupForm || !breakupResult) return;
  const formData = new FormData(priceBreakupForm);
  const purity = String(formData.get("purity"));
  const weight = Number(formData.get("weight"));
  const making = Number(formData.get("making"));
  const gst = Number(formData.get("gst"));
  const metalValue = getMetalRate(purity) * weight;
  const makingValue = making * weight;
  const subtotal = metalValue + makingValue;
  const gstValue = subtotal * (gst / 100);
  const total = subtotal + gstValue;

  breakupResult.innerHTML = [
    ["Metal value", metalValue],
    ["Making charges", makingValue],
    ["GST", gstValue],
    ["Estimated total", total],
  ]
    .map(([label, value]) => `<div><span>${label}</span><strong>${formatCurrency(value)}</strong></div>`)
    .join("");
};

priceBreakupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  calculatePriceBreakup();
});

priceBreakupForm?.addEventListener("input", calculatePriceBreakup);

galleryFilter?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderGalleryFilters();
  renderGallery();
});

gallerySearchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  activeSearch = jewellerySearchInput.value;
  renderGallery();
});

jewellerySearchInput?.addEventListener("input", (event) => {
  activeSearch = event.target.value;
  renderGallery();
});

clearSearchButton?.addEventListener("click", () => {
  activeSearch = "";
  jewellerySearchInput.value = "";
  renderGallery();
});

appointmentForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(appointmentForm);
  const message = encodeURIComponent(`Appointment request from ${formData.get("name")} (${formData.get("phone")}) for ${formData.get("occasion")}.`);
  window.open(`https://wa.me/918890599101?text=${message}`, "_blank");
  appointmentForm.reset();
});

contactMessageForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactMessageForm);
  const message = encodeURIComponent(`${formData.get("contactName")} (${formData.get("contactPhone")}): ${formData.get("message")}`);
  window.open(`https://wa.me/918890599101?text=${message}`, "_blank");
  contactMessageForm.reset();
});

adminLoginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const usernameHash = await hashText(String(formData.get("username")).trim());
  const passwordHash = await hashText(String(formData.get("password")));
  const isDefaultAdmin = usernameHash === ADMIN_USERNAME_HASH && passwordHash === ADMIN_PASSWORD_HASH;
  const isAdditionalAdmin = adminUsers.some((admin) => admin.usernameHash === usernameHash && admin.passwordHash === passwordHash);
  const isAdmin = isDefaultAdmin || isAdditionalAdmin;

  adminLoginStatus.textContent = isAdmin ? "Login successful. Admin features are now available." : "Invalid admin username or password.";
  adminTools.hidden = !isAdmin;

  if (isAdmin) adminLoginForm.reset();
});

forgotPasswordButton?.addEventListener("click", () => {
  adminLoginStatus.textContent = "For password reset, verify identity with Bhaira Ram or Sawai Ram by phone. Passwords are not displayed publicly.";
});

adminLogout?.addEventListener("click", () => {
  adminTools.hidden = true;
  adminLoginStatus.textContent = "Admin logged out.";
});

metalPriceForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(metalPriceForm);
  prices = {
    gold22Per10Gram: Number(formData.get("gold22Per10Gram")),
    gold24Per10Gram: Number(formData.get("gold24Per10Gram")),
    silverPerKg: Number(formData.get("silverPerKg")),
    updatedAt: formatDate(),
  };
  writeStoredData("bhawaniPrices", prices);
  renderPrices();
  renderGallery();
  calculatePriceBreakup();
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

staffForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(staffForm);
  staffMembers = [
    ...staffMembers,
    {
      name: String(formData.get("staffName")),
      role: String(formData.get("staffRole")),
      phone: String(formData.get("staffPhone")),
    },
  ];
  writeStoredData("bhawaniStaff", staffMembers);
  staffForm.reset();
  renderStaffList();
});

staffList?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-staff-index]");
  if (!removeButton) return;
  staffMembers = staffMembers.filter((_, index) => index !== Number(removeButton.dataset.staffIndex));
  writeStoredData("bhawaniStaff", staffMembers);
  renderStaffList();
});

adminUserForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(adminUserForm);
  const username = String(formData.get("newAdminUsername")).trim();
  const password = String(formData.get("newAdminPassword"));
  if (!username || !password) return;

  const usernameHash = await hashText(username);
  const passwordHash = await hashText(password);
  adminUsers = [...adminUsers.filter((admin) => admin.usernameHash !== usernameHash), { username, usernameHash, passwordHash }];
  writeStoredData("bhawaniAdminUsers", adminUsers);
  adminUserForm.reset();
  renderAdminUserList();
});

adminUserList?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-admin-index]");
  if (!removeButton) return;
  adminUsers = adminUsers.filter((_, index) => index !== Number(removeButton.dataset.adminIndex));
  writeStoredData("bhawaniAdminUsers", adminUsers);
  renderAdminUserList();
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
      description: String(formData.get("itemDescription")),
      metal: String(formData.get("itemMetal")),
      weightGram: Number(formData.get("itemWeightGram")),
      image: String(reader.result),
    };

    jewelleryItems = [...jewelleryItems, newItem].sort((first, second) => first.category.localeCompare(second.category) || first.name.localeCompare(second.name));
    writeStoredData("bhawaniJewellery", jewelleryItems);
    activeCategory = newItem.category;
    refreshStorefront();
    uploadForm.reset();
    uploadStatus.textContent = `${newItem.name} uploaded under ${newItem.category}. Weight and price are auto displayed.`;
  });
  reader.readAsDataURL(imageFile);
});

if (metalPriceForm) {
  metalPriceForm.elements.gold22Per10Gram.value = prices.gold22Per10Gram || getGold22PerGram() * 10;
  metalPriceForm.elements.gold24Per10Gram.value = prices.gold24Per10Gram || getGold24PerGram() * 10;
  metalPriceForm.elements.silverPerKg.value = prices.silverPerKg || getSilverPerGram() * 1000;
}

refreshStorefront();
calculatePriceBreakup();
