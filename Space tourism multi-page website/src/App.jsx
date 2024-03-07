import "./App.scss"
import Navbar from "./Navbar"
import Homepage from "./pages/Homepage"
import Destinations from "./pages/Destinations"
import Crew from "./pages/Crew"
import Technologies from "./pages/Technologies"
import data from "./data.json"
import { useEffect, useRef } from "react"
import { BrowserRouter, Routes, Route, useLocation, useOutlet } from "react-router-dom"
import { Transition, SwitchTransition } from "react-transition-group"

const routes = [
  { index: true, element: <Homepage />, key: "/index" },
  { path: "/destination", element: <Destinations destinations={data.destinations} /> },
  { path: "/crew", element: <Crew crew={data.crew} /> },
  { path: "/technology", element: <Technologies technologies={data.technology} /> },
]

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const defaultStyle = {
  transition: `opacity 250ms, transform 300ms`,
  transitionTimingFunction: "ease-in-out",
  opacity: 1,
}

const Layout = () => {
  const currentOutlet = useOutlet()
  const nodeRef = useRef()

  const location = useLocation()
  const currentPageIndexRef = useRef()
  const previousPageIndexRef = useRef()
  const transitionDirectionRef = useRef()

  useEffect(() => {
    const currentPageIndex = routes.findIndex(
      (route) => route.path === location.pathname || (route.index && location.pathname === "/")
    )
    currentPageIndexRef.current = currentPageIndex
    transitionDirectionRef.current = currentPageIndexRef.current < previousPageIndexRef.current ? "backwards" : "forwards"

    previousPageIndexRef.current = currentPageIndexRef.current
  }, [location])

  return (
    <>
      <Navbar />
      <SwitchTransition>
        <Transition key={location.pathname} timeout={300} nodeRef={nodeRef}>
          {(state) => {
            // Transition direction based on navbar item position
            const fwd = transitionDirectionRef.current === "forwards"
            const axis = window.matchMedia("(max-width: 570px)").matches ? "Y" : "X" // Mobile design translates over Y axis
            const t = axis === "X" ? "5%" : "20px"
            const transitionStyles = {
              exiting: { opacity: 0, transform: `translate${axis}(${fwd ? "-" : ""}${t})` },
              exited: { opacity: 0 },
              entering: { opacity: 0, transform: `translate${axis}(${fwd ? "" : "-"}${t})` },
              entered: { opacity: 1, transform: `translate${axis}(0%)` },
            }

            return (
              <div ref={nodeRef} style={{ ...defaultStyle, ...transitionStyles[state] }}>
                {currentOutlet}
              </div>
            )
          }}
        </Transition>
      </SwitchTransition>
      <div hidden className="attribution">
        <span>
          Challenge by&nbsp;
          <a href="https://www.frontendmentor.io/challenges/space-tourism-multipage-website-gRWj1URZ3" target="_blank">
            Frontend Mentor
          </a>
          .&nbsp;
        </span>
        <span>
          Coded by <a href="https://www.frontendmentor.io/profile/Dev-MV6">Dev-MV6</a>.
        </span>
      </div>
    </>
  )
}

export default App
