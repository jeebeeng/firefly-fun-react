import React, { useEffect, useState } from 'react'
import './Game.css'

const MIN_OFF_INTERVAL = 1200
const MAX_OFF_INTERVAL = 1900
const MIN_ON_INTERVAL = 800
const MAX_ON_INTERVAL = 2000
const FIREFLY_SIZE = 40
const NUM_ROW_FIREFLIES = 10

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
      }, data.onInterval)
    }, data.offInterval)
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
  const [onIntervals, setOnIntervals] = useState([])
  const [offIntervals, setOffIntervals] = useState([])

  useEffect(() => {
    const newFireflies = []
    const newOnIntervals = []
    for (let i = 0; i < NUM_ROW_FIREFLIES; i++) {
      newOnIntervals.push([])
      for (let j = 0; j < NUM_ROW_FIREFLIES; j++) {
        const onInterval = randomInterval(MIN_ON_INTERVAL, MAX_ON_INTERVAL)
        const offInterval = randomInterval(MIN_OFF_INTERVAL, MAX_OFF_INTERVAL)
        const newFireFly = {
          x: i,
          y: j,
          onInterval,
          offInterval
        }
        newFireflies.push(newFireFly)
        newOnIntervals[i][j] = onInterval
      }
    }
    setFireflies(newFireflies)
    setOnIntervals(newOnIntervals)
  }, [])

  const randomInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
  }

  const updateInterval = (x, y) => {
    setFireflies(prevFireflies =>
      prevFireflies.map(firefly => {
        if (firefly.x === x && firefly.y === y) {
          const offInterval = randomInterval(MIN_ON_INTERVAL, MAX_ON_INTERVAL)
          const onInterval = randomInterval(MIN_OFF_INTERVAL, MAX_OFF_INTERVAL)
          return { x, y, onInterval, offInterval }
        }
        return firefly
      })
    )
  }

  return (
    <div className="field">
      {fireflies.map(firefly => (
        <Firefly
          key={`${firefly.x}, ${firefly.y}, ${firefly.onInterval}`}
          data={firefly}
          update={updateInterval}
        />
      ))}
    </div>
  )
}

export default Game
