fetch('data/static-texts.json')
  .then(res => res.json())
  .then(data => {

    /* ===== header name ===== */
    const headerName = document.getElementById('header-name');
    if (headerName && data.profile?.name) {
      headerName.textContent = data.profile.name;
    }

    /* ===== header nav ===== */
    const headerNav = document.getElementById('header-nav');
    if (headerNav && data.navigation) {
      headerNav.innerHTML = '';

      data.navigation.forEach(n => {
        const a = document.createElement('a');
        a.href = n.href.startsWith('#')
          ? 'index.html' + n.href
          : n.href;
        a.textContent = n.text;
        headerNav.appendChild(a);
      });
    }

    /* ===== overlay 作成（誤タップ防止）===== */
    let overlay = document.getElementById('menu-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'menu-overlay';
      document.body.appendChild(overlay);
    }

    /* ===== hamburger control ===== */
    const toggle = document.getElementById('menu-toggle');
    if (toggle && headerNav) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation(); // 外クリック扱いにしない
        headerNav.classList.toggle('open');
        overlay.classList.toggle('active');
      });
    }

    /* ===== header内クリックでは閉じない ===== */
    const header = document.querySelector('header');
    if (header) {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    /* ===== overlayクリックで閉じる ===== */
    overlay.addEventListener('click', () => {
      headerNav.classList.remove('open');
      overlay.classList.remove('active');
    });

    /* ===== ナビリンクを押したら閉じる ===== */
    headerNav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        headerNav.classList.remove('open');
        overlay.classList.remove('active');
      }
    });

  })
  .catch(err => console.error('header.js error:', err));
