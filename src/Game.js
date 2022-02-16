import React, { useEffect, useState } from 'react'
import './Game.css'

const MIN_OFF_INTERVAL = 1200
const MAX_OFF_INTERVAL = 1900
const MIN_ON_INTERVAL = 800
const MAX_ON_INTERVAL = 2000
const FIREFLY_SIZE = 40
const NUM_ROW_FIREFLIES = 10
const INTERVAL_INCREMENT = 10

const Firefly = ({ data, update }) => {
  const [color, setColor] = useState('black')
  let darkTimer, lightTimer

  useEffect(() => {
    setUpTimeouts()
    return () => {
      clearInterval(darkTimer)
      clearTimeout(lightTimer)
    }
  }, [])

  const setUpTimeouts = () => {
    darkTimer = setInterval(() => {
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
    const newOffIntervals = []
    for (let i = 0; i < NUM_ROW_FIREFLIES; i++) {
      newOnIntervals.push([])
      newOffIntervals.push([])
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
        newOffIntervals[i][j] = offInterval
      }
    }
    setFireflies(newFireflies)
    setOnIntervals(newOnIntervals)
    setOffIntervals(newOffIntervals)
  }, [])

  const randomInterval = (min, max) => {
    return Math.floor((Math.random() * (max - min) + min) / 10) * 10
  }

  const averageInterval = (x, y, intervals) => {
    const directions = [
      [1, 1],
      [0, 1],
      [1, 0],
      [-1, -1],
      [-1, 0],
      [0, -1],
      [-1, 1],
      [1, -1]
    ]
    let sum = 0
    let num = 0

    directions.forEach(d => {
      let curr = intervals[x + d[0]]
      if (curr === undefined) {
        return
      }
      curr = curr[y + d[1]]
      if (curr) {
        sum += curr
        num++
      }
    })

    return sum / num
  }

  const compareAvgIntervals = (average, interval) => {
    if (interval < average) {
      return INTERVAL_INCREMENT
    } else if (interval > average) {
      return -INTERVAL_INCREMENT
    } else {
      return 0
    }
  }

  const updateInterval = (x, y) => {
    setFireflies(prevFireflies =>
      prevFireflies.map(firefly => {
        if (firefly.x === x && firefly.y === y) {
          const onInterval =
            firefly.onInterval +
            compareAvgIntervals(
              averageInterval(firefly.x, firefly.y, onIntervals),
              firefly.onInterval
            )
          const offInterval =
            firefly.offInterval +
            compareAvgIntervals(
              averageInterval(firefly.x, firefly.y, offIntervals),
              firefly.offInterval
            )
          return {
            ...firefly,
            onInterval,
            offInterval
          }
        }
        return firefly
      })
    )
  }

  return (
    <>
      <div className="field">
        {fireflies.map(firefly => (
          <Firefly
            key={`${firefly.x}, ${firefly.y}, ${firefly.onInterval}`}
            data={firefly}
            update={updateInterval}
          />
        ))}
      </div>
    </>
  )
}

export default Game
