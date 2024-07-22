import { rotatePoint, isPointInsidePolygon, countDownLatch, percentageConversion, drawTexts, drawBreakText } from './index'
import { Chart } from './charts'
import { axisLineStyle, yLineStyle, radar, itemStyle as commonItemStyle, areaStyle as commonAreaStyle, lineStyle as commonLineStyle } from './defaultOption'
import { InterfaceObj } from './chartInterface'
let points = []

/**
 * 雷达图
 */
class DrawRadar extends Chart {
  maxValue = 0;
  ctr = 1;
  numCtr = 40;
  speed = 1;
  mousePosition = {
    x: 0,
    y: 0
  }
  constructor() {
    super('radar');
  }

  create() {
    // 组织数据
    this.initData()
    // 绘制标签
    this.drawText()
    // 绘制底图
    this.drawRadarBg()
    // 执行动画
    this.animate()
  }

  bindEvent(e, callback) {
    const that = this
    const ctx = this.ctx
    const w = this.W
    let startAngle = 0;
    let isLegend = false;
    let pos = {
      x: e.localX,
      y: e.localY
    };
    let {
      indicator = [],
      center = radar.center,
      radius = radar.radius,
      startAngle: radarStartAngle = radar.startAngle,
      splitNumber = radar.splitNumber,
      splitLine = {},
      splitArea = {},
    } = this.radar
    radius = typeof radius === 'string' && radius.indexOf('%') !== -1 ? (w / 2) * percentageConversion(radius) : (Number(radius) || (w / 2 * 0.5))
    const [centerX, centerY] = that.setCenter(center, true)
    let rotatedMousePoint = rotatePoint(pos.x, pos.y, centerX, centerY, radarStartAngle * 2 * Math.PI / 360);
    if (isLegend || this.drawing) return;
    let activeIndex = null
    for (let i = 0, l = points.length; i < l; i++) {
      const item = points[i];
      if (item.hide) continue;
      // 判断当前点击是否在某个扇形区域里面
      const flag = isPointInsidePolygon(item.inflectionPoints, rotatedMousePoint)
      if (flag) {
        activeIndex = i
      }
      // that.clearGrid();
    }
    if (activeIndex !== null) {
      //
      // ctx.reset();
      ctx.rotate(radarStartAngle * 2 * Math.PI / 360);
      // ctx.translate(1, -1);
      ctx.translate(-this.W/2, -this.H/2);
      ctx.clearRect(0, 0, this.W, this.H);
      //
      // 绘制标签
      this.drawText()
      // 绘制底图
      this.drawRadarBg()
      // 执行动画
      this.animate(activeIndex)
      callback(true, e, {
        x: pos.x,
        y: pos.y,
        W: this.W,
        H: this.H
      }, points[activeIndex].name, indicator.map((item, index) => {
        return {
          name: item.name,
          num: points[activeIndex].data[index] || 0
        }
      }), this.tooltip)
    } else {
      callback(false, e)
    }
  }

  initData() {
    const dataArr = this.series
    let allArr = [];
    for (let i = 0; i < dataArr.length; i++) {
      dataArr[i].data.forEach(item => {
        allArr.push(this.getValue(item))
      })
    }
    this.maxValue = Math.max.apply(null, allArr);
  }

  getValue (item) {
    let value = 0
    if (typeof item === 'string' || typeof item === 'number') {
      value = Number(item)
    } else {
      value = Number(item.value)
    }
    return value
  }

  drawRadarBg() {
    const ctx = this.ctx
    const w = this.W
    let {
      indicator = [],
      center = radar.center,
      radius = radar.radius,
      startAngle: radarStartAngle = radar.startAngle,
      splitNumber = radar.splitNumber,
      axisLine = {},
      splitLine = {},
      splitArea = {},
    } = this.radar
    // 雷达图分割线
    const { show: axisLineShow = true, lineStyle: axisLineStyle = {} } = axisLine
    // 雷达图区域分割线
    const { show: splitLineShow = true, lineStyle: splitLineStyle = {} } = splitLine
    // 区域的颜色
    const { show: splitAreaShow = true, areaStyle = {} } = splitArea

    let totalDots = indicator.length
    // 起始角度
    let startAngle = 0;
    // 雷达图半径
    radius = typeof radius === 'string' && radius.indexOf('%') !== -1 ? (w / 2) * percentageConversion(radius) : (Number(radius) || (w / 2 * 0.5))
    // 移动到图表中间
    splitNumber = Math.max(splitNumber, 1)
    ctx.rotate(-radarStartAngle * 2 * Math.PI / 360);
    for (let index = 0; index < splitNumber; index++) {
      // 算出每个间隔的距离
      let R = radius * (1 - index / splitNumber);
      const startX = R * Math.cos(startAngle);
      const startY = R * Math.sin(startAngle);
      // 绘画每一个环
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (let i = 1; i < totalDots + 1; i++) { // 多画一个闭合路径
        const startX = R * Math.cos(startAngle);
        const startY = R * Math.sin(startAngle);
        ctx.lineTo(startX, startY);
        startAngle = startAngle - 2 * Math.PI / totalDots;
      }
      // ctx.moveTo(oneStartX, oneStartY);
      if (splitLineShow || index == 0) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#DBDBDB";
      } else {
        ctx.lineWidth = 0;
        ctx.strokeStyle = "rgba(0,0,0,0)";
      }
      ctx.closePath();
      ctx.stroke();
      if (splitAreaShow) {
        const { colors = ['#fff', 'rgba(200,200,200,0.2)'] } = areaStyle
        if (index % 2 === 0) {
          ctx.fillStyle = colors[0] || '#fff';
        } else {
          ctx.fillStyle = colors[1] || 'rgba(200,200,200,0.2)';
        }
        ctx.fill();
      }
      // 绘画分割线
      if (axisLineShow) {
        startAngle = 0;
        const { color = '#DBDBDB', width = 1 } = axisLineStyle
        for (let i = 1; i < totalDots + 1; i++) { // 多画一个闭合路径
          const startX = R * Math.cos(startAngle);
          const startY = R * Math.sin(startAngle);
          startAngle = startAngle - 2 * Math.PI / totalDots;
          ctx.beginPath();
          ctx.lineWidth = width;
          ctx.strokeStyle = color;
          ctx.lineTo(startX, startY);
          ctx.lineTo(0, 0); // 从中心点触发去绘画
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }

  drawText () {
    const ctx = this.ctx
    const w = this.W
    let {
      indicator = [],
      radius = radar.radius,
      center = radar.center,
      nameGap = radar.nameGap,
      axisName = {},
      startAngle: radarStartAngle = radar.startAngle
    } = this.radar
    const {
      show = true,
      color = '#999',
      fontWeight = 'normal',
      fontFamily = 'sans-serif',
      fontSize = 22,
      width = 0,
      overflow = 'none'
    } = axisName
    if (!show) return;
    let length = indicator.length;
    let angleStep = 2 * Math.PI / length;
    let r = typeof radius === 'string' && radius.indexOf('%') !== -1 ? (w / 2) * percentageConversion(radius) : (Number(radius) || (w / 2 * 0.5))
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontWeight} ${fontFamily}`;
    ctx.textAlign = 'center';
    let startAngle = -radarStartAngle * 2 * Math.PI / 360;
    this.setCenter(center)
    // ctx.rotate(0);
    // ctx.save()
    // ctx.rotate(radarStartAngle * Math.PI * 2 / 360);
    for (let i = 0; i < indicator.length; i++) {
      const obj = String(indicator[i].name)
      // let curAngle = radarStartAngle * 2 * Math.PI / 360 - angleStep * i;
      let x = (r * Math.cos(startAngle));
      let y = (r * Math.sin(startAngle));
      //根据方向调整文字的对齐点
      let cos = Math.cos(startAngle);
      startAngle = startAngle - 2 * Math.PI / length;
      if (Math.abs(cos) < 10e-4) {
        ctx.textAlign = 'center';
        if (y < 0) {
          y -= nameGap
        } else {
          y += nameGap
        }
      } else if (cos > 0) {
        ctx.textAlign = 'left';
        x += nameGap
      } else {
        ctx.textAlign = 'right';
        x -= nameGap
      }
      if (width !== 0 && overflow !== 'none') {
        const textX = x
        const textY = y
        let textI = obj.length
        if (overflow === 'truncate') {
          textI = drawTexts(ctx, obj, width)
          ctx.fillText(obj.substring(0, textI) + '...', textX, textY)
        } else if (overflow === 'breakAll') {
          drawBreakText(ctx, obj, width, {
            x: textX,
            y: textY
          })
        }
      } else {
        ctx.fillText(obj, x, y);
      }
    }
  }

  async animate (activeIndex = null) {
    const ctx = this.ctx
    const w = this.W
    let ifTip = false;
    let tipArr = null;
    let {
      indicator = [],
      center = radar.center,
      radius = radar.radius,
      startAngle: radarStartAngle = radar.startAngle
    } = this.radar
    this.drawing = true
    // 雷达图半径
    radius = typeof radius === 'string' && radius.indexOf('%') !== -1 ? (w / 2) * percentageConversion(radius) : (Number(radius) || (w / 2 * 0.5))
    // 移动到图表中间
    // ctx.save()
    // const [cx, cy] = this.setCenter(center)

    // ctx.save()
    // ctx.rotate(-radarStartAngle * 2 * Math.PI / 360);
    // 获取雷达图数据
    const totalDots = indicator.length
    const dataArr = this.series
    const colorArr = this.color
    points = []
    for (let i = 0; i < dataArr.length; i++) {
      const { data = [], itemStyle = {}, areaStyle = {}, lineStyle = {} } = dataArr[i]
      const { color: lineColor = '', width = 1 } = {...commonLineStyle, ...(lineStyle || {})};
      const {
        symbol = commonItemStyle.symbol,
        symbolSize = commonItemStyle.symbolSize,
        symbolColor = commonItemStyle.symbolColor,
        borderWidth = commonItemStyle.borderWidth,
        borderType = commonItemStyle.borderType,
        borderColor = commonItemStyle.borderColor
      } = itemStyle
      ctx.lineWidth = activeIndex === i ? width * 1.5 : width;
      let nowArr: Array<InterfaceObj | number | string> = dataArr[i].data;
      let arcArr = [];
      ctx.beginPath();
      let startAngle = 0;
      const inflectionPoints = []
      for (let j = 0; j < totalDots; j++) {
        const value = this.getValue(nowArr[j])
        let R = radius * (value / this.maxValue);
        const startX = R * Math.cos(startAngle);
        const startY = R * Math.sin(startAngle);
        startAngle = startAngle - 2 * Math.PI / totalDots;
        ctx.fillStyle = ctx.strokeStyle = lineColor || colorArr[i % colorArr.length];
        if (j === 0) {
          ctx.moveTo(startX, startY); //点连线
        } else {
          ctx.lineTo(startX, startY); //点连线
        }
        inflectionPoints.push({
          x: startX,
          y: startY
        })
        ctx.stroke();
        if (activeIndex === null) {
          await countDownLatch(1)
        }
      }
      ctx.closePath();
      ctx.stroke();
      points.push({
        ...dataArr[i],
        inflectionPoints
      })
      const { color = commonAreaStyle.color } = areaStyle
      if (!color) {
        // ctx.globalAlpha = 0.3;
        // ctx.fill();
        // ctx.globalAlpha = 1;
      } else {
        if (typeof color === 'string') {
          ctx.fillStyle = color
        } else if (typeof color === 'object') {
          const { direction = [0, 1, 0, 0], colors = [] } = color || {}
          const gradient = ctx.createLinearGradient(this.W / 2 * (direction[0] || 0), -this.H * (direction[1] || 1), this.W / 2 * (direction[2] || 0), -this.H * (direction[0] || 0));
          colors.forEach(item => {
            gradient.addColorStop(item.offset, item.color)
          })
          ctx.fillStyle = gradient;
        }
        ctx.fill();
      }

      // 拐点功能
      if (symbol === 'solidCircle' || activeIndex === i) {
        for (let m = 0; m < inflectionPoints.length; m++) {
          ctx.beginPath();
          const {x, y} = inflectionPoints[m]
          ctx.fillStyle = symbolColor || 'rgba(255,255,255,1)';
          ctx.strokeStyle = borderColor || colorArr[i % colorArr.length];
          ctx.lineWidth = borderWidth || 1;
          ctx.arc(x, y, symbolSize, 0, Math.PI * 2);
          ctx.fill()
          ctx.stroke();
        }
      }
    }
    this.drawing = false
    ctx.restore();
  }

  // 获取中心坐标
  setCenter(center: Array<string | number>, flag = false) {
    const [wc = '50%', hc = '50%'] = center
    const cx = this.W * percentageConversion(wc)
    const cy = this.H * percentageConversion(hc)
    if (!flag) {
      this.ctx.translate(cx, cy);
    }
    return [cx, cy]
  }
}

export default DrawRadar