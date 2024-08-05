import { Chart } from './charts'
import { percentageConversion, isPointInSector, countDownLatch, roundRect, getColor, deepCopy } from './index'
import { legend as commonLegend, legendTextStyle, label as commonLabel, labelLine as commonLabelLine, lineStyle as commonLineStyle,
  emphasis as commonEmphasis} from './defaultOption'
class DrawPie extends Chart {
  private radius = ['70%']
  private center = ['50%', '50%']
  private padAngle = 0
  // 标签设置，标签的视觉引导线配置
  private label = {
    show: true,
    position: 'outside',
    formatter: (params) => {
      return params.name
    },
    // 文字与 label line 之间的距离
    distanceToLabelLine: 5
  }
  // 标签的视觉引导线配置
  private labelLine = {
    show: true, // 默认开启，如果当label的position的值不是outside，则自动隐藏
    length: 10,
    length2: 20,
    minTurnAngle: 90
  }
  // 标签的视觉引导线配置
  private lineStyle = {
    color: '',
    width: 2,
    type: 'solid'
  }
  // 高亮状态的扇区和标签样式。
  private emphasis = {
    scale: true,
    scaleSize: 4,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 15,
    shadowOffsetX: 0,
    shadowOffsetY: 0
  }
  // 存储所有图形的数据
  private pieData = []

  private animationInfo = {
    timer: null
  }

  constructor () {
    super('pie')
  }
  bindEvent(e, callback) {
    const that = this
    const ctx = this.ctx
    let startAng = -Math.PI / 2;
    let isLegend = false;
    let pos = {
      x: e.localX,
      y: e.localY
    };
    const [centerX, centerY] = that.setCenter(true)
    let [radius, innerRadius] = that.getRadius()
    if (isLegend || this.drawing || !this.animateArr.length) return;
    for (let i = 0, l = this.animateArr.length; i < l; i++) {
      const item = this.animateArr[i];
      if (item.hide) continue;
      // 判断当前点击是否在某个扇形区域里面
      const angle = startAng + item.ang;
      // 如果是渲染环形的话，先判断点击是否是点击内部圆圈
      if (innerRadius) {
        const flag = isPointInSector(pos.x, pos.y, centerX, centerY, innerRadius, startAng, angle)
        if (flag) {
          callback(false, e)
          that.clearGrid();
          break;
        }
      }
      const flag = isPointInSector(pos.x, pos.y, centerX, centerY, radius, startAng, angle)
      if (flag) {
        that.clearGrid(i)
        pos.x -= 20
        callback(true, e, {
          x: pos.x,
          y: pos.y,
          W: this.W,
          H: this.H
        }, '', [{
          name: item.name,
          num: item.num
        }], this.tooltip)
        break;
      }
      startAng += item.ang;
      callback(false, e)
      that.clearGrid();
    }
  }
  clearGrid(index?) {
    let that = this,
      ctx = that.ctx,
      label = that.label,
      labelLine = that.labelLine,
      lineStyle = that.lineStyle,
      item, startAng = -Math.PI / 2,
      len = that.animateArr.filter(item => !item.hide).length, labels = [],
      j = 0,
      angle = 0;
    // 判断是否标签类型是在饼图外
    const isLine = label.position === 'outside' && labelLine.show
    let [radius, innerRadius] = that.getRadius()
    ctx.clearRect(0, 0, that.W, that.H);
    that.drawLegend(this.pieData);
    ctx.save();
    that.setCenter()
    const { length, length2 } = labelLine
    const { color, width = 2 } = lineStyle
    for (let i = 0, l = that.animateArr.length; i < l; i++) {
      item = that.animateArr[i];
      if (item.hide) continue;
      j++
      ctx.strokeStyle = item.color;
      ctx.fillStyle = item.color;

      angle = startAng + item.ang - (index === len ? 0 : (this.padAngle / 2));
      if (label.show) {
        //画描述
        let tr = radius,
          textAlign = 'center',
          tw = ctx.measureText(item.name).width,
          th = ctx.measureText(item.name).height,
          tAng = startAng + item.ang / 2,
          x = tr * Math.cos(tAng),
          y = tr * Math.sin(tAng);
        let labelX, labelY = y;
        if (isLine) {
          ctx.lineWidth = width;
          ctx.strokeStyle = color || item.color;
          ctx.lineCap = 'round';
          ctx.beginPath();
          const innerR = (innerRadius + (innerRadius - innerRadius) / 2)
          ctx.moveTo(x, y);
          const lengthX = (tr + length) * Math.cos(tAng)
          const lengthY = (tr + length) * Math.sin(tAng)
          const lengthY2 = (tr + length2) * Math.sin(tAng)
          labelY = lengthY2
          if (tAng >= -Math.PI / 2 && tAng <= Math.PI / 2) {
            ctx.lineTo(lengthX, lengthY);
            ctx.lineTo(x + length2, lengthY2);
          } else {
            ctx.lineTo(lengthX, lengthY);
            ctx.lineTo(x - length2, lengthY2);
          }
        }
        if (tAng >= -Math.PI / 2 && tAng <= Math.PI / 2) {
          labelX = x + label.distanceToLabelLine + (isLine ? length2 : 0)
          textAlign= 'left'
        } else {
          labelX = x - label.distanceToLabelLine - (isLine ? length2 : 0)
          textAlign = 'right'
        }

        if (label.position === 'center') {
          textAlign = 'center'
          labelX = x / 2
          labelY = y / 2
        }

        // that.fillText(i, label, {
        //   value: label.formatter(item),
        //   x: labelX,
        //   y: labelY
        // })
        labels.push({
          textAlign,
          i,
          value: typeof label.formatter === 'function' ? label.formatter(item) : item.name,
          x: labelX,
          y: labelY
        })
        isLine && ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.save();
      // const new_r = r * percentageConversion(radius)
      if (innerRadius) {
        let outR = radius
        let innerR = innerRadius
        if (index === i) {
          // ctx.save();
          const { scale, scaleSize, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY } = that.emphasis
          if (scale) {
            ctx.shadowColor = shadowColor
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
          }
          outR = radius + (scale ? scaleSize : 0)
          innerR = innerR + (scale ? scaleSize : 0)
        }
        // 绘制扇形
        ctx.beginPath();
        // 移动到外圆的起始点
        let startPoint = {
          x: 0 + outR * Math.cos(startAng),
          y: 0 + outR * Math.sin(startAng)
        };
        ctx.moveTo(startPoint.x, startPoint.y);
        // 绘制外圆的圆弧
        ctx.arc(0, 0, outR, startAng, angle);
        // 绘制内圆的圆弧
        ctx.arc(0, 0, innerR, angle, startAng, true);

      } else {
        if (index === i) {
          // ctx.save();
          const { scale, scaleSize, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY } = that.emphasis
          if (scale) {
            ctx.shadowColor = shadowColor
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
          }
          ctx.arc(0, 0, radius + (scale ? scaleSize : 0), startAng, angle, false);
        } else {
          ctx.arc(0, 0, radius, startAng, angle, false);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      startAng = angle + that.padAngle / 2;
    }
    labels.forEach(({i, value, x, y, textAlign}) => {
      ctx.textAlign = textAlign
      that.fillText(i, label, { value, x, y })
    })
    ctx.restore();
  }

  drawLegend (data, iwf = false, legendIndex = 0) {
    data = deepCopy(data)
    const {
      show = commonLegend.show,
      itemGap = commonLegend.itemGap,
      itemTextGap = commonLegend.itemTextGap,
      itemWidth = commonLegend.itemWidth,
      itemHeight = commonLegend.itemHeight,
      textStyle = commonLegend.textStyle,
      left = commonLegend.left,
      top = commonLegend.top,
      orient = commonLegend.orient } = this.legend
    if (!show) return;
    let sp = 0;
    let wrapSp = 0;
    let item; let ctx = this.ctx;
    let W = this.W;
    let cPaddingL = this.cPaddingL;
    let cPaddingR = this.cPaddingR;
    // let nl = percentageConversion(left)
    // let nt = percentageConversion(top)
    const { color = legendTextStyle.color, fontWeight = legendTextStyle.fontWeight, fontSize = legendTextStyle.fontSize, fontFamily = legendTextStyle.fontFamily } = textStyle
    // 先计算出整体的宽度，然后设置居中
    let isWrapFLag = false
    for (let i = 0; i < data.length; i++) {
      item = data[i]
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'left'
      ctx.textBaseline = "middle";
      ctx.fillStyle = color
      const tw = ctx.measureText(item.name).width
      sp += itemWidth + tw + itemTextGap + itemGap
      wrapSp += itemWidth + tw + itemTextGap + itemGap
      if (wrapSp >= (W - cPaddingL - cPaddingR)) {
        wrapSp = 0
        isWrapFLag = true
        item.wrapFlag = true
      }
      if (sp >= (W - cPaddingL - cPaddingR)) {
        item.wf = true
      }
    }
    if (isWrapFLag && !iwf) {
      const wrapLegend = []
      let item = []
      for (let i = 0; i < data.length; i++) {
        if (!data[i].wrapFlag) {
          item.push(data[i])
        } else {
          wrapLegend.push(item)
          item = [data[i]]
        }
        if (i === data.length - 1) {
          wrapLegend.push(item)
        }
      }
      wrapLegend.forEach((item, index) => {
        this.drawLegend(item, true, index)
      })
      return
    }
    ctx.save()
    ctx.translate(this.W * percentageConversion(left) - sp / 2, this.H * percentageConversion(top))
    sp = 0
    this.legendData = []
    for (let i = 0; i < data.length; i++) {
      item = data[i]
      const tw = ctx.measureText(item.name).width
      const th = ctx.measureText(item.name).height
      const h = Math.max(th, itemHeight)
      const wrapY = item.wf ? (h + 4) * legendIndex : 0
      ctx.fillStyle = item.color
      roundRect(ctx, sp, percentageConversion(top) + wrapY, itemWidth, itemHeight, 2)
      ctx.globalAlpha = item.hide ? 0.3 : 1
      ctx.fill()
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'left'
      ctx.textBaseline = "middle";
      ctx.fillStyle = color
      ctx.fillText(item.name, itemWidth + sp + itemTextGap, percentageConversion(top) + itemHeight / 2 + wrapY)
      // 计算每個图例的距离：上一个的图例宽度 + 上一个的图例文本与图例间隔 + 图例之间的间隔
      sp += itemWidth + tw + itemTextGap + itemGap
      this.legendData.push({
        hide: !!item.hide,
        name: item.name,
        x: itemWidth + sp + itemTextGap,
        y: this.H * percentageConversion(top),
        w: sp,
        h
      });
    }
    ctx.restore()
  }

  animate() {
    let that = this,
      ctx = that.ctx,
      item, startAng, ang = 0,
      len = that.animateArr.filter(item => !item.hide).length,
      index = 0,
      i = 0,
      isStop = true;
    let [radius, innerRadius] = that.getRadius()
    isStop = true;
    // ctx.save();
    const [cx, cy] = that.setCenter(true)
    let currentProgress = 1;
    const speed = 0.02;
    const data = that.animateArr
    function draw() {
      ctx.clearRect(0, 0, that.W, that.H);
      let startAngle = -Math.PI / 2;
      let endAngle;
      let index = 0;
      for (let i = 0, l = that.animateArr.length; i < l; i++) {
        item = that.animateArr[i];
        if (item.hide) continue;
        index += 1
        // 计算扇形的结束角度
        const ang = (item.ang) * currentProgress
        endAngle = startAngle + ang - (index === len ? 0 : (that.padAngle / 2))

        // 绘画内部扇形
        if (innerRadius) {
          // 绘制扇形
          ctx.beginPath();
          // 移动到外圆的起始点
          let startPoint = {
            x: cx + radius * Math.cos(startAngle),
            y: cy + radius * Math.sin(startAngle)
          };
          ctx.moveTo(startPoint.x, startPoint.y);
          // 绘制外圆的圆弧
          ctx.arc(cx, cy, radius, startAngle, endAngle);
          // 绘制内圆的圆弧
          ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
        } else {
          // 绘制扇形
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, radius, startAngle, endAngle);
        }
        // 闭合路径
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        // 更新起始角度，加上间隔角度
        startAngle = endAngle + (that.padAngle / 2);
      };
      // 更新当前角度
      currentProgress += speed;
      // 检查是否完成整个圆的绘制
      if (currentProgress <= 1) {
        // 使用setTimeout来模拟requestAnimationFrame
        this.animationInfo.timer = setTimeout(draw, 16); // 大约每16毫秒更新一次，模拟60fps
      } else {
        that.clearGrid();
      }
      // // 循环动画
      // if (currentAngle > 2 * Math.PI) {
      //   // currentAngle -= 2 * Math.PI;
      //   return
      // }
      // 使用setTimeout来模拟requestAnimationFrame
      // setTimeout(draw, 16)
    }
    draw()
  }
  create() {
    if (this.animationInfo.timer) {
      clearTimeout(this.animationInfo.timer)
    }
    this.initData();
    this.animate();
  }
  initData() {
    let item, total = 0;
    // this.pieData = []
    for (let i = 0; i < this.series.length; i++) {
      item = this.series[i]
      this.radius = item.radius || ['60%']
      this.center = item.center || ['50%', '50%']
      this.label = Object.assign({...commonLabel}, this.label, item.label)
      this.emphasis = Object.assign({...commonEmphasis}, this.emphasis, item.emphasis || {})
      this.labelLine = Object.assign({...commonLabelLine}, this.labelLine, item.labelLine || {})
      this.lineStyle = Object.assign({...commonLineStyle}, this.lineStyle, item.labelLine?.lineStyle || {})
      this.padAngle = (item.padAngle || 0) * 2 * Math.PI / 360
      this.pieData = item.data || []
    }

    this.legendData.length = 0;
    for (let i = 0; i < this.pieData.length; i++) {
      item = this.pieData[i];
      // 赋予没有颜色的项
      if (!item.color) {
        item.color = getColor(i, this.color);
      }
      item.name = item.name || 'unnamed';
      if (item.hide) continue;
      total += Math.abs(item.value);
    }

    for (let i = 0; i < this.pieData.length; i++) {
      item = this.pieData[i];
      this.animateArr.push({
        i: i,
        create: true,
        hide: !!item.hide,
        name: item.name,
        color: item.color,
        num: item.value,
        percent: Math.round(item.value / total * 10000) / 100,
        ang: (item.value / total) * Math.PI * 2,
        last: 0,
        cur: 0
      });
    }
  }
  // 获取中心坐标
  setCenter (flag = false) {
    const [wc = '50%', hc = '50%'] = this.center
    const cx = this.W * percentageConversion(wc)
    const cy = this.H * percentageConversion(hc)
    if (!flag) {
      this.ctx.translate(cx, cy);
    }
    return [cx, cy]
  }
  // 获取转化后的半径
  getRadius () {
    const r = this.H * 0.5
    let [radius, innerRadius] = this.radius
    return [r * percentageConversion(radius), innerRadius ? r * percentageConversion(innerRadius) : null]
  }
  fillText (index, styles, info) {
    const ctx = this.ctx
    const { show = true, color, fontWeight, fontFamily, fontSize } = styles
    if (!show) return;
    const { value, x, y } = info
    ctx.textBaseline = "middle";
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color || getColor(index, this.color)
    ctx.fillText(value, x, y);
  }
}

export default DrawPie