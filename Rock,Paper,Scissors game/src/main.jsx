import React from 'react'
import ReactDOM from 'react-dom/client'
import Game from './Game.jsx'
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Game initialBonusGameEnabled={false} />
  </React.StrictMode>
)
