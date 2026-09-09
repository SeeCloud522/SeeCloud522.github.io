import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/content.js';
import BorderGlow from './BorderGlow.jsx';
import { gsap, initMaskRise, revealHead, ScrollTrigger, reducedMotion } from '../lib/motion.js';
import './Projects.css';

const CATS = [
  { key: 'all', label: '全部' },
  { key: 'growth', label: '增长起号' },
  { key: 'op', label: '账号运营' },
  { key: 'shoot', label: '拍摄剪辑' },
  { key: 'event', label: '赛事活动' },
];

// 简单类别归类（后续可放 content.js 维护）
const catOf = (id) => {
  if (id === 'p01') return 'growth';
  if (id === 'p02') return 'op';
  if (id === 'p03' || id === 'p05' || id === 'p06') return 'shoot';
  return 'event';
};

export default function Projects() {
  const [active, setActive] = useState('all');
  const [gridIn, setGridIn] = useState(false);
  // 各轮播项目（p01/p04…）的当前索引，按项目 id 分别维护，互不干扰
  const [slide, setSlide] = useState({});
  const slideRef = useRef({});
  const setSlideAt = (id, upd) =>
    setSlide((s) => ({ ...s, [id]: upd(s[id] ?? 0) }));
  useEffect(() => { slideRef.current = slide; }, [slide]);
  const dragRef = useRef(null);
  const ref = useRef(null);
  const P01_SHOTS = ['/case-douyin-profile.jpg', '/case-douyin-data.jpg', '/case-douyin-grid.jpg'];
  const P01_LABELS = ['PROFILE', 'DATA', 'WORKS'];
  const P02_SHOTS = ['/case-shenzhen-xyl.jpg'];
  const P02_LABELS = ['CASE'];
  const P03_SHOTS = ['/case-p03-museum.jpg'];
  const P03_LABELS = ['CASE'];
  const P04_SHOTS = ['/case-p04-sanchuang.jpg', '/case-p04-jianhang.jpg'];
  const P04_LABELS = ['SANCHUANG', 'JIANHANG'];
  const P05_SHOTS = ['/case-p05-shoot1.jpg', '/case-p05-shoot2.jpg', '/case-p05-shoot3.jpg', '/case-p05-shoot4.jpg'];
  const P05_LABELS = ['SHOOT 01', 'SHOOT 02', 'SHOOT 03', 'SHOOT 04'];
  const P06_SHOTS = ['/case-p06-edit1.jpg', '/case-p06-edit2.jpg', '/case-p06-edit3.jpg', '/case-p06-edit4.jpg'];
  const P06_LABELS = ['EDIT 01', 'EDIT 02', 'EDIT 03', 'EDIT 04'];

  const visible = projects.filter((p) => active === 'all' || catOf(p.id) === active);

  const onFilter = (key) => {
    if (key === active) return;
    setActive(key);
  };

  // 轮播：左右切换 + 鼠标拖拽（循环），index 按项目 id 独立
  const go = (id, dir, total) => {
    setSlideAt(id, (s) => (s + dir + total) % total);
    // 等 track 位移结束再对齐新一张（若它高于视窗则标 pannable）
    window.setTimeout(() => {
      const el = document.getElementById(`slideshow-${id}`);
      if (el) stageActive(el);
    }, 60);
  };
  const carouselPointerDown = (e) => { dragRef.current = e.clientX; };
  const carouselPointerUp = (e, id, total) => {
    if (dragRef.current == null) return;
    const dx = e.clientX - dragRef.current;
    dragRef.current = null;
    if (Math.abs(dx) > 40) go(id, dx < 0 ? 1 : -1, total);
  };

  // —— 单图「全景扫视」：图片按真实比例完整显示，悬停时随鼠标上下平移查看被裁的上/下部分 ——
  const panoTravel = (stage) => {
    const img = stage && stage.querySelector('img');
    const root = stage && stage.parentElement;
    if (!img || !root || !img.complete) return 0;
    const vh = root.getBoundingClientRect().height;
    return Math.max(0, img.offsetHeight - vh);
  };
  // 平移跟随
  const panoMove = (e) => {
    const root = e.currentTarget;
    const stage = root.querySelector('.pano__stage');
    const img = stage && stage.querySelector('img');
    if (!stage || !img || !img.complete) return;
    const travel = panoTravel(stage);
    if (travel <= 0) return;
    const vr = root.getBoundingClientRect();
    if (vr.height === 0) return;
    const t = Math.min(1, Math.max(0, (e.clientY - vr.top) / vr.height));
    stage.style.transition = 'none';
    stage.style.transform = `translate3d(0, ${(-travel * t).toFixed(1)}px, 0)`;
  };
  // 移出/复位：回到「底部对齐」→ 图片底部数据完整可见
  const panoSettle = (e, showBottom = true) => {
    const root = e.currentTarget;
    const stage = root.querySelector('.pano__stage');
    if (!stage) return;
    alignStage(stage, showBottom);
  };
  // 通用：把某个 stage 对齐到顶(showBottom=false)或底(showBottom=true)
  const alignStage = (stage, showBottom = true) => {
    if (!stage) return;
    const travel = panoTravel(stage);
    stage.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    stage.style.transform = `translate3d(0, ${showBottom ? -travel.toFixed(1) : 0}px, 0)`;
    window.setTimeout(() => { if (stage) stage.style.transition = ''; }, 650);
  };

  // —— 轮播内每张图同样支持纵向扫视（当前可见 slide 的 stage 跟随指针） ——
  const curStage = (root) => {
    const slides = root.querySelectorAll('.slideshow__slide');
    const id = (root.id || '').replace('slideshow-', '');
    const curIdx = Math.min(slideRef.current[id] ?? 0, Math.max(slides.length - 1, 0));
    const cur = slides[curIdx];
    return cur ? cur.querySelector('.pano__stage') : null;
  };
  const carouselMove = (e) => {
    const root = e.currentTarget;
    const stage = curStage(root);
    const img = stage && stage.querySelector('img');
    if (!stage || !img || !img.complete) return;
    const travel = panoTravel(stage);
    if (travel <= 0) return;
    const vr = root.getBoundingClientRect();
    if (vr.height === 0) return;
    const t = Math.min(1, Math.max(0, (e.clientY - vr.top) / vr.height));
    stage.style.transition = 'none';
    stage.style.transform = `translate3d(0, ${(-travel * t).toFixed(1)}px, 0)`;
  };
  const carouselSettle = (e) => {
    const root = e.currentTarget;
    const stage = curStage(root);
    if (stage) alignStage(stage, false); // 截图顶部起读；向上滑看底部
  };
  // 切到某张时：复位到顶部；若该图高于视窗则标为可纵向扫视
  const stageActive = (root) => {
    const stage = curStage(root);
    if (!stage) return;
    const travel = panoTravel(stage);
    stage.style.transition = 'none';
    stage.style.transform = 'translate3d(0,0,0)';
    if (root && root.classList) root.classList.toggle('is-pannable', travel > 8);
  };

  // 区块头 + 过滤条 + 网格 is-in + 封面轻微 parallax：只注册一次
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    if (reducedMotion) return; // 降级动效：头与网格入场交给下方兜底 effect

    const ctx = gsap.context(() => {
      initMaskRise(section);
      revealHead(section);

      const bar = section.querySelector('.filter-bar');
      if (bar) {
        gsap.from(bar, {
          y: 24, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 0.1,
          scrollTrigger: { trigger: bar, start: 'top 92%', toggleActions: 'play none none none' },
        });
      }

      // 网格进入视口：点亮 is-in，触发卡片 CSS 入场
      const grid = section.querySelector('.projects__grid');
      if (grid) {
        ScrollTrigger.create({
          trigger: grid,
          start: 'top 82%',
          once: true,
          onEnter: () => setGridIn(true),
        });
      }

      // 封面轻微 parallax（滚动错位感，克制）
      const cards = section.querySelectorAll('.project__cover');
      if (cards.length) {
        cards.forEach((c) => {
          gsap.fromTo(c,
            { yPercent: 4 },
            {
              yPercent: -4, ease: 'none',
              scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            });
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // 降级动效：让卡片直接可见（不靠入场动画）
  useEffect(() => {
    if (reducedMotion) setGridIn(true);
  }, []);

  // 过滤切换：卡片以 key 重挂载，grid 已 .is-in 时新卡会在挂载时自动重放入场
  return (
    <section id="projects" className="section projects" ref={ref}>
      <div className="container">
        <div className="section-head reveal">
          <div className="section-head__left">
            <span className="section-eyebrow">03 / Selected Works</span>
            <h2 className="section-title mask-rise">
              作品项目
            </h2>
          </div>
        </div>

        {/* 分类过滤 */}
        <div className="filter-bar reveal" role="tablist" aria-label="项目分类">
          {CATS.map((c) => (
            <button
              key={c.key}
              role="tab"
              aria-selected={active === c.key}
              className={`filter-btn ${active === c.key ? 'is-active' : ''}`}
              onClick={() => onFilter(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className={`projects__grid${gridIn ? ' is-in' : ''}`}>
          {visible.map((p, i) => {
            const isP01 = p.id === 'p01';
            const isP02 = p.id === 'p02';
            const isP03 = p.id === 'p03';
            const isP04 = p.id === 'p04';
            const isP05 = p.id === 'p05';
            const isP06 = p.id === 'p06';
            const shots = isP01 ? P01_SHOTS : isP02 ? P02_SHOTS : isP03 ? P03_SHOTS : isP04 ? P04_SHOTS : isP05 ? P05_SHOTS : isP06 ? P06_SHOTS : null;
            const labels = isP01 ? P01_LABELS : isP02 ? P02_LABELS : isP03 ? P03_LABELS : isP04 ? P04_LABELS : isP05 ? P05_LABELS : isP06 ? P06_LABELS : null;
            const showNav = shots && shots.length > 1;
            return (
              <BorderGlow
                key={`${p.id}-${active}`}
                className="project"
                style={{ '--i': i }}
                backgroundColor="#0f1014"
                borderRadius={12}
                glowRadius={110}
                glowIntensity={1}
                coneSpread={30}
                edgeSensitivity={28}
                colors={['#7df3ff', '#e7d9b8', '#7df3ff']}
              >
                {/* 封面：分类色相 + 超大序号 + 视频 playhead */}
                <div className={`project__cover project__cover--${p.tone}${shots ? ' project__cover--fullbleed' : ''}`}>
                  <div className="project__cover-grid" aria-hidden="true" />
                  <div className="project__cover-sheen" aria-hidden="true" />
                  <span className="project__num" aria-hidden="true">{p.index}</span>

                  <div className="project__cover-top">
                    <span className="project__chip">SHORT-VIDEO</span>
                    <span className="project__year">{p.year}</span>
                  </div>

                  {shots && shots.length === 1 ? (
                    /* —— 单图：全景扫视 —— 图片完整比例显示，底部数据默认可见，悬停可上下平移看整张 */
                    <div
                      className="pano"
                      aria-label={`${p.title} 案例截图（悬停上下滑动查看全图）`}
                      onPointerMove={panoMove}
                      onPointerLeave={(e) => panoSettle(e, true)}
                    >
                      <div className="pano__stage">
                        <img
                          src={shots[0]}
                          alt={`${p.title} 案例：${labels[0]}`}
                          loading="lazy"
                          draggable={false}
                          onLoad={(e) => {
                            const stage = e.currentTarget.parentElement;
                            const travel = panoTravel(stage);
                            const root = stage.parentElement;
                            root.style.cursor = travel > 0 ? 'ns-resize' : 'default';
                            stage.style.transition = 'none';
                            // 初始对齐到底部 → 底部数据行完整可见
                            stage.style.transform = travel > 0 ? `translate3d(0, ${-travel.toFixed(1)}px, 0)` : 'translate3d(0,0,0)';
                          }}
                        />
                      </div>
                      <span className="pano__cap">{labels[0]}</span>
                      <span className="pano__hint" aria-hidden="true">上下滑动 · 查看全图</span>
                    </div>
                  ) : shots && (
                    <div
                      id={`slideshow-${p.id}`}
                      className="slideshow"
                      aria-label={`${p.title} 案例截图（可左右切换，悬停上下滑动看整张）`}
                      onPointerDown={carouselPointerDown}
                      onPointerUp={(e) => carouselPointerUp(e, p.id, shots.length)}
                      onPointerMove={carouselMove}
                      onPointerLeave={(e) => { dragRef.current = null; carouselSettle(e); }}
                    >
                      <div
                        className="slideshow__track"
                        style={{ transform: `translateX(-${(slide[p.id] ?? 0) * 100}%)` }}
                      >
                        {shots.map((src, k) => (
                          <div className="slideshow__slide" key={src}>
                            <div className="pano__stage">
                              <img
                                src={src}
                                alt={`${p.title} 案例 ${k + 1}：${labels[k]}`}
                                loading="lazy"
                                draggable={false}
                                onLoad={(e) => {
                                  const st = e.currentTarget.parentElement;
                                  const root = st.closest('.slideshow');
                                  const travel = panoTravel(st);
                                  st.style.transition = 'none';
                                  st.style.transform = 'translate3d(0,0,0)';
                                  if (root) root.classList.toggle('is-pannable', travel > 8);
                                }}
                              />
                            </div>
                            <span className="slideshow__cap">{labels[k]}</span>
                          </div>
                        ))}
                      </div>

                      {showNav && (
                        <>
                          <button
                            type="button"
                            className="slideshow__nav slideshow__nav--prev"
                            aria-label="上一张"
                            onClick={() => go(p.id, -1, shots.length)}
                          >‹</button>
                          <button
                            type="button"
                            className="slideshow__nav slideshow__nav--next"
                            aria-label="下一张"
                            onClick={() => go(p.id, 1, shots.length)}
                          >›</button>

                          <div className="slideshow__dots">
                            {shots.map((_, k) => (
                              <button
                                key={k}
                                type="button"
                                className={`slideshow__dot${(slide[p.id] ?? 0) === k ? ' is-on' : ''}`}
                                aria-label={`切换到第 ${k + 1} 张`}
                                onClick={() => go(p.id, k - (slide[p.id] ?? 0), shots.length)}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {!shots && (
                    <div className="project__cover-bot">
                      <span className="project__cover-title">{p.title}</span>
                    </div>
                  )}

                  {!shots && (
                    <div className="project__timeline" aria-hidden="true">
                      <i className="project__playhead" />
                      <span className="project__track" />
                    </div>
                  )}
                </div>

                <div className="project__body">
                  <p className="project__type">{p.subtitle}</p>
                  <h3 className="project__title">{p.title}</h3>
                  <p className="project__desc">{p.desc}</p>

                  <div className="project__foot">
                    <div className="project__metric">
                      <strong>{p.metric.value}</strong>
                      <span>{p.metric.label}</span>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            );
          })}
        </div>
      </div>
    </section>
  );
}
