import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames"
import anime from "animejs"
import TechnologiesBackground from "./TechnologiesBackground.jsx"
import "./Technologies.scss"

const techNames = ["launch-vehicle", "spaceport", "space-capsule"]
const Technologies = ({ technologies }) => {
  // Preload images
  const abortController = new AbortController()
  useEffect(() => {
    technologies.forEach((technology) => {
      fetch(technology.images.portrait, { signal: abortController.signal })
      fetch(technology.images.landscape, { signal: abortController.signal })
    })
    return () => abortController.abort
  }, [])

  const location = useLocation()
  const hash = location.hash
  const hashIndex = techNames.indexOf(hash.slice(1))
  const [activeNavbarLink, setActiveNavbarLink] = useState(hashIndex === -1 ? 0 : hashIndex)
  const [activeTechnology, setActiveTechnology] = useState(technologies[activeNavbarLink])
  const technologyRef = useRef(null)
  const technologyImageRef = useRef(null)

  const hasBeenRendered = useRef(false)

  useEffect(() => {
    if (!hasBeenRendered.current) return // Skip for first page render
    if (location.pathname !== "/technology") return // Prevent navbar active item state update on page transitions
    const i = techNames.indexOf(hash.slice(1))
    setActiveNavbarLink(i === -1 ? 0 : i)
  }, [hash])

  const easeInOut = "cubicBezier(0.420, 0.000, 0.580, 1.000)"
  const tabletMediaQuery = "(max-width: 1180px)"

  useEffect(() => {
    if (!hasBeenRendered.current) return // Skip animation for first page render

    // Animate technology info container
    anime({
      targets: [technologyRef.current, technologyImageRef.current],
      opacity: [1, 0],
      easing: easeInOut,
      direction: "alternate",
      loop: 2,
      duration: 400,
      update: function (anim) {
        if (anim.progress === 100) {
          setActiveTechnology(technologies[activeNavbarLink])

          if (window.matchMedia(tabletMediaQuery).matches) return
          // Animate image container
          anime({
            targets: technologyImageRef.current,
            translateX: [10, 0],
            duration: 600,
            easing: easeInOut,
          })
        }
      },
    })
  }, [activeNavbarLink])

  useEffect(() => {
    hasBeenRendered.current = true
    return () => (hasBeenRendered.current = false)
  }, [])

  return (
    <main className="main-container technologies-main-container">
      <TechnologiesBackground />
      <div className="content-wrapper">
        <div className="page-label">
          <span className="page-label__number">03</span>
          <h1 className="page-label__description">Space launch 101</h1>
        </div>

        <div className="content">
          <picture>
            <source srcSet={activeTechnology.images.landscape} media={tabletMediaQuery} />
            <img
              ref={technologyImageRef}
              className="technology-image"
              src={activeTechnology.images.portrait}
              alt={activeTechnology.name}
            />
          </picture>

          <nav className="technologies-navbar">
            <ul className="technologies-navbar__list">
              {technologies.map((tech, i) => (
                <li key={tech.name}>
                  <Link
                    onClick={() => setActiveNavbarLink(i)}
                    className={classNames("technologies-navbar__link", { active: activeNavbarLink === i })}
                    replace
                    to={"#" + tech.name.toLowerCase().replaceAll(" ", "-")}
                  >
                    {i + 1}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div ref={technologyRef} className="technology">
              <span className="terminology-subtitle">The terminology…</span>
              <div>
                <h1 className="technology__name">{activeTechnology.name}</h1>
                <p className="paragraph technology__description">{activeTechnology.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Technologies
