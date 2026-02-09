// activity-reports.js
async function fetchActivityReports() {
  const res = await fetch('/api/activity-reports');
  const data = await res.json();
  if (!data.success) return [];
  return data.reports;
}

async function renderActivityReportsList() {
  const reports = await fetchActivityReports();
  const root = document.getElementById('carousel-root');
  if (!root) return;
  root.innerHTML = '';

  const categories = [
    { id: 'committee', label: '委員会活動' },
    { id: 'childcare', label: '子育て政策' },
    { id: 'reform', label: '京都府議会・定例会' },
    { id: 'topics', label: 'Topics' }
  ];
  
  const years = Array.from(new Set(reports.map(r => r.year))).sort((a, b) => b - a);
  const catButtons = document.getElementById('category-buttons');
  const yearButtons = document.getElementById('year-buttons');
  
  let activeCategory = 'all';
  let activeYear = 'all';

  function renderFilters() {
    if (!catButtons || !yearButtons) return;
    catButtons.innerHTML = `<button data-category="all" class="${activeCategory === 'all' ? 'is-active' : ''}">すべて</button>` +
      categories.map(cat => `<button data-category="${cat.id}" class="${activeCategory === cat.id ? 'is-active' : ''}">${cat.label}</button>`).join('');
    
    yearButtons.innerHTML = `<button data-year="all" class="${activeYear === 'all' ? 'is-active' : ''}">すべての年</button>` +
      years.map(y => `<button data-year="${y}" class="${activeYear == y ? 'is-active' : ''}">${y}年</button>`).join('');
  }

  function renderList() {
    root.innerHTML = '';
    let filtered = reports;
    if (activeCategory !== 'all') filtered = filtered.filter(r => r.category === activeCategory);
    if (activeYear !== 'all') filtered = filtered.filter(r => String(r.year) === String(activeYear));

    const grouped = {};
    filtered.forEach(r => {
      if (!grouped[r.year]) grouped[r.year] = [];
      grouped[r.year].push(r);
    });

    const displayYears = activeYear === 'all' ? years : [activeYear];

    displayYears.forEach(year => {
      if (!grouped[year] || grouped[year].length === 0) return;
      const section = document.createElement('section');
      section.className = 'pdf-year-section';
      section.innerHTML = `<h2 class="pdf-year-title">${year}年</h2>`;
      renderCarousel(grouped[year], section);
      root.appendChild(section);
    });
  }

  function renderCarousel(list, section) {
    list.sort((a, b) => {
      const ca = categories.findIndex(c => c.id === a.category);
      const cb = categories.findIndex(c => c.id === b.category);
      return ca - cb;
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'pdf-carousel-wrapper';
    
    const carousel = document.createElement('div');
    carousel.className = 'pdf-carousel';
    // 強調表示用のスタイルを直接付与
    carousel.style.overflow = 'hidden';
    carousel.style.position = 'relative';
    carousel.style.width = '100%';
    carousel.style.padding = '60px 0';

    const inner = document.createElement('div');
    inner.className = 'pdf-carousel-inner';
    inner.style.display = 'flex';
    inner.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    inner.style.alignItems = 'center';

    list.forEach((r) => {
      const div = document.createElement('div');
      div.className = 'pdf-item';
      // 強調表示用の初期スタイル
      div.style.flex = '0 0 300px';
      div.style.margin = '0 20px';
      div.style.transition = 'all 0.5s ease';
      div.style.opacity = '0.3';
      div.style.transform = 'scale(0.85)';

      div.innerHTML = `
        <div class="report-thumb">
          <img src="${(r.photos && r.photos[0]) ? r.photos[0] : ''}" alt="${r.title}" style="width:100%; height:200px; object-fit:cover;" onerror="this.src='https://placehold.jp/24/03709b/ffffff/300x200.png?text=No+Photo'">
        </div>
        <div class="pdf-item-meta">
          <span class="report-meta-year">${r.year}年</span> ／ <span class="report-meta-cat">${categories.find(c=>c.id===r.category)?.label || r.category}</span>
        </div>
        <h3 class="report-title">${r.title}</h3>
        <div class="pdf-actions">
          <a href="article.html?type=report&id=${r.id}" class="pdf-btn">詳しく見る</a>
        </div>
      `;
      inner.appendChild(div);
    });

    carousel.appendChild(inner);
    
    const prev = document.createElement('button');
    prev.className = 'carousel-nav carousel-prev';
    prev.innerHTML = '❮';
    
    const next = document.createElement('button');
    next.className = 'carousel-nav carousel-next';
    next.innerHTML = '❯';
    
    carousel.appendChild(prev);
    carousel.appendChild(next);
    wrapper.appendChild(carousel);
    section.appendChild(wrapper);

    let currentIndex = 0;
    const items = inner.querySelectorAll('.pdf-item');

    function update() {
      if (items.length === 0) return;
      
      const containerWidth = carousel.offsetWidth;
      const itemWidth = 300; // カード幅
      const step = 340;      // 300 + margin 40
      
      const centerOffset = (containerWidth / 2) - (itemWidth / 2);
      const moveX = (currentIndex * step) - centerOffset;
      
      inner.style.transform = `translateX(${-moveX}px)`;

      // 強調クラスの切り替え
      items.forEach((item, i) => {
        if (i === currentIndex) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1.1)';
          item.style.zIndex = '10';
          item.classList.add('center');
        } else {
          item.style.opacity = '0.3';
          item.style.transform = 'scale(0.85)';
          item.style.zIndex = '1';
          item.classList.remove('center');
        }
      });
    }

    prev.onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + items.length) % items.length; update(); };
    next.onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % items.length; update(); };

    window.addEventListener('resize', update);
    setTimeout(update, 100);
  }

  // イベント登録
  catButtons.onclick = e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    activeCategory = btn.dataset.category;
    activeYear = 'all';
    renderFilters();
    renderList();
  };

  yearButtons.onclick = e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    activeYear = btn.dataset.year;
    activeCategory = 'all';
    renderFilters();
    renderList();
  };

  renderFilters();
  renderList();
}

window.renderActivityReportsList = renderActivityReportsList;