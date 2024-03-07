import { useRef, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames"
import anime from "animejs"
import "./Crew.scss"

const roles = ["commander", "mission-specialist", "pilot", "flight-engineer"]
const Crew = ({ crew }) => {
  // Preload images
  const abortController = new AbortController()
  useEffect(() => {
    crew.forEach((member) => fetch(member.images.webp, { signal: abortController.signal }))
    return () => abortController.abort
  }, [])

  const location = useLocation()
  const hash = location.hash
  const hashIndex = roles.indexOf(hash.slice(1))
  const [activeNavbarLink, setActiveNavbarLink] = useState(hashIndex === -1 ? 0 : hashIndex)
  const [activeMember, setActiveMember] = useState(crew[activeNavbarLink])
  const memberRef = useRef(null)
  const memberPhotoRef = useRef(null)

  const hasBeenRendered = useRef(false)

  useEffect(() => {
    if (!hasBeenRendered.current) return // Skip for first page render
    if (location.pathname !== "/crew") return // Prevent navbar active item state update on page transitions
    const i = roles.indexOf(hash.slice(1))
    setActiveNavbarLink(i === -1 ? 0 : i)
  }, [hash])

  const easeInOut = "cubicBezier(0.420, 0.000, 0.580, 1.000)"

  const resetInterval = () => {
    clearInterval(window.autoNextMemberInterval)
    window.autoNextMemberInterval = setInterval(
      () => setActiveNavbarLink((prev) => (prev + 1 === roles.length ? 0 : prev + 1)),
      5000
    )
  }

  useEffect(() => {
    resetInterval()
    if (!hasBeenRendered.current) return // Skip animation for first page render

    // Animate member info container
    anime({
      targets: [memberRef.current, memberPhotoRef.current],
      opacity: [1, 0],
      direction: "alternate",
      loop: 2,
      duration: 400,
      easing: easeInOut,
      update: function (anim) {
        if (anim.progress === 100) {
          setActiveMember(crew[activeNavbarLink])

          if (window.matchMedia("(max-width: 570px)").matches) return
          // Animate photo container
          anime({
            targets: memberPhotoRef.current,
            translateY: [10, 0],
            duration: 1000,
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

  const activeMemberClassName = activeMember.role.toLowerCase().replaceAll(" ", "-")

  return (
    <main className="main-container crew-main-container">
      <div className="content-wrapper">
        <div className="page-label">
          <span className="page-label__number">02</span>
          <h1 className="page-label__description">Meet your crew</h1>
        </div>

        <div ref={memberRef} className={"crew-member crew-member--" + activeMemberClassName}>
          <h2 className="crew-member__role">{activeMember.role}</h2>
          <h2 className="crew-member__name">{activeMember.name}</h2>
          <p className="paragraph crew-member__bio">{activeMember.bio}</p>
        </div>

        <nav className="crew-navbar">
          <ul className="crew-navbar__list">
            {crew.map((member, i) => {
              return (
                <li key={member.name}>
                  <Link
                    onClick={() => setActiveNavbarLink(i)}
                    className={classNames("crew-navbar__link", { active: activeNavbarLink === i })}
                    replace
                    to={"#" + member.role.toLowerCase().replaceAll(" ", "-")}
                  ></Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="crew-member-photo-wrapper">
          <img
            ref={memberPhotoRef}
            className={"crew-member-photo crew-member-photo--" + activeMemberClassName}
            src={activeMember.images.webp}
            alt={`${activeMember.role} ${activeMember.name}`}
          />
        </div>
      </div>
    </main>
  )
}

export default Crew
