// ============================================================
// motion.js — GSAP + ScrollTrigger 动效基础设施
// 统一缓动、prefers-reduced-motion、mask 文字进场、通用函数
// 说明：不依赖 GSAP 付费 SplitText，标题用整块/掩码式进场（mask-rise）
// ============================================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 关闭 lagSmoothing，滚动位置更跟手
gsap.ticker.lagSmoothing(0);

export const reducedMotion =
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const EASE = {
  out: 'expo.out', // 进入收尾，克制高级
  soft: 'power3.out',
  settle: 'power4.out',
};

gsap.defaults({ ease: EASE.soft, duration: 1 });

// 滚动进入时播放一次的通用配置（避免抢滚动、无 scrub 时的普通 reveal）
const PLAY = 'play none none none';

export function refresh() {
  ScrollTrigger.refresh();
}

// 统一"向上淡入"：可选 parallax 位移
export function revealUp(targets, vars = {}) {
  return gsap.from(targets, {
    y: vars.y ?? 46,
    autoAlpha: 0,
    duration: vars.duration ?? 1.15,
    ease: vars.ease ?? EASE.out,
    delay: vars.delay ?? 0,
    scrollTrigger: {
      trigger: vars.trigger ?? targets,
      start: vars.start ?? 'top 82%',
      toggleActions: PLAY,
      ...(vars.st ? { scrub: vars.st } : {}),
    },
  });
}

// 掩码式文字进场：把 .mask-rise 内部文字整体从下升入（遮罩揭开）
// DOM 由 initMaskRise 预包装为 <span class=mask-rise><span class=mask-rise__in>…</span></span>
export function maskRise(targets, vars = {}) {
  const el = gsap.utils.toArray(targets).map((t) =>
    t.classList.contains('mask-rise') ? t.querySelector('.mask-rise__in') || t : t
  );
  return gsap.from(el, {
    yPercent: vars.yPercent ?? 116,
    autoAlpha: 0,
    duration: vars.duration ?? 1.35,
    ease: vars.ease ?? EASE.out,
    delay: vars.delay ?? 0,
    scrollTrigger: {
      trigger: vars.trigger ?? targets,
      start: vars.start ?? 'top 82%',
      toggleActions: PLAY,
    },
  });
}

// 横向 clip 揭开（eyebrow / EN 子标题）
export function clipReveal(targets, vars = {}) {
  return gsap.from(targets, {
    clipPath: 'inset(0 0 0 100%)',
    autoAlpha: 0,
    duration: vars.duration ?? 0.95,
    ease: vars.ease ?? EASE.settle,
    delay: vars.delay ?? 0,
    scrollTrigger: {
      trigger: vars.trigger ?? targets,
      start: vars.start ?? 'top 84%',
      toggleActions: PLAY,
    },
  });
}

// 把 .mask-rise 元素内容包装成可掩码的 inner（避免内联 span 残留）
export function initMaskRise(root = document) {
  root.querySelectorAll('.mask-rise').forEach((el) => {
    if (el.querySelector('.mask-rise__in')) return;
    const inner = document.createElement('span');
    inner.className = 'mask-rise__in';
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
  });
}

// 供组件用的简化上下文入口
export function ctx() {
  return gsap.context(() => {});
}

// —— 标准区块头统一进场（eyebrow clip → 标题掩码升入 → 副题 clip / 简介上浮）——
// 复用 initMaskRise 需在 .section-title / .contact__title 上加 .mask-rise
export function revealHead(scope, opts = {}) {
  const root = opts.root ?? scope;
  const base = root.querySelector('.section-head') || root;
  const start = opts.start ?? 'top 82%';

  // eyebrow：横向揭开
  const eyebrow = root.querySelector('.section-eyebrow');
  if (eyebrow && !opts.noEyebrow) {
    gsap.from(eyebrow, {
      clipPath: 'inset(0 0 0 100%)', autoAlpha: 0,
      duration: 0.9, ease: EASE.settle,
      scrollTrigger: { trigger: eyebrow, start: 'top 90%', toggleActions: 'play none none none' },
    });
  }

  // 主标题：掩码升入（大幅、慢、收尾高级）
  const title = root.querySelector('.section-title') || root.querySelector('.contact__title');
  if (title) {
    const inner = title.classList.contains('mask-rise')
      ? title.querySelector('.mask-rise__in')
      : title;
    if (inner) {
      gsap.from(inner, {
        yPercent: 120, autoAlpha: 0,
        duration: 1.5, ease: EASE.out,
        scrollTrigger: { trigger: title, start, toggleActions: 'play none none none' },
      });
    }
    // 标题容器轻微"压缩后归位"
    gsap.from(title, {
      scaleY: 0.94, scale: 1.02, transformOrigin: '50% 100%',
      duration: 1.5, ease: EASE.out,
      scrollTrigger: { trigger: title, start, toggleActions: 'play none none none' },
    });
  }

  // 简介上浮
  const intro = root.querySelector('.section-intro');
  if (intro) {
    gsap.from(intro, {
      y: 30, autoAlpha: 0, duration: 1.0, ease: EASE.soft,
      scrollTrigger: { trigger: intro, start, toggleActions: 'play none none none' },
    });
  }

  // 右上 EN 副标题横向揭开
  const sub = root.querySelector('.section-sub');
  if (sub) {
    gsap.from(sub, {
      clipPath: 'inset(0 100% 0 0)', autoAlpha: 0,
      duration: 0.9, ease: EASE.settle, delay: 0.1,
      scrollTrigger: { trigger: sub, start: 'top 92%', toggleActions: 'play none none none' },
    });
  }

  return { root, start };
}

// 通用 stagger 上浮（cards / tiles / 分组）
export function staggerUp(targets, vars = {}) {
  return gsap.from(targets, {
    y: vars.y ?? 56,
    autoAlpha: 0,
    duration: vars.duration ?? 1.0,
    ease: vars.ease ?? EASE.out,
    stagger: vars.stagger ?? 0.1,
    delay: vars.delay ?? 0,
    scrollTrigger: {
      trigger: vars.trigger ?? targets,
      start: vars.start ?? 'top 84%',
      toggleActions: 'play none none none',
    },
  });
}

// 封面/图片向上 clip 揭开（图片 reveal）
export function coverReveal(targets, vars = {}) {
  return gsap.from(targets, {
    clipPath: 'inset(100% 0 0 0)',
    autoAlpha: 0,
    duration: vars.duration ?? 1.3,
    ease: vars.ease ?? EASE.out,
    delay: vars.delay ?? 0,
    scrollTrigger: {
      trigger: vars.trigger ?? targets,
      start: vars.start ?? 'top 86%',
      toggleActions: 'play none none none',
    },
  });
}

export { gsap, ScrollTrigger };
