const svgTransform = (chunk, extremes, fixed = 2) => {
  const toFixed = number => {
    const proxy = Math.pow(10, fixed)
    return Math.round(number * proxy) / proxy
  }

  const bottomYAxis = toFixed(extremes.lat.from),
    leftXAxis = toFixed(extremes.long.from)

  const totalHeight = extremes.lat.to - extremes.lat.from
  const totalWidth = extremes.long.to - extremes.long.from

  const widthRatio = totalWidth / totalHeight
  const heightRatio = totalHeight / totalWidth

  const w = widthRatio > 1 ? 1 : widthRatio,
    h = heightRatio > 1 ? 1 : heightRatio

  const inner = chunk => {
    return chunk.reduce((prev, cur) => {
      /** [[x,y],[x,y]] */
      const isContainerOfCoordinatesArrays = typeof cur[0][0] === 'number'

      if (isContainerOfCoordinatesArrays) {
        const mod = cur
          .map(el => {
            const x = el[0],
              y = el[1],
              deltaX = x - leftXAxis,
              deltaY = totalHeight - (y - bottomYAxis),
              posX = toFixed((deltaX / totalWidth) * 100 * w),
              posY = toFixed((deltaY / totalHeight) * 100 * h)

            return `${posX} ${posY}`
          })
          .join(' L ')

        return `M ${mod}`
      } else {
        return prev + inner(cur)
      }
    }, '')
  }

  return inner(chunk)
}

module.exports = svgTransform
