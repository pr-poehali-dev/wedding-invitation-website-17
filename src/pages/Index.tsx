import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const WEDDING_DATE = new Date('2026-08-18T10:00:00');

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
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
      <span style={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.75rem' }}>◆</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
    </div>
  );
}

/* ── Конверт-заставка ── */
function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'done'>('idle');

  const handleClick = () => {
    if (phase !== 'idle') return;
    setPhase('opening');
    setTimeout(() => {
      setPhase('done');
      setTimeout(onOpen, 400);
    }, 1200);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'linear-gradient(160deg, #f7f4ee 0%, #e8e0cc 60%, #ddd3b8 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', userSelect: 'none',
        opacity: phase === 'done' ? 0 : 1,
        transition: phase === 'done' ? 'opacity 0.4s ease' : 'none',
      }}
    >
      {/* bg mountain */}
      <svg viewBox="0 0 1440 320" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', opacity: 0.06, pointerEvents: 'none' }} preserveAspectRatio="none">
        <path d="M0,320 L0,220 L120,120 L240,180 L360,60 L480,140 L600,40 L720,100 L840,20 L960,80 L1080,30 L1200,90 L1320,50 L1440,110 L1440,320 Z" fill="#5c4a1e" />
      </svg>

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 24px' }}>
        <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(139,105,20,0.55)', marginBottom: 40, animation: 'fade-up 0.8s ease-out 0.2s both' }}>
          у вас письмо
        </p>

        {/* Envelope SVG */}
        <div
          style={{
            width: 'clamp(200px, 50vw, 300px)',
            margin: '0 auto 40px',
            animation: phase === 'idle' ? 'float 3s ease-in-out infinite' : 'none',
            transform: phase === 'opening' ? 'scale(1.08) translateY(-10px)' : 'scale(1)',
            transition: 'transform 0.5s ease',
            filter: phase === 'opening' ? 'drop-shadow(0 24px 48px rgba(139,105,20,0.25))' : 'drop-shadow(0 8px 24px rgba(139,105,20,0.12))',
          }}
        >
          <svg viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* envelope body */}
            <rect x="4" y="44" width="292" height="172" rx="8" fill="#fffdf7" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
            {/* bottom flap lines (decoration) */}
            <line x1="4" y1="216" x2="150" y2="130" stroke="rgba(212,175,55,0.25)" strokeWidth="1" />
            <line x1="296" y1="216" x2="150" y2="130" stroke="rgba(212,175,55,0.25)" strokeWidth="1" />
            {/* top flap */}
            <path
              d={phase === 'opening'
                ? 'M4 44 L150 44 L296 44 L150 4 Z'
                : 'M4 44 L150 130 L296 44 Z'}
              fill={phase === 'opening' ? '#fffdf7' : '#f5edd8'}
              stroke="rgba(212,175,55,0.5)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              style={{ transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)', transformOrigin: '150px 44px' }}
            />
            {/* wax seal */}
            <circle cx="150" cy="130" r="22" fill="#8B6914" opacity={phase === 'opening' ? 0 : 1} style={{ transition: 'opacity 0.3s ease' }} />
            <text x="150" y="135" textAnchor="middle" fill="rgba(255,253,247,0.9)" fontSize="14" fontFamily="Cormorant Garamond, serif" fontStyle="italic">А&Т</text>
            {/* envelope lines (letter visible when opening) */}
            {phase === 'opening' && (
              <>
                <rect x="80" y="70" width="140" height="8" rx="2" fill="rgba(139,105,20,0.15)" />
                <rect x="100" y="86" width="100" height="6" rx="2" fill="rgba(139,105,20,0.1)" />
                <rect x="90" y="100" width="120" height="6" rx="2" fill="rgba(139,105,20,0.1)" />
              </>
            )}
          </svg>
        </div>

        <div style={{ animation: 'fade-up 0.8s ease-out 0.5s both' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: 400, fontStyle: 'italic', color: '#1a1208', marginBottom: 8 }}>
            Аэлита & Тузагаш
          </p>
          <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(26,18,8,0.35)', textTransform: 'uppercase' }}>
            18 августа 2026
          </p>
        </div>

        <div style={{ marginTop: 44, animation: 'fade-up 0.8s ease-out 0.8s both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', border: '1px solid rgba(139,105,20,0.3)', color: '#8B6914', fontFamily: "'Golos Text', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            <Icon name="Mail" size={14} />
            нажмите, чтобы открыть
          </div>
        </div>
      </div>
    </div>
  );
}

const UPLOAD_URL = 'https://functions.poehali.dev/a2ef0256-232a-4681-8e7b-785a5cbca919';
const STORAGE_KEY = 'wedding_music_url';

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
        audioRef.current.volume = 0.4;
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 600);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, filename: 'river-flows-in-you.mp3' }),
      });
      const data = await res.json();
      if (data.url) {
        setMusicUrl(data.url);
        localStorage.setItem(STORAGE_KEY, data.url);
        setShowUpload(false);
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.volume = 0.4;
          audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navItems = [
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

      {/* Audio element */}
      <audio ref={audioRef} loop src={musicUrl || undefined} preload={musicUrl ? 'auto' : 'none'} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/mpeg,audio/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Music controls */}
      {opened && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>

          {/* Upload panel */}
          {showUpload && (
            <div style={{
              background: 'rgba(247,244,238,0.97)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(139,105,20,0.25)', padding: '16px 20px',
              boxShadow: '0 8px 32px rgba(139,105,20,0.15)',
              maxWidth: 240,
            }}>
              <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.72rem', color: '#1a1208', marginBottom: 12, lineHeight: 1.5 }}>
                Загрузите <strong>River Flows In You</strong><br />в формате mp3
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  width: '100%', background: uploading ? 'rgba(139,105,20,0.4)' : '#8B6914',
                  color: '#f7f4ee', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Golos Text', sans-serif", fontSize: '0.65rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {uploading
                  ? <><Icon name="Loader" size={13} />Загружаю...</>
                  : <><Icon name="Upload" size={13} />Выбрать файл</>
                }
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            {/* Upload button (show if no music) */}
            {!musicUrl && (
              <button
                onClick={() => setShowUpload(v => !v)}
                title="Загрузить музыку"
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(247,244,238,0.95)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(139,105,20,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 4px 16px rgba(139,105,20,0.12)',
                  color: '#8B6914', transition: 'transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Icon name="Upload" size={16} />
              </button>
            )}

            {/* Play/pause */}
            <button
              onClick={musicUrl ? toggleMusic : () => setShowUpload(v => !v)}
              title={musicUrl ? (playing ? 'Пауза' : 'Играть') : 'Загрузить музыку'}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: playing ? '#8B6914' : 'rgba(247,244,238,0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(139,105,20,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(139,105,20,0.15)',
                color: playing ? '#f7f4ee' : '#8B6914', transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <Icon name={playing ? 'Pause' : 'Music'} size={17} />
            </button>
          </div>

          {/* Label */}
          {musicUrl && (
            <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(26,18,8,0.3)', textAlign: 'right', marginTop: 2 }}>
              River Flows In You
            </p>
          )}
        </div>
      )}

      <div style={{ background: '#f7f4ee', minHeight: '100vh', fontFamily: "'Golos Text', sans-serif", color: '#1a1208' }}>

        {/* NAV */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(247,244,238,0.92)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(212,175,55,0.18)',
        }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
            <button onClick={() => scrollTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontStyle: 'italic', color: '#8B6914', fontWeight: 500 }}>
              А & Т
            </button>
            <div className="hidden md:flex" style={{ gap: 32 }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.45)', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#8B6914')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,18,8,0.45)')}>
                  {item.label}
                </button>
              ))}
            </div>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B6914' }}>
              <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
          {menuOpen && (
            <div style={{ padding: '16px 24px 20px', borderTop: '1px solid rgba(212,175,55,0.15)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: "'Golos Text', sans-serif", fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.5)' }}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* HERO */}
        <section id="hero" style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '100px 24px 80px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(160deg, #f7f4ee 0%, #ede8db 40%, #e4dcc8 100%)',
        }}>
          <svg viewBox="0 0 1440 320" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', opacity: 0.06, pointerEvents: 'none' }} preserveAspectRatio="none">
            <path d="M0,320 L0,220 L120,120 L240,180 L360,60 L480,140 L600,40 L720,100 L840,20 L960,80 L1080,30 L1200,90 L1320,50 L1440,110 L1440,320 Z" fill="#5c4a1e" />
          </svg>
          <svg viewBox="0 0 1440 320" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', opacity: 0.04, pointerEvents: 'none' }} preserveAspectRatio="none">
            <path d="M0,320 L0,260 L180,160 L360,220 L540,120 L720,180 L900,80 L1080,150 L1260,100 L1440,160 L1440,320 Z" fill="#3d2e0e" />
          </svg>
          <div style={{ position: 'absolute', top: '18%', right: '8%', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(139,105,20,0.1)', animation: 'float 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 160, height: 160, borderRadius: '50%', border: '1px solid rgba(139,105,20,0.08)', animation: 'float 10s ease-in-out infinite reverse' }} />

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, maxWidth: 680 }}>
            <div style={{ animation: 'fade-up 0.8s ease-out 0.1s both' }}>
              <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(139,105,20,0.6)' }}>свадьба</span>
            </div>
            <div style={{ animation: 'fade-up 0.8s ease-out 0.3s both' }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3.2rem, 12vw, 7rem)', fontWeight: 400, lineHeight: 1.05, margin: '14px 0 6px', color: '#1a1208' }}>
                Аэлита
                <span style={{ display: 'block', color: 'rgba(139,105,20,0.3)', fontSize: '0.45em', fontStyle: 'italic', margin: '2px 0' }}>&</span>
                Тузагаш
              </h1>
            </div>
            <div style={{ animation: 'fade-up 0.8s ease-out 0.45s both' }}><Divider /></div>
            <div style={{ animation: 'fade-up 0.8s ease-out 0.55s both', marginTop: 20 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(26,18,8,0.55)', letterSpacing: '0.04em' }}>
                18 августа 2026 года
              </p>
              <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(26,18,8,0.3)', textTransform: 'uppercase', marginTop: 4 }}>
                Республика Алтай · с. Новый Бельтир
              </p>
            </div>

            {/* TIMER */}
            <div style={{ animation: 'fade-up 0.8s ease-out 0.7s both', marginTop: 52 }}>
              <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.28)', marginBottom: 20 }}>до нашего дня</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {timerValues.map((val, i) => (
                  <div key={timerLabels[i]} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 2, padding: 'clamp(14px,3vw,22px) clamp(16px,3.5vw,28px)', textAlign: 'center', minWidth: 72 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 6vw, 3.4rem)', fontWeight: 400, lineHeight: 1, color: '#8B6914' }}>
                        {String(val).padStart(2, '0')}
                      </div>
                      <div style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)', marginTop: 6 }}>
                        {timerLabels[i]}
                      </div>
                    </div>
                    {i < 3 && <span style={{ color: 'rgba(139,105,20,0.25)', fontSize: '1.4rem', fontWeight: 100 }}>·</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ animation: 'fade-up 0.8s ease-out 0.9s both', marginTop: 44, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => scrollTo('rsvp')} style={{ background: '#8B6914', color: '#f7f4ee', border: 'none', cursor: 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 36px', transition: 'all 0.3s ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#6e5210')}
                onMouseLeave={e => (e.currentTarget.style.background = '#8B6914')}>
                Подтвердить присутствие
              </button>
              <button onClick={() => scrollTo('venue')} style={{ background: 'transparent', color: '#8B6914', border: '1px solid rgba(139,105,20,0.4)', cursor: 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 36px', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,105,20,0.06)'; e.currentTarget.style.borderColor = 'rgba(139,105,20,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(139,105,20,0.4)'; }}>
                Место проведения
              </button>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', animation: 'float 2.5s ease-in-out infinite' }}>
            <Icon name="ChevronDown" size={16} style={{ color: 'rgba(139,105,20,0.3)' }} />
          </div>
        </section>

        {/* PROGRAM */}
        <section id="program" style={{ padding: '100px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(139,105,20,0.6)' }}>18 августа 2026</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 400, margin: '10px 0 16px', color: '#1a1208' }}>Программа дня</h2>
                <Divider />
              </div>
            </Reveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { time: '10:00', icon: 'PartyPopper', title: 'Алтай той', desc: 'Торжество в с. Новый Бельтир, ул. Кара-Кем, д. 5. Встреча гостей, традиционное угощение, праздничное начало дня.' },
                { time: '14:00', icon: 'Waves', title: 'Катание', desc: 'Прогулка и катание в живописных окрестностях Алтая.' },
                { time: '16:00', icon: 'UtensilsCrossed', title: 'Банкет', desc: 'Праздничный стол, тосты, музыка и первый танец молодожёнов.' },
                { time: '22:00', icon: 'Moon', title: 'Завершение', desc: 'Финальные тосты, тёплые объятия и прощание под алтайским небом.' },
              ].map((item, i) => (
                <Reveal key={item.time} delay={i * 0.08}>
                  <div style={{ display: 'flex', gap: 24, padding: '28px 0', borderBottom: i < 3 ? '1px solid rgba(139,105,20,0.1)' : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0, paddingTop: 4 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(139,105,20,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B6914', background: 'rgba(139,105,20,0.04)' }}>
                        <Icon name={item.icon} fallback="Clock" size={16} />
                      </div>
                      {i < 3 && <div style={{ width: 1, flex: 1, background: 'rgba(139,105,20,0.12)', minHeight: 20 }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, color: '#8B6914', lineHeight: 1 }}>{item.time}</span>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 500, margin: '4px 0 6px', color: '#1a1208' }}>{item.title}</h3>
                      <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.82rem', lineHeight: 1.7, color: 'rgba(26,18,8,0.45)' }}>{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* VENUE */}
        <section id="venue" style={{ padding: '100px 24px', background: '#f7f4ee' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(139,105,20,0.6)' }}>где нас найти</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 400, margin: '10px 0 16px', color: '#1a1208' }}>Место проведения</h2>
                <Divider />
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-8">
              <Reveal>
                <div style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.2)', padding: 40, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(139,105,20,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B6914', flexShrink: 0 }}>
                      <Icon name="MapPin" size={18} />
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 500, color: '#1a1208' }}>с. Новый Бельтир</h3>
                  </div>
                  <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.82rem', lineHeight: 1.9, color: 'rgba(26,18,8,0.5)', marginBottom: 20 }}>
                    Горное село в Республике Алтай, в окружении величественных хребтов Чуйских Альп. Чистый воздух, алтайская природа и особая атмосфера торжества.
                  </p>
                  <div style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.78rem', color: 'rgba(26,18,8,0.4)', lineHeight: 2.4, marginBottom: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon name="MapPin" size={13} style={{ color: 'rgba(139,105,20,0.5)', flexShrink: 0 }} />
                      Республика Алтай, с. Новый Бельтир, ул. Кара-Кем, д. 5
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon name="Clock" size={13} style={{ color: 'rgba(139,105,20,0.5)', flexShrink: 0 }} />
                      Начало в 10:00
                    </div>
                  </div>
                  <a href="https://yandex.ru/maps/?text=Республика+Алтай,+Новый+Бельтир,+Кара-Кем+5"
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', marginTop: 28, background: '#8B6914', color: '#f7f4ee', textAlign: 'center', padding: '13px 24px', textDecoration: 'none', fontFamily: "'Golos Text', sans-serif", fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    Открыть на карте
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.2)', overflow: 'hidden', height: 420, position: 'relative' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2293.0!2d88.6!3d50.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDAzJzAwLjAiTiA4OMKwMzYnMDAuMCJF!5e0!3m2!1sru!2sru!4v1234"
                    width="100%" height="100%"
                    style={{ border: 0, filter: 'sepia(0.3) saturate(0.8)' }}
                    allowFullScreen loading="lazy"
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: 16, left: 20 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontStyle: 'italic', color: '#8B6914' }}>Кара-Кем, д. 5</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* RSVP */}
        <section id="rsvp" style={{ padding: '100px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 52 }}>
                <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(139,105,20,0.6)' }}>ваш ответ</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 400, margin: '10px 0 16px', color: '#1a1208' }}>Подтверждение</h2>
                <Divider />
                <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.8rem', lineHeight: 1.8, color: 'rgba(26,18,8,0.4)', marginTop: 16 }}>
                  Просим подтвердить присутствие до <strong style={{ color: 'rgba(26,18,8,0.65)' }}>1 августа 2026 года</strong>
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              {rsvpSent ? (
                <div style={{ background: '#f7f4ee', border: '1px solid rgba(212,175,55,0.25)', padding: 48, textAlign: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', border: '1px solid rgba(139,105,20,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B6914', margin: '0 auto 20px', animation: 'float 3s ease-in-out infinite' }}>
                    <Icon name="Check" size={26} />
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, marginBottom: 10, color: '#1a1208' }}>Спасибо!</h3>
                  <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.82rem', color: 'rgba(26,18,8,0.45)', lineHeight: 1.9 }}>
                    Мы получили ваш ответ и очень рады.<br />До встречи 18 августа в Новом Бельтире!
                  </p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setRsvpSent(true); }} style={{ background: '#f7f4ee', border: '1px solid rgba(212,175,55,0.2)', padding: 36 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.4)', display: 'block', marginBottom: 8 }}>Ваше имя</label>
                      <input style={{ width: '100%', background: '#fff', border: '1px solid rgba(212,175,55,0.25)', padding: '11px 14px', fontFamily: "'Golos Text', sans-serif", fontSize: '0.88rem', color: '#1a1208', outline: 'none', boxSizing: 'border-box' }}
                        placeholder="Имя и фамилия" value={rsvpForm.name} onChange={e => setRsvpForm({ ...rsvpForm, name: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.4)', display: 'block', marginBottom: 8 }}>Вы придёте?</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {['Да, буду!', 'К сожалению, нет'].map(opt => (
                          <button key={opt} type="button" onClick={() => setRsvpForm({ ...rsvpForm, attending: opt })}
                            style={{ flex: 1, padding: '11px 8px', cursor: 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.72rem', border: `1px solid ${rsvpForm.attending === opt ? '#8B6914' : 'rgba(212,175,55,0.25)'}`, background: rsvpForm.attending === opt ? 'rgba(139,105,20,0.08)' : '#fff', color: rsvpForm.attending === opt ? '#8B6914' : 'rgba(26,18,8,0.45)', transition: 'all 0.25s ease' }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.4)', display: 'block', marginBottom: 8 }}>Количество гостей</label>
                      <select style={{ width: '100%', background: '#fff', border: '1px solid rgba(212,175,55,0.25)', padding: '11px 14px', fontFamily: "'Golos Text', sans-serif", fontSize: '0.88rem', color: '#1a1208', outline: 'none', cursor: 'pointer' }}
                        value={rsvpForm.guests} onChange={e => setRsvpForm({ ...rsvpForm, guests: e.target.value })}>
                        {['1', '2', '3', '4', '5'].map(n => <option key={n} value={n}>{n} {n === '1' ? 'гость' : n === '5' ? 'гостей' : 'гостя'}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.4)', display: 'block', marginBottom: 8 }}>Пожелания молодожёнам</label>
                      <textarea style={{ width: '100%', background: '#fff', border: '1px solid rgba(212,175,55,0.25)', padding: '11px 14px', fontFamily: "'Golos Text', sans-serif", fontSize: '0.88rem', color: '#1a1208', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                        placeholder="Ваши пожелания..." rows={3} value={rsvpForm.message} onChange={e => setRsvpForm({ ...rsvpForm, message: e.target.value })} />
                    </div>
                    <button type="submit" style={{ background: '#8B6914', color: '#f7f4ee', border: 'none', cursor: 'pointer', fontFamily: "'Golos Text', sans-serif", fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 24px', marginTop: 4, transition: 'background 0.3s' }}
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

        {/* CONTACTS */}
        <section id="contacts" style={{ padding: '100px 24px', background: '#f7f4ee' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 52 }}>
                <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(139,105,20,0.6)' }}>мы на связи</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 400, margin: '10px 0 16px', color: '#1a1208' }}>Контакты</h2>
                <Divider />
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { role: 'Невеста', name: 'Аэлита Алексеевна', phone: '8 983 581-61-97', href: 'tel:+79835816197' },
                { role: 'Жених', name: 'Тузагаш Мергенович', phone: '8 913 404-33-19', href: 'tel:+79134043319' },
              ].map((person, i) => (
                <Reveal key={person.name} delay={i * 0.1}>
                  <div style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.2)', padding: 36, textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(139,105,20,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B6914', margin: '0 auto 14px', background: 'rgba(139,105,20,0.04)' }}>
                      <Icon name="User" size={18} />
                    </div>
                    <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)', display: 'block', marginBottom: 6 }}>{person.role}</span>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1208', marginBottom: 18 }}>{person.name}</h3>
                    <a href={person.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(26,18,8,0.5)', textDecoration: 'none', fontFamily: "'Golos Text', sans-serif", fontSize: '0.88rem', transition: 'color 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#8B6914')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,18,8,0.5)')}>
                      <Icon name="Phone" size={13} style={{ color: 'rgba(139,105,20,0.5)', flexShrink: 0 }} />
                      {person.phone}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '52px 24px 40px', textAlign: 'center', background: '#1a1208', color: 'rgba(247,244,238,0.4)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 400, fontStyle: 'italic', color: 'rgba(212,175,55,0.7)', marginBottom: 12 }}>
            Аэлита & Тузагаш
          </div>
          <Divider />
          <p style={{ fontFamily: "'Golos Text', sans-serif", fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 16, color: 'rgba(247,244,238,0.18)' }}>
            18 · 08 · 2026 · Республика Алтай
          </p>
        </footer>
      </div>
    </>
  );
}