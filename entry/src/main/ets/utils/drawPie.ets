import { Chart } from './charts'
import { percentageConversion, isPointInSector } from './index'

class DrawPie extends Chart {
  private radius = ['70%']
  private center = ['50%', '50%']
  // 标签设置，标签的视觉引导线配置
  private label = {
    show: false,
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
  constructor () {
    super('pie')
  }
  bindEvent(e, callback) {
    const that = this
    const ctx = this.ctx
    let startAng = -Math.PI / 2;
    var isLegend = false;
    let pos = {
      x: e.localX,
      y: e.localY
    };
    const [centerX, centerY] = that.setCenter(true)
    let [radius, innerRadius] = that.getRadius()
    if (isLegend || this.drawing) return;
    for (var i = 0, l = this.animateArr.length; i < l; i++) {
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
      len = that.animateArr.filter(item => !item.hide).length,
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
    const { color, width } = lineStyle
    for (var i = 0, l = that.animateArr.length; i < l; i++) {
      item = that.animateArr[i];
      if (item.hide) continue;
      ctx.strokeStyle = item.color;
      ctx.fillStyle = item.color;
      angle = j >= len - 1 ? Math.PI * 2 - Math.PI / 2 : startAng + item.ang;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.save();
      // const new_r = r * percentageConversion(radius)
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
        ctx.closePath();
        ctx.fill();
        // ctx.stroke();
      } else {
        ctx.arc(0, 0, radius, startAng, angle, false);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      if (label.show) {
        //画描述
        var tr = radius,
          tw = ctx.measureText(item.name).width,
          th = ctx.measureText(item.name).height,
          tAng = startAng + item.ang / 2,
          x = tr * Math.cos(tAng),
          y = tr * Math.sin(tAng);

        if (isLine) {
          ctx.lineWidth = width;
          ctx.strokeStyle = color || that.color[i];
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(x + length, y);
        }
        if (tAng >= -Math.PI / 2 && tAng <= Math.PI / 2) {
          isLine && ctx.lineTo(x + length2, y);
          that.fillText(i, label, {
            value: label.formatter(item),
            x: x + label.distanceToLabelLine + length2,
            y: y
          })
        } else {
          isLine && ctx.lineTo(x - length2, y);
          that.fillText(i, label, {
            value: label.formatter(item),
            x: x - label.distanceToLabelLine - length2 - tw,
            y: y
          })
        }
        isLine && ctx.stroke();
      }
      if (innerRadius) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, innerRadius, startAng, startAng, false);
        ctx.closePath();
        ctx.fill();
      }
      startAng += item.ang;
      j++;
    }
    ctx.restore();
  }
  animate() {
    var that = this,
      ctx = that.ctx,
      item, startAng, ang,
      isStop = true;
    let [radius, innerRadius] = that.getRadius()
    function run() {
      isStop = true;
      ctx.save();
      that.setCenter()
      // ctx.fillStyle = '#fff';
      // ctx.beginPath();
      // ctx.arc(0, 0, that.H / 3 + 30, 0, Math.PI * 2, false);
      // ctx.fill();
      for (var i = 0, l = that.animateArr.length; i < l; i++) {
        item = that.animateArr[i];
        if (item.hide) continue;
        startAng = -Math.PI / 2;
        that.animateArr.forEach((obj, j) => {
          if (j < i && !obj.hide) { startAng += obj.cur; }
        });

        ctx.fillStyle = item.color;
        if (item.last > item.ang) {
          ang = item.cur - 0.05;
          if (ang < item.ang) {
            item.cur = item.last = item.ang;
          }
        } else {
          ang = item.cur + 0.05;
          if (ang > item.ang) {
            item.cur = item.last = item.ang;
          }
        }
        if (item.cur != item.ang) {
          item.cur = ang;
          isStop = false;
        }

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAng, startAng + item.cur, false);
        ctx.closePath();
        ctx.fill();
        if (innerRadius) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, innerRadius, startAng, startAng, false);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
      if (isStop) {
        that.clearGrid();
        return;
      }
      // requestAnimationFrame(run);
      setTimeout(() => {
        run()
      }, 10)
    };
    run()
  }
  create() {
    this.initData();
    this.drawLegend(this.pieData);
    this.animate();
  }
  initData() {
    var that = this,
      item,
      total = 0;
    this.pieData = []
    for (let i = 0; i < this.series.length; i++) {
      item = this.series[i]
      that.radius = item.radius || ['60%']
      that.center = item.center || ['50%', '50%']
      that.label = Object.assign({}, item.label)
      that.emphasis = Object.assign({}, that.emphasis, item.emphasis || {})
      that.labelLine = Object.assign({}, that.labelLine, item.labelLine || {})
      that.lineStyle = Object.assign({}, that.lineStyle, item.labelLine?.lineStyle || {})
      this.pieData = this.pieData.concat(item.data || [])
    }

    this.legendData.length = 0;
    for (var i = 0; i < this.pieData.length; i++) {
      item = this.pieData[i];
      // 赋予没有颜色的项
      if (!item.color) {
        item.color = this.color[i];
      }
      item.name = item.name || 'unnamed';
      if (item.hide) continue;
      total += item.value;
    }

    for (var i = 0; i < this.pieData.length; i++) {
      item = this.pieData[i];
      if (!this.animateArr[i]) {
        this.animateArr.push({
          i: i,
          create: true,
          hide: !!item.hide,
          name: item.name,
          color: item.color,
          num: item.value,
          percent: Math.round(item.value / total * 10000) / 100,
          ang: Math.round(item.value / total * Math.PI * 2 * 100) / 100,
          last: 0,
          cur: 0
        });
      } else { // 更新
        if (that.animateArr[i].hide && !item.hide) {
          that.animateArr[i].create = true;
          that.animateArr[i].cur = 0;
          that.animateArr[i].last = 0;
        } else {
          that.animateArr[i].create = false;
        }
        that.animateArr[i].hide = item.hide;
        that.animateArr[i].percent = Math.round(item.value / total * 10000) / 100;
        that.animateArr[i].ang = Math.round(item.value / total * Math.PI * 2 * 100) / 100;
      }
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
    ctx.fillStyle = color || this.color[index]
    ctx.fillText(value, x, y);
  }
}

export default DrawPie