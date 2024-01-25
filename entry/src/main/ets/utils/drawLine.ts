import { Chart } from './charts'
import { percentageConversion, roundRect, calculateNum } from './index'
/**
 * 折线图
 */
class DrawLine extends Chart {
  constructor () {
    super('line')
  }

  bindEvent (e, callback) {
    const xl = this.xAxis.data.length
    const xs = (this.W - this.cPaddingL - this.cPaddingR) / (xl - 1)
    let index = 0;
    var isLegend = false;
    let pos = {
      x: e.localX,
      y: e.localY
    };

    if (isLegend || this.drawing) return;
    // 鼠标位置在图表中时
    if (pos.y > this.cPaddingT && pos.y < this.H - this.cPaddingB && pos.x > this.cPaddingL && pos.x < this.W - this.cPaddingR) {
      // canvas.style.cursor = 'pointer';
      for (var i = 0; i < xl; i++) {
        if (pos.x > i * xs) {
          index = i;
        }
      }
      this.clearGrid(index);
      // 获取处于当前位置的信息
      var arr = [];
      for (var j = 0, item, l = this.animateArr.length; j < l; j++) {
        item = this.animateArr[j];
        if (item.hide) continue;
        arr.push({ name: item.name, num: item.data[index].num })
      }
      // this.showInfo(pos, this.xAxis.data[index], arr);
      // console.log('callback', JSON.stringify(arr))
      const obj = this.animateArr[0].data[index]
      callback(true, e, {
        x: obj.x,
        W: this.W,
        H: this.H,
      }, this.xAxis.data[index], arr, this.tooltip)
    } else {
      this.clearGrid();
      callback(false, e)
    }
  }

  clearGrid (index?) {
    let that = this
    let obj; let r = 2
    let ctx = this.ctx
    let nameH = 0
    if (this.yAxis && !Array.isArray(this.yAxis) && this.yAxis.name) {
      nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
    }
    ctx.translate(0, 0)
    ctx.restore()
    ctx.clearRect(0, 0, that.W, that.H)
    // 画坐标系
    this.drawAxis()
    // 画标签
    this.drawLegend(this.series)
    // 画y轴刻度
    this.drawY()
    // 画标志线
    if (typeof index === 'number') {
      const { axisPointer = {} } = that.tooltip
      const { type, lineStyle, shadowStyle } = axisPointer
      ctx.beginPath()
      obj = that.animateArr[0].data[index]
      ctx.lineWidth = lineStyle.width
      ctx.strokeStyle = lineStyle.color
      ctx.moveTo(obj.x, -(that.H - that.cPaddingT - that.cPaddingB - nameH))
      ctx.lineTo(obj.x, 0)
      ctx.stroke()
    }

    for (let i = 0, item, il = that.animateArr.length; i < il; i++) {
      item = that.animateArr[i]
      if (item.hide) continue
      const { lineStyle, itemStyle, color: itemColor, label } = item
      const { color, width } = lineStyle;
      const { symbol, symbolSize, symbolColor, borderWidth, borderType, borderColor } = itemStyle
      that.setCtxStyle({
        strokeStyle: color || itemColor,
        lineWidth: width
      })
      ctx.beginPath()
      for (let j = 0, obj, jl = item.data.length; j < jl; j++) {
        obj = item.data[j]
        ctx[j == 0 ? 'moveTo' : 'lineTo'](obj.x, -obj.h)
      }
      ctx.stroke()


      const { show: labelShow, color: labelColor, fontWeight, fontFamily, fontSize } = label
      // 画完曲线后再画圆球
      for (let j = 0, jl = item.data.length; j < jl; j++) {
        obj = item.data[j]
        if (symbol === 'solidCircle') {
          ctx.beginPath();
          ctx.arc(obj.x, -obj.h, symbolSize * (index === j ? 2 : 1), 0, Math.PI * 2, false);
          ctx.fillStyle = symbolColor || itemColor;
          ctx.fill();
        }
        // 绘画拐点标签
        if (labelShow) {
          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = labelColor
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const text = String(obj.num)
          const textWidth = ctx.measureText(text).width; // 获取文字的长度
          const textHeight = ctx.measureText(text).height; // 获取文字的长度
          ctx.fillText(text, obj.x, -obj.h - textHeight);
        }
      }
    }
    ctx.restore()
  }

  animate () {
    let that = this
    let ctx = this.ctx
    let xdis = that.W - that.cPaddingL * 2
    let prev; let h = 0
    let x = 0
    let y = 0
    let isStop = true

    that.drawing = true;
    function run () {
      isStop = true
      ctx.clearRect(0, that.cPaddingL + that.cPaddingT - 5, that.W, that.H - that.cPaddingB - that.cPaddingT + 4)
      ctx.save()
      for (let i = 0, item, il = that.animateArr.length; i < il; i++) {
        item = that.animateArr[i]
        if (item.hide) continue
        item.isStop = true
        ctx.beginPath()
        const { lineStyle, itemStyle, color: itemColor, label } = item
        const { color, width } = lineStyle;
        that.setCtxStyle({
          strokeStyle: color || itemColor,
          lineWidth: width
        })

        if (item.create) { // 新增绘制路径动画
          item.xl += 20
          x = item.xl
          for (let j = 0, obj, jl = item.data.length; j < jl; j++) {
            obj = item.data[j]
            prev = item.data[j - 1]
            if (j == 0) {
              ctx.moveTo(obj.x, -obj.h)
            } else if (x >= obj.x) {
              ctx.lineTo(obj.x, -obj.h)
            } else if (x < obj.x) {
              // 获取在两个区间之间的y坐标
              y = prev.h + (x - prev.x) / (obj.x - prev.x) * (obj.h - prev.h)
              ctx.lineTo(x, -y)
              break
            }
          }
          ctx.stroke()
          const { symbol, symbolSize, symbolColor, borderWidth, borderType, borderColor } = itemStyle
          const { show: labelShow, color: labelColor, fontWeight, fontFamily, fontSize } = label
          // 画完曲线后再画圆球
          if (item.xl < xdis) {
            item.isStop = false
          }
          for (let j = 0, obj, jl = item.data.length; j < jl; j++) {
            obj = item.data[j]
            if (x >= obj.x) {
              obj.y = obj.p = obj.h
              // 绘画拐点样式--画实心圆
              if (symbol === 'solidCircle') {
                ctx.beginPath();
                ctx.arc(obj.x, -obj.h, symbolSize, 0, Math.PI * 2, false);
                ctx.fillStyle = symbolColor || itemColor;
                ctx.fill();
              }
              // 绘画拐点标签
              if (labelShow && !obj.isLabel) {
                obj.isLabel = true
                ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
                ctx.fillStyle = labelColor
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                const text = String(obj.num)
                const textWidth = ctx.measureText(text).width; // 获取文字的长度
                const textHeight = ctx.measureText(text).height; // 获取文字的长度
                ctx.fillText(text, obj.x, -obj.h - textHeight);
              }
            }
          }
        } else { // 更新位移动画
          for (let j = 0, obj, jl = item.data.length; j < jl; j++) {
            obj = item.data[j]
            if (obj.p > obj.h) {
              h = obj.y - 4
              if (h < obj.h) {
                obj.y = obj.p = obj.h
              }
            } else {
              h = obj.y + 4
              if (h > obj.h) {
                obj.y = obj.p = obj.h
              }
            }
            if (obj.p != obj.h) {
              obj.y = h
              item.isStop = false
            }

            ctx[j == 0 ? 'moveTo' : 'lineTo'](obj.x, -obj.y)
          }
          ctx.stroke()
          for (let j = 0, obj, jl = item.data.length; j < jl; j++) {
            obj = item.data[j]
            ctx.beginPath()
            ctx.arc(obj.x, -obj.y, 2, 0, Math.PI * 2, false)
            ctx.stroke()
            ctx.fill()
          }
        }
        if (!item.isStop) {
          isStop = false
        }
      }
      ctx.restore()

      if (isStop) {
        that.drawing = false
        return
      }
      setTimeout(() => {
        run()
      }, 1000 / 60)
    }
    run()
  }

  create () {
    // 画坐标系
    this.drawAxis()
    // 组织数据
    this.initData()
    // 画标签
    this.drawLegend(this.series)
    // 画y轴刻度
    this.drawY()
    // 执行动画
    this.animate()
  }

  initData () {
      let that = this
      let xl = this.xAxis.data.length
      let xs = (this.W - this.cPaddingL - this.cPaddingR) / (xl - 1)
      let ydis = this.H - this.cPaddingB - this.cPaddingT
      let sl = 0
      let min = 0
      let max = 0
      let item; let obj; let arr = []

      if (!this.series.length) {
        return
      }
      for (let i = 0; i < this.series.length; i++) {
        item = this.series[i]
        if (!item.data || !item.data.length) {
          this.series.splice(i--, 1)
          continue
        }
        // 赋予没有颜色的项
        if (!item.color) {
          item.color = this.color[i]
        }
        item.name = item.name || 'unnamed'

        if (item.hide) continue
        sl++
        arr = arr.concat(item.data.slice(0, xl))
      }
      // 计算数据在Y轴刻度
      this.info = calculateNum(arr)
      min = this.info.min
      max = this.info.max

      for (let i = 0; i < this.series.length; i++) {
        item = this.series[i]
        if (!this.animateArr[i]) {
          obj = Object.assign({}, {
            i: i,
            isStop: true,
            xl: 0,
            create: true,
            ...item,
            hide: !!item.hide,
            name: item.name,
            color: item.color,
            data: []
          })
          item.data.slice(0, xl).forEach((d, j) => {
            obj.data.push({
              num: d,
              h: Math.floor((d - min) / (max - min) * ydis + 2),
              p: 0,
              x: Math.round(xs * j),
              y: 0
            })
          })
          this.animateArr.push(obj)
        } else { // 更新
          if (that.animateArr[i].hide && !item.hide) {
            that.animateArr[i].create = true
            that.animateArr[i].xl = 0
          } else {
            that.animateArr[i].create = false
          }
          that.animateArr[i].hide = item.hide
          item.data.slice(0, xl).forEach((d, j) => {
            that.animateArr[i].data[j].h = Math.floor((d - min) / (max - min) * ydis + 2)
          })
        }
      }
  }

  drawAxis () {
    let that = this
    let ctx = this.ctx
    let W = this.W
    let H = this.H
    let cPaddingL = this.cPaddingL
    let cPaddingR = this.cPaddingR
    let cPaddingT = this.cPaddingT
    let cPaddingB = this.cPaddingB
    let xl = 0
    let xs = 0 // x轴单位数，每个单位长度

    ctx.clearRect(0, 0, W, H)

    // x轴
    ctx.save()
    ctx.translate(cPaddingL, H - cPaddingB)
    const { axisTick, splitLine, axisLine = {}, axisLabel, formatter, data } = this.xAxis;
    const {show: axisLineShow = true} = axisLine
    if (axisLineShow) {
      const { color = '#333', width = 1  } = axisLine.lineStyle;
      this.setCtxStyle({
        strokeStyle: color,
        lineWidth: width
      })
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(W - cPaddingL - cPaddingR, 0)
      ctx.stroke()
    }
    // x轴刻度
    if (this.xAxis && (xl = data.length)) {
      xs = (W - cPaddingL - cPaddingR) / (xl - 1)
      data.forEach((obj, i) => {
        let x = xs * (i)
        if (axisTick.show) {
          const { color, width } = axisTick.lineStyle;
          ctx.beginPath()
          this.setCtxStyle({
            strokeStyle: color,
            lineWidth: width
          })
          ctx.moveTo(x, 0)
          ctx.lineTo(x, axisTick.length)
          ctx.stroke()
        }
        // 设置文本属性
        const {color, fontWeight, fontSize, fontFamily} = axisLabel
        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        obj = formatter ? String(formatter(obj)) : obj
        const txtW = this.ctx.measureText(obj).width; // 获取文字的长度
        const txtH = this.ctx.measureText(obj).height; // 获取文字的长度
        const textX = x
        const textY = axisTick.length + 5
        ctx.fillText(obj, textX, textY)
      })
    }
    ctx.restore()
  }

  drawY () {
    if (!Array.isArray(this.yAxis)) {
      const { axisTick, splitLine, axisLine, axisLabel, nameTextStyle } = this.yAxis;
      let ctx = this.ctx
      let nameH = 0
      if (this.yAxis && this.yAxis.name) {
        const {color, fontWeight, fontSize, fontFamily} = nameTextStyle
        this.ctx.fillStyle = color
        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textBaseline = 'middle'
        nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
        const nameW = this.ctx.measureText(this.yAxis.name).width; // 获取文字的长度
        ctx.fillText(this.yAxis.name, this.cPaddingL - nameW / 2, this.cPaddingT)
      }

      let xdis = this.W - this.cPaddingL - this.cPaddingR
      let ydis = this.H - this.cPaddingB - this.cPaddingT - nameH
      let yl = this.info.num
      let ys = ydis / yl

      // 画Y轴刻度
      ctx.save()
      // ctx.fillStyle = 'hsl(200,100%,60%)'
      ctx.translate(this.cPaddingL, this.H - this.cPaddingB)

      for (let i = 0; i <= yl; i++) {
        if (axisTick.show) {
          const { color, width, length } = axisTick.lineStyle;
          ctx.beginPath()
          this.setCtxStyle({
            strokeStyle: color,
            lineWidth: width
          })
          ctx.moveTo(-axisTick.length, -Math.floor(ys * i))
          ctx.lineTo(0, -Math.floor(ys * i))
          ctx.stroke()
        }

        if (i > 0 && splitLine.show) {
          const { color, width } = splitLine.lineStyle;
          this.setCtxStyle({
            strokeStyle: color,
            lineWidth: width
          })
          ctx.beginPath()
          ctx.moveTo(0, -Math.floor(ys * i))
          ctx.lineTo(xdis, -Math.floor(ys * i))
          ctx.stroke()
        }

        const {color, fontWeight, fontSize, fontFamily} = axisLabel
        this.ctx.fillStyle = color
        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        let dim = Math.floor(this.info.step * i + this.info.min)
        let txt = String(this.yAxis.formatter ? this.yAxis.formatter(dim) : dim)
        const txtH = this.ctx.measureText(txt).height; // 获取文字的长度
        const interval = axisTick.show ? -(axisTick.interval + axisTick.length) : -8
        ctx.fillText(txt, interval, -ys * i)
      }

      // y轴
      if (axisLine.show) {
        const { color, width } = axisLine.lineStyle;
        this.setCtxStyle({
          strokeStyle: color,
          lineWidth: width
        })
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, this.cPaddingB + this.cPaddingT + nameH - this.H )
        ctx.stroke()
        // ctx.restore()
      }
      ctx.save()
      ctx.restore()
    }
  }
}


export default DrawLine