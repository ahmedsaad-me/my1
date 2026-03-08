const translations = {
  en: {
    navAbout:"About", navWork:"Work", navGallery:"Gallery", navContact:"Contact",
    eyebrow:"Electrical & Electronics Engineering Student",
    heroSubtitle:"A dark, smooth, premium portfolio blending engineering, creativity, photography, and future-focused project management.",
    btnWork:"View Work", btnConnect:"Let's Connect",
    statLang:"Languages", statPlatforms:"Platforms", statDrive:"Creative Drive",
    aboutMini:"About Me",
    aboutTitle:"A focused engineering student building a strong technical future.",
    aboutText1:"I am Ahmed Saad, an Electrical & Electronics Engineering student based in Bartın, Turkey. I am interested in power systems, electronics, renewable energy, and building a career that combines technical depth with project management.",
    aboutText2:"I enjoy learning, improving continuously, and presenting my work in a clean and professional way. This portfolio is a modern home for my identity, links, gallery, and future projects.",
    workMini:"Selected Work", workTitle:"A collection of premium project cards.",
    galleryMini:"Gallery", galleryTitle:"Photography mood with premium presentation.",
    linksMini:"Platforms", linksTitle:"All your important links in one place.",
    contactMini:"Contact", contactTitle:"Let’s build something extraordinary.",
    contactText:"Currently accepting new ideas, collaborations, and premium creative opportunities.",
    sendBtn:"Send Message"
  },
  ar: {
    navAbout:"من أنا", navWork:"الأعمال", navGallery:"المعرض", navContact:"تواصل",
    eyebrow:"طالب هندسة كهربائية وإلكترونيات",
    heroSubtitle:"موقع شخصي أسود، ناعم، وفاخر يجمع بين الهندسة والإبداع والتصوير وإدارة المشاريع المستقبلية.",
    btnWork:"شاهد الأعمال", btnConnect:"تواصل معي",
    statLang:"لغات", statPlatforms:"منصات", statDrive:"شغف إبداعي",
    aboutMini:"نبذة عني",
    aboutTitle:"طالب هندسة طموح يبني مستقبلًا تقنيًا قويًا.",
    aboutText1:"أنا أحمد سعد، طالب هندسة كهربائية وإلكترونيات في بارتن - تركيا. أهتم بأنظمة القوى والإلكترونيات والطاقة المتجددة وبناء مسار مهني يجمع بين العمق التقني وإدارة المشاريع.",
    aboutText2:"أحب التعلم والتطور المستمر وتقديم أعمالي بشكل نظيف واحترافي. هذا الموقع مساحة حديثة لهويتي وروابطي ومعرضي ومشاريعي القادمة.",
    workMini:"الأعمال المختارة", workTitle:"مجموعة أعمال بتقديم فاخر وحديث.",
    galleryMini:"المعرض", galleryTitle:"قسم صور بإحساس بصري احترافي.",
    linksMini:"المنصات", linksTitle:"كل روابطك المهمة في مكان واحد.",
    contactMini:"تواصل", contactTitle:"دعنا نبني شيئًا استثنائيًا.",
    contactText:"أرحب بالأفكار الجديدة والتعاونات والفرص الإبداعية المميزة.",
    sendBtn:"إرسال"
  },
  tr: {
    navAbout:"Hakkımda", navWork:"Projeler", navGallery:"Galeri", navContact:"İletişim",
    eyebrow:"Elektrik ve Elektronik Mühendisliği Öğrencisi",
    heroSubtitle:"Mühendislik, yaratıcılık, fotoğrafçılık ve gelecek odaklı proje yönetimini birleştiren koyu, akıcı ve premium bir portfolyo.",
    btnWork:"Projeleri Gör", btnConnect:"İletişime Geç",
    statLang:"Dil", statPlatforms:"Platform", statDrive:"Yaratıcı Enerji",
    aboutMini:"Hakkımda",
    aboutTitle:"Güçlü bir teknik gelecek inşa eden odaklı bir mühendislik öğrencisi.",
    aboutText1:"Ben Ahmed Saad. Bartın, Türkiye'de yaşayan Elektrik ve Elektronik Mühendisliği öğrencisiyim. Güç sistemleri, elektronik, yenilenebilir enerji ve proje yönetimiyle birleşen teknik bir kariyerle ilgileniyorum.",
    aboutText2:"Öğrenmeyi, sürekli gelişmeyi ve çalışmalarımı temiz ve profesyonel bir şekilde sunmayı seviyorum. Bu portfolyo kimliğim, bağlantılarım, galerim ve gelecekteki projelerim için modern bir alan.",
    workMini:"Seçili Çalışmalar", workTitle:"Premium proje kartlarından oluşan bir koleksiyon.",
    galleryMini:"Galeri", galleryTitle:"Premium sunumla fotoğraf ruhu.",
    linksMini:"Platformlar", linksTitle:"Tüm önemli bağlantıların tek yerde.",
    contactMini:"İletişim", contactTitle:"Birlikte olağanüstü bir şey yapalım.",
    contactText:"Yeni fikirler, iş birlikleri ve premium yaratıcı fırsatlara açığım.",
    sendBtn:"Mesaj Gönder"
  }
};

function applyLang(lang){
  document.body.dataset.lang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.dataset.i18n;
    if(translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
  });
  localStorage.setItem('site_lang', lang);
}

document.querySelectorAll('[data-lang]').forEach(btn=>{
  btn.addEventListener('click', ()=>applyLang(btn.dataset.lang));
});

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('.tilt-card').forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - .5) * -7;
    const ry = ((x / r.width) - .5) * 9;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', ()=> card.style.transform = '');
});

// optional online content apply
async function loadRemoteContent(){
  if(!window.SITE_CONFIG || !window.supabase) return;
  try{
    const client = window.supabase.createClient(SITE_CONFIG.supabaseUrl, SITE_CONFIG.supabaseAnonKey);
    const { data } = await client.from('site_settings').select('*').eq('id',1).single();
    if(data){
      if(data.hero_name_top) document.getElementById('heroNameTop').textContent = data.hero_name_top;
      if(data.hero_name_bottom) document.getElementById('heroNameBottom').textContent = data.hero_name_bottom;
      if(data.profile_image_url) document.getElementById('profileImage').src = data.profile_image_url;
      if(data.bg_color) document.documentElement.style.setProperty('--bg', data.bg_color);
      if(data.font_family) document.documentElement.style.setProperty('--font-main', data.font_family);
    }
  }catch(e){ console.log('Remote content optional:', e.message); }
}

applyLang(localStorage.getItem('site_lang') || 'en');
loadRemoteContent();
