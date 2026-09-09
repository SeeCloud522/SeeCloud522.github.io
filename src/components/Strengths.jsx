import { useEffect, useRef } from 'react';
import { strengths } from '../data/content.js';
import BorderGlow from './BorderGlow.jsx';
import { gsap, initMaskRise, revealHead, reducedMotion } from '../lib/motion.js';
import './Strengths.css';

export default function Strengths() {
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      initMaskRise(section);
      revealHead(section);

      const grid = section.querySelector('.strengths__grid');
      const cards = section.querySelectorAll('.strength');
      if (!grid || !cards.length) return;

      // 网格进入时，卡片逐张上浮（含编号先出的错落感）
      gsap.from(cards, {
        y: 66,
        autoAlpha: 0,
        duration: 1.0,
        ease: 'expo.out',
        stagger: 0.12,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' },
      });
      // 编号做更夸张的独立位移动效（先于卡片甩出）
      const nos = Array.from(cards).map((c) => c.querySelector('.strength__no'));
      gsap.from(nos, {
        y: 40, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.12,
        delay: 0.1,
        scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="strengths" className="section strengths" ref={ref}>
      <div className="container">
        <div className="section-head reveal">
          <div className="section-head__left">
            <span className="section-eyebrow">04 / Strengths</span>
            <h2 className="section-title mask-rise">个人优势<span className="em"> · 能力项</span></h2>
            <p className="section-intro">从内容制作到运营方法论，把每个环节都当成能复用的能力沉淀下来。</p>
          </div>
          <span className="section-sub">Core Capabilities</span>
        </div>

        <div className="strengths__grid">
          {strengths.map((s) => (
            <BorderGlow
              key={s.id}
              className="strength bg-pad"
              backgroundColor="#0f1014"
              borderRadius={12}
              glowRadius={90}
              glowIntensity={0.9}
              coneSpread={34}
              edgeSensitivity={30}
              colors={['#7df3ff', '#e7d9b8', '#7df3ff']}
            >
              <div className="strength__no">{s.no}</div>
              <div className="strength__body">
                <h3 className="strength__title">{s.title}</h3>
                <p className="strength__en">{s.en}</p>
                <p className="strength__desc">{s.desc}</p>
              </div>
              <div className="strength__arrow" aria-hidden="true">
                <span className="arrow-line" />
                <span className="arrow-tip" />
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}
