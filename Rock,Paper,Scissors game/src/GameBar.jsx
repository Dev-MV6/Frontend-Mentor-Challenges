import './styles/components/GameBar.scss'

export default function GameBar({ gameInstance }) {
  const GameScore = () => {
    return (
      <div
        className="game-score"
        tabIndex={gameInstance.gameBarScore != 0 ? '1' : '-1'}
        onClick={() => gameInstance.resetScore()}
        onKeyDown={(e) => {
          if (e.code === 'Space' || e.key === 'Enter') {
            gameInstance.resetScore()
          }
        }}
      >
        <span className="game-score__title">Score</span>
        <span className="game-score__points">{gameInstance.gameBarScore}</span>
      </div>
    )
  }

  return (
    <div className="game-bar">
      <img
        src={gameInstance.bonusGameEnabled ? './images/logo-bonus.svg' : './images/logo.svg'}
        alt="Game Logo"
        className="game-bar__logo"
        draggable="false"
        tabIndex="1"
        onClick={() => gameInstance.toggleGameMode()}
        onKeyDown={(e) => {
          if (e.code === 'Space' || e.key === 'Enter') {
            gameInstance.toggleGameMode()
          }
        }}
      />

      <GameScore gameInstance={gameInstance} />
    </div>
  )
}
