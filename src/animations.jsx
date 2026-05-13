'use client';
/* Anchor — Advanced animation utilities & components */
import React, { useState as useS, useEffect as useE, useRef as useR } from 'react';

// ============================================================
// Custom cursor — follows mouse; target reticle by default,
// expands on cards/links/swipers via [data-cursor]
// ============================================================
function CustomCursor() {
  const dotRef = useR(null);
  const ringRef = useR(null);
  const [label, setLabel] = useS('');
  const [variant, setVariant] = useS('default'); // default | hover | drag | view
  const pos = useR({ x: -100, y: -100 });
  const ring = useR({ x: -100, y: -100 });

  useE(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;
    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Detect hover targets via delegation
    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) {
        setVariant(t.dataset.cursor || 'hover');
        setLabel(t.dataset.cursorLabel || '');
      } else if (e.target.closest('a, button')) {
        setVariant('hover');
        setLabel('');
      }
    };
    const onOut = (e) => {
      const t = e.target.closest('[data-cursor], a, button');
      if (t) { setVariant('default'); setLabel(''); }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={`cur-dot cur-${variant}`}></div>
      <div ref={ringRef} className={`cur-ring cur-${variant}`}>
        {label && <span>{label}</span>}
      </div>
    </>
  );
}

// ============================================================
// Magnetic button — content pulls toward cursor
// ============================================================
function Magnetic({ children, strength = 0.3, className = '', ...rest }) {
  const wrapRef = useR(null);
  const innerRef = useR(null);

  useE(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    let raf, target = { x: 0, y: 0 }, current = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      target.x = (e.clientX - cx) * strength;
      target.y = (e.clientY - cy) * strength;
    };
    const onLeave = () => { target.x = 0; target.y = 0; };
    const tick = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      inner.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return (
    <span ref={wrapRef} className={`magnetic ${className}`} {...rest}>
      <span ref={innerRef} className="magnetic-inner">{children}</span>
    </span>
  );
}

// ============================================================
// Parallax — translates Y based on scroll position relative to element
// ============================================================
function useParallax(speed = 0.2) {
  const ref = useR(null);
  useE(() => {
    const el = ref.current; if (!el) return;
    let raf;
    const update = () => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const off = (center - window.innerHeight / 2) * -speed;
      el.style.setProperty('--parallax-y', `${off}px`);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);
  return ref;
}

function Parallax({ speed = 0.2, children, className = '', as: Tag = 'div' }) {
  const ref = useParallax(speed);
  return <Tag ref={ref} className={`parallax ${className}`}>{children}</Tag>;
}

// ============================================================
// Scroll-velocity marquee — speed reacts to page scrolling
// ============================================================
function VelocityMarquee({ items, dark = false }) {
  const trackRef = useR(null);
  const offset = useR(0);
  const baseSpeed = 0.5;
  const velocity = useR(0);
  const lastScroll = useR(0);

  useE(() => {
    lastScroll.current = window.scrollY;
    let raf;
    const onScroll = () => {
      const y = window.scrollY;
      velocity.current = (y - lastScroll.current);
      lastScroll.current = y;
    };
    const tick = () => {
      const track = trackRef.current;
      if (track) {
        offset.current -= baseSpeed + Math.min(8, Math.abs(velocity.current) * 0.6) * Math.sign(velocity.current || 1);
        velocity.current *= 0.92;
        const half = track.scrollWidth / 2;
        if (half > 0) {
          if (offset.current <= -half) offset.current += half;
          if (offset.current > 0) offset.current -= half;
        }
        track.style.transform = `translate3d(${offset.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const list = [...items, ...items];
  return (
    <div className={`v-marquee${dark ? ' dark' : ''}`}>
      <div className="v-marquee-track" ref={trackRef}>
        {list.map((c, i) => (
          <span key={i} className="v-marquee-item">
            <span className="v-marquee-name">{c.name}</span>
            <svg className="v-marquee-mark" width="22" height="22" viewBox="0 0 22 22"><path d="M11 0 L13 9 L22 11 L13 13 L11 22 L9 13 L0 11 L9 9 Z" fill="currentColor"/></svg>
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Page transition — sweeping panel between route changes
// ============================================================
function PageTransition({ routeKey }) {
  const [phase, setPhase] = useS('idle'); // idle | covering | revealing
  const prevKey = useR(routeKey);
  useE(() => {
    if (prevKey.current === routeKey) return;
    prevKey.current = routeKey;
    setPhase('covering');
    const t1 = setTimeout(() => setPhase('revealing'), 480);
    const t2 = setTimeout(() => setPhase('idle'), 980);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [routeKey]);
  return (
    <div className={`page-trans page-trans-${phase}`} aria-hidden="true">
      <div className="pt-panel pt-1"></div>
      <div className="pt-panel pt-2"></div>
      <div className="pt-panel pt-3"></div>
    </div>
  );
}

// ============================================================
// Section heading with animated split text
// ============================================================
function SplitText({ text, className = '', delay = 0 }) {
  const ref = useR(null);
  const [vis, setVis] = useS(false);
  useE(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setVis(true); io.unobserve(el); } });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = String(text).split(' ');
  return (
    <span ref={ref} className={`split-text ${vis ? 'in' : ''} ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="split-word"><span style={{ transitionDelay: `${delay + i * 60}ms` }}>{w}</span>{i < words.length - 1 ? ' ' : ''}</span>
      ))}
    </span>
  );
}

export {
  CustomCursor, Magnetic, Parallax, useParallax,
  VelocityMarquee, PageTransition, SplitText,
};
