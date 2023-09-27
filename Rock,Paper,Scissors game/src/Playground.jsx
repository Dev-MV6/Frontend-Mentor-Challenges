import { useRef } from 'react'
import './styles/components/Playground.scss'

export default function Playground({ gameInstance }) {
  const Coin = ({ type }) => {
    return (
      <button
        type="button"
        className={`coin coin--${type}`}
        onClick={() => gameInstance.startRound(type)}
        data-coin-type={type}
        tabIndex="1"
      >
        <div className="coin__face coin__face--front">
          <div className="coin__center">
            <img src={`./images/icon-${type}.svg`} alt={type} className="coin__icon" draggable="false" />
          </div>
        </div>
      </button>
    )
  }

  const getRoundResultDescription = (roundResult) => {
    if (roundResult === 'draw') return 'DRAW'
    return `YOU ${roundResult === 'winner' ? 'WIN' : 'LOSE'}`
  }

  gameInstance.playgroundRef = useRef()

  return (
    <div className="playground" ref={gameInstance.playgroundRef}>
      <div className="playground__coin-selection">
        {gameInstance.bonusGameEnabled ? (
          <>
            {/* Bonus mode */}
            <Coin type="scissors" />
            <Coin type="spock" />
            <Coin type="paper" />
            <Coin type="lizard" />
            <Coin type="rock" />
          </>
        ) : (
          <>
            {/* Normal mode */}
            <Coin type="paper" />
            <Coin type="scissors" />
            <Coin type="rock" />
          </>
        )}
      </div>

      <div className="playground__result hidden">
        <div className="playground-result__description-container hidden">
          <span className="playground-result__description">{getRoundResultDescription(gameInstance.lastRoundResult)}</span>
          <button
            className="playground-result__play-again-btn"
            type="button"
            tabIndex="1"
            onClick={(e) => gameInstance.endRound(e.target)}
          >
            Play again
          </button>
        </div>
      </div>
    </div>
  )
}
