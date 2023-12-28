import { useState, useRef} from 'react'
import GameBar from './GameBar'
import Playground from './Playground'
import Rules from './Rules'
import HelpScreen from './HelpScreen'
import './styles/Game.scss'

class RockPaperScissors {
  renderCoin(selection, options) {
    const coinContainer = document.createElement('div')
    coinContainer.className = 'coin-container'
    const coin = document.createElement('div')
    coin.setAttribute('data-coin-type', selection)
    coin.className = `coin coin--${selection}`
    coin.innerHTML = `
    <div class="coin__face coin__face--front">
      <div class="coin__center">
        <img class="coin__icon" src="./images/icon-${selection}.svg" alt="${selection}" draggable="false" />
      </div>
    </div>`

    if (options && options.isOpponentCoin) {
      // Extra HTML is required for opponent coin
      coin.classList.add('coin--flipped') // Coin is flipped at first (Backface up)
      coin.innerHTML =
        coin.innerHTML +
        `<div class="coin__face coin__face--back">
          <div class="coin__center">
            <img class="coin__icon" src="./images/${
              this.bonusGameEnabled ? 'icon-pentagon' : 'icon-triangle'
            }.svg" alt="" draggable="false" />
          </div>
        </div>`
    }

    coinContainer.appendChild(coin)
    return coinContainer
  }

  renderSelectedCoins(playerSelection, opponentSelection) {
    const playerCoinContainer = this.renderCoin(playerSelection)
    const opponentCoinContainer = this.renderCoin(opponentSelection, { isOpponentCoin: true })

    // Add class names to coin containers
    playerCoinContainer.classList.add('selected-coin-container', 'selected-coin-container--player')
    opponentCoinContainer.classList.add('selected-coin-container', 'selected-coin-container--opponent', 'hidden')

    const playerCoin = playerCoinContainer.querySelector('.coin')
    const opponentCoin = opponentCoinContainer.querySelector('.coin')

    // Add class names to coins
    playerCoin.classList.add('selected-coin', 'selected-coin--player')
    opponentCoin.classList.add('selected-coin', 'selected-coin--opponent')

    // Append coins to playground
    const playgroundResultContainer = this.playgroundRef.current.querySelector('.playground__result')
    playgroundResultContainer.appendChild(playerCoinContainer)
    playgroundResultContainer.appendChild(opponentCoinContainer)

    return { playerCoin: playerCoin, opponentCoin: opponentCoin }
  }

  startRound(playerSelection) {
    // Prevent user from changing game mode while the round is in process
    const gameBarLogo = document.querySelector('.game-bar__logo')
    gameBarLogo.style.pointerEvents = 'none'
    gameBarLogo.tabIndex = '-1'

    // Opponent selection (Computer)
    const options = ['rock', 'paper', 'scissors']
    if (this.bonusGameEnabled) options.push('lizard', 'spock')
    const opponentSelection = options[Math.floor(Math.random() * options.length)] // Random selection

    // Render selected coins in playground
    const { playerCoin, opponentCoin } = this.renderSelectedCoins(playerSelection, opponentSelection)

    // Round Result
    const { result } = this.calcRoundResult(playerSelection, opponentSelection)
    this.setLastRoundResult(result) // Round result description ("YOU WIN" / "YOU LOSE" / "DRAW")

    // Start round animation
    this.animateRoundResult(playerCoin, opponentCoin, () => {
      // Callback: Executed once animation is finished
      if (result !== 'draw') {
        // Winner coin beam
        const winnerCoin = result === 'winner' ? playerCoin : opponentCoin
        const winnerCoinBeam = document.createElement('div')
        winnerCoinBeam.className = 'winner-coin-beam'
        winnerCoin.appendChild(winnerCoinBeam)
        winnerCoinBeam.animate(
          { scale: [1, 1.05] },
          { duration: 1000, ease: 'ease-in-out', fill: 'forwards', iterations: Infinity, direction: 'alternate-reverse' }
        )

        // Update game score (can't go below 0)
        const currentScore = this.score[this.bonusGameEnabled ? 'bonus' : 'normal']
        if (result === 'loser' && currentScore <= 0) return
        let newScore = currentScore + (result === 'loser' ? -1 : +1)
        this.setCurrentModeScore(newScore)
      }
    })
  }

  animateRoundResult(playerCoin, opponentCoin, onAnimationEnd) {
    const isMobile = window.matchMedia('(max-width: 480px)').matches
    const playground = this.playgroundRef.current

    // Player selected coin presentation (STEP 0-1)
    playground.setAttribute('data-round-animation-step', 0)

    // Get equivalent type coin from coin selection container
    const equivalentTypeCoin = document.querySelector(
      `.playground__coin-selection .coin[data-coin-type=${playerCoin.getAttribute('data-coin-type')}]`
    )

    const playgroundCoinSelectionContainer = playground.querySelector('.playground__coin-selection')
    const playgroundResultContainer = playground.querySelector('.playground__result')

    // Get rectangles
    const equivalentTypeCoinRect = equivalentTypeCoin.getBoundingClientRect()
    playgroundCoinSelectionContainer.classList.add('hidden') // Hide coin selection container

    playgroundResultContainer.classList.remove('hidden') // Show round result container
    const playerCoinRect = playerCoin.getBoundingClientRect()

    const translateX = equivalentTypeCoinRect.x - playerCoinRect.x
    const translateY = equivalentTypeCoinRect.y - playerCoinRect.y

    const playerCoinContainer = playerCoin.parentElement
    playerCoinContainer.animate(
      [
        {
          transform: `translate(${translateX}px, ${translateY}px) scale(${equivalentTypeCoinRect.width / playerCoinRect.width})`,
        },
        {
          transform: `translate(0, 0) scale(1)`,
        },
      ],
      { duration: 300, easing: 'ease-in-out' }
    )

    setTimeout(() => {
      playground.setAttribute('data-round-animation-step', 1)
      playerCoinContainer.animate([{ left: '50%', transform: 'translateX(-50%)' }, { transform: 'none' }], {
        duration: 400,
        easing: 'ease-in-out',
      })

      setTimeout(() => {
        // Opponent coin reveal animation (STEP 2)
        const opponentCoinContainer = opponentCoin.parentElement
        opponentCoinContainer.classList.remove('hidden')
        opponentCoinContainer.animate(
          { opacity: [0, 1] },
          {
            duration: 400,
            easing: 'ease-in-out',
          }
        )

        setTimeout(() => {
          // Flip opponent coin (STEP 3)
          opponentCoin.classList.remove('coin--flipped')
        }, 800)

        setTimeout(
          () => {
            // Round result (STEP 4)
            playground.setAttribute('data-round-animation-step', 4)
            ;[playerCoinContainer, opponentCoinContainer].forEach((coinContainer) => {
              coinContainer.animate([{ transform: `translate(0%)` }, {}], {
                duration: 300,
                easing: 'ease-in-out',
              })
            })

            setTimeout(
              () => {
                // Show round result description & `PLAY AGAIN` button
                playgroundResultContainer.querySelector('.playground-result__description-container').classList.remove('hidden')
                playgroundResultContainer.querySelector('.playground-result__play-again-btn').focus()
                onAnimationEnd()
              },
              isMobile ? 0 : 200
            )
          },
          isMobile ? 1200 : 1500
        )
      }, 200)
    }, 500)
  }

  calcRoundResult(playerSelection, opponentSelection) {
    if (playerSelection === opponentSelection) return { result: 'draw' }

    switch (playerSelection) {
      case 'rock': // (Rock beats Scissors and Lizard)
        return { result: ['scissors', 'lizard'].includes(opponentSelection) ? 'winner' : 'loser' }
      case 'paper': // (Paper beats Rock and Spock)
        return { result: ['rock', 'spock'].includes(opponentSelection) ? 'winner' : 'loser' }
      case 'scissors': // (Scissors beats Paper and Lizard)
        return { result: ['paper', 'lizard'].includes(opponentSelection) ? 'winner' : 'loser' }
      case 'lizard': // (Lizard beats Paper and Spock)
        return { result: ['paper', 'spock'].includes(opponentSelection) ? 'winner' : 'loser' }
      case 'spock': // (Spock beats Scissors and Rock)
        return { result: ['scissors', 'rock'].includes(opponentSelection) ? 'winner' : 'loser' }
      default:
        throw new Error('Unable to determine round result')
    }
  }

  endRound(playAgainButton) {
    playAgainButton.disabled = true
    const playground = this.playgroundRef.current
    const playgroundResultContainer = playground.querySelector('.playground__result')

    // Clear round result container
    playgroundResultContainer.animate({ opacity: [1, 0] }, { duration: 300, easing: 'ease-in-out' }) // Hide round result container
    setTimeout(() => {
      const playgroundCoinSelectionContainer = this.playgroundRef.current.querySelector('.playground__coin-selection')
      playgroundResultContainer.classList.add('hidden')
      playgroundResultContainer.querySelector('.playground-result__description-container').classList.add('hidden') // Hide result description

      // Display coin selection container
      playgroundCoinSelectionContainer.classList.remove('hidden')
      playgroundCoinSelectionContainer.animate({ opacity: [0, 1] }, { duration: 300, easing: 'ease-in-out' })

      // Focus last coin selected in playground (A11Y/UX)
      document
        .querySelector(
          `.playground__coin-selection .coin[data-coin-type=${document
            .querySelector('.selected-coin--player')
            .getAttribute('data-coin-type')}]`
        )
        .focus()

      // Remove last round selected coins from the playground
      document.querySelectorAll('.playground__result .coin-container').forEach((coinContainer) => {
        coinContainer.remove()
      })

      playAgainButton.disabled = false
      playground.removeAttribute('data-round-animation-step')
    }, 280)

    // Allow user to change game mode by clicking game bar logo
    const gameBarLogo = document.querySelector('.game-bar__logo')
    gameBarLogo.style.pointerEvents = 'all'
    gameBarLogo.tabIndex = '1'
  }

  resetScore() {
    this.setCurrentModeScore(0)
  }

  setCurrentModeScore(newScore) {
    this.score[this.bonusGameEnabled ? 'bonus' : 'normal'] = newScore
    localStorage.setItem('score', JSON.stringify(this.score)) // Update local storage
    this.setGameBarScore(newScore) // Update game bar score
  }

  toggleGameMode() {
    const bonusGameEnabledNewState = !this.bonusGameEnabled
    this.setBonusGameEnabled(bonusGameEnabledNewState) // Update state
    this.setGameBarScore(this.score[bonusGameEnabledNewState ? 'bonus' : 'normal']) // Update game bar score
  }
}

export default function Game({ initialBonusGameEnabled }) {
  const gameInstanceRef = useRef();
  // Create game instance
  if (!gameInstanceRef.current) {
    gameInstanceRef.current = new RockPaperScissors();
  }
  const gameInstance = gameInstanceRef.current;

  // Bonus game enabled state
  const [bonusGameEnabled, setBonusGameEnabled] = useState(initialBonusGameEnabled)
  gameInstance.bonusGameEnabled = bonusGameEnabled
  gameInstance.setBonusGameEnabled = setBonusGameEnabled

  // Game score
  try {
    // Use saved score data from local storage
    const savedScore = JSON.parse(localStorage.getItem('score'))
    if (savedScore == null || savedScore.normal === undefined || savedScore.bonus === undefined) throw Error()
    gameInstance.score = savedScore
  } catch (err) {
    gameInstance.score = { normal: 0, bonus: 0 }
    localStorage.setItem('score', JSON.stringify(gameInstance.score))
  }

  // GameBar score status
  const initialGameBarScore = gameInstance.score[gameInstance.bonusGameEnabled ? 'bonus' : 'normal']
  const [gameBarScore, setGameBarScore] = useState(initialGameBarScore)
  gameInstance.gameBarScore = gameBarScore
  gameInstance.setGameBarScore = setGameBarScore

  // Round result (description displayed at round end)
  const [lastRoundResult, setLastRoundResult] = useState(null)
  gameInstance.lastRoundResult = lastRoundResult
  gameInstance.setLastRoundResult = setLastRoundResult

  return (
    <main className={`main-container${bonusGameEnabled ? ' bonus' : ''}`} style={{ opacity: 0 }}>
      <GameBar gameInstance={gameInstance} />
      <Playground gameInstance={gameInstance} />
      <HelpScreen />
      <Rules bonusGameEnabled={gameInstance.bonusGameEnabled} />
    </main>
  )
}
