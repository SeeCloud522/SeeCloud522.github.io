import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Strengths from './components/Strengths.jsx';
import Contact from './components/Contact.jsx';
import { ScrollTrigger } from './lib/motion.js';

export default function App() {
  // 挂载后给 body 加噪点纹理层；资源/字体加载完再刷新一次 ScrollTrigger 位置
  useEffect(() => {
    document.body.classList.add('grain');

    const onLoad = () => ScrollTrigger.refresh();
    const t = window.setTimeout(onLoad, 600);
    window.addEventListener('load', onLoad);

    return () => {
      document.body.classList.remove('grain');
      window.clearTimeout(t);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Strengths />
      </main>
      <Contact />
    </div>
  );
}
