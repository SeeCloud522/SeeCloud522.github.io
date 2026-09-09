import { useEffect, useRef } from 'react';
import { site } from '../data/content.js';
import { gsap, reducedMotion } from '../lib/motion.js';
import './Hero.css';

export default function Hero() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const loaderRef = useRef(null);

  // 粒子背景：视频不可用时的降级动效
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      particles.length = 0;
      const count = Math.min(70, Math.floor((w * h) / 22000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.14,
          vy: (Math.random() - 0.5) * 0.14,
          r: Math.random() * 1.3 + 0.3,
          a: Math.random() * 0.45 + 0.15,
        });
      }
    };

    let t = 0;
    const tick = () => {
      t += 0.004;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(125, 243, 255, 0.05)';
      const step = 56;
      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 243, 255, ${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 130 * 130) {
            const alpha = (1 - d2 / (130 * 130)) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(125, 243, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    init();
    tick();
    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  // 完整 Opening Animation
  useEffect(() => {
    const root = rootRef.current;
    const loader = loaderRef.current;
    if (!root) return;

    // 优先尊重系统降级动效设置
    if (reducedMotion) {
      if (loader) loader.style.display = 'none';
      return;
    }

    const chars = root.querySelectorAll('.char');
    const ctx = gsap.context(() => {
      // 先让将要"入场"的 Hero 内容处于隐藏态（loader 覆盖时不可见）
      gsap.set(['.hero__eyebrow', '.hero__copy', '.hero__actions .btn',
        '.hero__rail > span', '.hero__topline', '.hero__meta', '.hero__meta-item'], { autoAlpha: 0 });
      gsap.set(chars, { autoAlpha: 0, yPercent: 122, rotate: 0.001 });

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          if (loader) loader.classList.add('is-done');
        },
      });

      // 0) loader 内 brand 先行进场（微微上浮 + 淡入）
      const loaderInner = loader ? loader.querySelector('.loader__inner') : null;
      if (loaderInner) {
        tl.fromTo(loaderInner, { autoAlpha: 0, y: 16, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' }, 0.05);
      }

      // 1) loader 掀开（上移），揭幕露出 Hero
      if (loader) {
        tl.to(loader, { yPercent: -102, autoAlpha: 0, duration: 1.0, ease: 'power4.inOut' }, 0.62);
      }

      // 2) 主标题逐字掩码式升入（节奏慢、错落）；角色行内逐字上升
      tl.to(chars, { yPercent: 0, autoAlpha: 1, stagger: 0.05, duration: 1.5, ease: 'expo.out' }, 0.85);

      // 标题整体"压缩后归位"：轻微 scaleX 脉冲制造收束感
      const rows = root.querySelectorAll('.hero__title-row');
      tl.fromTo(rows, { scale: 1.045, scaleY: 0.92, transformOrigin: '50% 50%' },
        { scale: 1, scaleY: 1, duration: 1.15, ease: 'expo.out' }, 0.95);

      // 3) 眉题 / 描述 / CTA 依次进场
      tl.fromTo('.hero__eyebrow', { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.85 }, 1.45);
      tl.fromTo('.hero__copy', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.0 }, 1.7);
      tl.fromTo('.hero__actions .btn', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.1 }, 1.95);

      // 4) 右侧立标 + 顶部信息行
      tl.fromTo('.hero__rail > span', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08 }, 1.8);
      tl.fromTo('.hero__topline', { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 1.3);

      // 5) 底部 meta 信息带：整块从底部抬升 + 逐项
      tl.fromTo('.hero__meta', { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, duration: 1.05 }, 2.25);
      tl.fromTo('.hero__meta-item', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.07 }, 2.42);
    }, root);

    // 兜底：即便动画异常也要确保 loader 不遮住页面
    const failsafe = window.setTimeout(() => {
      if (loader) loader.classList.add('is-done');
    }, reducedMotion ? 0 : 6000);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
      if (loader) loader.classList.remove('is-done');
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // 把标题拆成逐字 span（用于入场动画）
  const renderChars = (text) =>
    Array.from(text).map((ch, i) => (
      <span key={i} className="char" aria-hidden={ch === ' ' ? undefined : 'true'}>
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ));

  return (
    <section id="home" className="hero" ref={rootRef}>
      {/* 完整 Opening 预加载屏障 */}
      <div className="hero__loader" ref={loaderRef} aria-hidden="true">
        <div className="loader__inner">
          <span className="loader__mark">W</span>
          <span className="loader__name">{site.name}</span>
          <span className="loader__sub">{site.nameEn}</span>
        </div>
      </div>

      {/* 视频背景（可选）：/hero.mp4 存在时接管 */}
      <video className="hero__video" autoPlay muted loop playsInline>
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* 粒子降级动效 */}
      <canvas ref={canvasRef} className="hero__particles" aria-hidden="true" />

      {/* 遮罩（只用于让内容可读） */}
      <div className="hero__veil" aria-hidden="true" />

      {/* 顶部信息行 */}
      <div className="hero__topline container">
        <span className="hero__dot" />
        <span className="hero__topline-text">AVAILABLE FOR 2026 · NEW MEDIA / SHORT-VIDEO</span>
      </div>

      <div className="hero__content container">
        {/* 左：眉题 + 巨型标题 + 描述 + CTA */}
        <div className="hero__main">
          <p className="hero__eyebrow">我是 {site.name} · {site.roleEn}</p>

          <h1 className="hero__title">
            <span className="hero__title-row hero__title-row--name" aria-label={site.name}>
              {renderChars(site.name)}
            </span>
            <span className="hero__title-row hero__title-row--role" aria-hidden="true">
              {renderChars(site.role)}
            </span>
          </h1>

          <p className="hero__copy">
            {site.role}。从选题、脚本、拍摄到剪辑与复盘，专注把内容与节奏做成可衡量的增长——
            <em>三年</em>专业剪辑经验，<em>二年</em>拍摄经验，<em>半年</em>运营经验。
          </p>

          <div className="hero__actions">
            <button className="btn btn-primary" onClick={() => scrollTo('projects')}>
              <span>查看作品</span><span className="arrow" />
            </button>
            <button className="btn" onClick={() => scrollTo('contact')}>
              <span>联系合作</span><span className="arrow" />
            </button>
          </div>
        </div>

        {/* 右：侧立标签（呼应身份） */}
        <div className="hero__rail" aria-hidden="true">
          <span>DOUYIN · XHS · WECHAT</span>
          <span className="hero__rail-line" />
        </div>
      </div>

      {/* 底部信息带 */}
      <div className="hero__meta container">
        <div className="hero__meta-item">
          <span className="hero__meta-k">数据</span>
          <strong className="hero__meta-v">40,000+ 获赞</strong>
        </div>
        <div className="hero__meta-item">
          <span className="hero__meta-k">增长</span>
          <strong className="hero__meta-v">8,000+ 粉丝 / 1 月</strong>
        </div>
        <div className="hero__meta-item">
          <span className="hero__meta-k">定位</span>
          <strong className="hero__meta-v">短视频 / 新媒体运营</strong>
        </div>
        <div className="hero__meta-item">
          <span className="hero__meta-k">BASE</span>
          <strong className="hero__meta-v">{site.location}</strong>
        </div>
      </div>
    </section>
  );
}
