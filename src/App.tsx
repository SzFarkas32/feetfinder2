import { useState } from 'react'
import './App.css'

const people = ['Meleg Máté', 'Tetves Tomi', 'Hambur Geri', 'MégMelegebb Máté', 'Likas Lali']
const newestFiles = [
  '23306CEC-E863-4735-9C51-C0695D9030F2_1_201_a.jpeg',
  'F6AB5E47-1D20-4A03-9F4E-AFF40B3C9722_1_201_a.jpeg',
  'EE248B0A-1E7C-4C8F-82A4-7893BB86A45B.jpeg',
  'E471F3F9-4CE4-4DD5-8D1F-AEC172FA6737_4_5005_c.jpeg',
  '4FF46AA7-DA3C-4DC0-9296-1FF499141C78_1_105_c.jpeg',
  'B0402E62-D5AE-436E-9444-6EDD8012571A_4_5005_c.jpeg',
  '801BBEB7-9776-4B31-B18F-26C47F539414_1_105_c.jpeg',
  '7FCC23EA-587B-4C34-A201-3E38CB6F455E_1_102_o.jpeg',
  'F21D5D1B-A310-4F6C-82A6-2ECE69CF2937_1_105_c.jpeg',
  '0A624EAF-0FF3-49F1-94B6-D75B0F3C0CCE.jpeg',
]

const photoFiles = Object.entries(
  import.meta.glob<string>('./assets/*.jpeg', {
    eager: true,
    import: 'default',
  }),
)
  .sort(([firstPath], [secondPath]) => {
    const firstRank = newestFiles.findIndex((file) => firstPath.endsWith(file))
    const secondRank = newestFiles.findIndex((file) => secondPath.endsWith(file))
    return (firstRank < 0 ? newestFiles.length : firstRank) -
      (secondRank < 0 ? newestFiles.length : secondRank)
  })
  .map(([path, src]) => ({ path, src }))

type Photo = (typeof photoFiles)[number] & { person: string }

function shuffle<T>(items: T[]) {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

function createGallery(): Photo[] {
  const assignments = shuffle([
    ...people,
    ...people,
    ...Array.from({ length: Math.max(0, photoFiles.length - people.length * 2) }, () =>
      people[Math.floor(Math.random() * people.length)],
    ),
  ])

  return photoFiles.map((photo, index) => ({ ...photo, person: assignments[index] }))
}

function App() {
  const [page, setPage] = useState<'home' | 'pictures'>('home')
  const [query, setQuery] = useState('')
  const [photos] = useState(createGallery)
  const normalizedQuery = query.trim().toLocaleLowerCase('hu')
  const matchingPhotos = photos.filter((photo) =>
    photo.person.toLocaleLowerCase('hu').includes(normalizedQuery),
  )
  const visiblePhotos = normalizedQuery
    ? matchingPhotos
    : page === 'home'
      ? photos.slice(0, 5)
      : photos

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#home" onClick={() => setPage('home')}>
          <span className="wordmark-mark" aria-hidden="true">F</span>
          <span>feetfinder<span className="wordmark-number">2</span></span>
        </a>
        <nav className="main-nav" aria-label="Fő navigáció">
          <button
            className={page === 'home' ? 'nav-link active' : 'nav-link'}
            onClick={() => setPage('home')}
            type="button"
          >
            Home
          </button>
          <button
            className={page === 'pictures' ? 'nav-link active' : 'nav-link'}
            onClick={() => setPage('pictures')}
            type="button"
          >
            Pictures <span className="nav-count">{photos.length}</span>
          </button>
        </nav>
        <label className="search-box">
          <span className="search-icon" aria-hidden="true" />
          <input
            aria-label="Keresés név alapján"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Keresés név alapján"
            type="search"
            value={query}
          />
          <kbd>⌘ K</kbd>
        </label>
      </header>

      <main>
        <section className="intro">
          <div className="intro-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> FIKTÍV AI GALÉRIA</p>
            <h1>{page === 'home' ? <>A pillanat,<br /><em>ami megmarad.</em></> : <>Minden kép.<br /><em>Minden történet.</em></>}</h1>
            <p className="intro-description">
              Válogatás a legfrissebb képekből, név szerint rendezve.
            </p>
          </div>
          <div className="intro-aside">
            <span className="aside-number">0{people.length}</span>
            <span className="aside-label">KARAKTER<br />A GALÉRIÁBAN</span>
            <span className="aside-rule" />
            <span className="aside-note">Minden kép<br />AI-generált demoanyag.</span>
          </div>
        </section>

        <section className="gallery-section" aria-live="polite">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{normalizedQuery ? 'KERESÉSI TALÁLATOK' : page === 'home' ? 'FRISSEN A GALÉRIÁBAN' : 'A TELJES VÁLOGATÁS'}</p>
              <h2>{normalizedQuery ? `„${query.trim()}”` : page === 'home' ? 'Legutóbbi képek' : 'Képek személyenként'}</h2>
            </div>
            <span className="result-count">{visiblePhotos.length.toString().padStart(2, '0')} KÉP</span>
          </div>

          {page === 'pictures' && !normalizedQuery ? (
            <div className="people-list">
              {people.map((person, personIndex) => {
                const personPhotos = photos.filter((photo) => photo.person === person)
                return (
                  <section className={`person-section person-tone-${personIndex}`} key={person}>
                    <div className="person-heading">
                      <span className="person-index">0{personIndex + 1}</span>
                      <h3>{person}</h3>
                      <span className="person-photo-count">{personPhotos.length} KÉP</span>
                    </div>
                    <div className="photo-grid">
                      {personPhotos.map((photo, index) => (
                        <article className="photo-card" key={photo.path}>
                          <div className="photo-frame">
                            <img alt={`${person} – ${index + 1}. kép, fiktív AI-galéria`} loading="lazy" src={photo.src} />
                            <span className="photo-index">#{String(index + 1).padStart(2, '0')}</span>
                          </div>
                          <div className="photo-caption"><span>{person}</span><span>AI DEMO</span></div>
                        </article>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : visiblePhotos.length > 0 ? (
            <div className="photo-grid featured-grid">
              {visiblePhotos.map((photo, index) => (
                <article className="photo-card" key={photo.path}>
                  <div className="photo-frame">
                    <img alt={`${photo.person} – fiktív AI-galéria`} loading="lazy" src={photo.src} />
                    <span className="photo-index">#{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="photo-caption"><span>{photo.person}</span><span>AI DEMO</span></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-mark">?</span>
              <p>Ehhez a névhez nincs találat.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <span>FEETFINDER2 / KÉPGALÉRIA</span>
        <span>FIKTÍV, AI-GENERÁLT DEMO</span>
        <span>© 2026</span>
      </footer>
    </div>
  )
}

export default App
