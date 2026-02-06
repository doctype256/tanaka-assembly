// 活動報告データをAPIから取得して表示する（policy.html/article.html用）
async function fetchActivityReports() {
  const res = await fetch('/api/activity-reports');
  const data = await res.json();
  if (!data.success) return [];
  return data.reports;
}

// policy.html用: 一覧表示
async function renderActivityReportsList() {
  const reports = await fetchActivityReports();
  const root = document.getElementById('carousel-root');
  if (!root) return;
  root.innerHTML = '';

  // static-texts.jsonのカテゴリ順・ラベルを再現
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
    catButtons.innerHTML = `<button data-category="all" class="${activeCategory === 'all' ? 'is-active' : ''}">すべて</button>` +
      categories.map(cat => `<button data-category="${cat.id}" class="${activeCategory === cat.id ? 'is-active' : ''}">${cat.label}</button>`).join('');
    yearButtons.innerHTML = `<button data-year="all" class="${activeYear === 'all' ? 'is-active' : ''}">すべての年</button>` +
      years.map(y => `<button data-year="${y}" class="${activeYear == y ? 'is-active' : ''}">${y}年</button>`).join('');
  }

  // 年ごとにカルーセルを分けて表示
  function renderList() {
    root.innerHTML = '';
    let filtered = reports;
    if (activeCategory !== 'all') filtered = filtered.filter(r => r.category === activeCategory);
    if (activeYear !== 'all') filtered = filtered.filter(r => String(r.year) === String(activeYear));
    // 年降順でグループ化
    const grouped = {};
    filtered.forEach(r => {
      if (!grouped[r.year]) grouped[r.year] = [];
      grouped[r.year].push(r);
    });
    years.forEach(year => {
      if (!grouped[year] || grouped[year].length === 0) return;
      const section = document.createElement('section');
      section.className = 'pdf-year-section';
      section.innerHTML = `<h2 class="pdf-year-title">${year}年</h2>`;
      renderCarousel(grouped[year], section);
      root.appendChild(section);
    });
  }

  // カルーセル: カテゴリ順で並べる
  function renderCarousel(list, section) {
    // カテゴリ順で並べ替え
    list.sort((a, b) => {
      const ca = categories.findIndex(c => c.id === a.category);
      const cb = categories.findIndex(c => c.id === b.category);
      return ca - cb;
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'pdf-carousel-wrapper';
    const carousel = document.createElement('div');
    carousel.className = 'pdf-carousel';
    const inner = document.createElement('div');
    inner.className = 'pdf-carousel-inner';

    list.forEach((r, idx) => {
      const div = document.createElement('div');
      div.className = 'pdf-item';
      div.innerHTML = `
        <div class="report-thumb">
          <img src="${(r.photos && r.photos[0]) ? r.photos[0] : ''}" alt="${r.title}" onerror="this.src='https://placehold.jp/24/03709b/ffffff/300x200.png?text=No+Photo'">
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
    // ナビボタン
    const prev = document.createElement('button');
    prev.className = 'carousel-nav carousel-prev';
    prev.innerHTML = '<span aria-label="前へ">&lt;</span>';
    const next = document.createElement('button');
    next.className = 'carousel-nav carousel-next';
    next.innerHTML = '<span aria-label="次へ">&gt;</span>';
    carousel.appendChild(prev);
    carousel.appendChild(next);
    wrapper.appendChild(carousel);
    section.appendChild(wrapper);

    let currentIndex = 0;
    const itemWidth = 340; // アイテムの幅

    // アイテムの表示位置を更新する
    function update() {
      const offset = -(currentIndex * itemWidth); // 現在のアイテムの位置を計算
      inner.style.transform = `translateX(${offset}px)`; // アイテムをスライド
    }

    // 前へボタン
    prev.onclick = () => {
      currentIndex = (currentIndex - 1 + list.length) % list.length;
      update();
    };

    // 次へボタン
    next.onclick = () => {
      currentIndex = (currentIndex + 1) % list.length;
      update();
    };

    // 初期状態で表示
    update();
  }

  // ボタン要素は再描画ごとに再取得（初回のみ登録）
  document.getElementById('category-buttons').onclick = e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    activeCategory = btn.dataset.category;
    renderFilters();
    renderList();
  };

  document.getElementById('year-buttons').onclick = e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    activeYear = btn.dataset.year;
    renderFilters();
    renderList();
  };

  renderFilters();
  renderList();
}

window.renderActivityReportsList = renderActivityReportsList;
