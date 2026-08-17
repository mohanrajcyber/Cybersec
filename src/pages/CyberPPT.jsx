import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PPT_SLIDES } from '../data/pptSlides'
import { localizeSlide, PPT_UI } from '../utils/pptLocale'
import { PPTIcon, PPTHeroVisual, PPTShowcaseImage } from '../components/PPTIcons'
import MatrixRain from '../components/MatrixRain'

function PPTQuiz({ questions }) {
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    setAnswers({})
  }, [questions])

  const pick = (qi, oi) => {
    setAnswers((prev) => ({ ...prev, [qi]: oi }))
  }

  return (
    <div className="ppt-quiz">
      {questions.map((item, qi) => {
        const chosen = answers[qi]
        const done = chosen !== undefined
        const correct = chosen === item.correct
        return (
          <div key={item.q} className="ppt-quiz-card ppt-animate-item" style={{ animationDelay: `${qi * 0.1}s` }}>
            <p className="ppt-quiz-q"><span>{qi + 1}.</span> {item.q}</p>
            <div className="ppt-quiz-options">
              {item.options.map((opt, oi) => {
                let cls = 'ppt-quiz-opt'
                if (done) {
                  if (oi === item.correct) cls += ' correct'
                  else if (oi === chosen) cls += ' wrong'
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    className={cls}
                    disabled={done}
                    onClick={() => pick(qi, oi)}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {done && (
              <p className={`ppt-quiz-feedback ${correct ? 'ok' : 'no'}`}>
                {correct ? '✓ Correct!' : '✗ Not quite.'} {item.explain}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SlideContent({ slide }) {
  switch (slide.type) {
    case 'hero':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <PPTHeroVisual name={slide.visual} />
          <ul className="ppt-hero-list">
            {slide.points.map((p, i) => (
              <li key={i} className="ppt-animate-item" style={{ animationDelay: `${i * 0.12}s` }}>{p}</li>
            ))}
          </ul>
        </div>
      )

    case 'showcase':
      return (
        <div className="ppt-slide-inner ppt-showcase ppt-animate-in">
          <PPTShowcaseImage name={slide.visual} />
          <ul className="ppt-showcase-list">
            {slide.bullets.map((t, i) => (
              <li key={i} className="ppt-showcase-item ppt-animate-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="ppt-showcase-num">{String(i + 1).padStart(2, '0')}</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'bullets':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <PPTHeroVisual name={slide.visual} />
          <ul className="ppt-bullet-list">
            {slide.points.map((p, i) => (
              <li key={i} className="ppt-bullet-item ppt-animate-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="ppt-bullet-icon"><PPTIcon name={p.icon} size={36} /></span>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'grid':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <div className="ppt-card-grid">
            {slide.cards.map((c, i) => (
              <div key={c.title} className="ppt-card ppt-animate-item" style={{ animationDelay: `${i * 0.07}s` }}>
                <span className="ppt-card-icon"><PPTIcon name={c.icon} size={40} /></span>
                <strong>{c.title}</strong>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'split':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <div className="ppt-split">
            <div className="ppt-split-col ppt-animate-item" style={{ animationDelay: '0.1s' }}>
              <h3>{slide.left.title}</h3>
              <ul>{slide.left.items.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <PPTShowcaseImage name={slide.visual} />
            <div className="ppt-split-col ppt-animate-item" style={{ animationDelay: '0.2s' }}>
              <h3>{slide.right.title}</h3>
              <ul>{slide.right.items.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
        </div>
      )

    case 'terminal':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <div className="ppt-terminal">
            <div className="ppt-terminal-bar">
              <span /><span /><span />
              <code>root@cybersec-lab:~$ training.sh</code>
            </div>
            <div className="ppt-terminal-body">
              {slide.commands.map((c, i) => (
                <div key={c.cmd} className="ppt-cmd-row ppt-animate-item" style={{ animationDelay: `${i * 0.08}s` }}>
                  <code className="ppt-cmd">$ {c.cmd}</code>
                  <span className="ppt-cmd-desc"># {c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'flow':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <div className="ppt-flow">
            {slide.steps.map((s, i) => (
              <div key={s.label} className="ppt-flow-step ppt-animate-item" style={{ animationDelay: `${i * 0.15}s` }}>
                <span className="ppt-flow-icon"><PPTIcon name={s.icon} size={44} /></span>
                <strong>{s.label}</strong>
                <p>{s.desc}</p>
                {i < slide.steps.length - 1 && <span className="ppt-flow-arrow">→</span>}
              </div>
            ))}
          </div>
          {slide.extra && (
            <ul className="ppt-flow-extra">
              {slide.extra.map((t, i) => (
                <li key={t} className="ppt-animate-item" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      )

    case 'layers':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <div className="ppt-osi-stack">
            {slide.layers.map((layer, i) => (
              <div
                key={layer.num}
                className="ppt-osi-layer ppt-animate-item"
                style={{ animationDelay: `${i * 0.07}s`, '--layer-hue': `${120 + i * 18}deg` }}
              >
                <span className="ppt-osi-num">L{layer.num}</span>
                <div className="ppt-osi-body">
                  <strong>{layer.name}</strong>
                  <p>{layer.desc}</p>
                  <code>{layer.ex}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'timeline':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <div className="ppt-timeline">
            {slide.steps.map((s, i) => (
              <div key={s.label} className="ppt-timeline-step ppt-animate-item" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="ppt-timeline-node">
                  <PPTIcon name={s.icon} size={32} />
                </div>
                <div className="ppt-timeline-content">
                  <strong>{s.label}</strong>
                  <p>{s.desc}</p>
                </div>
                {i < slide.steps.length - 1 && <div className="ppt-timeline-connector" />}
              </div>
            ))}
          </div>
        </div>
      )

    case 'compare':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <div className="ppt-compare">
            <div className="ppt-compare-col ppt-compare-bad ppt-animate-item">
              <h3>{slide.bad.title}</h3>
              <code className="ppt-compare-pw">{slide.bad.example}</code>
              <ul>{slide.bad.items.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <div className="ppt-compare-vs">VS</div>
            <div className="ppt-compare-col ppt-compare-good ppt-animate-item" style={{ animationDelay: '0.15s' }}>
              <h3>{slide.good.title}</h3>
              <code className="ppt-compare-pw">{slide.good.example}</code>
              <ul>{slide.good.items.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
        </div>
      )

    case 'casestudy':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <div className="ppt-casestudy">
            <PPTShowcaseImage name={slide.visual} />
            <div className="ppt-casestudy-facts">
              {slide.facts.map((f, i) => (
                <div key={f.label} className="ppt-casestudy-fact ppt-animate-item" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="ppt-casestudy-label">{f.label}</span>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'bootcamp':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <div className="ppt-bootcamp">
            {slide.days.map((d, i) => (
              <div key={d.day} className="ppt-bootcamp-day ppt-animate-item" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="ppt-bootcamp-head">
                  <span className="ppt-bootcamp-daynum">{d.day}</span>
                  <strong>{d.title}</strong>
                </div>
                <ul>{d.topics.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      )

    case 'labmap':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <div className="ppt-labmap">
            {slide.labs.map((lab, i) => (
              <Link key={lab.path} to={lab.path} className="ppt-lab-card ppt-animate-item" style={{ animationDelay: `${i * 0.06}s` }}>
                <span className="ppt-lab-icon">{lab.icon}</span>
                <strong>{lab.name}</strong>
                <p>{lab.desc}</p>
                <span className="ppt-lab-go">Open Lab →</span>
              </Link>
            ))}
          </div>
        </div>
      )

    case 'quiz':
      return (
        <div className="ppt-slide-inner ppt-animate-in">
          <PPTQuiz questions={slide.questions} />
        </div>
      )

    default:
      return null
  }
}

export default function CyberPPT() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [lang, setLang] = useState('en')

  const rawSlide = PPT_SLIDES[index]
  const slide = useMemo(() => localizeSlide(rawSlide, lang), [rawSlide, lang])
  const ui = PPT_UI[lang]
  const progress = ((index + 1) / PPT_SLIDES.length) * 100

  const go = useCallback((next) => {
    if (next < 0 || next >= PPT_SLIDES.length) return
    setDirection(next > index ? 1 : -1)
    setIndex(next)
  }, [index])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(index + 1) }
      if (e.key === 'ArrowLeft') go(index - 1)
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go, navigate])

  useEffect(() => {
    document.body.classList.add('ppt-open')
    return () => document.body.classList.remove('ppt-open')
  }, [])

  return (
    <div className="ppt-fullscreen">
      <MatrixRain className="ppt-matrix" />
      <div className="ppt-scanlines" aria-hidden />
      <div className="ppt-grid-bg" aria-hidden />

      <header className="ppt-topbar">
        <div className="ppt-topbar-left">
          <span className="ppt-live-dot" />
          <code>CYBERSEC_PPT.exe</code>
          <span className="ppt-tag">{slide.tag}</span>
        </div>
        <div className="ppt-topbar-right">
          <div className="ppt-lang-toggle">
            <button
              type="button"
              className={`ppt-lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              {ui.english}
            </button>
            <button
              type="button"
              className={`ppt-lang-btn ${lang === 'ta' ? 'active' : ''}`}
              onClick={() => setLang('ta')}
            >
              {ui.tamil}
            </button>
          </div>
          <span className="ppt-counter">{index + 1} / {PPT_SLIDES.length}</span>
          <button type="button" className="ppt-btn ppt-btn-ghost" onClick={() => navigate('/')}>{ui.exit}</button>
        </div>
      </header>

      <div className="ppt-progress-track">
        <div className="ppt-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <main className={`ppt-stage ppt-dir-${direction}`} key={`${slide.id}-${lang}`}>
        <p className="ppt-slide-tag">{slide.tag}</p>
        <h1 className="ppt-title">{slide.title}</h1>
        <p className="ppt-subtitle">{slide.subtitle}</p>
        {slide.labLink && (
          <Link to={slide.labLink.path} className="ppt-lab-link-btn">
            {slide.labLink.label || 'Try this lab →'}
          </Link>
        )}
        <SlideContent slide={slide} />
      </main>

      <footer className="ppt-footer">
        <button type="button" className="ppt-btn" disabled={index === 0} onClick={() => go(index - 1)}>{ui.prev}</button>
        <div className="ppt-dots">
          {PPT_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`ppt-dot ${i === index ? 'active' : ''}`}
              onClick={() => go(i)}
              aria-label={`${ui.slide} ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="ppt-btn ppt-btn-primary"
          disabled={index === PPT_SLIDES.length - 1}
          onClick={() => go(index + 1)}
        >
          {ui.next}
        </button>
      </footer>
    </div>
  )
}
