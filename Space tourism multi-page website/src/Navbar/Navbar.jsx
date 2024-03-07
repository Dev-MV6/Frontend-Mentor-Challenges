import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import "./Navbar.scss"
import MenuIcon from "./MenuIcon.jsx"
import classNames from "classnames"

const Navbar = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    window.onclick = (e) => {
      if (!e.target.classList.contains("main-navbar__menu-icon") && !e.target.classList.contains("main-navbar__list"))
        setMobileSidebarOpen(false)
    }

    return () => (window.onclick = null)
  }, [])

  useEffect(() => {
    if (window.matchMedia("(max-width: 570px)").matches) {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      document.body.style.overflowY = mobileSidebarOpen ? "hidden" : "auto"
    }
  }, [mobileSidebarOpen])

  return (
    <nav className={classNames("main-navbar", { "main-navbar--mobile-open": mobileSidebarOpen })}>
      <img className="main-navbar__logo" src="./images/logo.svg" alt="" />
      <MenuIcon setMobileSidebarOpen={setMobileSidebarOpen} />
      <ul className="main-navbar__list">
        <li className="main-navbar__item">
          <NavLink className="main-navbar__link" to="/">
            <span className="main-navbar__item-enumeration">00</span>Home
          </NavLink>
        </li>
        <li className="main-navbar__item">
          <NavLink className="main-navbar__link" to="/destination">
            <span className="main-navbar__item-enumeration">01</span>Destination
          </NavLink>
        </li>
        <li className="main-navbar__item">
          <NavLink className="main-navbar__link" to="/crew">
            <span className="main-navbar__item-enumeration">02</span>Crew
          </NavLink>
        </li>
        <li className="main-navbar__item">
          <NavLink className="main-navbar__link" to="/technology">
            <span className="main-navbar__item-enumeration">03</span>Technology
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
