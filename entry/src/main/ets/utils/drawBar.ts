import { Chart } from './charts'
import { calculateNum, lerp, drawTexts, drawBreakText, maxMinSumSeparatedBySign, deepCopy, drawRoundedRect } from './index'
import { axisLineStyle, yLineStyle, barStyle as commonBarStyle, label as commonLabel } from './defaultOption'
import { InterfaceObj } from './chartInterface';
let timer = null
let transitionStart = null
let transitionDuration = 800
let previousData = []
/**
 * 柱状图
 */
class DrawBar extends Chart {
  private zeroScaleY;
  constructor () {
    super('bar');
  }
  bindEvent(e, callback) {
    const { xl, xStart, xEnd } = this.getXdataLength()
    const ctx = this.ctx;
    const xs = (this.W - this.cPaddingL - this.cPaddingR) / ((xEnd - xStart) || 1);
    let index = 0;
    let isLegend = false;
    let pos = {
      x: e.localX,
      y: e.localY
    };
    if (isLegend || this.drawing) return;
    // 鼠标位置在图表中时
    if (pos.y > this.cPaddingT && pos.y < this.H - this.cPaddingB && pos.x > this.cPaddingL && pos.x < this.W - this.cPaddingR) {
      for (let i = 0; i < (xEnd - xStart); i++) {
        if (pos.x > i * xs + this.cPaddingL) {
          index = i;
        }
      }
      const obj = this.animateArr[0].data[index]
      if (!obj) return
      this.clearGrid(index, xs);
      // 获取处于当前位置的信息
      const arr = [];
      for (let j = 0, item, l = this.animateArr.length; j < l; j++) {
        item = this.animateArr[j];
        if (item.hide) continue;
        arr.push({ name: item.name, num: item.data[index].num });
      }
      // this.showInfo(pos, this.xAxis.data[index], arr);
      // console.log('callback', JSON.stringify(arr))
      callback(true, e, {
        x: obj.x,
        W: this.W,
        H: this.H
      }, this.xAxis.data[index], arr, this.tooltip);
    } else {
      this.clearGrid();
      callback(false, e);
    }
  }
  clearGrid(index?, xs?) {
    if (this.activeIndex === index) return;
    this.activeIndex = index || null;
    let that = this,
      ctx = this.ctx;
    let nameH = 0;
    if (this.yAxis && !Array.isArray(this.yAxis) && this.yAxis.name) {
      nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
    }
    ctx.clearRect(0, 0, that.W, that.H);
    // 画坐标系
    this.drawAxis();
    // 画标签
    this.drawLegend(this.series);
    // 画y轴刻度
    this.drawY();

    ctx.save();
    ctx.translate(this.cPaddingL, (this.H - this.cPaddingB));
    // 画标志线
    if (typeof index === 'number') {
      const { axisPointer = {} } = this.tooltip
      const { type = 'line', lineStyle = {}, shadowStyle = {} } = axisPointer
      ctx.lineWidth = xs;
      ctx.strokeStyle = shadowStyle.color || 'rgba(150,150,150, 0.2)';
      const x = xs * (index + 1) - xs / 2;
      const y = -(that.H - that.cPaddingT - that.cPaddingB - nameH);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, 0);
      ctx.stroke();
    }
    for (let i = 0, item, il = that.animateArr.length; i < il; i++) {
      item = that.animateArr[i];
      if (item.hide) continue;
      const { color, label, barW, borderRadius } = item;
      const { show: labelShow = commonLabel.show } = label
      for (let j = 0, obj, jl = item.data.length; j < jl; j++) {
        obj = item.data[j];
        if (index === j) {
          that.setCtxStyle({
            strokeStyle: color,
            lineWidth: barW,
            globalAlpha: 0.8
          });
        } else {
          that.setCtxStyle({
            strokeStyle: color,
            lineWidth: barW,
            globalAlpha: 1
          });
        }
        const y = obj.num ? -obj.h + (borderRadius ? barW / 2 : 0) * (obj.num > 0 ? 1 : -1) : 0
        ctx.beginPath();
        ctx.moveTo(obj.x, obj.num ? obj.zeroScaleY : 0);
        ctx.lineTo(obj.x, y);
        ctx.stroke()
        if (borderRadius) {
          ctx.beginPath()
          let globalAlpha = 1
          if (index === j) {
            globalAlpha = 0.8
          } else {
            globalAlpha = 1
          }
          that.createRadius(ctx, color, obj.x, y, barW / 2, obj.num, globalAlpha)
        }
        if (labelShow) {
          that.drawLabel(item, j)
        }
      }
    }
    ctx.restore()
  }
  animate() {
    timer = setTimeout(() => {
      this.animate()
    }, 16);
    if (transitionStart !== null) {
      this.drawBars();
      if (Date.now() - transitionStart >= transitionDuration) {
        // 过渡完成，重置transitionStart
        transitionStart = null;
        previousData = deepCopy(this.animateArr);
      }
    }
  }
  drawBars () {
    const that = this;
    const ctx =this.ctx;
    let nameH = 0
    if (this.yAxis && !Array.isArray(this.yAxis) && this.yAxis.name) {
      nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
    }
    const ydis = this.H - this.cPaddingB - this.cPaddingT - nameH
    const elapsed = Date.now() - transitionStart;
    const progress = Math.min(elapsed / transitionDuration, 1); // 进度，范围[0,1]
    this.ctx.clearRect(0, 0, this.W, this.H);
    // ctx.save()
    // ctx.translate(that.cPaddingL, (that.H - that.cPaddingB))
    // 画坐标系
    this.drawAxis();
    // 画标签
    this.drawLegend(this.series);
    // 画y轴刻度
    this.drawY();
    ctx.save()
    ctx.translate(that.cPaddingL, (that.H - that.cPaddingB))
    for (let i = 0, item, oldItem; i < this.animateArr.length; i++) {
      item = that.animateArr[i];
      oldItem = previousData[i];
      if (item.hide) continue;
      const { color, barW, stack, borderRadius } = item
      item.data.forEach((obj, index) => {
        this.setCtxStyle({
          fillStyle: color
        })
        let oldValue = this.renderType !== 'init' && oldItem.data[index] ? oldItem.data[index].h || 0 : 0;
        oldValue = oldValue ? -(oldValue + obj.zeroScaleY) : 0
        let y = obj.zeroScaleY;
        let h = obj.h && obj.num ? -(obj.h + obj.zeroScaleY) : 0;
        const currentValue = lerp(oldValue, h, progress);
        const x = obj.x - barW / 2;
        h = currentValue
        drawRoundedRect(ctx, x, y, barW, h, borderRadius ? [barW / 2, barW / 2, 0, 0] : [])
        this.drawLabel(item, index)
      });
    }
    ctx.restore()
  }
  create() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    // 组织数据
    this.initData();
    transitionStart = Date.now();
    if (this.renderType === 'init') {
      previousData = deepCopy(this.animateArr);
      // 执行动画
      this.animate();
    } else {
      // 更新动画
      this.animate();
    }
  }

  // 实现圆角的柱子
  createRadius (ctx, color, x, y, r, num, globalAlpha = 1) {
    ctx.beginPath()
    this.setCtxStyle({
      fillStyle: color,
      globalAlpha
    });
    ctx.arc(x, y, r, 0, 180 * Math.PI / 180, num > 0)
    ctx.fill();
  }

  initData () {
    let that = this
    const { xl, xStart, xEnd } = this.getXdataLength()
    let nameH = 0
    if (this.yAxis && !Array.isArray(this.yAxis) && this.yAxis.name) {
      nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
    }
    let xs = (this.W - this.cPaddingL - this.cPaddingR) / ((xEnd - xStart) || 1) // 每个数组的刻度间隔值
    let ydis = this.H - this.cPaddingB - this.cPaddingT - nameH
    let index = 0
    let sl = 0 // 展示数据的实际长度
    let min = 0
    let max = 0
    let sp = 3 // 柱子的间隔
    let bcg  = 6 // barCategoryGap 每个数据之间的间隔
    let w = 0 // 柱子的宽度
    let item; let obj;

    if (!this.series.length) {
      return
    }
    const result = [...this.series]
    let dataArr = {
      arr: []
    }
    let barWT = 0; // 计算所有柱子的合计宽度，用来计算显示的位置
    for (let i = 0; i < result.length; i++) {
      item = result[i]
      const { stack, barStyle } = item
      const { width = commonBarStyle.width, barGap = commonBarStyle.barGap } = barStyle
      if (item.hide) continue
      const data = item.data.slice(xStart, xEnd)
      if (stack) { // 判断是否是堆积图，如果是合计的堆积图，则每个柱子的起点也是累计的
        if (dataArr[stack]) {
          // dataArr[stack] = addArrays(dataArr[stack], data || [])
          dataArr[stack].push(data || [])
        } else {
          dataArr[stack] = data ? [data] : []
          barWT += (width + (result.length > 1 && i > 0 ? barGap : 0))
        }
      } else {
        dataArr.arr = dataArr.arr.concat(data)
        barWT += (width + (result.length > 1 && i > 0 ? barGap : 0))
      }
    }
    // 先计算出每个堆叠的柱子最大值跟最小值，比如出现负数时，渲染异常
    // 计算数据在Y轴刻度
    let arr = []
    for (const key in dataArr) {
      let oldData = dataArr[key]
      if (key !== 'arr') {
        oldData = maxMinSumSeparatedBySign(dataArr[key])
      }
      arr = arr.concat(oldData)
    }
    this.info = calculateNum(arr)
    min = this.info.min
    max = this.info.max
    // 如果算出来的合计大于每个数组的刻度间隔值，那么就算出相关的倍数，然后把柱子的宽度跟间距按照倍数缩小
    const xsW = (xs - sp * 2)
    let wScale = 1
    if (barWT > xsW) {
      wScale = Number((xsW / barWT).toFixed(1)) - 0.05
    }
    barWT = 0
    dataArr = {
      arr: []
    }
    let bgW = 0 // 用来计算每个柱子的宽度加上间隔的累计数
    for (let i = 0; i < this.series.length; i++) {
      item = this.series[i]
      const { stack, barStyle } = item
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
      const { width = commonBarStyle.width, barGap = commonBarStyle.barGap } = barStyle
      barStyle.w = width * wScale
      barStyle.bg = barGap * wScale
      if (stack) { // 判断是否是堆积图，如果是合计的堆积图，则每个柱子的起点也是累计的
        if (dataArr[stack]) {
          dataArr[stack].push(item)
          item.bgW = dataArr[stack][0].bgW
        } else {
          sl++
          barWT += (barStyle.w + (result.length > 1 ? barStyle.bg : 0))
          bgW += (barGap + barStyle.w)
          item.bgW = bgW
          dataArr[stack] = [item]
        }
      } else {
        sl++
        barWT += (barStyle.w + (result.length > 1 ? barStyle.bg : 0))
        bgW += (barGap + barStyle.w)
        item.bgW = bgW
        dataArr.arr.push(item)
      }
    }
    // 得到合计宽度之后，计算出中间位置起始点
    const startX = Math.abs((xs - barWT) / 2)
    this.getZeroScaleY()
    const seriesLength = this.series.length

    for (let i = 0; i < seriesLength; i++) {
      item = this.series[i]
      const pItem: InterfaceObj = i !== 0 ? this.series[index - 1] : {}
      const { barStyle, stack, bgW } = item
      const { color = commonBarStyle.color, w = commonBarStyle.width, bg = commonBarStyle.barGap, borderRadius = commonBarStyle.borderRadius } = barStyle
      obj = Object.assign({}, {
        i: index,
        isStop: true,
        xl: 0,
        create: true,
        ...item,
        hide: !!item.hide,
        name: item.name,
        color: color || item.color,
        borderRadius,
        barW: w,
        stack,
        data: []
      })
      item.data.slice(xStart, xEnd).forEach((d, j) => {
        let zeroScaleY = that.zeroScaleY
        let oldH = d === 0 ? 0 : Math.floor((d - min) / (max - min) * ydis)
        let h = d === 0 ? 0 : Math.floor((d - min) / (max - min) * ydis)
        let x = (xs * j + startX) + (index === 0 ? 0 : pItem.bgW) + w / 2
        // 判断是否是堆积图，如果是合计的堆积图，则每个柱子的起点也是累计的
        if (stack && i !== 0) {
          let zeroScaleT = that.zeroScaleY
          this.animateArr.forEach(amItem => {
            // 找到上一条对应的数据
            const dataItem = amItem.data[j]
            if (stack === amItem.stack) {
              x = dataItem.x
            }
            if (((dataItem.num >= 0 && d >= 0) || (dataItem.num <= 0 && d <= 0)) && stack === amItem.stack) {
              zeroScaleT = -dataItem.h
              zeroScaleY += (dataItem.num ? -(dataItem.h + dataItem.zeroScaleY) : 0)
              h = dataItem.num ? (Math.abs(zeroScaleT) + oldH - Math.abs(that.zeroScaleY)) : h
            }
          })
        }
        obj.data.push({
          num: d,
          h,
          zeroScaleY,
          p: 0,
          x,
          y: 0
        })
      })
      this.animateArr.push(obj)
      if (!item.hide) { index++; }
    }
    // console.log('renderType', this.renderType, JSON.stringify(this.series))
  }

  drawAxis () {
    let that = this
    let { xl, xStart, xEnd, zoomShow } = this.getXdataLength()
    let ctx = this.ctx
    let W = this.W
    let H = this.H
    let cPaddingL = this.cPaddingL
    let cPaddingR = this.cPaddingR
    let cPaddingT = this.cPaddingT
    let cPaddingB = this.cPaddingB
    const xWidth = (W - cPaddingL - cPaddingR)
    let xs = xWidth / ((xEnd - xStart) || 1) // x轴单位数，每个单位长度
    this.xs = xs
    let sp = 3 // 柱子的间隔
    // x轴
    ctx.save()
    ctx.translate(cPaddingL, H - cPaddingB)
    const { axisTick = {}, splitLine, axisLine = {}, axisLabel, formatter, data } = this.xAxis;
    const { show: axisLineShow = true } = axisLine || {}
    const {show: axisTickShow = true, interval = 4, length: axisTickLength = 5, lineStyle = axisLineStyle } = axisTick || {}
    if (axisLineShow) {
      const { color = '#333', width = 1  } = {...axisLineStyle, ...(axisLine.lineStyle || {})};
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
      let xInterval = 1
      const { color = '#999999', fontWeight = 'normal', fontSize = 22, fontFamily = 'sans-serif', overflow = 'none', margin = 5 } = axisLabel
      // 先判断是否已经超出整条x轴线长度了
      const { interval: axisLabelInterval = 'auto' } = axisLabel
      if (!zoomShow) {
        xInterval = axisLabelInterval === 'auto' ? 1 : (Math.max(axisLabelInterval, 1) + 1)
        if (axisLabelInterval === 'auto') {
          let maxTextWidth = 0
          data.forEach((obj, i) => {
            this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            this.ctx.fillStyle = color
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            obj = String(formatter ? formatter(obj) : obj)
            const txtW = this.ctx.measureText(obj).width; // 获取文字的长度
            maxTextWidth += txtW
          })
          if (maxTextWidth > xWidth * 0.8) {
            xInterval = Math.round(maxTextWidth / (xWidth)) + 1
          }
        }
      }
      for (let i = 0; i < (xEnd - xStart); i++) {
        let obj = data[i + xStart]
        let x = xs * (i + 1)
        if (axisTickShow) {
          const { color = '#333', width = 1 } = {...axisLineStyle, ...(lineStyle || {})};
          ctx.beginPath()
          this.setCtxStyle({
            strokeStyle: color,
            lineWidth: width
          })
          ctx.moveTo(x, 0)
          ctx.lineTo(x, axisTickLength)
          ctx.stroke()
        }
        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        if (i % xInterval === 0 || axisLabelInterval === 0) {
          obj = String(formatter ? formatter(obj) : obj)
          // 这里后续可以支持设置文字与x轴的距离
          const textX = x - xs / 2
          const textY = axisTickLength + margin
          let textI = obj.length
          if (overflow === 'truncate') {
            textI = drawTexts(ctx, obj, xs)
            ctx.fillText(obj.substring(0, textI) + (textI !== obj.length ? '...' : ''), textX, textY)
          } else if (overflow === 'breakAll') {
            drawBreakText(ctx, obj, xs, {
              x: textX,
              y: textY
            })
          } else {
            ctx.fillText(obj.substring(0, textI), textX, textY)
          }
        }
      }
    }
    ctx.restore()
  }

  getZeroScaleY () {
    let nameH = 0
    if (this.yAxis && !Array.isArray(this.yAxis) && this.yAxis.name) {
      nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
    }
    let ydis = this.H - this.cPaddingB - this.cPaddingT - nameH
    let yl = this.info.num
    let ys = ydis / yl
    for (let i = 0; i <= yl; i++) {
      let dim = Math.floor(this.info.step * i + this.info.min)
      if (dim == 0) { // 记录0刻度的坐标渲染有用
        this.zeroScaleY = -ys * i
      }
    }
  }

  drawY () {
    if (!Array.isArray(this.yAxis)) {
      const { axisTick, splitLine, axisLine, axisLabel, nameTextStyle, nameGap = 5 } = this.yAxis;
      const { show: axisTickShow = true, interval: axisTickInterval = 4, length: axisTickLength = 5 } = axisTick || {}
      const { show: splitLineShow = true } = splitLine || {}
      let ctx = this.ctx
      let nameH = 0
      if (this.yAxis && this.yAxis.name) {
        const { color = '#999', fontWeight = 'normal', fontSize = 22, fontFamily = 'sans-serif' } = nameTextStyle
        this.ctx.fillStyle = color
        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
        ctx.textBaseline = 'middle'
        const nameW = this.ctx.measureText(this.yAxis.name).width; // 获取文字的长度
        ctx.fillText(this.yAxis.name, this.cPaddingL - nameW / 2, this.cPaddingT - nameGap)
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
        if (axisTickShow) {
          const { color = '#DDE2EB', width = 1 } = {...axisLineStyle, ...(axisTick.lineStyle || {})};
          ctx.beginPath()
          this.setCtxStyle({
            strokeStyle: color,
            lineWidth: width
          })
          ctx.moveTo(-axisTickLength, -Math.floor(ys * i))
          ctx.lineTo(0, -Math.floor(ys * i))
          ctx.stroke()
        }

        if (i > 0 && splitLineShow) {
          // const { color, width } = splitLine.lineStyle || yLineStyle;
          const { color = '#DDE2EB', width = 1 } = {...yLineStyle, ...(splitLine.lineStyle || {})};
          this.setCtxStyle({
            strokeStyle: color,
            lineWidth: width
          })
          ctx.beginPath()
          ctx.moveTo(0, -Math.floor(ys * i))
          ctx.lineTo(xdis, -Math.floor(ys * i))
          ctx.stroke()
        }

        const { color = '#999', fontWeight = 'normal', fontSize = 22, fontFamily = 'sans-serif', margin = 0 } = axisLabel
        this.ctx.fillStyle = color
        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        let dim = Math.floor(this.info.step * i + this.info.min)
        let txt = String(this.yAxis.formatter ? this.yAxis.formatter(dim) : dim)
        const txtH = this.ctx.measureText(txt).height; // 获取文字的长度
        const interval = (axisTickShow ? -(axisTickInterval + axisTickLength) : -8) - margin
        ctx.fillText(txt, interval, -ys * i)
      }

      // y轴
      const { show: axisLineShow = true } = axisLine
      if (axisLineShow) {
        const { color = '#DDE2EB', width = 1 } = {...axisLineStyle, ...(axisLine.lineStyle || {})};
        this.setCtxStyle({
          strokeStyle: color,
          lineWidth: width
        })
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, (this.cPaddingT + this.cPaddingB + nameH) - this.H)
        ctx.stroke()
      }
      ctx.restore()
    }
  }

  drawLabel (item, j) {
    const ctx = this.ctx
    const {stack, label} = item
    let { color: labelColor = commonLabel.color, fontWeight = commonLabel.fontWeight, fontFamily = commonLabel.fontFamily, fontSize = commonLabel.fontSize, position = commonLabel.position, formatter, distanceToLabelLine = commonLabel.distanceToLabelLine } = label
    const obj = item.data[j];
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = labelColor
    const text = formatter ? formatter({
      name: String(obj.num),
      ...obj
    }) : String(obj.num)
    const textWidth = ctx.measureText(text).width / 2; // 获取文字的长度
    const textHeight = ctx.measureText(text).height / 2; // 获取文字的长度
    let textX = obj.x - textWidth
    let textY = obj.num >= 0 ? -obj.h - textHeight - distanceToLabelLine : -obj.h + textHeight + distanceToLabelLine
    if (stack && !position) {
      position = 'center'
    }
    if (position === 'center') {
      textY = obj.num == 0 ? obj.zeroScaleY : obj.num > 0 ? (obj.zeroScaleY - (obj.h)) / 2 : (obj.zeroScaleY - (obj.h)) / 2
    } else if (position === 'bottom') {
      textY = obj.num > 0 ? obj.zeroScaleY - distanceToLabelLine : obj.zeroScaleY + distanceToLabelLine
    }
    ctx.textBaseline = 'middle'
    ctx.fillText(text, textX, textY);
  }
}

export default DrawBar