let remoteTextsCache = {};
let currentSiteSettings = null;
let currentSiteData = { links: [], projects: [], gallery: [], blogPosts: [], events: [] };

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setMetaTag(attrName, attrValue, content) {
  if (!attrValue) return;
  const selector = attrName === "property" ? `meta[property="${attrValue}"]` : `meta[name="${attrValue}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content || "");
}

function setCanonical(url) {
  if (!url) return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function applySeoMeta({
  title,
  description,
  keywords,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  indexingEnabled
} = {}) {
  if (title) document.title = title;

  setMetaTag("name", "description", description || "");
  setMetaTag("name", "keywords", keywords || "");
  setMetaTag("name", "robots", indexingEnabled === false ? "noindex,nofollow" : "index,follow");

  setMetaTag("property", "og:type", "website");
  setMetaTag("property", "og:title", title || document.title);
  setMetaTag("property", "og:description", description || "");
  if (ogImage) setMetaTag("property", "og:image", ogImage);

  setMetaTag("name", "twitter:card", "summary_large_image");
  setMetaTag("name", "twitter:title", twitterTitle || title || document.title);
  setMetaTag("name", "twitter:description", twitterDescription || description || "");
  if (twitterImage || ogImage) setMetaTag("name", "twitter:image", twitterImage || ogImage);

  if (canonicalUrl) setCanonical(canonicalUrl);
}

function setTextContentSafe(selector, value) {
  const el = document.querySelector(selector);
  if (el && value !== undefined && value !== null && value !== "") el.textContent = value;
}

function applyRemoteTexts(lang) {
  const langMap = remoteTextsCache[lang] || {};

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (langMap[key]) el.textContent = langMap[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (langMap[key]) el.placeholder = langMap[key];
  });

  const page = document.body.dataset.page;

  if (page === "projects") {
    setTextContentSafe("#projectsPageEyebrow", langMap.projectsPageEyebrow);
    setTextContentSafe("#projectsPageTitle", langMap.projectsPageTitle);
    setTextContentSafe("#projectsPageText", langMap.projectsPageText);
  }

  if (page === "gallery-page") {
    setTextContentSafe("#galleryPageEyebrow", langMap.galleryPageEyebrow);
    setTextContentSafe("#galleryPageTitle", langMap.galleryPageTitle);
    setTextContentSafe("#galleryPageText", langMap.galleryPageText);
  }

  if (page === "events") {
    setTextContentSafe("#eventsPageEyebrow", langMap.eventsPageEyebrow);
    setTextContentSafe("#eventsPageTitle", langMap.eventsPageTitle);
    setTextContentSafe("#eventsPageText", langMap.eventsPageText);
  }

  if (page === "blog-list") {
    setTextContentSafe("#blogPageEyebrow", langMap.blogPageEyebrow);
    setTextContentSafe("#blogPageTitle", langMap.blogPageTitle);
  }

  if (page === "article") {
    setTextContentSafe("#articleBackText", langMap.articleBack);
    setTextContentSafe("#shareArticleBtn", langMap.shareArticleBtn);
  }

  if (page === "event-detail") {
    setTextContentSafe("#eventBackText", langMap.eventBack);
    setTextContentSafe("#shareEventBtn", langMap.shareEventBtn);
    setTextContentSafe("#eventDateLabel", langMap.eventDateLabel);
    setTextContentSafe("#eventLocationLabel", langMap.eventLocationLabel);
    setTextContentSafe("#eventGalleryTitle", langMap.eventGalleryTitle);
  }
}

function applyLang(lang) {
  const safeLang = translations[lang] ? lang : "en";

  document.body.dataset.lang = safeLang;
  document.documentElement.lang = safeLang;
  document.documentElement.dir = safeLang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (translations[safeLang] && translations[safeLang][key]) {
      el.textContent = translations[safeLang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[safeLang] && translations[safeLang][key]) {
      el.placeholder = translations[safeLang][key];
    }
  });

  const currentLangLabel = document.getElementById("currentLangLabel");
  if (currentLangLabel) currentLangLabel.textContent = safeLang.toUpperCase();

  localStorage.setItem("site_lang", safeLang);

  const dropdown = document.getElementById("langDropdown");
  if (dropdown) dropdown.classList.remove("show");

  applyRemoteTexts(safeLang);
}

function setupLanguageMenu() {
  const toggle = document.getElementById("langToggle");
  const dropdown = document.getElementById("langDropdown");

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });

  if (toggle && dropdown) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  }
}

function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");
  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("show");
    menuToggle.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", nav.classList.contains("show") ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        nav.classList.remove("show");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      nav.classList.remove("show");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.14 });

  items.forEach((el) => observer.observe(el));
}

function setupTilt() {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 900) return;
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -7;
      const ry = ((x / r.width) - 0.5) * 9;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function getSocialIcon(platform) {
  const icons = {
    instagram: "fa-brands fa-instagram",
    facebook: "fa-brands fa-facebook-f",
    x: "fa-brands fa-x-twitter",
    twitter: "fa-brands fa-x-twitter",
    tiktok: "fa-brands fa-tiktok",
    linktree: "fa-solid fa-link",
    threads: "fa-brands fa-threads",
    linkedin: "fa-brands fa-linkedin-in",
    shutterstock: "fa-solid fa-camera",
    github: "fa-brands fa-github",
    youtube: "fa-brands fa-youtube",
    behance: "fa-brands fa-behance",
    dribbble: "fa-brands fa-dribbble",
    telegram: "fa-brands fa-telegram",
    whatsapp: "fa-brands fa-whatsapp"
  };
  return icons[(platform || "").toLowerCase()] || "fa-solid fa-globe";
}

function normalizeUrl(url = "") {
  const trimmed = String(url).trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function renderSocialLinks(items) {
  const grid = document.getElementById("socialLinksGrid");
  if (!grid) return;

  grid.innerHTML = "";
  const unique = [];
  const seen = new Set();

  (items || [])
    .filter((item) => item.enabled)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .forEach((item) => {
      const normalizedUrl = normalizeUrl(item.url || "");
      const key = normalizedUrl.toLowerCase();
      if (!normalizedUrl) return;
      if (seen.has(key)) return;
      seen.add(key);
      unique.push({ ...item, url: normalizedUrl });
    });

  unique.forEach((item) => {
    const a = document.createElement("a");
    a.className = "social-card";
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    a.innerHTML = `
      <span class="social-card-left">
        <span class="social-icon"><i class="${escapeHtml(getSocialIcon(item.platform))}"></i></span>
        <span class="social-label-text">${escapeHtml(item.label || item.platform || "Link")}</span>
      </span>
      <span class="social-arrow"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
    `;

    grid.appendChild(a);
  });
}

function renderProjects(items, targetId, limit = null) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  grid.innerHTML = "";

  let rows = (items || []).filter((item) => item.enabled);
  rows = rows.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  if (limit !== null) rows = rows.slice(0, limit);

  rows.forEach((item) => {
    const article = document.createElement("article");
    article.className = "project-card reveal tilt-card";
    article.innerHTML = `
      <div class="project-card-image">
        <img src="${escapeHtml(item.image_url || "")}" alt="${escapeHtml(item.seo_title || item.title || "")}">
        <div class="hover-overlay">
          <div class="hover-overlay-content">
            <div class="hover-overlay-title">${escapeHtml(item.title || "")}</div>
            <div class="hover-overlay-text">${escapeHtml(item.hover_text || item.description || "")}</div>
          </div>
        </div>
      </div>
      <div class="project-meta"><span class="tag">${escapeHtml(item.badge || "PROJECT")}</span></div>
      <h3>${escapeHtml(item.title || "")}</h3>
      <p>${escapeHtml(item.description || "")}</p>
    `;
    grid.appendChild(article);
  });

  setupReveal();
  setupTilt();
}

function renderGallery(items, targetId, limit = null) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  grid.innerHTML = "";

  let rows = (items || []).filter((item) => item.enabled);
  rows = rows.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  if (limit !== null) rows = rows.slice(0, limit);

  rows.forEach((item) => {
    const article = document.createElement("article");
    article.className = "gallery-item reveal tilt-card";
    article.innerHTML = `
      <img src="${escapeHtml(item.image_url || "")}" alt="${escapeHtml(item.alt_text || item.seo_title || item.title || "")}">
      <div class="hover-overlay">
        <div class="hover-overlay-content">
          <div class="hover-overlay-title">${escapeHtml(item.title || "")}</div>
          <div class="hover-overlay-text">${escapeHtml(item.hover_text || "")}</div>
        </div>
      </div>
    `;
    grid.appendChild(article);
  });

  setupReveal();
  setupTilt();
}


function renderEvents(items, targetId, limit = null) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  grid.innerHTML = "";
  let rows = (items || []).filter((item) => item.enabled);
  rows = rows.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  if (limit !== null) rows = rows.slice(0, limit);
  rows.forEach((item) => {
    const article = document.createElement("article");
    article.className = "event-card reveal tilt-card";
    article.innerHTML = `
      <a href="event.html?slug=${encodeURIComponent(item.slug)}" class="event-card-link">
        <div class="event-card-image">
          <img src="${escapeHtml(item.cover_image_url || "profile.png")}" alt="${escapeHtml(item.seo_title || item.title || "")}">
          <div class="hover-overlay">
            <div class="hover-overlay-content">
              <div class="hover-overlay-title">${escapeHtml(item.title || "")}</div>
              <div class="hover-overlay-text">${escapeHtml(item.excerpt || item.location || "")}</div>
            </div>
          </div>
        </div>
        <div class="event-card-content">
          <div class="event-card-meta">
            <span>${new Date(item.event_date || item.created_at || Date.now()).toLocaleDateString()}</span>
            <span>${escapeHtml(item.location || "")}</span>
          </div>
          <h3>${escapeHtml(item.title || "")}</h3>
          <p>${escapeHtml(item.excerpt || "")}</p>
        </div>
      </a>
    `;
    grid.appendChild(article);
  });
  setupReveal();
  setupTilt();
}

function openLightbox(images = [], startIndex = 0) {
  const lightbox = document.getElementById("siteLightbox");
  const image = document.getElementById("siteLightboxImage");
  const counter = document.getElementById("siteLightboxCounter");
  if (!lightbox || !image) return;
  const validImages = (images || []).filter(Boolean);
  if (!validImages.length) return;
  let currentIndex = Math.max(0, Math.min(startIndex, validImages.length - 1));
  function renderLightbox() {
    image.src = validImages[currentIndex];
    if (counter) counter.textContent = `${currentIndex + 1} / ${validImages.length}`;
  }
  lightbox.dataset.images = JSON.stringify(validImages);
  lightbox.dataset.index = String(currentIndex);
  lightbox.classList.add("show");
  document.body.classList.add("lightbox-open");
  renderLightbox();
}

function closeLightbox() {
  const lightbox = document.getElementById("siteLightbox");
  if (!lightbox) return;
  lightbox.classList.remove("show");
  document.body.classList.remove("lightbox-open");
}

function moveLightbox(step = 1) {
  const lightbox = document.getElementById("siteLightbox");
  const image = document.getElementById("siteLightboxImage");
  const counter = document.getElementById("siteLightboxCounter");
  if (!lightbox || !image) return;
  const images = JSON.parse(lightbox.dataset.images || "[]");
  if (!images.length) return;
  let currentIndex = parseInt(lightbox.dataset.index || "0", 10);
  currentIndex = (currentIndex + step + images.length) % images.length;
  lightbox.dataset.index = String(currentIndex);
  image.src = images[currentIndex];
  if (counter) counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

function renderEventDetail(item) {
  if (!item) return;
  const eventCover = document.getElementById("eventCover");
  const eventTitle = document.getElementById("eventTitle");
  const eventExcerpt = document.getElementById("eventExcerpt");
  const eventContent = document.getElementById("eventContent");
  const eventDateValue = document.getElementById("eventDateValue");
  const eventLocationValue = document.getElementById("eventLocationValue");
  const eventGalleryGrid = document.getElementById("eventGalleryGrid");
  const images = [item.gallery_image_1, item.gallery_image_2, item.gallery_image_3, item.gallery_image_4].filter(Boolean);
  if (eventCover) eventCover.src = item.cover_image_url || "profile.png";
  if (eventTitle) eventTitle.textContent = item.title || "";
  if (eventExcerpt) eventExcerpt.textContent = item.excerpt || "";
  if (eventContent) eventContent.innerHTML = item.content_html || "";
  if (eventDateValue) eventDateValue.textContent = item.event_date ? new Date(item.event_date).toLocaleDateString() : "";
  if (eventLocationValue) eventLocationValue.textContent = item.location || "";
  if (eventGalleryGrid) {
    eventGalleryGrid.innerHTML = images.map((src, index) => `
      <button type="button" class="event-gallery-item" data-event-image-index="${index}">
        <img src="${escapeHtml(src)}" alt="${escapeHtml(item.title || "Event")} ${index + 1}">
      </button>
    `).join("");
    eventGalleryGrid.querySelectorAll("[data-event-image-index]").forEach((button) => {
      button.addEventListener("click", () => openLightbox(images, parseInt(button.dataset.eventImageIndex || "0", 10)));
    });
  }
}

function renderHomeBlog(items) {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const rows = (items || [])
    .filter((item) => item.published && item.featured)
    .sort((a, b) => {
      const aOrder = a.sort_order ?? 0;
      const bOrder = b.sort_order ?? 0;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return new Date(b.created_at) - new Date(a.created_at);
    })
    .slice(0, 3);

  rows.forEach((item) => {
    const article = document.createElement("article");
    article.className = "blog-card reveal";
    article.innerHTML = `
      <a href="article.html?slug=${encodeURIComponent(item.slug)}" class="blog-card-link">
        <div class="blog-card-image">
          <img src="${escapeHtml(item.cover_image_url || "profile.png")}" alt="${escapeHtml(item.seo_title || item.title || "")}">
        </div>
        <div class="blog-card-content">
          <div class="blog-card-date">${new Date(item.created_at).toLocaleDateString()}</div>
          <h3>${escapeHtml(item.title || "")}</h3>
          <p>${escapeHtml(item.excerpt || "")}</p>
        </div>
      </a>
    `;
    grid.appendChild(article);
  });

  setupReveal();
}

function renderBlogList(items) {
  const grid = document.getElementById("blogListGrid");
  if (!grid) return;

  const currentLang = localStorage.getItem("site_lang") || "en";
  const langMap = remoteTextsCache[currentLang] || {};
  grid.innerHTML = "";

  const rows = (items || [])
    .filter((item) => item.published)
    .sort((a, b) => {
      const aOrder = a.sort_order ?? 0;
      const bOrder = b.sort_order ?? 0;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  if (!rows.length) {
    grid.innerHTML = `<div class="empty-state">${escapeHtml(langMap.blogEmpty || translations[currentLang]?.blogEmpty || "No articles yet.")}</div>`;
    return;
  }

  rows.forEach((item) => {
    const article = document.createElement("article");
    article.className = "blog-card reveal";
    article.innerHTML = `
      <a href="article.html?slug=${encodeURIComponent(item.slug)}" class="blog-card-link">
        <div class="blog-card-image">
          <img src="${escapeHtml(item.cover_image_url || "profile.png")}" alt="${escapeHtml(item.seo_title || item.title || "")}">
        </div>
        <div class="blog-card-content">
          <div class="blog-card-date">${new Date(item.created_at).toLocaleDateString()}</div>
          <h3>${escapeHtml(item.title || "")}</h3>
          <p>${escapeHtml(item.excerpt || "")}</p>
        </div>
      </a>
    `;
    grid.appendChild(article);
  });

  setupReveal();
}

function setHeroCounts({ projects = 0, photos = 0, articles = 0 } = {}) {
  const projectsEl = document.getElementById("projectsCount");
  const photosEl = document.getElementById("photosCount");
  const articlesEl = document.getElementById("articlesCount");

  if (projectsEl) projectsEl.textContent = String(projects);
  if (photosEl) photosEl.textContent = String(photos);
  if (articlesEl) articlesEl.textContent = String(articles);
}

function applyTheme(theme) {
  const body = document.body;
  const toggle = document.getElementById("themeToggle");
  const icon = toggle ? toggle.querySelector("i") : null;
  const safeTheme = theme === "light" ? "light" : "dark";

  if (safeTheme === "light") {
    body.classList.add("light-mode");
    if (icon) icon.className = "fa-solid fa-moon";
  } else {
    body.classList.remove("light-mode");
    if (icon) icon.className = "fa-solid fa-sun";
  }

  localStorage.setItem("site_theme", safeTheme);
}

function setupTheme() {
  const savedTheme = localStorage.getItem("site_theme") || "dark";
  applyTheme(savedTheme);

  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light-mode");
      applyTheme(isLight ? "dark" : "light");
    });
  }
}

function setupHeroImageMotion() {
  const heroVisual = document.getElementById("heroVisual");
  const heroImage = document.getElementById("profileImage");
  if (!heroVisual || !heroImage) return;

  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollYTarget = 0;
  let ticking = false;

  function animate() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    heroImage.style.transform = `
      translate3d(${currentX}px, ${currentY + scrollYTarget}px, 0)
      rotateX(${(-currentY * 0.08).toFixed(2)}deg)
      rotateY(${(currentX * 0.08).toFixed(2)}deg)
      scale(1.01)
    `;

    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      requestAnimationFrame(animate);
    } else {
      ticking = false;
    }
  }

  function startAnimation() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(animate);
    }
  }

  heroVisual.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 900) return;

    const rect = heroVisual.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    targetX = ((x - rect.width / 2) / rect.width) * 18;
    targetY = ((y - rect.height / 2) / rect.height) * 18;
    startAnimation();
  });

  heroVisual.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
    startAnimation();
  });

  window.addEventListener("scroll", () => {
    if (window.innerWidth < 900) {
      scrollYTarget = 0;
      heroImage.style.transform = "translate3d(0,0,0)";
      return;
    }

    const rect = heroVisual.getBoundingClientRect();
    const windowCenter = window.innerHeight / 2;
    const elementCenter = rect.top + rect.height / 2;
    const distance = elementCenter - windowCenter;

    scrollYTarget = Math.max(Math.min(distance * -0.04, 18), -18);
    startAnimation();
  }, { passive: true });
}

function getVisitorToken() {
  let token = localStorage.getItem("site_visitor_token");
  if (!token) {
    token = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem("site_visitor_token", token);
  }
  return token;
}

function getPageKey() {
  const page = document.body.dataset.page || "home";
  const slug = new URLSearchParams(window.location.search).get("slug");
  return slug ? `${page}:${slug}` : page;
}

async function trackCvDownload(client) {
  try {
    await client.from("cv_downloads").insert({
      visitor_token: getVisitorToken(),
      page_key: getPageKey(),
      user_agent: navigator.userAgent || "",
      referrer: document.referrer || ""
    });
  } catch (e) {
    console.log("CV tracking optional:", e.message);
  }
}

async function triggerCvDownload() {
  const url = currentSiteSettings?.cv_file_url || "";
  const fileName = currentSiteSettings?.cv_file_name || "Ahmed-Saad-CV.pdf";
  if (!url) {
    alert(translations[localStorage.getItem("site_lang") || "en"]?.cvMissing || "No CV file has been added yet.");
    return;
  }
  const client = window.supabase && window.SITE_CONFIG ? window.supabase.createClient(SITE_CONFIG.supabaseUrl, SITE_CONFIG.supabaseAnonKey) : null;
  if (client) await trackCvDownload(client);
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1200);
  } catch (e) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

function bindCvButtons() {
  document.querySelectorAll("[data-cv-download]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      triggerCvDownload();
    });
  });
}

async function trackVisit(client) {
  try {
    const pageKey = getPageKey();
    const storageKey = `visit_tracked_${pageKey}_${new Date().toISOString().slice(0,10)}`;
    if (sessionStorage.getItem(storageKey)) return;

    await client.from("site_visits").insert({
      page_key: pageKey,
      path: window.location.pathname + window.location.search,
      visitor_token: getVisitorToken(),
      user_agent: navigator.userAgent || "",
      referrer: document.referrer || "",
      country: "",
      city: "",
      device_type: /mobile/i.test(navigator.userAgent) ? "mobile" : "desktop"
    });

    sessionStorage.setItem(storageKey, "1");
  } catch (e) {
    console.log("Visit tracking optional:", e.message);
  }
}

async function loadRemoteContent() {
  if (!window.SITE_CONFIG || !window.supabase) return;

  try {
    const client = window.supabase.createClient(SITE_CONFIG.supabaseUrl, SITE_CONFIG.supabaseAnonKey);

    await trackVisit(client);

    const page = document.body.dataset.page;

    const { data: textRows } = await client.from("site_texts").select("*");
    remoteTextsCache = {};
    (textRows || []).forEach((row) => {
      if (!remoteTextsCache[row.lang]) remoteTextsCache[row.lang] = {};
      remoteTextsCache[row.lang][row.text_key] = row.text_value || "";
    });

    applyRemoteTexts(localStorage.getItem("site_lang") || "en");

    const { data: settings } = await client.from("site_settings").select("*").eq("id", 1).single();
    currentSiteSettings = settings || null;

    if (settings) {
      const heroTop = document.getElementById("heroNameTop");
      const heroBottom = document.getElementById("heroNameBottom");
      const heroImg = document.getElementById("profileImage");
      const aboutImg = document.getElementById("aboutProfileImage");
      const faviconEl = document.getElementById("siteFavicon");

      if (heroTop && settings.hero_name_top) heroTop.textContent = settings.hero_name_top;
      if (heroBottom && settings.hero_name_bottom) heroBottom.textContent = settings.hero_name_bottom;

      if (heroImg && settings.profile_image_url) heroImg.src = settings.profile_image_url;
      if (aboutImg && settings.profile_image_url) aboutImg.src = settings.profile_image_url;

      if (faviconEl) {
        if (settings.favicon_url && settings.favicon_url.trim()) {
          faviconEl.href = settings.favicon_url;
        } else if (settings.profile_image_url && settings.profile_image_url.trim()) {
          faviconEl.href = settings.profile_image_url;
        }
      }

      if (settings.font_family) {
        document.documentElement.style.setProperty("--font-main", settings.font_family);
      }

      const aboutTitle = document.querySelector('[data-i18n="aboutTitle"]');
      const aboutText1 = document.getElementById("aboutText1");
      const aboutText2 = document.getElementById("aboutText2");

      if (aboutTitle && settings.about_title) aboutTitle.textContent = settings.about_title;
      if (aboutText1 && settings.about_text1) aboutText1.textContent = settings.about_text1;
      if (aboutText2 && settings.about_text2) aboutText2.textContent = settings.about_text2;

      const canonicalBase = (settings.seo_canonical_base_url || "").trim();
      const canonicalUrl = canonicalBase ? canonicalBase.replace(/\/$/, "") + window.location.pathname + window.location.search : "";

      applySeoMeta({
        title: settings.seo_site_title || document.title,
        description: settings.seo_site_description || document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
        keywords: settings.seo_site_keywords || "",
        ogImage: settings.seo_og_image_url || settings.profile_image_url || "",
        twitterTitle: settings.seo_twitter_title || settings.seo_site_title || document.title,
        twitterDescription: settings.seo_twitter_description || settings.seo_site_description || "",
        twitterImage: settings.seo_twitter_image_url || settings.seo_og_image_url || settings.profile_image_url || "",
        canonicalUrl,
        indexingEnabled: settings.seo_indexing_enabled !== false
      });
    }

    const { data: links } = await client.from("social_links").select("*").order("sort_order", { ascending: true });
    if (links) renderSocialLinks(links);

    const { data: projects } = await client.from("projects").select("*").order("sort_order", { ascending: true });
    const { data: gallery } = await client.from("gallery_items").select("*").order("sort_order", { ascending: true });
    const { data: blogPosts } = await client.from("blog_posts").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    const { data: events } = await client.from("events").select("*").order("sort_order", { ascending: true }).order("event_date", { ascending: false });

    currentSiteData = { links: links || [], projects: projects || [], gallery: gallery || [], blogPosts: blogPosts || [], events: events || [] };

    const enabledProjects = (projects || []).filter((p) => p.enabled);
    const enabledGallery = (gallery || []).filter((g) => g.enabled);
    const publishedArticles = (blogPosts || []).filter((post) => post.published);
    const enabledEvents = (events || []).filter((event) => event.enabled);

    setHeroCounts({
      projects: enabledProjects.length,
      photos: enabledGallery.length,
      articles: publishedArticles.length
    });

    if (page === "home") {
      renderProjects(enabledProjects.filter((p) => p.featured), "projectsGrid", 3);
      renderGallery(enabledGallery.filter((g) => g.featured), "galleryGrid", 6);
      renderEvents(enabledEvents.filter((event) => event.featured), "eventsGrid", 3);
      renderHomeBlog(blogPosts || []);
    }

    if (page === "projects") {
      renderProjects(projects || [], "allProjectsGrid");
      if (currentSiteSettings) {
        applySeoMeta({
          title: document.getElementById("projectsPageTitle")?.textContent || currentSiteSettings.seo_site_title || document.title,
          description: document.getElementById("projectsPageText")?.textContent || currentSiteSettings.seo_site_description || "",
          keywords: currentSiteSettings.seo_site_keywords || "",
          ogImage: currentSiteSettings.seo_og_image_url || currentSiteSettings.profile_image_url || "",
          twitterTitle: currentSiteSettings.seo_twitter_title || document.getElementById("projectsPageTitle")?.textContent || document.title,
          twitterDescription: currentSiteSettings.seo_twitter_description || document.getElementById("projectsPageText")?.textContent || "",
          twitterImage: currentSiteSettings.seo_twitter_image_url || currentSiteSettings.seo_og_image_url || currentSiteSettings.profile_image_url || "",
          canonicalUrl: (currentSiteSettings.seo_canonical_base_url || "").trim() ? currentSiteSettings.seo_canonical_base_url.replace(/\/$/, "") + "/projects.html" : "",
          indexingEnabled: currentSiteSettings.seo_indexing_enabled !== false
        });
      }
    }

    if (page === "gallery-page") {
      renderGallery(gallery || [], "allGalleryGrid");
      if (currentSiteSettings) {
        applySeoMeta({
          title: document.getElementById("galleryPageTitle")?.textContent || currentSiteSettings.seo_site_title || document.title,
          description: document.getElementById("galleryPageText")?.textContent || currentSiteSettings.seo_site_description || "",
          keywords: currentSiteSettings.seo_site_keywords || "",
          ogImage: currentSiteSettings.seo_og_image_url || currentSiteSettings.profile_image_url || "",
          twitterTitle: currentSiteSettings.seo_twitter_title || document.getElementById("galleryPageTitle")?.textContent || document.title,
          twitterDescription: currentSiteSettings.seo_twitter_description || document.getElementById("galleryPageText")?.textContent || "",
          twitterImage: currentSiteSettings.seo_twitter_image_url || currentSiteSettings.seo_og_image_url || currentSiteSettings.profile_image_url || "",
          canonicalUrl: (currentSiteSettings.seo_canonical_base_url || "").trim() ? currentSiteSettings.seo_canonical_base_url.replace(/\/$/, "") + "/gallery.html" : "",
          indexingEnabled: currentSiteSettings.seo_indexing_enabled !== false
        });
      }
    }

    if (page === "events") {
      renderEvents(events || [], "allEventsGrid");
      if (currentSiteSettings) {
        applySeoMeta({
          title: document.getElementById("eventsPageTitle")?.textContent || currentSiteSettings.seo_site_title || document.title,
          description: document.getElementById("eventsPageText")?.textContent || currentSiteSettings.seo_site_description || "",
          keywords: currentSiteSettings.seo_site_keywords || "",
          ogImage: currentSiteSettings.seo_og_image_url || currentSiteSettings.profile_image_url || "",
          twitterTitle: currentSiteSettings.seo_twitter_title || document.getElementById("eventsPageTitle")?.textContent || document.title,
          twitterDescription: currentSiteSettings.seo_twitter_description || document.getElementById("eventsPageText")?.textContent || "",
          twitterImage: currentSiteSettings.seo_twitter_image_url || currentSiteSettings.seo_og_image_url || currentSiteSettings.profile_image_url || "",
          canonicalUrl: (currentSiteSettings.seo_canonical_base_url || "").trim() ? currentSiteSettings.seo_canonical_base_url.replace(/\/$/, "") + "/events.html" : "",
          indexingEnabled: currentSiteSettings.seo_indexing_enabled !== false
        });
      }
    }

    if (page === "blog-list") {
      renderBlogList(blogPosts || []);
      if (currentSiteSettings) {
        applySeoMeta({
          title: document.getElementById("blogPageTitle")?.textContent || currentSiteSettings.seo_site_title || document.title,
          description: currentSiteSettings.seo_site_description || "",
          keywords: currentSiteSettings.seo_site_keywords || "",
          ogImage: currentSiteSettings.seo_og_image_url || currentSiteSettings.profile_image_url || "",
          twitterTitle: currentSiteSettings.seo_twitter_title || document.getElementById("blogPageTitle")?.textContent || document.title,
          twitterDescription: currentSiteSettings.seo_twitter_description || currentSiteSettings.seo_site_description || "",
          twitterImage: currentSiteSettings.seo_twitter_image_url || currentSiteSettings.seo_og_image_url || currentSiteSettings.profile_image_url || "",
          canonicalUrl: (currentSiteSettings.seo_canonical_base_url || "").trim() ? currentSiteSettings.seo_canonical_base_url.replace(/\/$/, "") + "/blog.html" : "",
          indexingEnabled: currentSiteSettings.seo_indexing_enabled !== false
        });
      }
    }

    if (page === "article") {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("slug");

      if (slug) {
        const { data: post } = await client.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single();

        if (post) {
          const articleCover = document.getElementById("articleCover");
          const articleTitle = document.getElementById("articleTitle");
          const articleExcerpt = document.getElementById("articleExcerpt");
          const articleInnerImage = document.getElementById("articleInnerImage");
          const articleContent = document.getElementById("articleContent");
          const articleDate = document.getElementById("articleDate");

          if (articleCover) articleCover.src = post.cover_image_url || "profile.png";
          if (articleTitle) articleTitle.textContent = post.title || "";
          if (articleExcerpt) articleExcerpt.textContent = post.excerpt || "";
          if (articleInnerImage) articleInnerImage.src = post.article_image_url || post.cover_image_url || "profile.png";
          if (articleContent) articleContent.innerHTML = post.content_html || "";
          if (articleDate) articleDate.textContent = new Date(post.created_at).toLocaleDateString();

          applySeoMeta({
            title: post.seo_title || post.title || "Article",
            description: post.seo_description || post.excerpt || "",
            keywords: post.seo_keywords || currentSiteSettings?.seo_site_keywords || "",
            ogImage: post.og_image_url || post.cover_image_url || currentSiteSettings?.seo_og_image_url || "",
            twitterTitle: post.seo_title || post.title || "Article",
            twitterDescription: post.seo_description || post.excerpt || "",
            twitterImage: post.og_image_url || post.cover_image_url || currentSiteSettings?.seo_twitter_image_url || "",
            canonicalUrl: post.canonical_url || ((currentSiteSettings?.seo_canonical_base_url || "").trim() ? currentSiteSettings.seo_canonical_base_url.replace(/\/$/, "") + `/article.html?slug=${encodeURIComponent(slug)}` : ""),
            indexingEnabled: currentSiteSettings?.seo_indexing_enabled !== false
          });

          const shareBtn = document.getElementById("shareArticleBtn");
          if (shareBtn) {
            shareBtn.onclick = async () => {
              const shareData = { title: post.title || "Article", text: post.excerpt || "", url: window.location.href };
              try {
                if (navigator.share) await navigator.share(shareData);
                else { await navigator.clipboard.writeText(window.location.href); alert("Article link copied"); }
              } catch (e) { console.log(e); }
            };
          }
        }
      }
    }

    if (page === "event-detail") {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("slug");
      if (slug) {
        const { data: event } = await client.from("events").select("*").eq("slug", slug).eq("enabled", true).single();
        if (event) {
          renderEventDetail(event);
          applySeoMeta({
            title: event.seo_title || event.title || "Event",
            description: event.seo_description || event.excerpt || "",
            keywords: event.seo_keywords || currentSiteSettings?.seo_site_keywords || "",
            ogImage: event.og_image_url || event.cover_image_url || currentSiteSettings?.seo_og_image_url || "",
            twitterTitle: event.seo_title || event.title || "Event",
            twitterDescription: event.seo_description || event.excerpt || "",
            twitterImage: event.og_image_url || event.cover_image_url || currentSiteSettings?.seo_twitter_image_url || "",
            canonicalUrl: event.canonical_url || ((currentSiteSettings?.seo_canonical_base_url || "").trim() ? currentSiteSettings.seo_canonical_base_url.replace(/\/$/, "") + `/event.html?slug=${encodeURIComponent(slug)}` : ""),
            indexingEnabled: currentSiteSettings?.seo_indexing_enabled !== false
          });
          const shareBtn = document.getElementById("shareEventBtn");
          if (shareBtn) {
            shareBtn.onclick = async () => {
              const shareData = { title: event.title || "Event", text: event.excerpt || "", url: window.location.href };
              try {
                if (navigator.share) await navigator.share(shareData);
                else { await navigator.clipboard.writeText(window.location.href); alert("Event link copied"); }
              } catch (e) { console.log(e); }
            };
          }
        }
      }
    }
  } catch (e) {
    console.log("Remote content optional:", e.message);
  }
}

document.addEventListener("click", (e) => {
  if (e.target.closest("[data-lightbox-close]")) closeLightbox();
  if (e.target.closest("[data-lightbox-prev]")) moveLightbox(-1);
  if (e.target.closest("[data-lightbox-next]")) moveLightbox(1);
  if (e.target.id === "siteLightbox") closeLightbox();
});
document.addEventListener("keydown", (e) => {
  const lightbox = document.getElementById("siteLightbox");
  if (!lightbox || !lightbox.classList.contains("show")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") moveLightbox(-1);
  if (e.key === "ArrowRight") moveLightbox(1);
});
