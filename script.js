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
const goldPriceForm = document.querySelector("#gold-price-form");
const categoryForm = document.querySelector("#category-form");
const uploadForm = document.querySelector("#upload-form");
const uploadCategory = document.querySelector("#upload-category");
const uploadStatus = document.querySelector("#upload-status");
const forgotPasswordButton = document.querySelector("#forgot-password");
const staffForm = document.querySelector("#staff-form");
const staffList = document.querySelector("#staff-list");
const adminUserForm = document.querySelector("#admin-user-form");
const adminUserList = document.querySelector("#admin-user-list");

const ADMIN_USERNAME_HASH = "5108473c";
const ADMIN_PASSWORD_HASH = "00f2996d";
const tabPanelIds = ["gold-prices", "gallery", "contact", "admin-panel"];

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

const defaultStaff = [
  { name: "Sawai Ram", role: "Admin", phone: "+91 63677 08444" },
  { name: "Bhaira Ram", role: "Sales", phone: "+91 88905 99101" },
];

const readStoredData = (key, fallback) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : fallback;
};

const writeStoredData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const hashText = async (value) => {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
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
let staffMembers = readStoredData("bhawaniStaff", defaultStaff);
let adminUsers = readStoredData("bhawaniAdminUsers", []);
let activeCategory = "All";
let activeSearch = "";

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
    closeMobileMenu();
  }
});

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

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panelId = button.getAttribute("aria-controls");
    if (panelId) {
      showTab(panelId);
      history.replaceState(null, "", `#${panelId}`);
    }
  });
});

const showTabFromHash = (hash) => {
  const panelId = hash.replace("#", "");
  if (tabPanelIds.includes(panelId)) {
    showTab(panelId);
  }
};

document.addEventListener("click", (event) => {
  const clickedElement = event.target instanceof Element ? event.target : event.target.parentElement;
  const anchor = clickedElement?.closest('a[href^="#"]');
  if (!anchor) return;

  const panelId = anchor.hash.replace("#", "");
  if (tabPanelIds.includes(panelId)) {
    showTab(panelId);
  }
});

window.addEventListener("hashchange", () => showTabFromHash(window.location.hash));
showTabFromHash(window.location.hash);

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

const buildWhatsAppLink = (item) => {
  const message = `Namaste Bhawani Jewellers, I want to enquire about ${item.name} (${item.category}, ${item.weight}).`;
  return `https://wa.me/918890599101?text=${encodeURIComponent(message)}`;
};

const renderGallery = () => {
  if (!galleryGrid) return;

  const searchText = activeSearch.toLowerCase();
  const visibleItems = jewelleryItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const searchableText = `${item.name} ${item.category} ${item.weight}`.toLowerCase();
    const matchesSearch = !searchText || searchableText.includes(searchText);
    return matchesCategory && matchesSearch;
  });

  if (!visibleItems.length) {
    galleryGrid.innerHTML = '<div class="empty-state">No jewellery images matched. Try another search or category.</div>';
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
            <div class="card-actions">
              <a class="button primary small" href="${buildWhatsAppLink(item)}" target="_blank" rel="noopener">WhatsApp Enquiry</a>
            </div>
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
  renderStaffList();
  renderAdminUserList();
  calculatePriceBreakup();
};

const renderStaffList = () => {
  if (!staffList) return;

  staffList.innerHTML = staffMembers
    .map(
      (staff, index) => `
        <div class="management-item">
          <span><strong>${escapeHtml(staff.name)}</strong><small>${escapeHtml(staff.role)} • ${escapeHtml(staff.phone)}</small></span>
          <button class="link-button danger" type="button" data-staff-index="${index}">Remove</button>
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
              <span><strong>${escapeHtml(admin.username)}</strong><small>Additional admin</small></span>
              <button class="link-button danger" type="button" data-admin-index="${index}">Remove</button>
            </div>
          `,
        )
        .join("")
    : '<div class="empty-state compact">No extra admins added yet.</div>';
};

const calculatePriceBreakup = () => {
  if (!priceBreakupForm || !breakupResult) return;

  const formData = new FormData(priceBreakupForm);
  const purity = formData.get("purity");
  const weight = Number(formData.get("weight"));
  const makingPerGram = Number(formData.get("making"));
  const gstPercent = Number(formData.get("gst"));
  const rate = Number(prices[purity]);
  const metalValue = rate * weight;
  const makingValue = makingPerGram * weight;
  const subtotal = metalValue + makingValue;
  const gstValue = (subtotal * gstPercent) / 100;
  const total = subtotal + gstValue;

  breakupResult.innerHTML = `
    <div><span>Metal value</span><strong>${formatCurrency(metalValue)}</strong></div>
    <div><span>Making charges</span><strong>${formatCurrency(makingValue)}</strong></div>
    <div><span>GST</span><strong>${formatCurrency(gstValue)}</strong></div>
    <div><span>Total estimate</span><strong>${formatCurrency(total)}</strong></div>
  `;
};

galleryFilter?.addEventListener("click", (event) => {
  const filterButton = event.target.closest(".filter-chip");
  if (!filterButton) return;

  activeCategory = filterButton.dataset.category;
  renderGalleryFilters();
  renderGallery();
});

gallerySearchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  activeSearch = jewellerySearchInput.value.trim();
  renderGallery();
});

clearSearchButton?.addEventListener("click", () => {
  activeSearch = "";
  jewellerySearchInput.value = "";
  renderGallery();
});

priceBreakupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  calculatePriceBreakup();
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
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const username = formData.get("username");
  const password = formData.get("password");
  const [usernameHash, passwordHash] = await Promise.all([hashText(username), hashText(password)]);
  const isDefaultAdmin = usernameHash === ADMIN_USERNAME_HASH && passwordHash === ADMIN_PASSWORD_HASH;
  const isAdditionalAdmin = adminUsers.some(
    (admin) => admin.usernameHash === usernameHash && admin.passwordHash === passwordHash,
  );
  const isAdmin = isDefaultAdmin || isAdditionalAdmin;

  adminLoginStatus.textContent = isAdmin
    ? "Login successful. Admin features are now available."
    : "Invalid admin username or password.";
  adminTools.hidden = !isAdmin;

  if (isAdmin) {
    adminLoginForm.reset();
  }
});

forgotPasswordButton?.addEventListener("click", () => {
  adminLoginStatus.textContent = "Password reset is protected. Contact Sawai Ram at +91 63677 08444 to verify identity and create a new admin.";
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
  adminUsers = [
    ...adminUsers.filter((admin) => admin.usernameHash !== usernameHash),
    { username, usernameHash, passwordHash },
  ];
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
