import { calculateNum, pointInsideCircle } from './index'
import { Chart } from './charts'
/**
 * 柱状图
 */
class DrawPoint extends Chart {
  constructor () {
    super('point');
  }
  bindEvent(e, callback) {
    let that = this,
      ctx = that.ctx,
      xl = this.xAxis.data.length,
      xs = (that.W - this.cPaddingL - this.cPaddingR) / xl,
      index = 0;
    let pos = {
      x: e.localX,
      y: e.localY
    };
    if (!this.series.length) return;
    let obj;
    let activeI = null;
    let activeJ = null;
    for (var i = 0, l = this.animateArr.length; i < l; i++) {
      const item = this.animateArr[i];
      if (item.hide) continue;
      // 判断当前点击是否在某个圆形区域里面
      for (let j = 0, jl = item.data.length; j < jl; j++) {
        obj = item.data[j];
        const flag = pointInsideCircle([pos.x, pos.y], [obj.x + this.cPaddingL, that.H - obj.y - that.cPaddingT], obj.r)
        console.log('11', pos.x, pos.y, obj.x + this.cPaddingL, that.H - obj.y - that.cPaddingT, obj.r, flag)
        if (flag) {
          activeI = i
          activeJ = j
        }
      }
    }
    if (activeI !== null && activeJ  !== null) {
      that.clearGrid({ i: activeI, j: activeJ })
      callback(true, e, {
        x: pos.x - 20,
        y: pos.y,
        W: this.W,
        H: this.H
      }, this.animateArr[activeI].name, [this.animateArr[activeI].data[activeJ]], this.tooltip)
    } else {
      callback(false, e)
      that.clearGrid();
    }
  }
  create() {
    // 组织数据
    this.initData();
    // 画坐标系
    this.drawAxis();
    // 画y轴刻度
    this.drawY();
    // 画标签
    this.drawLegend(this.series)
    // 执行动画
    this.animate();
  }
  initData() {
    if ((!this.xAxis.data.length) && this.series.length) {
      // 如果没有x轴，则动态计算出x轴坐标的数据
      let xAxisData = []
      this.xAxis.data = []
      let item;
      for (let i = 0; i < this.series.length; i++) {
        item = this.series[i];
        if (!item.data || !item.data.length) {
          this.series.splice(i--, 1);
          continue;
        }
        item.data.forEach(d => {
          xAxisData.push(d.xVal);
        });
      }
      const xAxisInfo = calculateNum(xAxisData)
      for (let i = xAxisInfo.min; i <= xAxisInfo.max; i += xAxisInfo.step) {
        this.xAxis.data.push(i)
      }
    }
    let that = this,
      xdis = this.W - this.cPaddingL - this.cPaddingR,
      ydis = this.H - this.cPaddingB - this.cPaddingT,
      xl = this.xAxis.data.length,
      xs = xdis / xl,
      xmin = Number(this.xAxis.data[0]),
      xmax = Number(this.xAxis.data.slice(-1)[0]),
      min, max, numMin, numMax, item, obj, arr = [],
      numArr = [],
      index = 0,
      r,h;

    if (!this.series.length) return;
    for (let i = 0; i < this.series.length; i++) {
      item = this.series[i];
      if (!item.data || !item.data.length) {
        this.series.splice(i--, 1);
        continue;
      }
      // 赋予没有颜色的项
      if (!item.color) {
        item.color = this.color[i]
      }
      item.name = item.name || 'unnamed';

      if (item.hide) continue;
      item.data.forEach(d => {
        arr.push(d.yVal);
        numArr.push(d.num);
      });
    }

    numMax = Math.max.apply(null, numArr);
    numMin = Math.min.apply(null, numArr);

    // 计算数据在Y轴刻度
    this.info = calculateNum(arr);
    min = this.info.min;
    max = this.info.max;

    for (let i = 0; i < this.series.length; i++) {
      item = this.series[i];
      if (!this.animateArr[i]) {
        obj = Object.assign({}, {
          i: index,
          isStop: true,
          create: true,
          hide: !!item.hide,
          name: item.name,
          color: item.color,
          data: []
        });

        item.data.forEach((d, j) => {
          h = Math.floor((d.yVal - min) / (max - min) * ydis);
          // r = getRadius(numMax, numMin, d.num);
          r = typeof item.symbolSize == 'number' ? item.symbolSize : item.symbolSize(d);
          obj.data[j] = d;
          obj.data[j].h = h;
          obj.data[j].p = h;
          obj.data[j].x = Math.floor((d.xVal - xmin) / (xmax - xmin) * xdis + 2);
          obj.data[j].y = h;
          obj.data[j].radius = r;
          obj.data[j].r = 0;
          obj.data[j].v = r / 20;
        });
        this.animateArr.push(obj);

      } else { //更新
        if (that.animateArr[i].hide && !item.hide) {
          that.animateArr[i].create = true;
        } else {
          that.animateArr[i].create = false;
        }
        that.animateArr[i].hide = item.hide;
        that.animateArr[i].i = index;
        item.data.forEach((d, j) => {
          // r = getRadius(numMax, numMin, d.num);
          r = 20;
          h = Math.floor((d.yVal - min) / (max - min) * ydis + 2);
          if (that.animateArr[i].create) {
            that.animateArr[i].data[j].p = h;
            that.animateArr[i].data[j].y = h;
            that.animateArr[i].data[j].r = 0;
          }
          that.animateArr[i].data[j].radius = r;
          that.animateArr[i].data[j].v = r / 20;
          that.animateArr[i].data[j].h = h;
        });
      }
      if (!item.hide) { index++; }
    }

    function getRadius(numMax, numMin, num) {
      let r1 = Math.ceil(num / numMax * xs / 3);
      let r2 = Math.ceil(num / numMin * 6);
      return Math.max(r2 > xs / 4 ? r1 : r2,6);
    }
  }
  drawAxis() {
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

    // ctx.clearRect(0, 0, W, H)
    // x轴
    ctx.save()
    ctx.translate(cPaddingL, H - cPaddingB)
    const { axisTick, splitLine, axisLine = {}, axisLabel, data } = this.xAxis;
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
        const text = String(obj)
        const txtW = this.ctx.measureText(text).width; // 获取文字的长度
        const txtH = this.ctx.measureText(text).height; // 获取文字的长度
        const textX = x - txtW / 2
        const textY = axisTick.length + 5 + txtH / 2
        ctx.textBaseline = 'middle'
        ctx.fillText(text, textX, textY)
      })
    }
    ctx.restore()
  }
  drawY() {
    if (!Array.isArray(this.yAxis)) {
      const { axisTick, splitLine, axisLine, axisLabel, nameTextStyle } = this.yAxis;
      let ctx = this.ctx
      let nameH = 0
      // ctx.fillStyle = 'hsl(200,100%,60%)'
      if (this.yAxis && this.yAxis.name) {
        const {color, fontWeight, fontSize, fontFamily} = nameTextStyle
        this.ctx.fillStyle = color
        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
        const nameW = this.ctx.measureText(this.yAxis.name).width; // 获取文字的长度
        ctx.textBaseline = 'middle'
        ctx.fillText(this.yAxis.name, this.cPaddingL - nameW / 2, this.cPaddingT)
      }
      // 画Y轴刻度
      ctx.save()
      ctx.translate(this.cPaddingL, this.H - this.cPaddingB)
      let xdis = this.W - this.cPaddingL - this.cPaddingR
      let ydis = this.H - this.cPaddingB - this.cPaddingT - nameH
      let yl = this.info.num
      let ys = ydis / yl
      for (let i = 0; i <= yl; i++) {
        if (axisTick.show) {
          const { color, width } = axisTick.lineStyle;
          ctx.beginPath()
          this.setCtxStyle({
            strokeStyle: color,
            lineWidth: width
          })
          ctx.moveTo(-5, -Math.floor(ys * i))
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
        let dim = Math.floor(this.info.step * i + this.info.min)
        let txt = String(this.yAxis.formatter ? this.yAxis.formatter(dim) : dim)
        const txtH = this.ctx.measureText(txt).height; // 获取文字的长度
        ctx.textBaseline = 'middle'
        ctx.fillText(txt, -8, -ys * i)
      }

      // y轴
      if (axisLine.show) {
        const { color, width } = axisLine.lineStyle;
        this.setCtxStyle({
          strokeStyle: color,
          lineWidth: width
        })
        // ctx.save()
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, this.cPaddingL + this.cPaddingT - this.H + nameH)
        ctx.stroke()
        // ctx.restore()
      }
      ctx.restore()
    }
  }
  animate() {
    let that = this,
      ctx = this.ctx,
      start = new Date().getTime(),
      time=0,
      item, obj, h, r, isStop = true;
    function run() {
      ctx.save();
      // ctx.clearRect(0, 0, that.W, that.H);
      // // 画坐标系
      // that.drawAxis();
      // // 画标签
      // this.drawLegend(this.series)
      // // 画y轴刻度
      // that.drawY();
      ctx.translate(that.cPaddingL, that.H - that.cPaddingB);
      ctx.shadowBlur = 1;
      isStop = true;
      time= new Date().getTime() -start ;
      for (let i = 0, l = that.animateArr.length; i < l; i++) {
        item = that.animateArr[i];
        if (item.hide) continue;

        item.isStop = true;
        ctx.strokeStyle = item.color;
        ctx.shadowColor = item.color;

        for (let j = 0, jl = item.data.length; j < jl; j++) {
          obj = item.data[j];
          ctx.beginPath();
          if (obj.r > obj.radius) {
            r = obj.r - obj.v * time/1000;
            if (r < obj.radius) {
              obj.r = obj.radius;
            }
          } else {
            r = obj.r + obj.v * time / 1000;
            if (r > obj.radius) {
              obj.r = obj.radius;
            }
          }
          if (obj.r != obj.radius) {
            obj.r = r;
            item.isStop = false;
          }
          if (obj.p > obj.h) {
            h = obj.y - 10 * time / 1000;
            if (h < obj.h) {
              obj.y = obj.p = obj.h;
            }
          } else {
            h = obj.y + 10 * time / 1000;
            if (h > obj.h) {
              obj.y = obj.p = obj.h;
            }
          }
          if (obj.y != obj.h) {
            obj.y = h;
            item.isStop = false;
          }
          // let gradient = ctx.createRadialGradient(obj.x, -obj.y, 0, obj.x, -obj.y, obj.r);
          // gradient.addColorStop(0, 'hsla(' + item.hsl + ',70%,85%,0.7)');
          // gradient.addColorStop(1, 'hsla(' + item.hsl + ',70%,60%,0.7)');
          ctx.fillStyle = item.color;
          ctx.arc(obj.x, -obj.y, obj.r, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.stroke();
        }
        if (!item.isStop) { isStop = false; }
      }
      ctx.restore();
      if (isStop) { return; }
      setTimeout(() => {
        run()
      }, 1000 / 60)
    }
    run()
  }
  clearGrid(pos?) {
    let that = this,
      obj,
      item,
      ctx = this.ctx;
    ctx.clearRect(0, 0, that.W, that.H);
    // 画坐标系
    this.drawAxis();
    // // 画y轴刻度
    this.drawY();
    // // 画标签
    this.drawLegend(this.series)

    for (let i = 0, item, il = that.animateArr.length; i < il; i++) {
      item = that.animateArr[i];
      if (item.hide) continue;
      for (let j = 0, jl = item.data.length; j < jl; j++) {
        if (pos && i == pos.i && j == pos.j) continue;
        obj = item.data[j];
        drawPoint(item, obj);
      }
    }

    if (pos) {
      item = that.animateArr[pos.i];
      obj = item.data[pos.j];
      drawPoint(item, obj, true);
    }

    function drawPoint(item, obj, isScale?) {
      ctx.save();
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 1;
      ctx.strokeStyle = item.color;
      ctx.translate(that.cPaddingL + obj.x, that.H - that.cPaddingB - obj.h);
      // let gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, obj.radius);
      // gradient.addColorStop(0, 'hsla(' + item.hsl + ',70%,85%,0.7)');
      // gradient.addColorStop(1, 'hsla(' + item.hsl + ',70%,60%,0.7)');
      ctx.fillStyle = item.color;
      ctx.beginPath();
      if (isScale) {
        ctx.scale(1.4, 1.4);
      }
      ctx.arc(0, 0, obj.radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }
}

export default DrawPoint