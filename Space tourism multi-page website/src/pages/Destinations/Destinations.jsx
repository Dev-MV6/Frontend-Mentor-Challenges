import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames"
import anime from "animejs"
import DestinationsBackground from "./DestinationsBackground.jsx"
import "./Destinations.scss"

const destinationNames = ["moon", "mars", "europa", "titan"]
const Destinations = ({ destinations }) => {
  // Preload images
  const abortController = new AbortController()
  useEffect(() => {
    destinations.forEach((destination) => fetch(destination.images.webp, { signal: abortController.signal }))
    return () => abortController.abort
  }, [])

  const location = useLocation()
  const hash = location.hash
  const hashIndex = destinationNames.indexOf(hash.slice(1))
  const [activeNavbarItem, setActiveNavbarItem] = useState(hashIndex === -1 ? 0 : hashIndex)
  const [activeDest, setActiveDest] = useState(destinations[activeNavbarItem])
  const destinationRef = useRef(null)
  const destinationImageRef = useRef(null)

  const hasBeenRendered = useRef(false)

  useEffect(() => {
    if (!hasBeenRendered.current) return // Skip for first page render
    if (location.pathname !== "/destination") return // Prevent navbar active item state update on page transitions
    const i = destinationNames.indexOf(hash.slice(1))
    setActiveNavbarItem(i === -1 ? 0 : i)
  }, [hash])

  useEffect(() => {
    if (!hasBeenRendered.current) return // Skip animation for first page render

    anime({
      targets: [destinationRef.current, destinationImageRef.current],
      opacity: [1, 0],
      easing: "linear",
      direction: "alternate",
      loop: 2,
      duration: 200,
      update: function (anim) {
        if (anim.progress === 100) {
          setActiveDest(destinations[activeNavbarItem])
        }
      },
    })
  }, [activeNavbarItem])

  useEffect(() => {
    hasBeenRendered.current = true
    return () => (hasBeenRendered.current = false)
  }, [])

  return (
    <main className="main-container destinations-main-container">
      <DestinationsBackground />
      <div className="content-wrapper">
        <div>
          <div className="page-label">
            <span className="page-label__number">01</span>
            <h1 className="page-label__description">Pick your destination</h1>
          </div>

          <img ref={destinationImageRef} className="destination-image" src={activeDest.images.webp} alt="" />
        </div>

        <div className="destinations-wrapper">
          <nav className="destinations-navbar">
            <ul className="destinations-navbar__list">
              {destinations.map((dest, i) => {
                return (
                  <li className={classNames("destinations-navbar__item", { active: activeNavbarItem === i })} key={dest.name}>
                    <Link replace to={`#${destinationNames[i]}`}>
                      {dest.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div ref={destinationRef} className="destination">
            <h2 className="destination__name">{activeDest.name}</h2>
            <p className="paragraph destination__description">{activeDest.description}</p>

            <hr className="destination__separator" />

            <div className="destination-travel-info-wrapper">
              <div className="destination-travel-info">
                <span className="destination-travel-info__desc">Avg. distance</span>
                <span className="destination-travel-info__value">{activeDest.distance}</span>
              </div>
              <div className="destination-travel-info">
                <span className="destination-travel-info__desc">Est. travel time</span>
                <span className="destination-travel-info__value">{activeDest.travel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Destinations
