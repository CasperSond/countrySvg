/**
 *
 * @param {number} from
 * @param {number} to
 */

const getRandomBetween = (from, to) => {
  const random = Math.random()
  const length = to - from
  const randomIndex = Math.floor(random * length)
  const frompadded = from + randomIndex

  return frompadded
}

/**
 *
 * @param {Array} array
 *
 */

const shuffleArray = (array, length) => {
  const copy = array.slice(),
    shuffled = []

  while (copy.length > 0) {
    if (length && shuffled.length === length) {
      return shuffled
    }
    const random = Math.random(),
      randomIndex = Math.floor(random * copy.length),
      grapRandom = copy.splice(randomIndex, 1)

    shuffled.push(grapRandom[0])
  }

  return shuffled
}

export { getRandomBetween, shuffleArray }
