import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const WEDDING_DATE = new Date('2026-08-18T10:00:00');
const HERO_IMG = 'https://cdn.poehali.dev/projects/28856232-d476-451e-9286-32342fd2728b/bucket/0e57ace8-d915-41ef-87dd-235c5529abf7.jpg';
const STORY_IMG = 'https://cdn.poehali.dev/projects/28856232-d476-451e-9286-32342fd2728b/bucket/a2b194b2-48ad-4a45-9679-da307a58d07e.png';
const UPLOAD_URL = 'https://functions.poehali.dev/a2ef0256-232a-4681-8e7b-785a5cbca919';
const STORAGE_KEY = 'wedding_music_url';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance < 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
}

function useIntersection(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useIntersection();
  return (
    <div ref={ref} className={className} style={{
      transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '0 auto', maxWidth: 320 }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(139,105,20,0.35))' }} />
      <span style={{ color: 'rgba(139,105,20,0.4)', fontSize: '0.6rem' }}>❧</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(139,105,20,0.35), transparent)' }} />
    </div>
  );
}

/* ── Конверт ── */
function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'done'>('idle');

  const handleClick = () => {
    if (phase !== 'idle') return;
    setPhase('opening');
    setTimeout(() => { setPhase('done'); setTimeout(onOpen, 400); }, 1200);
  };

  return (
    <div onClick={handleClick} style={{
      position: 'fixed', inset: 0, zIndex: 999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', userSelect: 'none', overflow: 'hidden',
      opacity: phase === 'done' ? 0 : 1,
      transition: phase === 'done' ? 'opacity 0.5s ease' : 'none',
    }}>
      {/* BG photo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${HERO_IMG})`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
        filter: 'brightness(0.55)',
      }} />
      {/* warm overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(30,20,5,0.3) 0%, rgba(10,8,2,0.55) 100%)' }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 24px' }}>
        <div style={{ animation: 'fade-up 0.8s ease-out 0.1s both' }}>
          <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(240,210,120,0.7)', marginBottom: 32 }}>
            у вас письмо
          </p>
        </div>

        {/* Envelope */}
        <div style={{
          width: 'clamp(180px, 45vw, 260px)', margin: '0 auto 36px',
          animation: phase === 'idle' ? 'float 3s ease-in-out infinite' : 'none',
          transform: phase === 'opening' ? 'scale(1.1) translateY(-12px)' : 'scale(1)',
          transition: 'transform 0.5s ease',
          filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.5))',
        }}>
          <svg viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="44" width="292" height="172" rx="6" fill="rgba(255,248,230,0.95)" stroke="rgba(212,175,55,0.6)" strokeWidth="1.5" />
            <line x1="4" y1="216" x2="150" y2="130" stroke="rgba(212,175,55,0.2)" strokeWidth="1" />
            <line x1="296" y1="216" x2="150" y2="130" stroke="rgba(212,175,55,0.2)" strokeWidth="1" />
            <path
              d={phase === 'opening' ? 'M4 44 L150 44 L296 44 L150 4 Z' : 'M4 44 L150 130 L296 44 Z'}
              fill={phase === 'opening' ? 'rgba(255,248,230,0.95)' : 'rgba(240,225,185,0.95)'}
              stroke="rgba(212,175,55,0.6)" strokeWidth="1.5" strokeLinejoin="round"
              style={{ transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}
            />
            <circle cx="150" cy="130" r="24" fill="#8B6914" opacity={phase === 'opening' ? 0 : 1} style={{ transition: 'opacity 0.3s ease' }} />
            <text x="150" y="136" textAnchor="middle" fill="rgba(255,248,230,0.95)" fontSize="13" fontFamily="Cormorant Garamond, serif" fontStyle="italic">А&Т</text>
            {phase === 'opening' && (
              <>
                <rect x="80" y="70" width="140" height="7" rx="2" fill="rgba(139,105,20,0.15)" />
                <rect x="100" y="84" width="100" height="5" rx="2" fill="rgba(139,105,20,0.1)" />
                <rect x="90" y="97" width="120" height="5" rx="2" fill="rgba(139,105,20,0.1)" />
              </>
            )}
          </svg>
        </div>

        <div style={{ animation: 'fade-up 0.8s ease-out 0.4s both' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 8vw, 3.8rem)', fontWeight: 400, color: '#f5edd8', lineHeight: 1.1, marginBottom: 6 }}>
            АЭЛИТА<br />
            <span style={{ fontSize: '0.55em', color: 'rgba(212,175,55,0.6)', fontStyle: 'italic' }}>&</span><br />
            ТУЗАГАШ
          </h1>
          <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(240,210,120,0.6)', textTransform: 'uppercase', marginTop: 8 }}>
            18.08.2026
          </p>
        </div>

        <div style={{ marginTop: 40, animation: 'fade-up 0.8s ease-out 0.7s both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 28px', border: '1px solid rgba(212,175,55,0.4)', color: 'rgba(240,210,120,0.8)', fontFamily: "'Golos Text', sans-serif", fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            <Icon name="Mail" size={13} />
            нажмите, чтобы открыть
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [opened, setOpened] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: '', guests: '1', attending: '', message: '' });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [musicUrl, setMusicUrl] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || '');
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeLeft = useCountdown(WEDDING_DATE);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => {
      if (audioRef.current && musicUrl) {
        audioRef.current.volume = 0.38;
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 600);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      const res = await fetch(UPLOAD_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, filename: 'river-flows-in-you.mp3' }),
      });
      const data = await res.json();
      if (data.url) {
        setMusicUrl(data.url);
        localStorage.setItem(STORAGE_KEY, data.url);
        setShowUpload(false);
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.volume = 0.38;
          audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
        }
      }
    } finally { setUploading(false); }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navItems = [
    { id: 'story', label: 'История' },
    { id: 'program', label: 'Программа' },
    { id: 'venue', label: 'Место' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'contacts', label: 'Контакты' },
  ];

  const timerLabels = ['дней', 'часов', 'минут', 'секунд'];
  const timerValues = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds];

  return (
    <>
      {!opened && <EnvelopeIntro onOpen={handleOpen} />}

      <audio ref={audioRef} loop src={musicUrl || undefined} preload={musicUrl ? 'auto' : 'none'} />
      <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileUpload} />

      {/* Music button */}
      {opened && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          {showUpload && (
            <div style={{ background: 'rgba(247,244,238,0.97)', backdropFilter: 'blur(12px)', border: '1px solid rgba(139,105,20,0.2)', padding: '14px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', maxWidth: 220 }}>
              <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.7rem', color: '#1a1208', marginBottom: 10, lineHeight: 1.5 }}>
                Загрузите <strong>River Flows In You</strong> (mp3)
              </p>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                style={{ width: '100%', background: uploading ? 'rgba(139,105,20,0.4)' : '#8B6914', color: '#f7f4ee', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.63rem', letterSpacing: '0.13em', textTransform: 'uppercase', padding: '9px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name={uploading ? 'Loader' : 'Upload'} size={12} />
                {uploading ? 'Загружаю...' : 'Выбрать файл'}
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!musicUrl && (
              <button onClick={() => setShowUpload(v => !v)} title="Загрузить музыку"
                style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(247,244,238,0.95)', border: '1px solid rgba(139,105,20,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8B6914', transition: 'transform 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                <Icon name="Upload" size={15} />
              </button>
            )}
            <button onClick={musicUrl ? toggleMusic : () => setShowUpload(v => !v)} title={playing ? 'Пауза' : 'River Flows In You'}
              style={{ width: 42, height: 42, borderRadius: '50%', background: playing ? '#8B6914' : 'rgba(247,244,238,0.95)', border: '1px solid rgba(139,105,20,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: playing ? '#f7f4ee' : '#8B6914', transition: 'all 0.25s', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
              <Icon name={playing ? 'Pause' : 'Music2'} size={16} />
            </button>
          </div>
          {musicUrl && playing && (
            <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.52rem', letterSpacing: '0.1em', color: 'rgba(26,18,8,0.28)', textAlign: 'right' }}>River Flows In You</p>
          )}
        </div>
      )}

      <div style={{ background: '#f7f4ee', minHeight: '100vh', fontFamily: "'Golos Text', sans-serif", color: '#1a1208' }}>

        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(247,244,238,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
            <button onClick={() => scrollTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontStyle: 'italic', color: '#8B6914', fontWeight: 500 }}>А & Т</button>
            <div className="hidden md:flex" style={{ gap: 32 }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.42)', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#8B6914')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,18,8,0.42)')}>
                  {item.label}
                </button>
              ))}
            </div>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B6914' }}>
              <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
          {menuOpen && (
            <div style={{ padding: '14px 24px 18px', borderTop: '1px solid rgba(212,175,55,0.12)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: "'Golos Text', sans-serif", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.48)' }}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* ── HERO ── фото на весь экран */}
        <section id="hero" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
          {/* Background photo */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${HERO_IMG})`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
          }} />
          {/* gradient overlay — снизу как на фото */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,14,4,0.15) 0%, rgba(10,7,2,0.0) 35%, rgba(10,7,2,0.5) 70%, rgba(5,3,1,0.85) 100%)' }} />

          {/* Text overlay — как на исходном фото */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 'clamp(60px, 12vh, 100px)', zIndex: 2 }}>
            <div style={{ animation: 'fade-up 0.8s ease-out 0.2s both', textAlign: 'center' }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, lineHeight: 0.9, color: '#f0e6c8', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                <div style={{ fontSize: 'clamp(3rem, 10vw, 6.5rem)', letterSpacing: '0.06em' }}>АЭЛИТА</div>
                <div style={{ fontSize: 'clamp(1.4rem, 4vw, 2.4rem)', fontStyle: 'italic', color: 'rgba(212,175,55,0.75)', margin: '4px 0', letterSpacing: '0.1em' }}>&</div>
                <div style={{ fontSize: 'clamp(3rem, 10vw, 6.5rem)', letterSpacing: '0.06em' }}>ТУЗАГАШ</div>
              </h1>
              <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(240,220,160,0.7)', marginTop: 16 }}>
                ПРИГЛАШАЕМ ВАС НА НАШУ СВАДЬБУ
              </p>
              <div style={{ margin: '14px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 1, background: 'rgba(212,175,55,0.4)' }} />
                <span style={{ color: 'rgba(212,175,55,0.6)', fontSize: '0.8rem' }}>❧</span>
                <div style={{ width: 40, height: 1, background: 'rgba(212,175,55,0.4)' }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.3rem, 3.5vw, 2rem)', fontWeight: 300, color: 'rgba(240,220,160,0.85)', letterSpacing: '0.08em' }}>
                18.08.2026
              </p>
            </div>
          </div>

          {/* Bottom: timer + buttons */}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: 'clamp(32px,6vw,60px) 24px clamp(40px,8vh,80px)', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,220,160,0.45)', marginBottom: 16 }}>до нашего дня</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
              {timerValues.map((val, i) => (
                <div key={timerLabels[i]} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ background: 'rgba(255,248,230,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 2, padding: 'clamp(10px,2vw,16px) clamp(12px,2.5vw,22px)', textAlign: 'center', minWidth: 64 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 300, lineHeight: 1, color: '#f0e2a8' }}>
                      {String(val).padStart(2, '0')}
                    </div>
                    <div style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.48rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,220,160,0.4)', marginTop: 5 }}>
                      {timerLabels[i]}
                    </div>
                  </div>
                  {i < 3 && <span style={{ color: 'rgba(212,175,55,0.3)', fontSize: '1.2rem' }}>·</span>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => scrollTo('rsvp')} style={{ background: 'rgba(139,105,20,0.85)', backdropFilter: 'blur(8px)', color: '#f5edd8', border: '1px solid rgba(212,175,55,0.4)', cursor: 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '13px 32px', transition: 'all 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(110,82,16,0.95)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(139,105,20,0.85)')}>
                Подтвердить присутствие
              </button>
              <button onClick={() => scrollTo('story')} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', color: 'rgba(240,220,160,0.85)', border: '1px solid rgba(212,175,55,0.3)', cursor: 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '13px 32px', transition: 'all 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                Наша история
              </button>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', animation: 'float 2.5s ease-in-out infinite', zIndex: 3 }}>
            <Icon name="ChevronDown" size={16} style={{ color: 'rgba(212,175,55,0.35)' }} />
          </div>
        </section>

        {/* ── НАША ИСТОРИЯ ── по макету */}
        <section id="story" style={{ padding: '90px 24px', background: '#faf7f0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, fontStyle: 'italic', color: '#4a3010', marginBottom: 14 }}>
                  Наша история
                </h2>
                <Divider />
              </div>
            </Reveal>

            {/* Макет как на скриншоте — два фото с подписями */}
            <Reveal>
              <div style={{ position: 'relative', width: '100%' }}>
                {/* Используем само изображение как есть */}
                <img
                  src={STORY_IMG}
                  alt="Наша история"
                  style={{ width: '100%', borderRadius: 4, display: 'block', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}
                />
              </div>
            </Reveal>

            {/* Дополнительный текст под фото */}
            <Reveal delay={0.15}>
              <div style={{ textAlign: 'center', marginTop: 48, maxWidth: 560, margin: '48px auto 0' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(74,48,16,0.7)', lineHeight: 1.8 }}>
                  Судьба хранила нас друг для друга с самого детства. И когда пришло время — всё встало на своё место.
                </p>
                <div style={{ marginTop: 20 }}><Divider /></div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── ПРОГРАММА ── */}
        <section id="program" style={{ padding: '90px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 52 }}>
                <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.56rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(139,105,20,0.58)' }}>18 августа 2026</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, margin: '10px 0 16px', color: '#1a1208' }}>Программа дня</h2>
                <Divider />
              </div>
            </Reveal>
            {[
              { time: '10:00', icon: 'PartyPopper', title: 'Алтай той', desc: 'Торжество в с. Новый Бельтир, ул. Кара-Кем, д. 5. Встреча гостей, традиционное угощение, праздничное начало дня.' },
              { time: '14:00', icon: 'Waves', title: 'Катание', desc: 'Прогулка и катание в живописных окрестностях Алтая.' },
              { time: '16:00', icon: 'UtensilsCrossed', title: 'Банкет', desc: 'Праздничный стол, тосты, музыка и первый танец. Кафе «Туштажу», с. Кош-Агач, ул. Каменистая, 27.' },
              { time: '22:00', icon: 'Moon', title: 'Завершение', desc: 'Финальные тосты, тёплые объятия и прощание под алтайским небом.' },
            ].map((item, i) => (
              <Reveal key={item.time} delay={i * 0.07}>
                <div style={{ display: 'flex', gap: 22, padding: '26px 0', borderBottom: i < 3 ? '1px solid rgba(139,105,20,0.09)' : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, paddingTop: 4 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(139,105,20,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B6914', background: 'rgba(139,105,20,0.03)' }}>
                      <Icon name={item.icon} fallback="Clock" size={15} />
                    </div>
                    {i < 3 && <div style={{ width: 1, flex: 1, background: 'rgba(139,105,20,0.1)', minHeight: 18 }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.55rem', fontWeight: 400, color: '#8B6914', lineHeight: 1 }}>{item.time}</span>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 500, margin: '4px 0 5px', color: '#1a1208' }}>{item.title}</h3>
                    <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(26,18,8,0.43)' }}>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── МЕСТО ── */}
        <section id="venue" style={{ padding: '90px 24px', background: '#faf7f0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 52 }}>
                <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.56rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(139,105,20,0.58)' }}>где нас найти</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, margin: '10px 0 16px', color: '#1a1208' }}>Место проведения</h2>
                <Divider />
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-8">
              <Reveal>
                <div style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.18)', padding: 36, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid rgba(139,105,20,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B6914', flexShrink: 0 }}>
                      <Icon name="MapPin" size={17} />
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1208' }}>Кафе «Туштажу»</h3>
                  </div>
                  <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.8rem', lineHeight: 1.9, color: 'rgba(26,18,8,0.48)', marginBottom: 18 }}>
                    Банкет пройдёт в уютном кафе «Туштажу» в сердце с. Кош-Агач. Вкусная кухня, тёплая атмосфера и алтайское гостеприимство.
                  </p>
                  <div style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.76rem', color: 'rgba(26,18,8,0.38)', lineHeight: 2.3, marginBottom: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <Icon name="MapPin" size={12} style={{ color: 'rgba(139,105,20,0.48)', flexShrink: 0, marginTop: 3 }} />
                      Республика Алтай, с. Кош-Агач, ул. Каменистая, 27
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Icon name="Clock" size={12} style={{ color: 'rgba(139,105,20,0.48)', flexShrink: 0 }} />
                      Банкет начинается в 16:00
                    </div>
                  </div>
                  <a href="https://yandex.ru/maps/?text=Республика+Алтай,+Кош-Агач,+Каменистая+27"
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', marginTop: 24, background: '#8B6914', color: '#f7f4ee', textAlign: 'center', padding: '12px 20px', textDecoration: 'none', fontFamily: "'Golos Text', sans-serif", fontSize: '0.65rem', letterSpacing: '0.17em', textTransform: 'uppercase', transition: 'background 0.3s' }}>
                    Открыть на карте
                  </a>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.18)', overflow: 'hidden', height: 380, position: 'relative' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2258!2d88.657!3d50.001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDAwJzAyLjQiTiA4OMKwMzknMjUuMiJF!5e0!3m2!1sru!2sru!4v1234"
                    width="100%" height="100%"
                    style={{ border: 0, filter: 'sepia(0.25) saturate(0.85)' }}
                    allowFullScreen loading="lazy"
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: 14, left: 18 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', fontStyle: 'italic', color: '#8B6914' }}>Кафе «Туштажу»</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── RSVP ── */}
        <section id="rsvp" style={{ padding: '90px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 540, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.56rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(139,105,20,0.58)' }}>ваш ответ</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, margin: '10px 0 14px', color: '#1a1208' }}>Подтверждение</h2>
                <Divider />
                <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.78rem', lineHeight: 1.8, color: 'rgba(26,18,8,0.38)', marginTop: 14 }}>
                  Просим подтвердить присутствие до <strong style={{ color: 'rgba(26,18,8,0.6)' }}>1 августа 2026 года</strong>
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              {rsvpSent ? (
                <div style={{ background: '#faf7f0', border: '1px solid rgba(212,175,55,0.2)', padding: 44, textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(139,105,20,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B6914', margin: '0 auto 18px', animation: 'float 3s ease-in-out infinite' }}>
                    <Icon name="Check" size={24} />
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.9rem', fontWeight: 400, marginBottom: 8, color: '#1a1208' }}>Спасибо!</h3>
                  <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.8rem', color: 'rgba(26,18,8,0.43)', lineHeight: 1.9 }}>
                    До встречи 18 августа в Кош-Агаче!
                  </p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setRsvpSent(true); }} style={{ background: '#faf7f0', border: '1px solid rgba(212,175,55,0.18)', padding: 32 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                      <label style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.38)', display: 'block', marginBottom: 7 }}>Ваше имя</label>
                      <input style={{ width: '100%', background: '#fff', border: '1px solid rgba(212,175,55,0.22)', padding: '10px 13px', fontFamily: "'Golos Text', sans-serif", fontSize: '0.87rem', color: '#1a1208', outline: 'none', boxSizing: 'border-box' }}
                        placeholder="Имя и фамилия" value={rsvpForm.name} onChange={e => setRsvpForm({ ...rsvpForm, name: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.38)', display: 'block', marginBottom: 7 }}>Вы придёте?</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['Да, буду!', 'К сожалению, нет'].map(opt => (
                          <button key={opt} type="button" onClick={() => setRsvpForm({ ...rsvpForm, attending: opt })}
                            style={{ flex: 1, padding: '10px 8px', cursor: 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.7rem', border: `1px solid ${rsvpForm.attending === opt ? '#8B6914' : 'rgba(212,175,55,0.22)'}`, background: rsvpForm.attending === opt ? 'rgba(139,105,20,0.07)' : '#fff', color: rsvpForm.attending === opt ? '#8B6914' : 'rgba(26,18,8,0.43)', transition: 'all 0.22s' }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.38)', display: 'block', marginBottom: 7 }}>Количество гостей</label>
                      <select style={{ width: '100%', background: '#fff', border: '1px solid rgba(212,175,55,0.22)', padding: '10px 13px', fontFamily: "'Golos Text', sans-serif", fontSize: '0.87rem', color: '#1a1208', outline: 'none', cursor: 'pointer' }}
                        value={rsvpForm.guests} onChange={e => setRsvpForm({ ...rsvpForm, guests: e.target.value })}>
                        {['1','2','3','4','5'].map(n => <option key={n} value={n}>{n} {n==='1'?'гость':n==='5'?'гостей':'гостя'}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.38)', display: 'block', marginBottom: 7 }}>Пожелания молодожёнам</label>
                      <textarea style={{ width: '100%', background: '#fff', border: '1px solid rgba(212,175,55,0.22)', padding: '10px 13px', fontFamily: "'Golos Text', sans-serif", fontSize: '0.87rem', color: '#1a1208', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                        placeholder="Ваши пожелания..." rows={3} value={rsvpForm.message} onChange={e => setRsvpForm({ ...rsvpForm, message: e.target.value })} />
                    </div>
                    <button type="submit" style={{ background: '#8B6914', color: '#f7f4ee', border: 'none', cursor: 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '13px 20px', transition: 'background 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#6e5210')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#8B6914')}>
                      Отправить ответ
                    </button>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </section>

        {/* ── КОНТАКТЫ ── */}
        <section id="contacts" style={{ padding: '90px 24px', background: '#faf7f0' }}>
          <div style={{ maxWidth: 660, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.56rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(139,105,20,0.58)' }}>мы на связи</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, margin: '10px 0 14px', color: '#1a1208' }}>Контакты</h2>
                <Divider />
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { role: 'Невеста', name: 'Аэлита Алексеевна', phone: '8 983 581-61-97', href: 'tel:+79835816197' },
                { role: 'Жених', name: 'Тузагаш Мергенович', phone: '8 913 404-33-19', href: 'tel:+79134043319' },
              ].map((person, i) => (
                <Reveal key={person.name} delay={i * 0.1}>
                  <div style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.18)', padding: 32, textAlign: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(139,105,20,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B6914', margin: '0 auto 12px', background: 'rgba(139,105,20,0.03)' }}>
                      <Icon name="User" size={17} />
                    </div>
                    <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.56rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.28)', display: 'block', marginBottom: 5 }}>{person.role}</span>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 500, color: '#1a1208', marginBottom: 16 }}>{person.name}</h3>
                    <a href={person.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: 'rgba(26,18,8,0.48)', textDecoration: 'none', fontFamily: "'Golos Text', sans-serif", fontSize: '0.87rem', transition: 'color 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#8B6914')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,18,8,0.48)')}>
                      <Icon name="Phone" size={12} style={{ color: 'rgba(139,105,20,0.45)', flexShrink: 0 }} />
                      {person.phone}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '48px 24px 36px', textAlign: 'center', background: '#1a1208' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, fontStyle: 'italic', color: 'rgba(212,175,55,0.65)', marginBottom: 10 }}>
            Аэлита & Тузагаш
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '0 auto', maxWidth: 280 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25))' }} />
            <span style={{ color: 'rgba(212,175,55,0.3)', fontSize: '0.6rem' }}>❧</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(212,175,55,0.25), transparent)' }} />
          </div>
          <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 14, color: 'rgba(247,244,238,0.16)' }}>
            18 · 08 · 2026 · Республика Алтай
          </p>
        </footer>
      </div>
    </>
  );
}
