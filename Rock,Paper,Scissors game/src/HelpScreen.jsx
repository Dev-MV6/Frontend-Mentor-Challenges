import { useState, useEffect, useRef } from 'react'
import './styles/components/HelpScreen.scss'

export default function HelpScreen() {
  const initialHelpScreenVisible = Boolean(
    // Make visible automatically on first page load ever
    // (Doesn't work as expected on <React.StrictMode> since it causes the component to be mounted twice)
    !localStorage.getItem('help_screen_shown') && (localStorage.setItem('help_screen_shown', 1) || true)
  )
  const [helpScreenVisible, setHelpScreenVisible] = useState(initialHelpScreenVisible)

  const toggleHelpScreenVisible = () => {
    setHelpScreenVisible(!helpScreenVisible)
  }

  const helpScreenRef = useRef()
  const logoIndicatorRef = useRef()
  const scoreIndicatorRef = useRef()
  const coinIndicatorRef = useRef()
  const rulesIndicatorRef = useRef()

  const helpScreenEffect = () => {
    const positionHelpIndicators = () => {
      positionIndicator(logoIndicatorRef.current, document.querySelector('.game-bar__logo'))
      positionIndicator(scoreIndicatorRef.current, document.querySelector('.game-score'))

      const selectableCoin = document.querySelector('.playground__coin-selection .coin--scissors')
      const selectableCoinRect = selectableCoin.getBoundingClientRect()
      selectableCoinRect.height = selectableCoinRect.height + selectableCoinRect.height * 0.04
      positionIndicator(coinIndicatorRef.current, selectableCoin, selectableCoinRect, 1.2)

      positionIndicator(rulesIndicatorRef.current, document.querySelector('.show-rules-btn'))

      function positionIndicator(indicator, element, elementRect = element.getBoundingClientRect(), scale = 1.1) {
        element.style.zIndex = 1000

        indicator.style.left = elementRect.x + 'px'
        indicator.style.top = elementRect.y + 'px'

        const indicatorWidth = elementRect.width * scale
        const indicatorHeight = elementRect.height * scale
        indicator.style.width = indicatorWidth + 'px'
        indicator.style.height = indicatorHeight + 'px'

        const translateX = (elementRect.width - indicatorWidth) / 2
        const translateY = (elementRect.height - indicatorHeight) / 2
        indicator.style.transform = `translate(${translateX}px, ${translateY}px)`
      }
    }

    helpScreenRef.current.classList.toggle('hidden', !helpScreenVisible)
    window.onresize = helpScreenVisible ? positionHelpIndicators : null

    setTimeout(() => {
      window.onclick = helpScreenVisible ? () => setHelpScreenVisible(false) : null
      window.onkeydown = helpScreenVisible
        ? (e) => {
            if (
              e.key === 'Escape' ||
              ((e.code === 'Space' || e.key === 'Enter') && e.target !== document.querySelector('.attribution button'))
            ) {
              setHelpScreenVisible(false)
            }
          }
        : null
    }, 0)

    if (helpScreenVisible) {
      positionHelpIndicators()
    }

    return () => {
      // Cleanup function
      window.onresize = null
      window.onclick = null
      window.onkeydown = null
    }
  }

  useEffect(helpScreenEffect, [helpScreenVisible])

  window.onload = () => {
    // Run effect on page load
    helpScreenEffect()
    window.onload = null
  }

  return (
    <>
      <div className="help-screen hidden" ref={helpScreenRef}>
        <div className={`help-screen__indicator help-screen__indicator--logo`} ref={logoIndicatorRef}>
          <div className="help-screen__indicator-arrow"></div>
          <span className="help-screen__indicator-description">
            Click to toggle
            <br />
            game mode
          </span>
        </div>
        <div className={`help-screen__indicator help-screen__indicator--score`} ref={scoreIndicatorRef}>
          <div className="help-screen__indicator-arrow"></div>
          <span className="help-screen__indicator-description">
            Click to <b>reset</b> your
            <br />
            current score
          </span>
        </div>
        <div className={`help-screen__indicator help-screen__indicator--coin`} ref={coinIndicatorRef}>
          <div className="help-screen__indicator-arrow"></div>
          <span className="help-screen__indicator-description">
            Choose a coin to
            <br />
            start playing
          </span>
        </div>
        <div className={`help-screen__indicator help-screen__indicator--rules`} ref={rulesIndicatorRef}>
          <div className="help-screen__indicator-arrow"></div>
          <span className="help-screen__indicator-description">See game rules</span>
        </div>
      </div>

      <div className="attribution" aria-expanded={helpScreenVisible}>
        {helpScreenVisible ? (
          <button onClick={toggleHelpScreenVisible} tabIndex="1">
            <svg className="attribution__icon attribution__icon--close" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
              <path d="M16.97 0l2.122 2.121-7.425 7.425 7.425 7.425-2.121 2.12-7.425-7.424-7.425 7.425L0 16.97l7.425-7.425L0 2.121 2.121 0l7.425 7.425L16.971 0z" />
            </svg>
          </button>
        ) : (
          <button onClick={toggleHelpScreenVisible} tabIndex="1">
            <svg className="attribution__icon attribution__icon--info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
          </button>
        )}
        <div className="attribution__content">
          Challenge by&nbsp;
          <a href="https://www.frontendmentor.io/challenges/rock-paper-scissors-game-pTgwgvgH" target="_blank" tabIndex="1">
            Frontend Mentor
          </a>
          &nbsp;
          <div>
            Coded by{' '}
            <a href="https://www.frontendmentor.io/profile/Dev-MV6" target="_blank" tabIndex="1">
              Dev-MV6
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
