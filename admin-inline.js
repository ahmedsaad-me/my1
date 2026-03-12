
    const ADMIN_PASSWORD = "22446688";
    const CLEANUP_FUNCTION_URL = "https://urhkqtisdludmqcqhhea.supabase.co/functions/v1/super-worker";

    let socialLinksData = [];
    let projectsData = [];
    let galleryData = [];
    let eventsData = [];
    let cvDownloadsData = [];
    let blogPostsData = [];
    let inboxMessagesData = [];
    let siteTextsData = [];
    let storageAssetsData = [];
    let visitsData = [];
    let blogEditor = null;

    const tabMeta = {
      dashboard: { title: "Dashboard", desc: "Overview of website content, visitors, and messages." },
      general: { title: "General", desc: "Main identity, hero titles, profile image, favicon, and base website settings." },
      texts: { title: "Texts", desc: "Edit all titles, descriptions, buttons, labels, and placeholders for every section." },
      seo: { title: "SEO", desc: "Global search engine settings for the entire website." },
      about: { title: "About", desc: "Edit the About title and the two main paragraphs." },
      projects: { title: "Projects", desc: "Add, edit, feature, sort, and optimize projects." },
      gallery: { title: "Gallery", desc: "Add, edit, feature, sort, and optimize images." },
      events: { title: "Events", desc: "Add, edit, sort, feature, and optimize events." },
      links: { title: "Links", desc: "Manage social and external links." },
      blog: { title: "Blog", desc: "Create and manage articles with full SEO." },
      inbox: { title: "Inbox", desc: "Read and organize messages sent from the contact form." },
      tools: { title: "Tools", desc: "Maintenance tools for cleanup and resets." }
    };

    function escapeHtml(text = "") {
      return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function getClient() {
      if (!window.SITE_CONFIG || !SITE_CONFIG.supabaseUrl || !SITE_CONFIG.supabaseAnonKey) {
        alert("Please add your Supabase data first in config.js");
        return null;
      }
      return window.supabase.createClient(SITE_CONFIG.supabaseUrl, SITE_CONFIG.supabaseAnonKey);
    }

    function getTextFieldGroups() {
      return [
        {
          title: "Navbar",
          fields: [
            { key: "navAbout", label: "About" },
            { key: "navWork", label: "Work" },
            { key: "navGallery", label: "Gallery" },
            { key: "navBlog", label: "Blog" },
            { key: "navLinks", label: "Links" },
            { key: "navContact", label: "Contact" }
          ]
        },
        {
          title: "Hero Section",
          fields: [
            { key: "eyebrow", label: "Top Small Text" },
            { key: "heroSubtitle", label: "Hero Description", type: "textarea" },
            { key: "btnWork", label: "Primary Button" },
            { key: "btnConnect", label: "Secondary Button" }
          ]
        },
        {
          title: "Stats",
          fields: [
            { key: "statProjects", label: "Projects Label" },
            { key: "statPhotos", label: "Photos Label" },
            { key: "statArticles", label: "Articles Label" }
          ]
        },
        {
          title: "Work Section",
          fields: [
            { key: "workMini", label: "Small Title" },
            { key: "workTitle", label: "Main Title", type: "textarea" }
          ]
        },
        {
          title: "Gallery Section",
          fields: [
            { key: "galleryMini", label: "Small Title" },
            { key: "galleryTitle", label: "Main Title", type: "textarea" }
          ]
        },
        {
          title: "About Section",
          fields: [
            { key: "aboutMini", label: "Small Title" },
            { key: "aboutTitle", label: "Main Title", type: "textarea" },
            { key: "aboutText1", label: "Paragraph 1", type: "textarea" },
            { key: "aboutText2", label: "Paragraph 2", type: "textarea" }
          ]
        },
        {
          title: "Blog Section",
          fields: [
            { key: "blogMini", label: "Small Title" },
            { key: "blogTitle", label: "Main Title", type: "textarea" }
          ]
        },
        {
          title: "Links Section",
          fields: [
            { key: "linksMini", label: "Small Title" },
            { key: "linksTitle", label: "Main Title", type: "textarea" }
          ]
        },
        {
          title: "Contact Section",
          fields: [
            { key: "contactMini", label: "Small Title" },
            { key: "contactTitle", label: "Main Title", type: "textarea" },
            { key: "contactText", label: "Description", type: "textarea" },
            { key: "formNamePlaceholder", label: "Name Placeholder" },
            { key: "formEmailPlaceholder", label: "Email Placeholder" },
            { key: "formMessagePlaceholder", label: "Message Placeholder" },
            { key: "sendBtn", label: "Send Button" }
          ]
        },
        {
          title: "Projects Page",
          fields: [
            { key: "projectsPageEyebrow", label: "Small Title" },
            { key: "projectsPageTitle", label: "Main Title" },
            { key: "projectsPageText", label: "Description", type: "textarea" }
          ]
        },
        {
          title: "Gallery Page",
          fields: [
            { key: "galleryPageEyebrow", label: "Small Title" },
            { key: "galleryPageTitle", label: "Main Title" },
            { key: "galleryPageText", label: "Description", type: "textarea" }
          ]
        },
        {
          title: "Events Page",
          fields: [
            { key: "eventsPageEyebrow", label: "Small Title" },
            { key: "eventsPageTitle", label: "Main Title" },
            { key: "eventsPageText", label: "Description", type: "textarea" }
          ]
        },
        {
          title: "Blog Page",
          fields: [
            { key: "blogPageEyebrow", label: "Small Title" },
            { key: "blogPageTitle", label: "Main Title" },
            { key: "blogEmpty", label: "Empty Blog Message", type: "textarea" }
          ]
        },
        {
          title: "Article Page",
          fields: [
            { key: "articleBack", label: "Back To Blog Button" },
            { key: "shareArticleBtn", label: "Share Article Button" }
          ]
        },
        {
          title: "Event Detail Page",
          fields: [
            { key: "eventBack", label: "Back To Events Button" },
            { key: "shareEventBtn", label: "Share Event Button" },
            { key: "eventDateLabel", label: "Date Label" },
            { key: "eventLocationLabel", label: "Location Label" },
            { key: "eventGalleryTitle", label: "Gallery Title" }
          ]
        }
      ];
    }

    function getDefaultTextValue(lang, key) {
      const defaults = {
        en: {
          navAbout: "About",
          navWork: "Work",
          navGallery: "Gallery",
          navEvents: "Events",
          navBlog: "Blog",
          navLinks: "Links",
          navContact: "Contact",
          eyebrow: "Electrical & Electronics Engineering Student",
          heroSubtitle: "A dark, smooth, premium portfolio blending engineering, creativity, photography, and future-focused project management.",
          btnWork: "View Work",
          btnConnect: "Let's Connect",
          statProjects: "Projects",
          statPhotos: "Photos",
          statArticles: "Articles",
          workMini: "Selected Work",
          workTitle: "A collection of premium project cards.",
          galleryMini: "Gallery",
          galleryTitle: "Photography mood with premium presentation.",
          eventsMini: "Events",
          eventsTitle: "Events, conferences, and activities I attended.",
          viewMore: "View More",
          aboutMini: "About Me",
          aboutTitle: "A focused engineering student building a strong technical future.",
          aboutText1: "I am Ahmed Saad, an Electrical & Electronics Engineering student based in Bartın, Turkey. I am interested in power systems, electronics, renewable energy, and building a career that combines technical depth with project management.",
          aboutText2: "I enjoy learning, improving continuously, and presenting my work in a clean and professional way. This portfolio is a modern home for my identity, links, gallery, and future projects.",
          blogMini: "Blog",
          blogTitle: "Short articles, insights, and thoughts.",
          linksMini: "Platforms",
          linksTitle: "All your important links in one place.",
          contactMini: "Contact",
          contactTitle: "Let’s build something extraordinary.",
          contactText: "Currently accepting new ideas, collaborations, and premium creative opportunities.",
          formNamePlaceholder: "Name",
          formEmailPlaceholder: "Email",
          formMessagePlaceholder: "Message",
          sendBtn: "Send Message",
          projectsPageEyebrow: "All Projects",
          projectsPageTitle: "Projects Archive",
          projectsPageText: "Every project from the homepage and everything added later from the admin panel appears here.",
          galleryPageEyebrow: "Full Gallery",
          galleryPageTitle: "Gallery Archive",
          galleryPageText: "All gallery images added from the admin panel appear here with the same premium hover effect.",
          eventsPageEyebrow: "All Events",
          eventsPageTitle: "Events Archive",
          eventsPageText: "Every event you add from the dashboard appears here with the same premium presentation.",
          blogPageEyebrow: "Blog",
          blogPageTitle: "Articles & Insights",
          blogEmpty: "No articles yet.",
          articleBack: "Back to Blog",
          eventBack: "Back to Events",
          shareArticleBtn: "Share Article",
          shareEventBtn: "Share Event",
          eventDateLabel: "Date",
          eventLocationLabel: "Location",
          eventGalleryTitle: "Event Gallery"
        },
        ar: {
          navAbout: "من أنا",
          navWork: "الأعمال",
          navGallery: "المعرض",
          navEvents: "الفعاليات",
          navBlog: "المدونة",
          navLinks: "الروابط",
          navContact: "تواصل",
          eyebrow: "طالب هندسة كهربائية وإلكترونيات",
          heroSubtitle: "موقع شخصي أسود واحترافي يجمع بين الهندسة والإبداع والتصوير وإدارة المشاريع المستقبلية.",
          btnWork: "شاهد الأعمال",
          btnConnect: "تواصل معي",
          statProjects: "المشاريع",
          statPhotos: "الصور",
          statArticles: "المقالات",
          workMini: "الأعمال المختارة",
          workTitle: "مجموعة أعمال بتقديم فاخر وحديث.",
          galleryMini: "المعرض",
          galleryTitle: "قسم صور بإحساس بصري احترافي.",
          eventsMini: "الفعاليات",
          eventsTitle: "الفعاليات والمؤتمرات والأنشطة التي حضرتها.",
          viewMore: "عرض المزيد",
          aboutMini: "نبذة عني",
          aboutTitle: "طالب هندسة طموح يبني مستقبلًا تقنيًا قويًا.",
          aboutText1: "أنا أحمد سعد، طالب هندسة كهربائية وإلكترونيات في بارتن - تركيا. أهتم بأنظمة القوى والإلكترونيات والطاقة المتجددة وبناء مسار مهني يجمع بين العمق التقني وإدارة المشاريع.",
          aboutText2: "أحب التعلم والتطور المستمر وتقديم أعمالي بشكل نظيف واحترافي. هذا الموقع مساحة حديثة لهويتي وروابطي ومعرضي ومشاريعي القادمة.",
          blogMini: "المدونة",
          blogTitle: "مقالات قصيرة وأفكار ورؤى.",
          linksMini: "المنصات",
          linksTitle: "كل روابطك المهمة في مكان واحد.",
          contactMini: "تواصل",
          contactTitle: "دعنا نبني شيئًا استثنائيًا.",
          contactText: "أرحب بالأفكار الجديدة والتعاونات والفرص الإبداعية المميزة.",
          formNamePlaceholder: "الاسم",
          formEmailPlaceholder: "البريد الإلكتروني",
          formMessagePlaceholder: "الرسالة",
          sendBtn: "إرسال",
          projectsPageEyebrow: "كل المشاريع",
          projectsPageTitle: "أرشيف المشاريع",
          projectsPageText: "كل المشاريع الموجودة في الصفحة الرئيسية وأي مشاريع تضيفها لاحقًا من لوحة التحكم ستظهر هنا.",
          galleryPageEyebrow: "المعرض الكامل",
          galleryPageTitle: "أرشيف الصور",
          galleryPageText: "كل الصور التي تضيفها من لوحة التحكم ستظهر هنا بنفس التأثير الاحترافي.",
          eventsPageEyebrow: "كل الفعاليات",
          eventsPageTitle: "أرشيف الفعاليات",
          eventsPageText: "كل الفعاليات التي تضيفها من لوحة التحكم ستظهر هنا بنفس العرض الاحترافي.",
          blogPageEyebrow: "المدونة",
          blogPageTitle: "مقالات وأفكار",
          blogEmpty: "لا توجد مقالات حتى الآن.",
          articleBack: "العودة إلى المدونة",
          eventBack: "العودة إلى الفعاليات",
          shareArticleBtn: "مشاركة المقال",
          shareEventBtn: "مشاركة الفعالية",
          eventDateLabel: "التاريخ",
          eventLocationLabel: "المكان",
          eventGalleryTitle: "صور الفعالية"
        },
        tr: {
          navAbout: "Hakkımda",
          navWork: "Projeler",
          navGallery: "Galeri",
          navEvents: "Etkinlikler",
          navBlog: "Blog",
          navLinks: "Bağlantılar",
          navContact: "İletişim",
          eyebrow: "Elektrik ve Elektronik Mühendisliği Öğrencisi",
          heroSubtitle: "Mühendislik, yaratıcılık, fotoğrafçılık ve gelecek odaklı proje yönetimini birleştiren koyu ve premium bir portfolyo.",
          btnWork: "Projeleri Gör",
          btnConnect: "İletişime Geç",
          statProjects: "Projeler",
          statPhotos: "Fotoğraflar",
          statArticles: "Makaleler",
          workMini: "Seçili Çalışmalar",
          workTitle: "Premium proje kartlarından oluşan bir koleksiyon.",
          galleryMini: "Galeri",
          galleryTitle: "Premium sunumla fotoğraf ruhu.",
          eventsMini: "Etkinlikler",
          eventsTitle: "Katıldığım etkinlikler, konferanslar ve aktiviteler.",
          viewMore: "Daha Fazla",
          aboutMini: "Hakkımda",
          aboutTitle: "Güçlü bir teknik gelecek inşa eden odaklı bir mühendislik öğrencisi.",
          aboutText1: "Ben Ahmed Saad. Bartın, Türkiye'de yaşayan Elektrik ve Elektronik Mühendisliği öğrencisiyim. Güç sistemleri, elektronik, yenilenebilir enerji ve proje yönetimiyle birleşen teknik bir kariyerle ilgileniyorum.",
          aboutText2: "Öğrenmeyi, sürekli gelişmeyi ve çalışmalarımı temiz ve profesyonel bir şekilde sunmayı seviyorum. Bu portfolyo kimliğim, bağlantılarım, galerim ve gelecekteki projelerim için modern bir alan.",
          blogMini: "Blog",
          blogTitle: "Kısa yazılar, içgörüler ve düşünceler.",
          linksMini: "Platformlar",
          linksTitle: "Tüm önemli bağlantıların tek yerde.",
          contactMini: "İletişim",
          contactTitle: "Birlikte olağanüstü bir şey yapalım.",
          contactText: "Yeni fikirler, iş birlikleri ve premium yaratıcı fırsatlara açığım.",
          formNamePlaceholder: "İsim",
          formEmailPlaceholder: "E-posta",
          formMessagePlaceholder: "Mesaj",
          sendBtn: "Mesaj Gönder",
          projectsPageEyebrow: "Tüm Projeler",
          projectsPageTitle: "Proje Arşivi",
          projectsPageText: "Ana sayfadaki tüm projeler ve yönetim panelinden sonradan eklenenler burada görünür.",
          galleryPageEyebrow: "Tam Galeri",
          galleryPageTitle: "Galeri Arşivi",
          galleryPageText: "Yönetim panelinden eklenen tüm galeri görselleri burada aynı premium efektle görünür.",
          eventsPageEyebrow: "Tüm Etkinlikler",
          eventsPageTitle: "Etkinlik Arşivi",
          eventsPageText: "Yönetim panelinden eklediğiniz tüm etkinlikler burada aynı premium sunumla görünür.",
          blogPageEyebrow: "Blog",
          blogPageTitle: "Yazılar ve İçgörüler",
          blogEmpty: "Henüz makale yok.",
          articleBack: "Bloga Dön",
          eventBack: "Etkinliklere Dön",
          shareArticleBtn: "Makaleyi Paylaş",
          shareEventBtn: "Etkinliği Paylaş",
          eventDateLabel: "Tarih",
          eventLocationLabel: "Konum",
          eventGalleryTitle: "Etkinlik Galerisi"
        },
        fr: {
          navAbout: "À propos",
          navWork: "Projets",
          navGallery: "Galerie",
          navEvents: "Événements",
          navBlog: "Blog",
          navLinks: "Liens",
          navContact: "Contact",
          eyebrow: "Étudiant en génie électrique et électronique",
          heroSubtitle: "Un portfolio sombre, fluide et premium qui mélange ingénierie, créativité, photographie et gestion de projet tournée vers l’avenir.",
          btnWork: "Voir les projets",
          btnConnect: "Me contacter",
          statProjects: "Projets",
          statPhotos: "Photos",
          statArticles: "Articles",
          workMini: "Travaux sélectionnés",
          workTitle: "Une collection de cartes de projets premium.",
          galleryMini: "Galerie",
          galleryTitle: "Une galerie photo avec une présentation premium.",
          eventsMini: "Événements",
          eventsTitle: "Les événements, conférences et activités auxquels j’ai participé.",
          viewMore: "Voir plus",
          aboutMini: "À propos de moi",
          aboutTitle: "Un étudiant ingénieur concentré sur un avenir technique solide.",
          aboutText1: "Je suis Ahmed Saad, étudiant en génie électrique et électronique à Bartın, en Turquie. Je m’intéresse aux systèmes électriques, à l’électronique, aux énergies renouvelables et à une carrière qui combine profondeur technique et gestion de projet.",
          aboutText2: "J’aime apprendre, progresser continuellement et présenter mon travail de manière propre et professionnelle. Ce portfolio est un espace moderne pour mon identité, mes liens, ma galerie et mes futurs projets.",
          blogMini: "Blog",
          blogTitle: "Articles courts, idées et réflexions.",
          linksMini: "Plateformes",
          linksTitle: "Tous vos liens importants au même endroit.",
          contactMini: "Contact",
          contactTitle: "Construisons quelque chose d’extraordinaire.",
          contactText: "Ouvert aux nouvelles idées, collaborations et opportunités créatives premium.",
          formNamePlaceholder: "Nom",
          formEmailPlaceholder: "E-mail",
          formMessagePlaceholder: "Message",
          sendBtn: "Envoyer",
          projectsPageEyebrow: "Tous les projets",
          projectsPageTitle: "Archives des projets",
          projectsPageText: "Tous les projets de la page d’accueil et ceux ajoutés plus tard depuis l’administration apparaissent ici.",
          galleryPageEyebrow: "Galerie complète",
          galleryPageTitle: "Archives de la galerie",
          galleryPageText: "Toutes les images ajoutées depuis l’administration apparaissent ici avec le même effet premium.",
          eventsPageEyebrow: "Tous les événements",
          eventsPageTitle: "Archives des événements",
          eventsPageText: "Tous les événements ajoutés depuis le tableau de bord apparaissent ici avec la même présentation premium.",
          blogPageEyebrow: "Blog",
          blogPageTitle: "Articles & idées",
          blogEmpty: "Aucun article pour le moment.",
          articleBack: "Retour au blog",
          eventBack: "Retour aux événements",
          shareArticleBtn: "Partager l’article",
          shareEventBtn: "Partager l’événement",
          eventDateLabel: "Date",
          eventLocationLabel: "Lieu",
          eventGalleryTitle: "Galerie de l’événement"
        }
      };
      return defaults[lang]?.[key] || "";
    }

    function getCurrentTextsLang() {
      const select = document.getElementById("textsLangSelect");
      return select ? select.value : "en";
    }

    function getTextValue(lang, key) {
      const row = siteTextsData.find(item => item.lang === lang && item.text_key === key);
      if (row) return row.text_value || "";
      return getDefaultTextValue(lang, key);
    }

    function renderTextsEditor() {
      const lang = getCurrentTextsLang();
      const wrap = document.getElementById("textsAdminList");
      if (!wrap) return;

      wrap.innerHTML = getTextFieldGroups().map(group => `
        <div class="row-card">
          <div class="row-head"><strong>${escapeHtml(group.title)}</strong></div>
          <div class="grid">
            ${group.fields.map(field => `
              <label style="grid-column:1/-1;">
                ${escapeHtml(field.label)}
                ${field.type === "textarea"
                  ? `<textarea class="site-text-input" data-lang="${lang}" data-key="${field.key}">${escapeHtml(getTextValue(lang, field.key))}</textarea>`
                  : `<input class="site-text-input" data-lang="${lang}" data-key="${field.key}" type="text" value="${escapeHtml(getTextValue(lang, field.key))}">`
                }
              </label>
            `).join("")}
          </div>
        </div>
      `).join("");
    }

    function collectTextsRows() {
      return [...document.querySelectorAll("#textsAdminList .site-text-input")].map(input => ({
        lang: input.dataset.lang,
        text_key: input.dataset.key,
        text_value: input.value.trim()
      }));
    }
const ADMIN_LOGIN_FUNCTION_URL = "https://urhkqtisdludmqcqhhea.supabase.co/functions/v1/admin-login-check";

function openAdminPanel() {
  document.getElementById("loginCard").classList.add("hidden");
  document.getElementById("sidebarMenu").classList.remove("hidden");
  document.getElementById("panel").classList.remove("hidden");
  document.getElementById("loginStatus").textContent = "";

  bindTabs();
  initBlogEditor();
  loadAllData();
}

async function login() {
  const emailEl = document.getElementById("adminEmail");
  const passwordEl = document.getElementById("password");
  const loginStatus = document.getElementById("loginStatus");

  if (!emailEl || !passwordEl || !loginStatus) {
    alert("Login inputs are missing from admin.html");
    return;
  }

  const email = emailEl.value.trim().toLowerCase();
  const password = passwordEl.value.trim();

  if (!email || !password) {
    loginStatus.textContent = "Enter email and password";
    return;
  }

  loginStatus.textContent = "Checking...";

  try {
    const response = await fetch(ADMIN_LOGIN_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      loginStatus.textContent = data.message || "Wrong email or password";
      return;
    }

    sessionStorage.setItem("admin_logged_in", "true");
    openAdminPanel();
  } catch (error) {
    console.error("Login error:", error);
    loginStatus.textContent = "Login failed";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("admin_logged_in") === "true") {
    openAdminPanel();
  }
});

    function bindTabs() {
      document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const tab = btn.dataset.tab;

          document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
          document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

          btn.classList.add("active");
          document.getElementById(`tab-${tab}`).classList.add("active");

          document.getElementById("panelTitle").textContent = tabMeta[tab].title;
          document.getElementById("panelDesc").textContent = tabMeta[tab].desc;
          document.getElementById("mainSaveBtn").style.display = ["blog","dashboard","inbox","tools"].includes(tab) ? "none" : "";
          document.getElementById("saveStatus").textContent = "";

          if (tab === "texts") renderTextsEditor();
          if (tab === "dashboard") loadDashboardStats();
          if (tab === "inbox") renderInboxMessages();
        });
      });
    }

    function initBlogEditor() {
      if (blogEditor) return;

      blogEditor = new Quill("#blogEditor", {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["blockquote", "link"],
            ["clean"]
          ]
        }
      });

      document.getElementById("blogTitle").addEventListener("input", () => {
        const id = document.getElementById("blogPostId").value;
        if (!id) {
          document.getElementById("blogSlug").value = slugify(document.getElementById("blogTitle").value);
        }
      });
    }

    function slugify(text = "") {
      return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    }

    function buildPublicUrl(fileName) {
      return `${SITE_CONFIG.supabaseUrl}/storage/v1/object/public/images/${fileName}`;
    }

    async function uploadToImagesBucket(file, sourceType = "misc") {
      const client = getClient();
      if (!client) return null;

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await client.storage.from("images").upload(fileName, file);

      if (error) {
        alert(error.message);
        return null;
      }

      const publicUrl = buildPublicUrl(fileName);

      await client.from("storage_assets").upsert({
        bucket_name: "images",
        file_path: fileName,
        public_url: publicUrl,
        source_type: sourceType,
        source_id: ""
      }, { onConflict: "file_path" });

      return publicUrl;
    }

    async function uploadToDocumentsBucket(file, sourceType = "document") {
      const client = getClient();
      if (!client) return "";
      const safeName = `${Date.now()}-${(file.name || "file").replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const fileName = `${sourceType}/${safeName}`;
      const { error } = await client.storage.from("documents").upload(fileName, file, { upsert: true, contentType: file.type || "application/pdf" });
      if (error) {
        alert(error.message);
        return "";
      }

      const publicUrl = `${SITE_CONFIG.supabaseUrl}/storage/v1/object/public/documents/${fileName}`;

      await client.from("storage_assets").upsert({
        storage_path: fileName,
        public_url: publicUrl,
        source_type: sourceType,
        content_type: file.type || "application/pdf",
        file_size: file.size || null
      }, { onConflict: "storage_path" });

      return publicUrl;
    }

    async function uploadProfileImage() {
      const file = document.getElementById("profileUpload").files[0];
      if (!file) return;
      document.getElementById("uploadStatus").textContent = "Uploading...";
      const url = await uploadToImagesBucket(file, "profile");
      if (url) {
        document.getElementById("profileImageUrl").value = url;
        document.getElementById("previewImg").src = url;
        document.getElementById("uploadStatus").textContent = "Image uploaded successfully";
      }
    }

    async function uploadFavicon() {
      const file = document.getElementById("faviconUpload").files[0];
      if (!file) return;
      document.getElementById("faviconStatus").textContent = "Uploading...";
      const url = await uploadToImagesBucket(file, "favicon");
      if (url) {
        document.getElementById("faviconUrl").value = url;
        document.getElementById("faviconPreview").src = url;
        document.getElementById("faviconStatus").textContent = "Favicon uploaded successfully";
      }
    }

    function removeRow(button) {
      const row = button.closest(".row-card");
      if (row) row.remove();
    }

    async function uploadCvFile() {
      const file = document.getElementById("cvUpload").files[0];
      const status = document.getElementById("cvStatus");
      if (!file) {
        status.textContent = "Choose a PDF file first";
        return;
      }
      status.textContent = "Uploading CV...";
      const url = await uploadToDocumentsBucket(file, "cv");
      if (url) {
        document.getElementById("cvFileUrl").value = url;
        document.getElementById("cvFileName").value = file.name || "Ahmed-Saad-CV.pdf";
        status.textContent = "CV uploaded successfully";
      } else {
        status.textContent = "CV upload failed";
      }
    }

    function clearCvFile() {
      document.getElementById("cvFileUrl").value = "";
      document.getElementById("cvFileName").value = "";
      document.getElementById("cvStatus").textContent = "CV removed from settings. Save Online to publish the change.";
    }

    function socialRowTemplate(item = {}) {
      return `
        <div class="row-card">
          <div class="row-head">
            <strong>Link</strong>
            <button type="button" class="btn-danger" onclick="removeRow(this)">Delete</button>
          </div>
          <div class="grid">
            <label>
              Platform
              <select class="social-platform">
                <option value="instagram" ${item.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                <option value="facebook" ${item.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                <option value="x" ${item.platform === 'x' ? 'selected' : ''}>X / Twitter</option>
                <option value="tiktok" ${item.platform === 'tiktok' ? 'selected' : ''}>TikTok</option>
                <option value="linktree" ${item.platform === 'linktree' ? 'selected' : ''}>Linktree</option>
                <option value="threads" ${item.platform === 'threads' ? 'selected' : ''}>Threads</option>
                <option value="linkedin" ${item.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                <option value="shutterstock" ${item.platform === 'shutterstock' ? 'selected' : ''}>Shutterstock</option>
                <option value="github" ${item.platform === 'github' ? 'selected' : ''}>GitHub</option>
                <option value="youtube" ${item.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
                <option value="behance" ${item.platform === 'behance' ? 'selected' : ''}>Behance</option>
              </select>
            </label>

            <label>Label<input class="social-label" type="text" value="${escapeHtml(item.label || '')}"></label>
            <label style="grid-column:1/-1;">URL<input class="social-url" type="text" value="${escapeHtml(item.url || '')}"></label>
            <label>Sort Order<input class="social-order" type="number" value="${item.sort_order ?? 0}"></label>
            <label>
              Enabled
              <select class="social-enabled">
                <option value="true" ${(item.enabled ?? true) ? 'selected' : ''}>Yes</option>
                <option value="false" ${item.enabled === false ? 'selected' : ''}>No</option>
              </select>
            </label>
          </div>
        </div>
      `;
    }

    function projectRowTemplate(item = {}) {
      return `
        <div class="row-card">
          <div class="row-head">
            <strong>${escapeHtml(item.title || "Project")}</strong>
            <button type="button" class="btn-danger" onclick="removeRow(this)">Delete</button>
          </div>

          <div class="grid">
            <label>Title<input class="project-title" type="text" value="${escapeHtml(item.title || '')}"></label>
            <label>Badge<input class="project-badge" type="text" value="${escapeHtml(item.badge || 'PROJECT')}"></label>
            <label style="grid-column:1/-1;">Description<textarea class="project-description">${escapeHtml(item.description || '')}</textarea></label>
            <label style="grid-column:1/-1;">Hover Text<textarea class="project-hover">${escapeHtml(item.hover_text || '')}</textarea></label>
            <label style="grid-column:1/-1;">Image URL<input class="project-image-url" type="text" value="${escapeHtml(item.image_url || '')}"></label>
            <label>Upload Image<input class="project-image-file" type="file" accept="image/*"></label>
            <label>Sort Order<input class="project-order" type="number" value="${item.sort_order ?? 0}"></label>
            <label>
              Featured on Home
              <select class="project-featured">
                <option value="true" ${(item.featured ?? true) ? 'selected' : ''}>Yes</option>
                <option value="false" ${item.featured === false ? 'selected' : ''}>No</option>
              </select>
            </label>
            <label>
              Enabled
              <select class="project-enabled">
                <option value="true" ${(item.enabled ?? true) ? 'selected' : ''}>Yes</option>
                <option value="false" ${item.enabled === false ? 'selected' : ''}>No</option>
              </select>
            </label>
            <label style="grid-column:1/-1;">SEO Title<input class="project-seo-title" type="text" value="${escapeHtml(item.seo_title || '')}"></label>
            <label style="grid-column:1/-1;">SEO Description<textarea class="project-seo-description">${escapeHtml(item.seo_description || '')}</textarea></label>
            <label style="grid-column:1/-1;">SEO Keywords<textarea class="project-seo-keywords">${escapeHtml(item.seo_keywords || '')}</textarea></label>
            <label>OG Image URL<input class="project-og-image-url" type="text" value="${escapeHtml(item.og_image_url || '')}"></label>
            <label>Canonical URL<input class="project-canonical-url" type="text" value="${escapeHtml(item.canonical_url || '')}"></label>
          </div>

          <div class="toolbar" style="margin-top:12px;">
            <button type="button" class="btn-dark" onclick="uploadProjectImage(this)">Upload Project Image</button>
          </div>
        </div>
      `;
    }

    function galleryRowTemplate(item = {}) {
      return `
        <div class="row-card">
          <div class="row-head">
            <strong>${escapeHtml(item.title || "Image")}</strong>
            <button type="button" class="btn-danger" onclick="removeRow(this)">Delete</button>
          </div>

          <div class="grid">
            <label>Title<input class="gallery-title" type="text" value="${escapeHtml(item.title || '')}"></label>
            <label>Sort Order<input class="gallery-order" type="number" value="${item.sort_order ?? 0}"></label>
            <label style="grid-column:1/-1;">Hover Text<textarea class="gallery-hover">${escapeHtml(item.hover_text || '')}</textarea></label>
            <label style="grid-column:1/-1;">Alt Text<input class="gallery-alt-text" type="text" value="${escapeHtml(item.alt_text || '')}"></label>
            <label style="grid-column:1/-1;">Image URL<input class="gallery-image-url" type="text" value="${escapeHtml(item.image_url || '')}"></label>
            <label>Upload Image<input class="gallery-image-file" type="file" accept="image/*"></label>
            <label>
              Featured on Home
              <select class="gallery-featured">
                <option value="true" ${(item.featured ?? true) ? 'selected' : ''}>Yes</option>
                <option value="false" ${item.featured === false ? 'selected' : ''}>No</option>
              </select>
            </label>
            <label>
              Enabled
              <select class="gallery-enabled">
                <option value="true" ${(item.enabled ?? true) ? 'selected' : ''}>Yes</option>
                <option value="false" ${item.enabled === false ? 'selected' : ''}>No</option>
              </select>
            </label>
            <label style="grid-column:1/-1;">SEO Title<input class="gallery-seo-title" type="text" value="${escapeHtml(item.seo_title || '')}"></label>
            <label style="grid-column:1/-1;">SEO Description<textarea class="gallery-seo-description">${escapeHtml(item.seo_description || '')}</textarea></label>
            <label style="grid-column:1/-1;">SEO Keywords<textarea class="gallery-seo-keywords">${escapeHtml(item.seo_keywords || '')}</textarea></label>
            <label>OG Image URL<input class="gallery-og-image-url" type="text" value="${escapeHtml(item.og_image_url || '')}"></label>
            <label>Canonical URL<input class="gallery-canonical-url" type="text" value="${escapeHtml(item.canonical_url || '')}"></label>
          </div>

          <div class="toolbar" style="margin-top:12px;">
            <button type="button" class="btn-dark" onclick="uploadGalleryImage(this)">Upload Gallery Image</button>
          </div>
        </div>
      `;
    }

    function eventRowTemplate(item = {}) {
      return `
        <div class="row-card">
          <div class="row-head">
            <strong>${escapeHtml(item.title || "Event")}</strong>
            <button type="button" class="btn-danger" onclick="removeRow(this)">Delete</button>
          </div>

          <div class="grid">
            <label>Title<input class="event-title" type="text" value="${escapeHtml(item.title || '')}"></label>
            <label>Slug<input class="event-slug" type="text" value="${escapeHtml(item.slug || '')}"></label>
            <label>Date<input class="event-date" type="date" value="${escapeHtml(item.event_date || '')}"></label>
            <label>Location<input class="event-location" type="text" value="${escapeHtml(item.location || '')}"></label>
            <label style="grid-column:1/-1;">Excerpt<textarea class="event-excerpt">${escapeHtml(item.excerpt || '')}</textarea></label>
            <label style="grid-column:1/-1;">Details HTML<textarea class="event-content">${escapeHtml(item.content_html || '')}</textarea></label>
            <label style="grid-column:1/-1;">Cover Image URL<input class="event-cover-url" type="text" value="${escapeHtml(item.cover_image_url || '')}"></label>
            <label>Upload Cover<input class="event-cover-file" type="file" accept="image/*"></label>

            <label>Image 1 URL<input class="event-image-1" type="text" value="${escapeHtml(item.gallery_image_1 || '')}"></label>
            <label>Upload Image 1<input class="event-image-file-1" type="file" accept="image/*"></label>
            <label>Image 2 URL<input class="event-image-2" type="text" value="${escapeHtml(item.gallery_image_2 || '')}"></label>
            <label>Upload Image 2<input class="event-image-file-2" type="file" accept="image/*"></label>
            <label>Image 3 URL<input class="event-image-3" type="text" value="${escapeHtml(item.gallery_image_3 || '')}"></label>
            <label>Upload Image 3<input class="event-image-file-3" type="file" accept="image/*"></label>
            <label>Image 4 URL<input class="event-image-4" type="text" value="${escapeHtml(item.gallery_image_4 || '')}"></label>
            <label>Upload Image 4<input class="event-image-file-4" type="file" accept="image/*"></label>

            <label>Sort Order<input class="event-order" type="number" value="${item.sort_order ?? 0}"></label>
            <label>
              Featured on Home
              <select class="event-featured">
                <option value="true" ${(item.featured ?? true) ? 'selected' : ''}>Yes</option>
                <option value="false" ${item.featured === false ? 'selected' : ''}>No</option>
              </select>
            </label>
            <label>
              Enabled
              <select class="event-enabled">
                <option value="true" ${(item.enabled ?? true) ? 'selected' : ''}>Yes</option>
                <option value="false" ${item.enabled === false ? 'selected' : ''}>No</option>
              </select>
            </label>
            <label style="grid-column:1/-1;">SEO Title<input class="event-seo-title" type="text" value="${escapeHtml(item.seo_title || '')}"></label>
            <label style="grid-column:1/-1;">SEO Description<textarea class="event-seo-description">${escapeHtml(item.seo_description || '')}</textarea></label>
            <label style="grid-column:1/-1;">SEO Keywords<textarea class="event-seo-keywords">${escapeHtml(item.seo_keywords || '')}</textarea></label>
            <label>OG Image URL<input class="event-og-image-url" type="text" value="${escapeHtml(item.og_image_url || '')}"></label>
            <label>Canonical URL<input class="event-canonical-url" type="text" value="${escapeHtml(item.canonical_url || '')}"></label>
          </div>

          <div class="toolbar" style="margin-top:12px;">
            <button type="button" class="btn-dark" onclick="uploadEventImage(this, 'cover')">Upload Cover</button>
            <button type="button" class="btn-dark" onclick="uploadEventImage(this, '1')">Upload Image 1</button>
            <button type="button" class="btn-dark" onclick="uploadEventImage(this, '2')">Upload Image 2</button>
            <button type="button" class="btn-dark" onclick="uploadEventImage(this, '3')">Upload Image 3</button>
            <button type="button" class="btn-dark" onclick="uploadEventImage(this, '4')">Upload Image 4</button>
          </div>
        </div>
      `;
    }

    function formatMessageDate(value) {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleString();
    }

    function messageRowTemplate(item = {}) {
      return `
        <div class="message-card ${item.is_read ? "" : "unread"}">
          <div class="message-head">
            <div>
              <h4>${escapeHtml(item.subject || "New Message")}</h4>
              <div class="message-meta">
                <div><strong>Name:</strong> ${escapeHtml(item.name || "")}</div>
                <div><strong>Email:</strong> ${escapeHtml(item.email || "")}</div>
                <div><strong>Date:</strong> ${escapeHtml(formatMessageDate(item.created_at))}</div>
              </div>
            </div>
            <div class="toolbar">
              <span class="badge-pill ${item.is_read ? "" : "unread"}">${item.is_read ? "Read" : "Unread"}</span>
              <button type="button" class="btn-blue" onclick="toggleMessageRead(${item.id}, ${item.is_read ? 'false' : 'true'})">${item.is_read ? "Mark Unread" : "Mark Read"}</button>
              <button type="button" class="btn-danger" onclick="deleteMessage(${item.id})">Delete</button>
            </div>
          </div>
          <div class="message-body">${escapeHtml(item.message || "")}</div>
        </div>
      `;
    }

    function blogRowTemplate(item = {}) {
      return `
        <div class="blog-list-item">
          <div>
            <h4>${escapeHtml(item.title || "")}</h4>
            <p>${escapeHtml(item.slug || "")} • ${item.published ? "Published" : "Draft"}</p>
          </div>
          <div class="toolbar">
            <button type="button" class="btn-dark" onclick="editBlogPost(${item.id})">Edit</button>
          </div>
        </div>
      `;
    }

    function renderDashboardMessages() {
      const wrap = document.getElementById("dashboardRecentMessages");
      if (!wrap) return;

      const rows = [...inboxMessagesData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
      if (!rows.length) {
        wrap.innerHTML = `<div class="empty-state">No messages yet.</div>`;
        return;
      }
      wrap.innerHTML = rows.map(messageRowTemplate).join("");
    }

    function renderInboxMessages() {
      const wrap = document.getElementById("inboxAdminList");
      if (!wrap) return;

      const search = (document.getElementById("inboxSearchInput")?.value || "").trim().toLowerCase();
      const filter = document.getElementById("inboxFilterSelect")?.value || "all";

      let rows = [...inboxMessagesData];
      if (filter === "unread") rows = rows.filter(item => !item.is_read);
      if (filter === "read") rows = rows.filter(item => !!item.is_read);

      if (search) {
        rows = rows.filter(item => {
          const haystack = [item.name, item.email, item.subject, item.message].join(" ").toLowerCase();
          return haystack.includes(search);
        });
      }

      rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      if (!rows.length) {
        wrap.innerHTML = `<div class="empty-state">No matching messages.</div>`;
        return;
      }

      wrap.innerHTML = rows.map(messageRowTemplate).join("");
    }

    function renderLists() {
      const socialWrap = document.getElementById("socialLinksAdminList");
      const projectsWrap = document.getElementById("projectsAdminList");
      const galleryWrap = document.getElementById("galleryAdminList");
      const eventsWrap = document.getElementById("eventsAdminList");
      const blogWrap = document.getElementById("blogPostsAdminList");

      if (socialWrap) socialWrap.innerHTML = socialLinksData.map(socialRowTemplate).join("");
      if (projectsWrap) projectsWrap.innerHTML = projectsData.map(projectRowTemplate).join("");
      if (galleryWrap) galleryWrap.innerHTML = galleryData.map(galleryRowTemplate).join("");
      if (eventsWrap) eventsWrap.innerHTML = eventsData.map(eventRowTemplate).join("");
      if (blogWrap) blogWrap.innerHTML = blogPostsData.map(blogRowTemplate).join("");

      renderInboxMessages();
      renderDashboardMessages();
      renderTextsEditor();
      loadDashboardStats();
    }

    function addSocialRow() {
      socialLinksData.push({ platform:"instagram", label:"", url:"", sort_order:socialLinksData.length + 1, enabled:true });
      renderLists();
    }

    function addProjectRow() {
      projectsData.push({
        title:"", description:"", image_url:"", badge:"PROJECT", hover_text:"",
        sort_order:projectsData.length + 1, featured:true, enabled:true,
        seo_title:"", seo_description:"", seo_keywords:"", og_image_url:"", canonical_url:""
      });
      renderLists();
    }

    function addGalleryRow() {
      galleryData.push({
        title:"", image_url:"", hover_text:"", alt_text:"",
        sort_order:galleryData.length + 1, featured:true, enabled:true,
        seo_title:"", seo_description:"", seo_keywords:"", og_image_url:"", canonical_url:""
      });
      renderLists();
    }

    function addEventRow() {
      eventsData.push({
        title:"", slug:"", event_date:"", location:"", excerpt:"", content_html:"",
        cover_image_url:"", gallery_image_1:"", gallery_image_2:"", gallery_image_3:"", gallery_image_4:"",
        sort_order:eventsData.length + 1, featured:true, enabled:true,
        seo_title:"", seo_description:"", seo_keywords:"", og_image_url:"", canonical_url:""
      });
      renderLists();
    }

    async function uploadProjectImage(button) {
      const row = button.closest(".row-card");
      const file = row.querySelector(".project-image-file").files[0];
      if (!file) return;
      const url = await uploadToImagesBucket(file, "project");
      if (url) row.querySelector(".project-image-url").value = url;
    }

    async function uploadGalleryImage(button) {
      const row = button.closest(".row-card");
      const file = row.querySelector(".gallery-image-file").files[0];
      if (!file) return;
      const url = await uploadToImagesBucket(file, "gallery");
      if (url) row.querySelector(".gallery-image-url").value = url;
    }

    async function uploadEventImage(button, slot) {
      const row = button.closest(".row-card");
      let fileInput;
      let targetInput;
      if (slot === "cover") {
        fileInput = row.querySelector(".event-cover-file");
        targetInput = row.querySelector(".event-cover-url");
      } else {
        fileInput = row.querySelector(`.event-image-file-${slot}`);
        targetInput = row.querySelector(`.event-image-${slot}`);
      }
      const file = fileInput?.files?.[0];
      if (!file || !targetInput) return;
      const url = await uploadToImagesBucket(file, `event-${slot}`);
      if (url) targetInput.value = url;
    }

    async function uploadBlogCover() {
      const file = document.getElementById("blogCoverFile").files[0];
      if (!file) return;
      document.getElementById("blogStatus").textContent = "Uploading cover...";
      const url = await uploadToImagesBucket(file, "blog-cover");
      if (url) {
        document.getElementById("blogCoverUrl").value = url;
        document.getElementById("blogStatus").textContent = "Cover uploaded successfully";
      }
    }

    async function uploadBlogInner() {
      const file = document.getElementById("blogInnerFile").files[0];
      if (!file) return;
      document.getElementById("blogStatus").textContent = "Uploading article image...";
      const url = await uploadToImagesBucket(file, "blog-inner");
      if (url) {
        document.getElementById("blogInnerUrl").value = url;
        document.getElementById("blogStatus").textContent = "Article image uploaded successfully";
      }
    }

    function collectSocialRows() {
      const raw = [...document.querySelectorAll("#socialLinksAdminList .row-card")].map(row => ({
        platform: row.querySelector(".social-platform").value,
        label: row.querySelector(".social-label").value.trim(),
        url: row.querySelector(".social-url").value.trim(),
        sort_order: parseInt(row.querySelector(".social-order").value || "0", 10),
        enabled: row.querySelector(".social-enabled").value === "true"
      })).filter(item => item.label && item.url);

      const seen = new Set();
      return raw.filter(item => {
        const key = `${item.platform}||${item.url.trim().toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    function collectProjectRows() {
      return [...document.querySelectorAll("#projectsAdminList .row-card")].map(row => ({
        title: row.querySelector(".project-title").value.trim(),
        description: row.querySelector(".project-description").value.trim(),
        image_url: row.querySelector(".project-image-url").value.trim(),
        badge: row.querySelector(".project-badge").value.trim() || "PROJECT",
        hover_text: row.querySelector(".project-hover").value.trim(),
        sort_order: parseInt(row.querySelector(".project-order").value || "0", 10),
        featured: row.querySelector(".project-featured").value === "true",
        enabled: row.querySelector(".project-enabled").value === "true",
        seo_title: row.querySelector(".project-seo-title").value.trim(),
        seo_description: row.querySelector(".project-seo-description").value.trim(),
        seo_keywords: row.querySelector(".project-seo-keywords").value.trim(),
        og_image_url: row.querySelector(".project-og-image-url").value.trim(),
        canonical_url: row.querySelector(".project-canonical-url").value.trim()
      })).filter(item => item.title && item.image_url);
    }

    function collectGalleryRows() {
      return [...document.querySelectorAll("#galleryAdminList .row-card")].map(row => ({
        title: row.querySelector(".gallery-title").value.trim(),
        image_url: row.querySelector(".gallery-image-url").value.trim(),
        hover_text: row.querySelector(".gallery-hover").value.trim(),
        alt_text: row.querySelector(".gallery-alt-text").value.trim(),
        sort_order: parseInt(row.querySelector(".gallery-order").value || "0", 10),
        featured: row.querySelector(".gallery-featured").value === "true",
        enabled: row.querySelector(".gallery-enabled").value === "true",
        seo_title: row.querySelector(".gallery-seo-title").value.trim(),
        seo_description: row.querySelector(".gallery-seo-description").value.trim(),
        seo_keywords: row.querySelector(".gallery-seo-keywords").value.trim(),
        og_image_url: row.querySelector(".gallery-og-image-url").value.trim(),
        canonical_url: row.querySelector(".gallery-canonical-url").value.trim()
      })).filter(item => item.title && item.image_url);
    }

    function collectEventRows() {
      return [...document.querySelectorAll("#eventsAdminList .row-card")].map(row => {
        const title = row.querySelector(".event-title").value.trim();
        return {
          title,
          slug: (row.querySelector(".event-slug").value.trim() || slugify(title)),
          event_date: row.querySelector(".event-date").value,
          location: row.querySelector(".event-location").value.trim(),
          excerpt: row.querySelector(".event-excerpt").value.trim(),
          content_html: row.querySelector(".event-content").value.trim(),
          cover_image_url: row.querySelector(".event-cover-url").value.trim(),
          gallery_image_1: row.querySelector(".event-image-1").value.trim(),
          gallery_image_2: row.querySelector(".event-image-2").value.trim(),
          gallery_image_3: row.querySelector(".event-image-3").value.trim(),
          gallery_image_4: row.querySelector(".event-image-4").value.trim(),
          sort_order: parseInt(row.querySelector(".event-order").value || "0", 10),
          featured: row.querySelector(".event-featured").value === "true",
          enabled: row.querySelector(".event-enabled").value === "true",
          seo_title: row.querySelector(".event-seo-title").value.trim(),
          seo_description: row.querySelector(".event-seo-description").value.trim(),
          seo_keywords: row.querySelector(".event-seo-keywords").value.trim(),
          og_image_url: row.querySelector(".event-og-image-url").value.trim(),
          canonical_url: row.querySelector(".event-canonical-url").value.trim()
        };
      }).filter(item => item.title && item.cover_image_url);
    }

    function startNewArticle() {
      document.getElementById("blogPostId").value = "";
      document.getElementById("blogTitle").value = "";
      document.getElementById("blogSlug").value = "";
      document.getElementById("blogExcerpt").value = "";
      document.getElementById("blogCoverUrl").value = "";
      document.getElementById("blogInnerUrl").value = "";
      document.getElementById("blogSeoTitle").value = "";
      document.getElementById("blogSeoDescription").value = "";
      document.getElementById("blogSeoKeywords").value = "";
      document.getElementById("blogOgImageUrl").value = "";
      document.getElementById("blogCanonicalUrl").value = "";
      document.getElementById("blogSortOrder").value = "0";
      document.getElementById("blogPublished").value = "true";
      document.getElementById("blogFeatured").value = "true";
      document.getElementById("blogStatus").textContent = "";
      if (blogEditor) blogEditor.root.innerHTML = "";
    }

    function editBlogPost(id) {
      const item = blogPostsData.find(post => post.id === id);
      if (!item) return;

      document.getElementById("blogPostId").value = item.id;
      document.getElementById("blogTitle").value = item.title || "";
      document.getElementById("blogSlug").value = item.slug || "";
      document.getElementById("blogExcerpt").value = item.excerpt || "";
      document.getElementById("blogCoverUrl").value = item.cover_image_url || "";
      document.getElementById("blogInnerUrl").value = item.article_image_url || "";
      document.getElementById("blogSeoTitle").value = item.seo_title || "";
      document.getElementById("blogSeoDescription").value = item.seo_description || "";
      document.getElementById("blogSeoKeywords").value = item.seo_keywords || "";
      document.getElementById("blogOgImageUrl").value = item.og_image_url || "";
      document.getElementById("blogCanonicalUrl").value = item.canonical_url || "";
      document.getElementById("blogSortOrder").value = item.sort_order ?? 0;
      document.getElementById("blogPublished").value = String(item.published ?? true);
      document.getElementById("blogFeatured").value = String(item.featured ?? true);
      if (blogEditor) blogEditor.root.innerHTML = item.content_html || "";
      document.getElementById("blogStatus").textContent = "Editing article";
    }

    async function loadInboxMessages() {
      const client = getClient();
      if (!client) return;

      const { data, error } = await client.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) {
        document.getElementById("inboxAdminList").innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
        return;
      }

      inboxMessagesData = data || [];
      renderInboxMessages();
      renderDashboardMessages();
      loadDashboardStats();
    }

    async function toggleMessageRead(id, nextValue) {
      const client = getClient();
      if (!client) return;

      const { error } = await client.from("contact_messages").update({ is_read: nextValue }).eq("id", id);
      if (error) {
        alert(error.message);
        return;
      }

      await loadInboxMessages();
    }

    async function deleteMessage(id) {
      const client = getClient();
      if (!client) return;

      const confirmed = confirm("Delete this message?");
      if (!confirmed) return;

      const { error } = await client.from("contact_messages").delete().eq("id", id);
      if (error) {
        alert(error.message);
        return;
      }

      await loadInboxMessages();
    }

    async function deleteReadMessages() {
      const client = getClient();
      if (!client) return;

      const el = document.getElementById("deleteReadStatus");
      el.textContent = "Deleting read messages...";

      const confirmed = confirm("Delete all read messages?");
      if (!confirmed) {
        el.textContent = "";
        return;
      }

      const { error } = await client.from("contact_messages").delete().eq("is_read", true);
      if (error) {
        el.textContent = error.message;
        return;
      }

      el.textContent = "Read messages deleted successfully.";
      await loadInboxMessages();
    }

    async function deleteAllVisits() {
      const client = getClient();
      if (!client) return;

      const el = document.getElementById("visitsToolStatus");
      el.textContent = "Deleting visits...";

      const confirmed = confirm("Delete all visitor analytics?");
      if (!confirmed) {
        el.textContent = "";
        return;
      }

      const { error } = await client.from("site_visits").delete().gt("id", 0);
      if (error) {
        el.textContent = error.message;
        return;
      }

      el.textContent = "All visits deleted successfully.";
      visitsData = [];
      loadDashboardStats();
    }

    async function runStorageCleanup() {
      const btn = document.getElementById("cleanupStorageBtn");
      const status = document.getElementById("cleanupStatus");

      if (!btn) return;

      btn.disabled = true;
      btn.textContent = "Cleaning...";
      status.textContent = "Cleaning unused files...";

      try {
        const response = await fetch(CLEANUP_FUNCTION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });

        const data = await response.json();

        if (!response.ok || data.ok === false) {
          throw new Error(data.error || "Cleanup failed");
        }

        status.textContent = `Done. Deleted ${data.deleted_count || 0} unused file(s).`;
        alert(`Cleanup finished successfully. Deleted ${data.deleted_count || 0} unused file(s).`);
        await loadAllData();
      } catch (error) {
        console.error("Cleanup error:", error);
        status.textContent = error.message || "Cleanup failed";
        alert(error.message || "Cleanup failed");
      } finally {
        btn.disabled = false;
        btn.textContent = "Clean Unused Storage Files";
      }
    }

    function setFieldValue(id, value, fallback = "") {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = value ?? fallback;
    }

    async function loadDashboardStats() {
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);

      const projectsEnabled = projectsData.filter(item => item.enabled).length;
      const galleryEnabled = galleryData.filter(item => item.enabled).length;
      const articlesPublished = blogPostsData.filter(item => item.published).length;
      const messagesCount = inboxMessagesData.length;
      const unreadCount = inboxMessagesData.filter(item => !item.is_read).length;
      const totalVisits = visitsData.length;
      const todayVisits = visitsData.filter(item => new Date(item.created_at) >= todayStart).length;

      document.getElementById("dashProjects").textContent = String(projectsEnabled);
      document.getElementById("dashGallery").textContent = String(galleryEnabled);
      document.getElementById("dashArticles").textContent = String(articlesPublished);
      document.getElementById("dashMessages").textContent = String(messagesCount);
      document.getElementById("dashUnread").textContent = String(unreadCount);
      document.getElementById("dashVisits").textContent = String(totalVisits);
      document.getElementById("dashTodayVisits").textContent = String(todayVisits);
      document.getElementById("dashAssets").textContent = String(storageAssetsData.length);

      renderDashboardMessages();
    }

    async function loadAllData() {
      const client = getClient();
      if (!client) return;

      const { data: settings } = await client.from("site_settings").select("*").eq("id", 1).single();

      if (settings) {
        setFieldValue("heroTop", settings.hero_name_top, "Ahmed");
        setFieldValue("heroBottom", settings.hero_name_bottom, "Saad");
        setFieldValue("fontFamily", settings.font_family, "'Inter', system-ui, sans-serif");
        setFieldValue("profileImageUrl", settings.profile_image_url, "");
        setFieldValue("faviconUrl", settings.favicon_url, "");
        setFieldValue("aboutTitleInput", settings.about_title, "");
        setFieldValue("aboutText1Input", settings.about_text1, "");
        setFieldValue("aboutText2Input", settings.about_text2, "");
        setFieldValue("cvFileUrl", settings.cv_file_url, "");
        setFieldValue("cvFileName", settings.cv_file_name, "");

        setFieldValue("seoSiteTitle", settings.seo_site_title, "");
        setFieldValue("seoSiteDescription", settings.seo_site_description, "");
        setFieldValue("seoSiteKeywords", settings.seo_site_keywords, "");
        setFieldValue("seoOgImageUrl", settings.seo_og_image_url, "");
        setFieldValue("seoTwitterTitle", settings.seo_twitter_title, "");
        setFieldValue("seoTwitterDescription", settings.seo_twitter_description, "");
        setFieldValue("seoTwitterImageUrl", settings.seo_twitter_image_url, "");
        setFieldValue("seoIndexingEnabled", String(settings.seo_indexing_enabled ?? true), "true");
        setFieldValue("seoCanonicalBaseUrl", settings.seo_canonical_base_url, "");

        if (settings.profile_image_url) document.getElementById("previewImg").src = settings.profile_image_url;
        if (settings.favicon_url) document.getElementById("faviconPreview").src = settings.favicon_url;
      }

      const { data: links } = await client.from("social_links").select("*").order("sort_order", { ascending:true });
      const { data: projects } = await client.from("projects").select("*").order("sort_order", { ascending:true });
      const { data: gallery } = await client.from("gallery_items").select("*").order("sort_order", { ascending:true });
      const { data: events } = await client.from("events").select("*").order("sort_order", { ascending:true }).order("event_date", { ascending:false });
      const { data: siteTexts } = await client.from("site_texts").select("*").order("lang", { ascending:true }).order("text_key", { ascending:true });
      const { data: assets } = await client.from("storage_assets").select("*").order("created_at", { ascending:false });
      const { data: visits } = await client.from("site_visits").select("*").order("created_at", { ascending:false });
      const { data: cvDownloads } = await client.from("cv_downloads").select("*").order("created_at", { ascending:false });

      socialLinksData = links || [];
      projectsData = projects || [];
      galleryData = gallery || [];
      eventsData = events || [];
      siteTextsData = siteTexts || [];
      storageAssetsData = assets || [];
      visitsData = visits || [];
      cvDownloadsData = cvDownloads || [];

      const blogResponse = await client.from("blog_posts").select("*").order("sort_order", { ascending:true }).order("created_at", { ascending:false });
      blogPostsData = blogResponse.data || [];

      const inboxResponse = await client.from("contact_messages").select("*").order("created_at", { ascending:false });
      inboxMessagesData = inboxResponse.data || [];

      renderLists();
    }

    async function saveEverything() {
  const client = getClient();
  if (!client) return;

  const saveStatus = document.getElementById("saveStatus");
  saveStatus.textContent = "Saving...";

  const activeTabBtn = document.querySelector(".tab-btn.active");
  const activeTab = activeTabBtn ? activeTabBtn.dataset.tab : "";

  const settingsPayload = {
    id: 1,
    hero_name_top: document.getElementById("heroTop").value.trim(),
    hero_name_bottom: document.getElementById("heroBottom").value.trim(),
    font_family: document.getElementById("fontFamily").value.trim(),
    profile_image_url: document.getElementById("profileImageUrl").value.trim(),
    favicon_url: document.getElementById("faviconUrl").value.trim(),
    about_title: document.getElementById("aboutTitleInput").value.trim(),
    about_text1: document.getElementById("aboutText1Input").value.trim(),
    about_text2: document.getElementById("aboutText2Input").value.trim(),
    cv_file_url: document.getElementById("cvFileUrl").value.trim(),
    cv_file_name: document.getElementById("cvFileName").value.trim(),
    seo_site_title: document.getElementById("seoSiteTitle").value.trim(),
    seo_site_description: document.getElementById("seoSiteDescription").value.trim(),
    seo_site_keywords: document.getElementById("seoSiteKeywords").value.trim(),
    seo_og_image_url: document.getElementById("seoOgImageUrl").value.trim(),
    seo_twitter_title: document.getElementById("seoTwitterTitle").value.trim(),
    seo_twitter_description: document.getElementById("seoTwitterDescription").value.trim(),
    seo_twitter_image_url: document.getElementById("seoTwitterImageUrl").value.trim(),
    seo_indexing_enabled: document.getElementById("seoIndexingEnabled").value === "true",
    seo_canonical_base_url: document.getElementById("seoCanonicalBaseUrl").value.trim()
  };

  let result = await client.from("site_settings").upsert(settingsPayload);
  if (result.error) {
    saveStatus.textContent = result.error.message;
    return;
  }

  if (activeTab === "texts") {
    const textRows = collectTextsRows();
    const currentLang = getCurrentTextsLang();

    await client.from("site_texts").delete().eq("lang", currentLang);

    if (textRows.length) {
      result = await client.from("site_texts").insert(textRows);
      if (result.error) {
        saveStatus.textContent = result.error.message;
        return;
      }
    }
  }

  if (activeTab === "links") {
    await client.from("social_links").delete().gt("id", 0);

    const socialRows = collectSocialRows();
    if (socialRows.length) {
      result = await client.from("social_links").insert(socialRows);
      if (result.error) {
        saveStatus.textContent = result.error.message;
        return;
      }
    }
  }

  if (activeTab === "projects") {
    await client.from("projects").delete().gt("id", 0);

    const projectRows = collectProjectRows();
    if (projectRows.length) {
      result = await client.from("projects").insert(projectRows);
      if (result.error) {
        saveStatus.textContent = result.error.message;
        return;
      }
    }
  }

  if (activeTab === "gallery") {
    await client.from("gallery_items").delete().gt("id", 0);

    const galleryRows = collectGalleryRows();
    if (galleryRows.length) {
      result = await client.from("gallery_items").insert(galleryRows);
      if (result.error) {
        saveStatus.textContent = result.error.message;
        return;
      }
    }
  }

  if (activeTab === "events") {
    await client.from("events").delete().gt("id", 0);

    const eventRows = collectEventRows();
    if (eventRows.length) {
      result = await client.from("events").insert(eventRows);
      if (result.error) {
        saveStatus.textContent = result.error.message;
        return;
      }
    }
  }

  saveStatus.textContent = "Saved online successfully";
  await loadAllData();
}
    
    async function saveBlogPost() {
      const client = getClient();
      if (!client) return;

      const status = document.getElementById("blogStatus");
      const id = document.getElementById("blogPostId").value;
      const title = document.getElementById("blogTitle").value.trim();
      const slug = slugify(document.getElementById("blogSlug").value.trim() || title);
      const excerpt = document.getElementById("blogExcerpt").value.trim();
      const cover_image_url = document.getElementById("blogCoverUrl").value.trim();
      const article_image_url = document.getElementById("blogInnerUrl").value.trim();
      const seo_title = document.getElementById("blogSeoTitle").value.trim();
      const seo_description = document.getElementById("blogSeoDescription").value.trim();
      const seo_keywords = document.getElementById("blogSeoKeywords").value.trim();
      const og_image_url = document.getElementById("blogOgImageUrl").value.trim();
      const canonical_url = document.getElementById("blogCanonicalUrl").value.trim();
      const sort_order = parseInt(document.getElementById("blogSortOrder").value || "0", 10);
      const published = document.getElementById("blogPublished").value === "true";
      const featured = document.getElementById("blogFeatured").value === "true";
      const content_html = blogEditor ? blogEditor.root.innerHTML.trim() : "";

      if (!title || !slug || !content_html || content_html === "<p><br></p>") {
        status.textContent = "Title, slug, and content are required";
        return;
      }

      status.textContent = "Saving article...";

      const payload = {
        title,
        slug,
        excerpt,
        cover_image_url,
        article_image_url,
        seo_title,
        seo_description,
        seo_keywords,
        og_image_url,
        canonical_url,
        sort_order,
        published,
        featured,
        content_html
      };

      let result;
      if (id) {
        result = await client.from("blog_posts").update(payload).eq("id", id);
      } else {
        result = await client.from("blog_posts").insert(payload);
      }

      if (result.error) {
        status.textContent = result.error.message;
        return;
      }

      status.textContent = "Article saved successfully";
      await loadAllData();
      if (!id) startNewArticle();
    }

    async function deleteCurrentBlogPost() {
      const client = getClient();
      if (!client) return;

      const id = document.getElementById("blogPostId").value;
      const status = document.getElementById("blogStatus");

      if (!id) {
        status.textContent = "Open an article first";
        return;
      }

      status.textContent = "Deleting...";

      const { error } = await client.from("blog_posts").delete().eq("id", id);
      if (error) {
        status.textContent = error.message;
        return;
      }

      startNewArticle();
      status.textContent = "Article deleted";
      await loadAllData();
    }
  