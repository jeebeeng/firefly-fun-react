import React, { useEffect, useState, useCallback } from 'react'
import './Game.css'

const OFF_INTERVAL = 1000
const MIN_INTERVAL = 1200
const MAX_INTERVAL = 1800

const Firefly = ({ data, update }) => {
  const [className, setClassName] = useState('firefly-dark')

  useEffect(() => {
    const darkTimer = setTimeout(() => {
      setClassName('firefly-light')
      const lightTimer = setTimeout(() => {
        update(data.x, data.y)
      }, data.interval)
    }, OFF_INTERVAL)
    return () => {
      clearTimeout(darkTimer)
    }
  }, [update, data])

  return <div className={`firefly ${className}`}></div>
}

const Game = () => {
  const [fireflies, setFireflies] = useState([])
  const [board, setBoard] = useState([])

  useEffect(() => {
    setFireflies([{ x: 0, y: 0, interval: randomInterval() }])
  }, [])

  const randomInterval = () => {
    return Math.floor(
      Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL
    )
  }

  const updateInterval = (x, y) => {
    setFireflies(
      fireflies.map(firefly => {
        if (firefly.x === x && firefly.y === y) {
          const newInterval = randomInterval()
          return { x, y, interval: newInterval }
        }
        return firefly
      })
    )
  }

  return (
    <div>
      {fireflies.map(firefly => (
        <Firefly
          key={`${firefly.x}, ${firefly.y}, ${firefly.interval}`}
          data={firefly}
          update={updateInterval}
        />
      ))}
    </div>
  )
}

export default Game
