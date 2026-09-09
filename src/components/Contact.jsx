import { useEffect, useRef } from 'react';
import { site } from '../data/content.js';
import BorderGlow from './BorderGlow.jsx';
import { gsap, reducedMotion, EASE } from '../lib/motion.js';
import './Contact.css';

export default function Contact() {
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // eyebrow 横向揭开
      const eyebrow = section.querySelector('.section-eyebrow');
      if (eyebrow) {
        gsap.from(eyebrow, { clipPath: 'inset(0 0 0 100%)', autoAlpha: 0, duration: 0.9, ease: EASE.settle,
          scrollTrigger: { trigger: eyebrow, start: 'top 88%', toggleActions: 'play none none none' } });
      }

      // 大标题：自下掩码揭开（大幅、慢）
      const title = section.querySelector('.contact__title');
      if (title) {
        gsap.from(title, {
          clipPath: 'inset(100% 0 0 0)', y: 60, autoAlpha: 0, duration: 1.5, ease: EASE.out,
          scrollTrigger: { trigger: title, start: 'top 84%', toggleActions: 'play none none none' },
        });
        // 英文副标题独立错开
        const en = section.querySelector('.contact__title-en');
        if (en) {
          gsap.from(en, { y: 26, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 0.4,
            scrollTrigger: { trigger: title, start: 'top 84%', toggleActions: 'play none none none' } });
        }
      }

      // 简介
      const sub = section.querySelector('.contact__sub');
      if (sub) {
        gsap.from(sub, { y: 30, autoAlpha: 0, duration: 1.0, ease: EASE.soft,
          scrollTrigger: { trigger: sub, start: 'top 86%', toggleActions: 'play none none none' } });
      }

      // 下载面板整块上浮
      const dl = section.querySelector('.contact-download');
      if (dl) {
        gsap.from(dl, {
          y: 70, autoAlpha: 0, duration: 1.05, ease: EASE.out,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: dl, start: 'top 88%', toggleActions: 'play none none none' },
        });
      }

      // CTA + footer 收敛
      const cta = section.querySelector('.contact__cta');
      if (cta) {
        gsap.from(cta.querySelectorAll('.btn'), { y: 24, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: cta, start: 'top 92%', toggleActions: 'play none none none' } });
      }
      const footer = section.querySelector('.contact__footer');
      if (footer) {
        gsap.from(footer, { autoAlpha: 0, duration: 1.0,
          scrollTrigger: { trigger: footer, start: 'top 96%', toggleActions: 'play none none none' } });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="contact" ref={ref}>
      <div className="contact__bg" aria-hidden="true">
        <div className="contact__bg-glow" />
        <div className="contact__bg-grid" />
      </div>

      <div className="container contact__inner">
        <div className="contact__head reveal">
          <span className="section-eyebrow">05 / PORTFOLIO</span>
          <h2 className="contact__title">
            <span>部分视频打包作品集</span>
            <span className="contact__title-en">点击下方即可查看</span>
          </h2>
        </div>

        {/* 作品集下载 · 单一入口（百度网盘） */}
        <BorderGlow
          className="contact-download"
          borderRadius={16}
          glowRadius={120}
          glowIntensity={1}
          coneSpread={32}
          edgeSensitivity={34}
          colors={['#7df3ff', '#e7d9b8', '#7df3ff']}
        >
          <a
            className="contact__download"
            href={site.portfolio.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="打开作品集（百度网盘）"
          >
            <span className="contact__download-ico" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="contact__download-main">
              <span className="contact__download-label">作品集 · 百度网盘</span>
              <span className="contact__download-title">下载 / 查看我的全部作品</span>
              <span className="contact__download-meta">提取码：{site.portfolio.pwd}</span>
            </span>
            <span className="contact__download-arrow" aria-hidden="true">↗</span>
          </a>
        </BorderGlow>

        <div className="contact__tel reveal">
          <span className="contact__tel-label">联系电话</span>
          <a className="contact__tel-num" href={`tel:${site.phone}`}>
            <span className="contact__tel-icon" aria-hidden="true">☎</span>
            191 2792 1737
          </a>
        </div>

        <div className="contact__cta reveal">
          <a className="btn btn-primary btn--lg" href={`mailto:${site.email}`}>
            <span>发送邮件</span>
            <span className="arrow" />
          </a>
          <a className="btn btn--lg" href={`tel:${site.phone}`}>
            <span>拨打电话</span>
            <span className="arrow" />
          </a>
        </div>

        <footer className="contact__footer reveal">
          <div className="contact__footer-left">
            <span>© 2026 {site.name}</span>
            <span className="contact__footer-dot" />
            <span>All rights reserved.</span>
          </div>
          <div className="contact__footer-right">
            <span>Designed &amp; Built by {site.name}</span>
            <span className="contact__footer-dot" />
            <span>React + Vite</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
