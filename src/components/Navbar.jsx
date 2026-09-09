import { useEffect, useState } from 'react';
import { navItems, site } from '../data/content.js';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      // 当前区段高亮
      const sections = navItems.map((n) => document.getElementById(n.id));
      const offset = window.innerHeight * 0.4;
      let current = 'home';
      for (const s of sections) {
        if (!s) continue;
        const top = s.getBoundingClientRect().top;
        if (top - offset <= 0) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner container">
        <a className="nav__brand" href="#home" onClick={(e) => { e.preventDefault(); go('home'); }}>
          <span className="nav__brand-mark">W</span>
          <span className="nav__brand-text">{site.brand}</span>
        </a>

        <nav className="nav__menu" aria-label="主导航">
          {navItems.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`nav__link ${active === it.id ? 'is-active' : ''}`}
              onClick={(e) => { e.preventDefault(); go(it.id); }}
            >
              <span className="nav__link-en">{it.en}</span>
              <span className="nav__link-cn">{it.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="btn btn--sm" onClick={() => go('contact')}>
            <span>联系我</span>
            <span className="arrow" />
          </button>
          <button
            className="nav__burger"
            aria-label="菜单"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* 移动端展开面板 */}
      <div className="nav__panel">
        {navItems.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className="nav__panel-link"
            onClick={(e) => { e.preventDefault(); go(it.id); }}
          >
            <span>{it.label}</span>
            <em>{it.en}</em>
          </a>
        ))}
      </div>
    </header>
  );
}
