import React, { useEffect, useState } from 'react'
import './Game.css'

const OFF_INTERVAL = 1000
const MIN_INTERVAL = 1400
const MAX_INTERVAL = 1800
const FIREFLY_SIZE = 40

const Firefly = ({ data, update }) => {
  const [color, setColor] = useState('black')
  let darkTimer, lightTimer

  useEffect(() => {
    setUpTimeouts()
    return () => {
      clearInterval(darkTimer)
      clearTimeout(lightTimer)
    }
  }, [data])

  const setUpTimeouts = () => {
    darkTimer = setInterval(() => {
      setColor('yellow')
      lightTimer = setTimeout(() => {
        setColor('black')
        //update(data.x, data.y)
      }, data.interval)
    }, OFF_INTERVAL + data.interval)
  }

  return (
    <div
      style={{
        height: `${FIREFLY_SIZE - 1}px`,
        width: `${FIREFLY_SIZE - 1}px`,
        left: `${FIREFLY_SIZE * data.x + 1}px`,
        top: `${FIREFLY_SIZE * data.y + 1}px`,
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
      newFireflies.push({ x: i, y: i, interval: randomInterval() })
    }
    setFireflies(newFireflies)
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
