import { useCallback, useRef } from 'react';
import './BorderGlow.css';

/**
 * BorderGlow — 边缘感应辉光容器
 *
 * 用法（props 与示例 API 完全一致）：
 * <BorderGlow
 *   edgeSensitivity={30}
 *   glowColor="125 243 255"
 *   backgroundColor="#0e0f12"
 *   borderRadius={10}
 *   glowRadius={90}
 *   glowIntensity={1.0}
 *   coneSpread={26}
 *   animated={false}
 *   colors={['#7df3ff', '#e7d9b8']}
 *   className="..."
 * >
 *   {children}
 * </BorderGlow>
 *
 * 行为：鼠标移向容器边缘时，沿鼠标方位在边框上产生一段锥形辉光；
 * 越靠近边缘强度越高，中心区域保持克制。
 */
export default function BorderGlow({
  children,
  edgeSensitivity = 30,
  glowColor = '125 243 255',
  backgroundColor = '#0e0f12',
  borderRadius = 10,
  glowRadius = 90,
  glowIntensity = 1.0,
  coneSpread = 26,
  animated = false,
  colors = ['#7df3ff', '#e7d9b8'],
  className = '',
  style,
}) {
  const ref = useRef(null);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // 指针相对中心的归一化坐标（-1 ~ 1），diagonal 归一化保证角落=1
      const dx = (px - cx) / cx;
      const dy = (py - cy) / cy;
      const diag = Math.hypot(dx, dy);
      const dist = Math.min(diag, 1.2); // 到中心距离：0 中心 ~ >1 出边

      // 方位角（朝向指针）
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI; // -180~180
      angle = (angle + 360) % 360;

      // 边缘感应强度：靠近边缘/外圈时增强，中心低
      // 用“超出单位圆的量”加重边缘爆发；sensitivity 控制中心最小发光
      let edge = dist;
      if (dist > 0.86) edge = 0.86 + (dist - 0.86) * 3; // 出边前加速
      const sens = Math.max(edgeSensitivity / 100, 0.02);
      const boost = 0.55 + edge * 0.45 * (1 + sens * 2);

      el.style.setProperty('--bg-x', `${px}px`);
      el.style.setProperty('--bg-y', `${py}px`);
      el.style.setProperty('--bg-pos', `${((px / rect.width) * 100).toFixed(2)}% ${((py / rect.height) * 100).toFixed(2)}%`);
      el.style.setProperty('--bg-angle', `${angle}deg`);
      el.style.setProperty('--bg-dist', dist.toFixed(3));
      el.style.setProperty('--bg-boost', boost.toFixed(3));
      el.style.setProperty('--bg-spread', `${coneSpread}deg`);
      el.style.setProperty('--bg-glow-r', `${glowRadius}px`);
      el.style.setProperty('--bg-int', glowIntensity.toFixed(2));
      el.style.setProperty('--bg-edge', edgeSensitivity.toFixed(1));
      el.style.setProperty('--bg-c1', colors[0] || glowColor);
      el.style.setProperty('--bg-c2', colors[1] || colors[0] || glowColor);
      el.style.setProperty('--bg-c3', colors[2] || colors[0] || glowColor);
    },
    [edgeSensitivity, glowRadius, glowIntensity, coneSpread, colors, glowColor]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--bg-dist', '0');
    el.style.setProperty('--bg-boost', '0');
  }, []);

  return (
    <div
      ref={ref}
      className={`border-glow ${animated ? 'is-animated' : ''} ${className}`}
      style={
        {
          ...style,
          '--bg-radius': `${borderRadius}px`,
          '--bg-color': backgroundColor,
          '--bg-glow': glowColor,
          '--bg-dist': '0',
          '--bg-boost': '0',
        }
      }
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* 边缘辉光锥形层 */}
      <span className="border-glow__aura" aria-hidden="true" />
      {/* 边框线 */}
      <span className="border-glow__edge" aria-hidden="true" />
      <div className="border-glow__content">{children}</div>
    </div>
  );
}
