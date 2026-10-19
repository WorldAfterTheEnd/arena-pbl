/* =====================================================================
   ARENA - shell.js
   Membangun sidebar + header otomatis sesuai role yang login, dan
   mengatur pergantian menu (section [data-view]) tanpa reload halaman.
   Pemakaian di halaman:  Shell.mount({ title: 'Dashboard' })
   ===================================================================== */
(function (global) {
  'use strict';

  function mount({ title }) {
    const user = Auth.current();
    const meta = user.roleMeta;

    // Teks di bawah judul, mengikuti mockup: "Masuk sebagai Mahasiswa" / "Masuk sebagai Approver - Tahap : Presiden BEM"
    const sub = meta.tahap
      ? `Masuk sebagai Approver - <span class="tahap">Tahap</span> : <b>${meta.label}</b>`
      : `Masuk sebagai ${meta.sub}`;

    const menu = meta.menu.map((m, i) =>
      `<button class="menu-item ${i === 0 ? 'active' : ''}" data-menu="${m.key}">${m.label}</button>`).join('');

    // Approver punya tautan "Bantuan"; semua role punya "Keluar"
    const help = meta.tahap ? '<button class="help">Bantuan</button>' : '';

    const shell = document.getElementById('app');
    const content = shell.innerHTML;            // simpan konten halaman (section-section view)
    shell.className = 'app';
    shell.innerHTML = `
      <aside class="sidebar">
        <div class="brand"><div class="brand-logo">A</div>ARENA</div>
        ${menu}
        <div class="sidebar-foot">${help}<button class="logout" id="btn-logout">Keluar</button></div>
      </aside>
      <main class="main">
        <h1 class="page-title" id="page-title">${title}</h1>
        <div class="page-sub">${sub}</div>
        ${content}
      </main>`;

    // Ganti section saat menu diklik
    const views = shell.querySelectorAll('.view');
    function show(key) {
      shell.querySelectorAll('.menu-item').forEach(b => b.classList.toggle('active', b.dataset.menu === key));
      views.forEach(v => v.classList.toggle('active', v.dataset.view === key));
      document.dispatchEvent(new CustomEvent('arena:view', { detail: key }));   // hook untuk JS halaman
    }
    shell.querySelectorAll('.menu-item').forEach(b => b.onclick = () => show(b.dataset.menu));
    show(meta.menu[0].key);

    document.getElementById('btn-logout').onclick = () => { Auth.logout(); window.location.href = '../login.html'; };
    return { user, show };
  }

  global.Shell = { mount };
})(window);
