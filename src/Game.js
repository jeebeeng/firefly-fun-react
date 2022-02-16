import React, { useEffect, useState } from 'react'
import './Game.css'

const OFF_INTERVAL = 2000
const MIN_INTERVAL = 800
const MAX_INTERVAL = 2000
const FIREFLY_SIZE = 40

const Firefly = ({ data, update }) => {
  const [color, setColor] = useState('black')
  let darkTimer, lightTimer

  useEffect(() => {
    setUpTimeouts()
    return () => {
      clearTimeout(darkTimer)
      clearTimeout(lightTimer)
    }
  }, [])

  const setUpTimeouts = () => {
    darkTimer = setTimeout(() => {
      setColor('yellow')
      lightTimer = setTimeout(() => {
        update(data.x, data.y)
        setColor('black')
      }, data.interval)
    }, OFF_INTERVAL + data.interval)
  }

  return (
    <div
      className="firefly"
      style={{
        height: `${FIREFLY_SIZE - 4}px`,
        width: `${FIREFLY_SIZE - 4}px`,
        left: `${FIREFLY_SIZE * data.x * 1.5}px`,
        top: `${FIREFLY_SIZE * data.y * 1.5}px`,
        backgroundColor: `${color}`
      }}
    ></div>
  )
}

const Game = () => {
  const [fireflies, setFireflies] = useState([])

  useEffect(() => {
    const newFireflies = []
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        newFireflies.push({ x: j, y: i, interval: randomInterval() })
      }
    }
    setFireflies(newFireflies)
  }, [])

  const randomInterval = () => {
    return Math.floor(
      Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL
    )
  }

  const updateInterval = (x, y) => {
    setFireflies(prevFireflies =>
      prevFireflies.map(firefly => {
        if (firefly.x === x && firefly.y === y) {
          const newInterval = randomInterval()
          return { x, y, interval: newInterval }
        }
        return firefly
      })
    )
  }

  return (
    <div className="field">
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
