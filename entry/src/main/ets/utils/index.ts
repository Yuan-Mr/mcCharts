import { InterfaceObj, LegendInterface, TooltipInterface, SeriesInterface, AxisInterface, DataZoomInterface, RadarInterface } from './chartInterface'

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
    max: Math.max(...arr) > 0 ? max : Math.max(0, max - step)
  }
}

export function percentageConversion (value) {
  return Number(value.replace('%', '')) / 100
}

export function isPointInSector(pointX, pointY, centerX, centerY, radius, startAngle, endAngle) {
  // 计算给定坐标与扇形圆心的距离
  let distance = Math.sqrt(Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2));
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
  let dx = circle[0] - point[0]
  let dy = circle[1] - point[1]
  return dx * dx + dy * dy <= r * r
}

// 辅助函数：计算两点之间的距离
export function getDistance(point1, point2) {
  let dx = point2.localX - point1.localX;
  let dy = point2.localY - point1.localY;
  return Math.hypot(dx, dy);
}


export function interpolateLinear(points, density = 2) {
  const interpolatedPoints = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [p1, p2] = [points[i], points[i + 1]];
    const dx = (p2.x - p1.x) / (density + 1);
    const dy = (p2.y - p1.y) / (density + 1);

    for (let j = 1; j <= density; j++) {
      interpolatedPoints.push({
        x: p1.x + dx * j,
        y: p1.y + dy * j
      });
    }
    // 添加原始点，以保持曲线经过所有给定点
    interpolatedPoints.push(p2);
  }
  return interpolatedPoints;
}


export function roundDownToEven(num) {
  if (num % 2 === 1) { // 检查是否为奇数
    return num + 1; // 如果是奇数，则减去1得到偶数
  }
  return num; // 如果是偶数，则直接返回
}


export function addArrays(arr1, arr2) {
  const result = [];
  const maxLength = Math.max(arr1.length, arr2.length);

  for (let i = 0; i < maxLength; i++) {
    const sum = (arr1[i] || 0) + (arr2[i] || 0);
    result.push(sum);
  }

  return result;
}

// 文本超长截取处理
export function drawTexts(ctx, text, maxWidth) {
  let currentWidth = 0;
  let textI = text.length
  for (let i = 0; i < text.length; i++) {
    const letter = text[i];
    currentWidth += ctx.measureText(letter).width;
    if (currentWidth > maxWidth) {
      textI = i
      break; // 退出循环
    }
  }
  return textI;
}

// 文本超长换行处理
export function drawBreakText(ctx, text, maxWidth, position) {
  let currentWidth = 0;
  let lineHeight = 0;
  let textI = text.length
  let x = position.x; // 初始x坐标
  let y = position.y; // 初始y坐标
  let startIndex = 0
  for (let i = 0; i < text.length; i++) {
    const letter = text[i];
    currentWidth += ctx.measureText(letter).width;
    lineHeight = ctx.measureText(letter).height
    if (currentWidth > maxWidth * 0.6) {
      // 绘制当前行的文本（不包含当前单词）
      ctx.fillText(text.substring(startIndex, i + 1),  x, y)
      // 重置当前行的宽度和y坐标
      startIndex = i + 1
      currentWidth = 0;
      y += lineHeight;
    }
    // 如果是最后一个单词，或者遍历完所有单词，则绘制最后一行
    if (i === text.length - 1 && startIndex !== text.length) {
      ctx.fillText(text.substring(startIndex, i + 1),  x, y)
      y += lineHeight;
      text = ''; // 重置文本以开始新段落（如果需要）
      currentWidth = 0; // 重置当前行宽度
    }
  }
}

// 睡眠
function sleep(ms: number):Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 计时
export async function countDownLatch(count: number) {
  while (count > 0) {
    await sleep(80);
    count--;
  }
}

export function isPointInsidePolygon(polygon, point) {
  let x = point.x, y = point.y;

  let inside = false;
  let j = polygon.length - 1;
  for (let i = 0; i < polygon.length; i++) {
    let xi = polygon[i].x, yi = polygon[i].y;
    let xj = polygon[j].x, yj = polygon[j].y;

    let intersect = ((yi > y) !== (yj > y)) &&
      (x <= (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;

    j = i;
  }
  return inside;
}

export function rotatePoint(x, y, centerX, centerY, deltaTheta) {
  let translatedX = x - centerX;
  let translatedY = y - centerY;
  let r = Math.sqrt(translatedX * translatedX + translatedY * translatedY);
  let theta = Math.atan2(translatedY, translatedX);
  // let thetaDegrees = theta * (180 / Math.PI);
  theta = theta + deltaTheta;
  // // 确保newTheta在0到2π之间
  theta = theta % (2 * Math.PI);
  if (theta < 0) {
    theta += 2 * Math.PI;
  }
  x = r * Math.cos(theta)
  y = r * Math.sin(theta)
  return {x, y};
}

export function assign(target: object, ...source: object[]): object {
  for (const items of source) {
    for (const key of Object.keys(items)) {
      target[key] = Reflect.get(items, key)
    }
  }
  return target;
}

export function maxMinSumSeparatedBySign(data): Array<number> {
  // 初始化两个数组用于存储每个位置上的正数和与负数和
  let positiveSums = new Array(data[0].length).fill(0);
  let negativeSums = new Array(data[0].length).fill(0);

  // 遍历二维数组中的每一个元素
  data.forEach(row => {
    row.forEach((value, i) => {
      if (value > 0) {  // 如果是正数，累加到正数和中
        positiveSums[i] += value;
      } else if (value < 0) {  // 如果是负数，累加到负数和中
        negativeSums[i] += value;
      }
    });
  });

  // 计算最大值和最小值
  let maxVal = Math.max(...positiveSums.map((pos, i) => Math.max(pos, negativeSums[i])));
  let minVal = Math.min(...negativeSums.map((neg, i) => Math.min(neg, positiveSums[i])));
  return [maxVal, minVal]
}

export function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();

  // 确保半径不会大于宽度或高度的一半
  // r = Math.min(r, Math.abs(w / 2), Math.abs(h / 2));
  const [topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0] = r.map(r => Math.min(r, Math.abs(w / 2), Math.abs(h / 2)));
  if (h < 0) {

    // 负高度的情况
    y += h; // 调整y坐标，使图形从正确的起点开始绘制
    h = -h; // 取绝对值，以便接下来的绘制代码可以正常工作

    // 左上角（现为右下角）
    ctx.moveTo(x + topRight, y);
    ctx.lineTo(x + w - topRight, y);
    ctx.arcTo(x + w, y, x + w, y + topRight, topRight); // 顺时针弧线

    // 左下角
    ctx.lineTo(x + w, y + h - bottomRight);
    ctx.arcTo(x + w, y + h, x + w - bottomRight, y + h, bottomRight); // 逆时针弧线

    // 左下角（现为右上角）
    ctx.lineTo(x + bottomLeft, y + h);
    ctx.arcTo(x, y + h, x, y + h - bottomLeft, bottomLeft); // 顺时针弧线

    // 左上角（现为左上角）
    ctx.lineTo(x, y + topLeft);
    ctx.arcTo(x, y, x + topLeft, y, topLeft); // 逆时针弧线
  } else {
    ctx.moveTo(x + bottomRight, y);
    ctx.lineTo(x + w - bottomRight, y);
    ctx.arcTo(x + w, y, x + w, y + bottomRight, bottomRight);

    // 右上角
    ctx.lineTo(x + w, y + h - topRight);
    ctx.arcTo(x + w, y + h, x + w - topRight, y + h, topRight);

    ctx.lineTo(x + topLeft, y + h);
    ctx.arcTo(x, y + h, x, y + h - topLeft, topLeft);

    //
    ctx.lineTo(x, y + bottomLeft);
    ctx.arcTo(x, y, x + bottomLeft, y, bottomLeft);
  }
  ctx.closePath();
  ctx.fill();
}
// 绘制横向柱状图
export function drawHorRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  // 确保半径不会大于宽度或高度的一半
  const [topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0] = r.map(r => Math.min(r, Math.abs(h / 2), Math.abs(w / 2)));
  if (w < 0) {
    // 负高度的情况
    x = x+w; // 调整y坐标，使图形从正确的起点开始绘制
    w=-w
    // 左上角（现为右下角）
    ctx.moveTo(x + bottomRight, y);
    ctx.lineTo(x + w - bottomRight, y);
    ctx.arcTo(x + w, y, x + w, y + bottomRight, topRight); // 顺时针弧线

    // 左下角
    ctx.lineTo(x + w, y + h - bottomRight);
    ctx.arcTo(x + w, y + h, x + w - bottomRight, y + h, bottomRight); // 逆时针弧线

    // 左下角（现为右上角）
    ctx.lineTo(x + bottomLeft, y + h);
    ctx.arcTo(x, y + h, x, y + h - bottomLeft, bottomLeft); // 顺时针弧线

    // 左上角（现为左上角）
    ctx.lineTo(x, y + topLeft);
    ctx.arcTo(x, y, x + topLeft, y, topLeft); // 逆时针弧线
  } else {
    ctx.moveTo(x + bottomRight, y);
    ctx.lineTo(x + w - bottomRight, y);
    ctx.arcTo(x + w, y, x + w, y + bottomRight, bottomRight);
    // 右上角
    ctx.lineTo(x + w, y + h - topRight);
    ctx.arcTo(x + w, y + h, x + w - topRight, y + h, topRight);

    ctx.lineTo(x + topLeft, y + h);
    ctx.arcTo(x, y + h, x, y + h - topLeft, topLeft);

    //
    ctx.lineTo(x, y + bottomLeft);
    ctx.arcTo(x, y, x + bottomLeft, y, bottomLeft);
  }
  ctx.closePath();
  ctx.fill();
}


export function lerp (start, end, t) { // 线性插值
  return start * (1 - t) + end * t;
}