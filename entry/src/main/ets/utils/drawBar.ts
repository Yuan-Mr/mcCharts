import { Chart } from './charts'
import { calculateNum } from './index'
/**
 * 柱状图
 */
class DrawBar extends Chart {
  private zeroScaleY;
  constructor () {
    super('bar');
  }
  bindEvent(e, callback) {
    const ctx = this.ctx;
    const xl = this.xAxis.data.length;
    const xs = (this.W - this.cPaddingL - this.cPaddingR) / xl;
    let index = 0;
    var isLegend = false;
    let pos = {
      x: e.localX,
      y: e.localY
    };
    if (isLegend || this.drawing) return;
    // 鼠标位置在图表中时
    if (pos.y > this.cPaddingT && pos.y < this.H - this.cPaddingB && pos.x > this.cPaddingL && pos.x < this.W - this.cPaddingR) {
      for (var i = 0; i < xl; i++) {
        if (pos.x > i * xs + this.cPaddingL) {
          index = i;
        }
      }
      this.clearGrid(index, xs);
      // 获取处于当前位置的信息
      const arr = [];
      for (var j = 0, item, l = this.animateArr.length; j < l; j++) {
        item = this.animateArr[j];
        if (item.hide) continue;
        arr.push({ name: item.name, num: item.data[index].num });
      }
      // this.showInfo(pos, this.xAxis.data[index], arr);
      // console.log('callback', JSON.stringify(arr))
      const obj = this.animateArr[0].data[index];
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
    var that = this,
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
      ctx.lineWidth = xs;
      ctx.strokeStyle = 'rgba(150,150,150,0.2)';
      const x = xs * (index + 1) - xs / 2;
      const y = -(that.H - that.cPaddingT - that.cPaddingB - nameH + 2);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, 0);
      ctx.stroke();
    }
    for (var i = 0, item, il = that.animateArr.length; i < il; i++) {
      item = that.animateArr[i];
      if (item.hide) continue;
      const { color, label, barW } = item;
      const { show: labelShow } = label
      for (var j = 0, obj, jl = item.data.length; j < jl; j++) {
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
        ctx.beginPath();
        ctx.moveTo(obj.x, obj.zeroScaleY);
        ctx.lineTo(obj.x, -obj.h);
        ctx.stroke()
        if (labelShow) {
          that.drawLabel(item, j)
        }
      }
    }
    ctx.restore()
  }
  animate() {
    var that = this,
      ctx = this.ctx,
      obj, h = 0,
      isStop = true;
    function run() {
      isStop = true;
      ctx.save()
      ctx.translate(that.cPaddingL, (that.H - that.cPaddingB))
      for (var i = 0, item; i < that.animateArr.length; i++) {
        item = that.animateArr[i];
        if (item.hide) continue;
        const { color, label, barW, stack } = item
        that.setCtxStyle({
          strokeStyle: color,
          lineWidth: barW
        })
        item.isStop = true;
        const { show: labelShow, color: labelColor, fontWeight, fontFamily, fontSize, position, formatter, distanceToLabelLine } = label
        for (var j = 0, jl = item.data.length; j < jl; j++) {
          obj = item.data[j];
          if (obj.num > 0) {
            const s = obj.h + obj.zeroScaleY
            h = obj.y + 4;
            if (h >= s) {
              obj.y = s;
              obj.p = obj.h;
            }
            if (obj.p != obj.h) {
              obj.y = h
              item.isStop = false;
            }
            ctx.beginPath();
            if (obj.y <= s) {
              ctx.moveTo(obj.x, obj.zeroScaleY);
              ctx.lineTo(obj.x, -obj.y + obj.zeroScaleY);
            }
            ctx.stroke();
          } else {
            const s = obj.h + obj.zeroScaleY
            h = obj.y - 4;
            if (h < s) {
              obj.y = s;
              obj.p = obj.h;
            }
            if (obj.p != obj.h) {
              obj.y = h
              item.isStop = false;
            }
            ctx.beginPath();
            if (obj.y >= s) {
              ctx.moveTo(obj.x, obj.zeroScaleY);
              ctx.lineTo(obj.x, -obj.y + obj.zeroScaleY);
            }
            ctx.stroke();
          }
        }
        if (!item.isStop) { isStop = false; }
      }

      if (isStop) {
        for (var i = 0, item; i < that.animateArr.length; i++) {
          item = that.animateArr[i];
          if (item.hide) continue;
          const { label } = item
          let { show: labelShow } = label
          if (labelShow) {
            for (var j = 0, jl = item.data.length; j < jl; j++) {
              that.drawLabel(item, j)
            }
          }
        }
        that.drawing = false
        ctx.restore()
        return
      }
      ctx.restore()
      setTimeout(() => {
        run()
      }, 1000 / 60)
    }
    run()
  }
  create() {
    // 画坐标系
    this.drawAxis();
    // 组织数据
    this.initData();
    // 画标签
    this.drawLegend(this.series);
    // 画y轴刻度
    this.drawY();
    // 执行动画
    this.animate();
  }

  initData () {
    let that = this
    let nameH = 0
    if (this.yAxis && !Array.isArray(this.yAxis) && this.yAxis.name) {
      nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
    }
    let xl = this.xAxis.data.length
    let xs = (this.W - this.cPaddingL - this.cPaddingR) / (xl) // 每个数组的刻度间隔值
    let ydis = this.H - this.cPaddingB - this.cPaddingT - nameH
    let index = 0
    let sl = 0 // 展示数据的实际长度
    let min = 0
    let max = 0
    let sp = 3 // 柱子的间隔
    let bcg  = 6 // barCategoryGap 每个数据之间的间隔
    let w = 0 // 柱子的宽度
    let item; let obj; let arr = []

    if (!this.series.length) {
      return
    }
    const result = [...this.series]
    for (let i = 0; i < this.series.length; i++) {
      item = this.series[i]
      const { stack } = item
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
      if (stack === 'total' && i !== 0) { // 判断是否是堆积图，如果是合计的堆积图，则每个柱子的起点也是累计的
        const new_data = item.data.slice(0, xl)
        new_data.forEach((d, j) => {
          this.series.forEach((amItem, k) => {
            if (k < i) {
              // 找到上一条对应的数据
              const dataItem = Number(amItem.data[j])
              if ((dataItem >= 0 && d >= 0) || (dataItem < 0 && d < 0)) {
                new_data[j] += dataItem
              }
            }
          })
        })
        arr = arr.concat(new_data)
      } else {
        arr = arr.concat(item.data.slice(0, xl))
      }

    }
    // 计算数据在Y轴刻度
    this.info = calculateNum(arr)
    min = this.info.min
    max = this.info.max
    this.getZeroScaleY()
    for (let i = 0; i < this.series.length; i++) {
      item = this.series[i]
      const { barStyle, stack } = item
      const { color, width, barGap, barCategoryGap } = barStyle
      sp = barGap || 3
      bcg = barCategoryGap || 6
      if (stack) {
        sl = 1
      }
      const barW = Math.round((xs - sp * (sl - 1) - bcg * 2) / sl)
      w = width > barW ? barW : width ;
      obj = Object.assign({}, {
        i: index,
        isStop: true,
        xl: 0,
        create: true,
        ...item,
        hide: !!item.hide,
        name: item.name,
        color: color || item.color,
        barW: w,
        stack,
        data: []
      })

      item.data.slice(0, xl).forEach((d, j) => {
        let zeroScaleY = that.zeroScaleY
        let oldH = Math.floor((d - min) / (max - min) * ydis)
        let h = Math.floor((d - min) / (max - min) * ydis)
        // 判断是否是堆积图，如果是合计的堆积图，则每个柱子的起点也是累计的
        if (stack === 'total' && i !== 0) {
          this.animateArr.forEach(amItem => {
            // 找到上一条对应的数据
            const dataItem = amItem.data[j]
            if ((dataItem.num >= 0 && d >= 0) || (dataItem.num < 0 && d < 0)) {
              zeroScaleY = -dataItem.h
              h = Math.abs(zeroScaleY) + oldH - Math.abs(that.zeroScaleY)
            }
          })
        }
        obj.data.push({
          num: d,
          h,
          zeroScaleY,
          p: 0,
          x: stack ? Math.round((xs * j) + w / 2 + bcg) : Math.round(xs * j + w * index + sp * (index) + w / 2 + bcg),
          y: 0
        })
      })
      this.animateArr.push(obj)
      if (!item.hide) { index++; }
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
      xs = (W - cPaddingL - cPaddingR) / (xl)
      data.forEach((obj, i) => {
        let x = xs * (i + 1)
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
        ctx.textBaseline = 'middle'
        obj = formatter ? String(formatter(obj)) : obj
        const txtW = this.ctx.measureText(obj).width; // 获取文字的长度
        const textY = axisTick.length + 5
        ctx.fillText(obj, x - xs / 2 - txtW / 2, textY)
      })
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
      const { axisTick, splitLine, axisLine, axisLabel, nameTextStyle } = this.yAxis;
      let ctx = this.ctx
      let nameH = 0
      if (this.yAxis && this.yAxis.name) {
        const {color, fontWeight, fontSize, fontFamily} = nameTextStyle
        this.ctx.fillStyle = color
        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
        ctx.textBaseline = 'middle'
        const nameW = this.ctx.measureText(this.yAxis.name).width; // 获取文字的长度
        ctx.fillText(this.yAxis.name, this.cPaddingL - nameW / 2, this.cPaddingT - 5)
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
          const { color, width } = axisTick.lineStyle;
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
        ctx.lineTo(0, (this.cPaddingT + this.cPaddingB + nameH) - this.H)
        ctx.stroke()
      }
      ctx.restore()
    }
  }

  drawLabel (item, j) {
    const ctx = this.ctx
    const {stack, label} = item
    let { color: labelColor, fontWeight, fontFamily, fontSize, position, formatter, distanceToLabelLine } = label
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
    let textY = obj.num > 0 ? -obj.h - textHeight - distanceToLabelLine : -obj.h + textHeight + distanceToLabelLine
    if (stack === 'total' && !position) {
      position = 'center'
    }
    if (position === 'center') {
      textY = obj.num > 0 ? (obj.zeroScaleY - (obj.h)) / 2 : (obj.zeroScaleY - (obj.h)) / 2
    } else if (position === 'bottom') {
      textY = obj.num > 0 ? obj.zeroScaleY - distanceToLabelLine : obj.zeroScaleY + distanceToLabelLine
    }
    ctx.textBaseline = 'middle'
    ctx.fillText(text, textX, textY);
  }
}

export default DrawBar