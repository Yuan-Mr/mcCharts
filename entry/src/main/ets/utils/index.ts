// 判断对象属性
const typeOf = function (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

// deepCopy 深拷贝
export const deepCopy = function (data) {
  const t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (const i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}

export function roundRect (ctx, x, y, width, height, radius) {
  ctx.beginPath()
  if (width > 0) {
    ctx.moveTo(x + radius, y)
  } else {
    ctx.moveTo(x - radius, y)
  }

  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)

  if (width > 0) {
    ctx.arcTo(x, y, x + radius, y, radius)
  } else {
    ctx.arcTo(x, y, x - radius, y, radius)
  }
}

export function calculateNum (arr, isMin?) {
  if (!arr || !arr.length) {
    return { num: 0, step: 0, min: 0, max: 0 }
  }
  const newArr = [...arr]
  let oldHigh = Math.max.apply(this, arr)
  let high = Math.max(...newArr.map(item => Math.abs(item)), 0)
  let low = Math.min(...arr, 0)
  let num = 0
  let max = 0
  let min = 0
  let pow; let sum; let step; let absLow; let i; let j; let k = 0
  outer:
  for (i = 0; i < 10; i++) {
    pow = Math.pow(10, i)
    for (j = 1; j <= 10; j++) {
      sum = pow * j
      if (sum > high) {
        max = sum
        break
      }
    }
    if (!max) continue
    if (i < 2 || j > 4) break
    for (k = 0; k < 10; k++) {
      if (max - pow / 10 * (k + 1) <= high) {
        max -= pow / 10 * k
        break outer
      }
    }
  }
  num = j
  if (num < 4) {
    if (max % 4 == 0) { num = 4 }
    if (max % 3 == 0) { num = 3 }
  }
  step = Math.round(max / num * 100) / 100
  if (low < 0) {
    if (oldHigh > 0) {
      num++
    }
    absLow = Math.abs(low)
    // num++
    min += step

    while (min <= absLow) {
      num++
      min += step
    }
    min = -min
  }

  if (isMin) {
    let l = num
    let m = 0
    for (let i = 1; i < l; i++) {
      let n = min + i * step
      if (low < n) {
        break
      }
      m = n
      num--
    }
    min = m
  }
  return {
    num: num,
    step: step,
    min: min,
    max: Math.max(...arr) > 0 ? max : 0
  }
}

export function percentageConversion (value) {
  return Number(value.replace('%', '')) / 100
}

export function isPointInSector(pointX, pointY, centerX, centerY, radius, startAngle, endAngle) {
  // 计算给定坐标与扇形圆心的距离
  var distance = Math.sqrt(Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2));
  // 计算给定坐标与扇形圆心的角度
  let angle = Math.atan2(pointY - centerY, pointX - centerX);
  // 将角度转换为正值（0到360度）
  if (angle < -Math.PI / 2) {
    angle += Math.PI * 2;
  }
  // 检查给定坐标是否在扇形的半径范围内，并且角度在起始角度和结束角度之间
  if (distance <= radius && angle >= startAngle && angle <= endAngle) {
    return true;
  }

  return false;
}

/**
 *  判断一个点是否在圆的内部
 *  @param point  测试点坐标
 *  @param circle 圆心坐标
 *  @param r 圆半径
 *  返回true为真，false为假
 *  */
export function pointInsideCircle(point, circle, r) {
  if (r === 0) return false
  var dx = circle[0] - point[0]
  var dy = circle[1] - point[1]
  return dx * dx + dy * dy <= r * r
}