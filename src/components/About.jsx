import { useEffect, useRef } from 'react';
import { about } from '../data/content.js';
import { gsap, initMaskRise, revealHead, staggerUp, EASE, reducedMotion } from '../lib/motion.js';
import './About.css';

export default function About() {
  const ref = useRef(null);

  // —— 人物长图：默认顶部对齐看头部，悬停随鼠标上下平移查看被裁的底部 ——
  const stageRef = useRef(null);
  const portraitTravel = (stage) => {
    const img = stage && stage.querySelector('img');
    if (!img || !stage || !img.complete) return 0;
    const vh = stage.parentElement.getBoundingClientRect().height;
    return Math.max(0, img.offsetHeight - vh);
  };
  const alignTop = (stage, anim = true) => {
    if (!stage) return;
    stage.style.transition = anim ? 'transform 0.55s cubic-bezier(0.16,1,0.3,1)' : 'none';
    stage.style.transform = 'translate3d(0,0,0)';
  };
  const onPortraitMove = (e) => {
    const stage = stageRef.current;
    const img = stage && stage.querySelector('img');
    if (!stage || !img || !img.complete) return;
    const travel = portraitTravel(stage);
    if (travel <= 0) return;
    const vr = stage.parentElement.getBoundingClientRect();
    if (vr.height === 0) return;
    const t = Math.min(1, Math.max(0, (e.clientY - vr.top) / vr.height));
    stage.style.transition = 'none';
    stage.style.transform = `translate3d(0, ${(-travel * t).toFixed(1)}px, 0)`;
  };
  const onPortraitLeave = () => {
    const stage = stageRef.current;
    if (stage) alignTop(stage, true);
  };
  const onPortraitLoad = () => {
    const stage = stageRef.current;
    if (!stage) return;
    alignTop(stage, false);
    const travel = portraitTravel(stage);
    const root = stage.parentElement;
    root.style.cursor = travel > 0 ? 'ns-resize' : 'default';
  };

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      initMaskRise(section);
      revealHead(section);

      // 人物像：整块 cover 揭开上浮（不作用内层图，避免与上下扫视的 transform 冲突）
      const portrait = section.querySelector('.about__portrait');
      if (portrait) {
        gsap.from(portrait, {
          y: 60, autoAlpha: 0, rotateX: -8, transformOrigin: '50% 100%',
          duration: 1.3, ease: EASE.out,
          scrollTrigger: { trigger: portrait, start: 'top 84%', toggleActions: 'play none none none' },
        });
      }

      // metric 面板：整块上浮 + 逐格 stagger
      const metrics = section.querySelector('.about__metrics');
      if (metrics) {
        staggerUp(metrics, { y: 40, trigger: metrics, start: 'top 88%' });
        gsap.from(metrics.querySelectorAll('.about__metric'), {
          autoAlpha: 0, y: 22, duration: 0.7, ease: EASE.soft, stagger: 0.08,
          delay: 0.15,
          scrollTrigger: { trigger: metrics, start: 'top 88%', toggleActions: 'play none none none' },
        });
      }

      // 左信息：lead + block 依次
      const infoEl = section.querySelector('.about__info');
      if (infoEl) {
        const lead = section.querySelector('.about__lead');
        const blocks = section.querySelectorAll('.about__block');
        if (lead) gsap.from(lead, { y: 40, autoAlpha: 0, duration: 1.0, ease: EASE.soft,
          scrollTrigger: { trigger: infoEl, start: 'top 82%', toggleActions: 'play none none none' } });
        if (blocks.length) gsap.from(blocks, { y: 40, autoAlpha: 0, duration: 1.0, ease: EASE.out, stagger: 0.14, delay: 0.15,
          scrollTrigger: { trigger: infoEl, start: 'top 74%', toggleActions: 'play none none none' } });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="section about" ref={ref}>
      <div className="container">
        <div className="section-head reveal">
          <div className="section-head__left">
            <span className="section-eyebrow">02 / About</span>
            <h2 className="section-title mask-rise">
              用内容<span className="em">把数据</span>做出来
            </h2>
            <p className="section-intro">{about.intro}</p>
          </div>
        </div>

        <div className="about__grid">
          {/* 右：人物 + 数据面板 */}
          <div className="about__panel reveal">
            <div
              className="about__portrait"
              aria-label="运营案例长图（悬停上下滑动查看全图）"
              onPointerMove={onPortraitMove}
              onPointerLeave={onPortraitLeave}
            >
              <div className="about__portrait-stage" ref={stageRef}>
                <img
                  className="about__portrait-img"
                  src="/case-douyin-jiajia.jpg"
                  alt="调酒师佳佳 · 抖音账号截图（运营案例）"
                  loading="lazy"
                  draggable={false}
                  onLoad={onPortraitLoad}
                />
              </div>
              <span className="about__portrait-hint" aria-hidden="true">上下滑动 · 查看全图</span>
              <div className="about__portrait-meta">
                <span className="about__portrait-line" />
                <span>CASE · 调酒师佳佳 / 抖音</span>
              </div>
              <div className="about__portrait-corner about__portrait-corner--tl" />
              <div className="about__portrait-corner about__portrait-corner--tr" />
              <div className="about__portrait-corner about__portrait-corner--bl" />
              <div className="about__portrait-corner about__portrait-corner--br" />
            </div>

            {/* metric 面板：参考站 about-panel 风格 */}
            <div className="about__metrics">
              {about.stats.map((s) => (
                <div key={s.label} className="about__metric">
                  <span className="about__metric-label">{s.label}</span>
                  <strong className="about__metric-num">{s.num}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* 左：介绍细节 */}
          <div className="about__info">
            <p className="about__lead reveal">
              {about.lead}
            </p>

            <div className="about__block reveal">
              <span className="about__block-label">Education / 经历</span>
              <ul className="about__edu">
                {about.edu.map((e, i) => (
                  <li key={i}>
                    <em>{e.school}</em>
                    <span>{e.major}</span>
                    <i>{e.time}</i>
                  </li>
                ))}
              </ul>
            </div>

            <div className="about__block reveal">
              <span className="about__block-label">Skills</span>
              <ul className="about__skills">
                {about.skills.map((s) => (
                  <li key={s}>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
