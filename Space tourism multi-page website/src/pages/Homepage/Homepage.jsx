import { useNavigate } from "react-router-dom"
import "./Homepage.scss"

const Homepage = () => {
  const navigate = useNavigate()
  return (
    <main className="main-container homepage-main-container">
      <div className="content-wrapper">
        <div className="content">
          <h1 className="title-container">
            <span className="title-big">So, you want to travel to </span>
            <span className="title-huge">Space</span>
          </h1>
          <p className="paragraph">
            Let’s face it; if you want to go to space, you might as well genuinely go to outer space and not hover kind of on the
            edge of it. Well sit back, and relax because we’ll give you a truly out of this world experience!
          </p>
        </div>
        <button className="explore-button" onClick={() => navigate("destination")}>
          Explore
        </button>
      </div>
    </main>
  )
}

export default Homepage
