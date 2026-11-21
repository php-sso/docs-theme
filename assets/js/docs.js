/* php-sso docs: search, copy buttons and the "on this page" highlight. No libraries, no network requests to other sites. */
(() => {
  'use strict';

  // A bar with the language and a copy button on each code block.
  document.querySelectorAll('.code').forEach((box) => {
    const pre = box.querySelector('pre');
    if (!pre) return;
    const bar = document.createElement('div');
    bar.className = 'code-bar';
    const lang = document.createElement('span');
    lang.textContent = box.dataset.lang || '';
    bar.append(lang);
    if (navigator.clipboard) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy';
      btn.textContent = 'Copy';
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ''));
          btn.textContent = 'Copied';
        } catch (e) {
          btn.textContent = 'Press Ctrl+C';
        }
        setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
      });
      bar.append(btn);
    }
    box.prepend(bar);
  });

  // Highlight the heading you are reading in "On this page".
  const toc = document.querySelector('.toc');
  if (toc && 'IntersectionObserver' in window) {
    const links = new Map([...toc.querySelectorAll('a[href^="#"]')].map((a) => [decodeURIComponent(a.getAttribute('href').slice(1)), a]));
    const seen = new Set();
    const pick = () => {
      const first = [...links.keys()].find((id) => seen.has(id));
      links.forEach((a, id) => a.classList.toggle('active', id === first));
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id)));
      pick();
    }, { rootMargin: '0px 0px -70% 0px' });
    links.forEach((_, id) => { const h = document.getElementById(id); if (h) io.observe(h); });
  }

  // Search over index.json, loaded the first time you use it.
  const box = document.querySelector('.search');
  if (!box) return;
  const input = box.querySelector('input');
  const list = box.querySelector('.search-results');
  let index = null;
  let loading = null;
  let active = -1;

  const load = () => loading || (loading = fetch(box.dataset.index).then((r) => r.json()).then((d) => { index = d; }).catch(() => { index = []; }));
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const run = (q) => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return index.map((p) => {
      const t = p.title.toLowerCase();
      const x = p.text.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (t.includes(w)) score += 10; else if (x.includes(w)) score += 1; else return null;
      }
      return { p, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 8).map((r) => r.p);
  };

  const snippet = (text, words) => {
    const low = text.toLowerCase();
    const at = Math.max(0, Math.min(...words.map((w) => low.indexOf(w)).filter((i) => i >= 0)) - 40);
    let s = esc(text.slice(at, at + 130));
    words.forEach((w) => { s = s.replace(new RegExp(rx(esc(w)), 'ig'), (m) => `<mark>${m}</mark>`); });
    return (at > 0 ? '…' : '') + s + '…';
  };

  const show = (items, q) => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    active = -1;
    list.innerHTML = items.length
      ? items.map((p) => `<li role="option"><a href="${esc(p.url)}"><b>${esc(p.title)}</b><small>${snippet(p.text, words)}</small></a></li>`).join('')
      : '<li class="none">Nothing found.</li>';
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };
  const hide = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); };
  const move = (d) => {
    const links = [...list.querySelectorAll('a')];
    if (!links.length) return;
    active = (active + d + links.length) % links.length;
    links.forEach((a, i) => a.setAttribute('aria-selected', String(i === active)));
    links[active].scrollIntoView({ block: 'nearest' });
  };

  input.addEventListener('focus', load);
  input.addEventListener('input', async () => {
    const q = input.value.trim();
    if (!q) { hide(); return; }
    await load();
    show(run(q), q);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { const a = list.querySelectorAll('a')[Math.max(active, 0)]; if (a && !list.hidden) { e.preventDefault(); location.href = a.href; } }
    else if (e.key === 'Escape') { hide(); input.blur(); }
  });
  document.addEventListener('click', (e) => { if (!box.contains(e.target)) hide(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });
})();
