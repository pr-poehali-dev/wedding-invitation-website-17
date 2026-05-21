import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const WEDDING_DATE = new Date('2025-09-14T14:00:00');

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
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

function useIntersection(threshold = 0.12) {
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

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useIntersection();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </div>
  );
}

function GoldOrnament() {
  return (
    <div className="flex items-center gap-3 justify-center my-2">
      <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
      <span style={{ color: 'var(--gold)', fontSize: '0.9rem', opacity: 0.6 }}>✦</span>
      <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
    </div>
  );
}

function TimerBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="timer-block flex flex-col items-center justify-center px-6 py-5 md:px-8 md:py-7" style={{ minWidth: 80 }}>
      <span
        className="font-cormorant gold-gradient-text"
        style={{ fontSize: 'clamp(2.2rem, 7vw, 3.8rem)', fontWeight: 300, lineHeight: 1 }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span
        className="font-montserrat mt-2"
        style={{ fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Index() {
  const [rsvpForm, setRsvpForm] = useState({ name: '', guests: '1', attending: '', message: '' });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const timeLeft = useCountdown(WEDDING_DATE);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSent(true);
  };

  const navItems = [
    { id: 'about', label: 'История' },
    { id: 'program', label: 'Программа' },
    { id: 'venue', label: 'Место' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'contacts', label: 'Контакты' },
  ];

  return (
    <div style={{ background: 'var(--emerald-deep)', minHeight: '100vh', color: 'var(--ivory)' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10, 26, 20, 0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201, 168, 76, 0.1)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div className="flex items-center justify-between" style={{ height: 64 }}>
            <button
              onClick={() => scrollTo('hero')}
              className="font-cormorant gold-gradient-text"
              style={{ fontSize: '1.4rem', fontWeight: 400, fontStyle: 'italic', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              А & М
            </button>
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="nav-link" style={{ background: 'none', border: 'none' }}>
                  {item.label}
                </button>
              ))}
            </div>
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer' }}
            >
              <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden flex flex-col gap-4 py-6" style={{ borderTop: '1px solid rgba(201, 168, 76, 0.1)' }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="nav-link text-left" style={{ background: 'none', border: 'none' }}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '100px 24px 80px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(26,61,42,0.9) 0%, var(--emerald-deep) 65%)',
      }}>
        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: '12%', left: '6%', width: 350, height: 350, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.05)', animation: 'float 7s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '8%', right: '4%', width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.07)', animation: 'float 9s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '35%', right: '10%', width: 90, height: 90, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.1)' }} />
        <div style={{ position: 'absolute', top: '60%', left: '3%', width: 50, height: 50, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.08)' }} />

        <div className="text-center relative z-10 animate-fade-up" style={{ maxWidth: 720, animationDelay: '0.1s' }}>
          <span className="font-montserrat" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.75 }}>
            приглашают вас разделить их радость
          </span>

          <h1 className="font-cormorant" style={{ fontSize: 'clamp(3.5rem, 13vw, 7.5rem)', fontWeight: 300, lineHeight: 1.05, margin: '20px 0 10px' }}>
            <span className="gold-gradient-text">Анна</span>
            <span style={{ color: 'rgba(245,240,232,0.2)', fontSize: '0.55em', margin: '0 10px', fontStyle: 'italic' }}>&</span>
            <span className="gold-gradient-text">Михаил</span>
          </h1>

          <GoldOrnament />

          <p className="font-cormorant" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.7rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(245,240,232,0.65)', letterSpacing: '0.04em', marginTop: 8 }}>
            14 сентября 2025 года
          </p>
          <p className="font-montserrat" style={{ fontSize: '0.68rem', letterSpacing: '0.22em', color: 'rgba(245,240,232,0.3)', textTransform: 'uppercase', marginTop: 4 }}>
            Усадьба Захарово · Московская область
          </p>

          {/* TIMER */}
          <div style={{ marginTop: 48 }}>
            <p className="font-montserrat" style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)', marginBottom: 20 }}>
              до нашего дня осталось
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <TimerBlock value={timeLeft.days} label="дней" />
              <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: '1.8rem', fontWeight: 100, lineHeight: 1 }}>·</span>
              <TimerBlock value={timeLeft.hours} label="часов" />
              <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: '1.8rem', fontWeight: 100, lineHeight: 1 }}>·</span>
              <TimerBlock value={timeLeft.minutes} label="минут" />
              <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: '1.8rem', fontWeight: 100, lineHeight: 1 }}>·</span>
              <TimerBlock value={timeLeft.seconds} label="секунд" />
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap" style={{ marginTop: 44 }}>
            <button className="btn-gold" onClick={() => scrollTo('rsvp')}>Подтвердить присутствие</button>
            <button className="btn-outline-gold" onClick={() => scrollTo('about')}>Наша история</button>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', animation: 'float 2.5s ease-in-out infinite' }}>
          <Icon name="ChevronDown" size={18} style={{ color: 'rgba(201,168,76,0.35)' }} />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '100px 24px', background: 'radial-gradient(ellipse at 80% 40%, rgba(26,61,42,0.2) 0%, transparent 60%)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <AnimatedSection>
            <div className="text-center" style={{ marginBottom: 60 }}>
              <span className="font-montserrat" style={{ fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.65 }}>
                глава первая
              </span>
              <h2 className="font-cormorant" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 300, marginTop: 12 }}>
                История нашей любви
              </h2>
              <GoldOrnament />
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { year: '2019', icon: 'Coffee', title: 'Первая встреча', text: 'Познакомились на конференции в Москве. Анна опрокинула кофе на ноутбук Михаила — и именно тогда началась наша история.' },
              { year: '2021', icon: 'Plane', title: 'Первое путешествие', text: 'Поездка в Санкт-Петербург на белые ночи. Мы шли по набережной и поняли — хотим быть рядом всегда.' },
              { year: '2024', icon: 'Gem', title: 'Предложение', text: 'Михаил сделал предложение в нашем любимом ресторане, украсив весь зал белыми розами. Анна сказала "да".' },
            ].map((card, i) => (
              <AnimatedSection key={card.year} className={i === 1 ? 'md:mt-10' : ''}>
                <div className="section-card p-8 text-center h-full" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="flex items-center justify-center mx-auto mb-4" style={{ width: 52, height: 52, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.28)', color: 'var(--gold)' }}>
                    <Icon name={card.icon} fallback="Star" size={20} />
                  </div>
                  <span className="font-cormorant gold-gradient-text" style={{ fontSize: '1.9rem', fontWeight: 300, display: 'block' }}>{card.year}</span>
                  <h3 className="font-cormorant" style={{ fontSize: '1.25rem', fontWeight: 400, margin: '6px 0 12px', color: 'rgba(245,240,232,0.9)' }}>{card.title}</h3>
                  <p className="font-montserrat" style={{ fontSize: '0.8rem', lineHeight: 1.8, color: 'rgba(245,240,232,0.45)', fontWeight: 300 }}>{card.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}><div className="gold-divider" /></div>

      {/* PROGRAM */}
      <section id="program" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <AnimatedSection>
            <div className="text-center" style={{ marginBottom: 60 }}>
              <span className="font-montserrat" style={{ fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.65 }}>14 сентября 2025</span>
              <h2 className="font-cormorant" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 300, marginTop: 12 }}>Программа дня</h2>
              <GoldOrnament />
            </div>
          </AnimatedSection>

          <div style={{ position: 'relative' }}>
            <div className="hidden md:block" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.25) 10%, rgba(201,168,76,0.25) 90%, transparent)', transform: 'translateX(-50%)' }} />

            {[
              { time: '13:00', title: 'Сбор гостей', desc: 'Встреча у главного входа. Приветственные напитки и знакомство гостей.', align: 'left' },
              { time: '14:00', title: 'Церемония', desc: 'Торжественная церемония бракосочетания в розарии под открытым небом.', align: 'right' },
              { time: '15:00', title: 'Фотосессия', desc: 'Совместная фотосессия в живописных уголках усадьбы.', align: 'left' },
              { time: '16:00', title: 'Банкет', desc: 'Праздничный ужин, живая музыка, тосты и первый танец молодожёнов.', align: 'right' },
              { time: '20:00', title: 'Вечеринка', desc: 'Танцы, торт, фейерверк и незабываемые воспоминания.', align: 'left' },
            ].map((item, i) => (
              <AnimatedSection key={item.time}>
                <div className="flex items-start gap-4 mb-8" style={{ flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
                  <div className="section-card p-6 flex-1">
                    <span className="font-cormorant gold-gradient-text" style={{ fontSize: '1.7rem', fontWeight: 300, display: 'block', lineHeight: 1 }}>{item.time}</span>
                    <h3 className="font-cormorant" style={{ fontSize: '1.15rem', fontWeight: 400, margin: '4px 0 8px' }}>{item.title}</h3>
                    <p className="font-montserrat" style={{ fontSize: '0.78rem', lineHeight: 1.7, color: 'rgba(245,240,232,0.45)', fontWeight: 300 }}>{item.desc}</p>
                  </div>
                  <div className="hidden md:flex items-center justify-center flex-shrink-0" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)', marginTop: 28, boxShadow: '0 0 16px rgba(201,168,76,0.5)' }} />
                  <div className="flex-1 hidden md:block" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}><div className="gold-divider" /></div>

      {/* VENUE */}
      <section id="venue" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <AnimatedSection>
            <div className="text-center" style={{ marginBottom: 60 }}>
              <span className="font-montserrat" style={{ fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.65 }}>где нас найти</span>
              <h2 className="font-cormorant" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 300, marginTop: 12 }}>Место проведения</h2>
              <GoldOrnament />
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="section-card p-8 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
                    <Icon name="MapPin" size={18} />
                  </div>
                  <h3 className="font-cormorant" style={{ fontSize: '1.5rem', fontWeight: 400 }}>Усадьба Захарово</h3>
                </div>
                <p className="font-montserrat" style={{ fontSize: '0.8rem', lineHeight: 1.9, color: 'rgba(245,240,232,0.5)', fontWeight: 300, marginBottom: 20 }}>
                  Одно из красивейших исторических поместий Подмосковья. Белоснежные колонны, вековые липы и живописные пруды создадут идеальный фон для нашего торжества.
                </p>
                <div style={{ fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif', color: 'rgba(245,240,232,0.38)', lineHeight: 2.2, marginBottom: 'auto' }}>
                  <div>📍 Одинцовский район, с. Захарово</div>
                  <div>🚗 40 минут от МКАД по Можайскому шоссе</div>
                  <div>🅿️ Бесплатная парковка на территории</div>
                  <div>🚌 Трансфер от ст. м. Кунцевская в 12:00</div>
                </div>
                <button className="btn-gold mt-8" style={{ width: '100%' }}>Открыть на карте</button>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="section-card overflow-hidden" style={{ height: 420, position: 'relative' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9013.21!2d36.895!3d55.718!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQzJzA0LjgiTiAzNsKwNTMnNDIuMCJF!5e0!3m2!1sru!2sru!4v1234"
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'saturate(0.25) hue-rotate(120deg) brightness(0.5)' }}
                  allowFullScreen loading="lazy"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,26,20,0.7) 0%, transparent 40%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                  <span className="font-cormorant gold-gradient-text" style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>Усадьба Захарово</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}><div className="gold-divider" /></div>

      {/* RSVP */}
      <section id="rsvp" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <AnimatedSection>
            <div className="text-center" style={{ marginBottom: 56 }}>
              <span className="font-montserrat" style={{ fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.65 }}>ваш ответ</span>
              <h2 className="font-cormorant" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 300, marginTop: 12 }}>Подтверждение</h2>
              <GoldOrnament />
              <p className="font-montserrat" style={{ fontSize: '0.78rem', lineHeight: 1.8, color: 'rgba(245,240,232,0.4)', fontWeight: 300, marginTop: 12 }}>
                Просим подтвердить присутствие до 1 августа 2025 года
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            {rsvpSent ? (
              <div className="section-card p-12 text-center">
                <div className="flex items-center justify-center mx-auto mb-6" style={{ width: 64, height: 64, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.4)', color: 'var(--gold)', animation: 'float 3s ease-in-out infinite' }}>
                  <Icon name="Check" size={28} />
                </div>
                <h3 className="font-cormorant" style={{ fontSize: '2.2rem', fontWeight: 300, marginBottom: 12 }}>Спасибо!</h3>
                <p className="font-montserrat" style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.45)', fontWeight: 300, lineHeight: 1.9 }}>
                  Мы получили ваш ответ и очень рады видеть вас на нашем торжестве.<br />До встречи 14 сентября!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvp} className="section-card p-8">
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="font-montserrat block mb-2" style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>Ваше имя</label>
                    <input className="input-wedding" placeholder="Имя и фамилия" value={rsvpForm.name} onChange={e => setRsvpForm({ ...rsvpForm, name: e.target.value })} required />
                  </div>

                  <div>
                    <label className="font-montserrat block mb-2" style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>Вы придёте?</label>
                    <div className="flex gap-3">
                      {['Да, буду!', 'К сожалению, нет'].map(opt => (
                        <button key={opt} type="button" onClick={() => setRsvpForm({ ...rsvpForm, attending: opt })} className="flex-1 font-montserrat"
                          style={{ padding: '11px 8px', fontSize: '0.7rem', letterSpacing: '0.04em', border: `1px solid ${rsvpForm.attending === opt ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.18)'}`, background: rsvpForm.attending === opt ? 'rgba(201,168,76,0.08)' : 'transparent', color: rsvpForm.attending === opt ? 'var(--gold)' : 'rgba(245,240,232,0.4)', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-montserrat block mb-2" style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>Количество гостей</label>
                    <select className="input-wedding" value={rsvpForm.guests} onChange={e => setRsvpForm({ ...rsvpForm, guests: e.target.value })} style={{ cursor: 'pointer' }}>
                      {['1', '2', '3', '4'].map(n => <option key={n} value={n} style={{ background: '#0d2018' }}>{n} {n === '1' ? 'гость' : 'гостя'}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="font-montserrat block mb-2" style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>Пожелания молодожёнам</label>
                    <textarea className="input-wedding" placeholder="Ваши пожелания..." rows={3} value={rsvpForm.message} onChange={e => setRsvpForm({ ...rsvpForm, message: e.target.value })} style={{ resize: 'none' }} />
                  </div>

                  <button type="submit" className="btn-gold mt-2" style={{ width: '100%' }}>Отправить ответ</button>
                </div>
              </form>
            )}
          </AnimatedSection>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}><div className="gold-divider" /></div>

      {/* CONTACTS */}
      <section id="contacts" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <AnimatedSection>
            <div className="text-center" style={{ marginBottom: 56 }}>
              <span className="font-montserrat" style={{ fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.65 }}>мы на связи</span>
              <h2 className="font-cormorant" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 300, marginTop: 12 }}>Контакты</h2>
              <GoldOrnament />
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {[
              { role: 'Невеста', name: 'Анна Петрова', phone: '+7 (985) 123-45-67', tg: '@anna_bride' },
              { role: 'Жених', name: 'Михаил Соколов', phone: '+7 (916) 234-56-78', tg: '@mikhail_groom' },
            ].map(person => (
              <AnimatedSection key={person.name}>
                <div className="section-card p-8 text-center">
                  <div className="flex items-center justify-center mx-auto mb-4" style={{ width: 52, height: 52, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.28)', color: 'var(--gold)' }}>
                    <Icon name="User" size={20} />
                  </div>
                  <span className="font-montserrat block mb-1" style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)' }}>{person.role}</span>
                  <h3 className="font-cormorant" style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: 16 }}>{person.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <a href={`tel:${person.phone.replace(/\D/g, '')}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(245,240,232,0.5)', textDecoration: 'none', fontSize: '0.83rem', fontFamily: 'Montserrat', fontWeight: 300 }}>
                      <Icon name="Phone" size={13} style={{ color: 'rgba(201,168,76,0.55)' }} />
                      {person.phone}
                    </a>
                    <a href={`https://t.me/${person.tg.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(245,240,232,0.5)', textDecoration: 'none', fontSize: '0.83rem', fontFamily: 'Montserrat', fontWeight: 300 }}>
                      <Icon name="Send" size={13} style={{ color: 'rgba(201,168,76,0.55)' }} />
                      {person.tg}
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="section-card p-8 text-center">
              <span className="font-montserrat block mb-1" style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)' }}>Свадебный организатор</span>
              <h3 className="font-cormorant" style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: 4 }}>Елена Морозова</h3>
              <p className="font-montserrat" style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.28)', fontWeight: 300, marginBottom: 14 }}>По вопросам программы, трансфера и размещения</p>
              <a href="tel:+79031234567" style={{ color: 'var(--gold)', textDecoration: 'none', fontFamily: 'Montserrat', fontSize: '0.85rem', fontWeight: 400 }}>+7 (903) 123-45-67</a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 24px 44px', textAlign: 'center', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="font-cormorant gold-gradient-text" style={{ fontSize: '2.8rem', fontWeight: 300, fontStyle: 'italic', marginBottom: 10 }}>
          Анна & Михаил
        </div>
        <GoldOrnament />
        <p className="font-montserrat" style={{ fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.18)', marginTop: 14 }}>
          14 · 09 · 2025
        </p>
      </footer>
    </div>
  );
}