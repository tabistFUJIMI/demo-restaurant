// メインJS: スクロールアニメーション、ヘッダー制御、動的コンテンツ
document.addEventListener('DOMContentLoaded', async () => {
  // --- Store Init (JSON fetch) ---
  const inits = [];
  if (typeof NewsStore !== 'undefined' && NewsStore.init) inits.push(NewsStore.init());
  if (typeof MenuStore !== 'undefined' && MenuStore.init) inits.push(MenuStore.init());
  await Promise.all(inits);

  // --- Scroll Header ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Mobile Menu ---
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        nav.classList.remove('is-open');
      });
    });
  }

  // --- Scroll Reveal ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // --- Re-observe helper ---
  function reobserve(container) {
    container.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  }

  // --- Dynamic News (Top page) ---
  const newsList = document.getElementById('news-list');
  if (newsList && typeof NewsStore !== 'undefined') {
    const news = NewsStore.getPublished().slice(0, 5);
    newsList.innerHTML = news.map(n => {
      const date = new Date(n.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
      const tagClass = n.category === '季節メニュー' ? 'tag-season' : n.category === '臨時休業' ? 'tag-closed' : 'tag-info';
      return `<li>
        <a href="news.html?id=${n.id}">
          <span class="news-date">${date}</span>
          <span class="news-tag ${tagClass}">${n.category}</span>
          <span class="news-text">${n.title}</span>
        </a>
      </li>`;
    }).join('');
  }

  // --- Dynamic Menu Preview (Top page: 3件) ---
  const menuPreview = document.getElementById('menu-preview');
  if (menuPreview && typeof MenuStore !== 'undefined') {
    const menus = MenuStore.getPublished().slice(0, 3);
    menuPreview.innerHTML = menus.map(m => `
      <div class="menu-card reveal">
        <div class="menu-card-img">
          <img src="${m.image}" alt="${m.name}" loading="lazy">
        </div>
        <div class="menu-card-body">
          <h4>${m.name}</h4>
          <p class="menu-card-desc">${m.description}</p>
          <p class="menu-card-price">&yen;${m.price.toLocaleString()}</p>
        </div>
      </div>
    `).join('');
    reobserve(menuPreview);
  }
});
