import { AxisInterface, LegendInterface, TooltipInterface, SeriesInterface, InterfaceObj, DataZoomInterface, RadarInterface } from './chartInterface'
import { deepCopy } from './index'
import { seriesOpt, xAxisOpt, yAxisOpt, tooltip, legend, legendTextStyle, dataZoom, radar } from './defaultOption'
import { percentageConversion, roundRect } from './index'
let zoomAccumulator = 0; // 缩放累积量
const zoomStep = 0.06; // 每次滚动累积的步数，根据需要调整
/**
 * 图表基类
 */
export class Chart {
  type: string;
  ctx: any;
  offContext: any;
  offCanvas: any;
  renderType: any;
  W: number;
  H: number;
  cPaddingT: number = 30;
  cPaddingB: number = 30;
  cPaddingL: number = 30;
  cPaddingR: number = 20;
  xs: number = 0; // x轴间隔
  stepNum: number = 0; // 滚动距离
  activeIndex: number | null = null;
  color: Array<string> = ['#5f45ff', '#DIDEAF', '#ff50f2ff', '#EEF1C8', '#0090ff', '#F7B73E', '#A06AFP', '#F5A95F'];
  legend: LegendInterface = deepCopy(legend);
  title: InterfaceObj = {};
  dataZoom: DataZoomInterface = deepCopy(dataZoom);
  legendData: Array<InterfaceObj> = [];
  tooltip: TooltipInterface = deepCopy(tooltip);
  radar: RadarInterface = deepCopy(radar);
  series: Array<SeriesInterface> = [];
  xAxis: AxisInterface = deepCopy(xAxisOpt);
  yAxis: AxisInterface | AxisInterface[] = deepCopy(yAxisOpt);
  animateArr: Array<InterfaceObj> = [];
  previousData: Array<InterfaceObj> = []; // 存储历史数据
  info: any = {};
  drawing: boolean = false;
  seriesOpt = deepCopy(seriesOpt);

  constructor (type) {
    this.type = type
    if (type === 'pie') {
      // 如果是饼图就默认显示在区域外面
      this.seriesOpt.label.position = 'outside'
    }
  }

  init (ctx, opt, offContext, renderType, offCanvas?) {
    this.ctx = ctx
    this.W = ctx.width
    this.H = ctx.height
    this.previousData = deepCopy(this.animateArr)
    this.animateArr = []
    this.offContext = offContext
    if (offCanvas) {
      this.offCanvas = offCanvas
    }
    this.renderType = renderType
    // this.ctx.imageSmoothingQuality = 'high'
    ctx.translate(0, 0);
    ctx.restore()
    ctx.clearRect(0, 0, this.W, this.H);
    this.setOption(opt)
    this.create()
  }
  setOption (opt) {
    for (const key in opt) {
      const item = opt[key]
      switch (key) {
        case 'cPaddingT':
          this.cPaddingT = Number(item)
          break
        case 'cPaddingB':
          this.cPaddingB = Number(item)
          break
        case 'cPaddingL':
          this.cPaddingL = Number(item)
          break
        case 'cPaddingR':
          this.cPaddingR = Number(item)
          break
        case 'tooltip':
          this.tooltip = Object.assign({}, deepCopy(tooltip), item)
          break
        case 'title':
          this.title = Object.assign({}, this.title, item)
          break
        case 'color':
          this.color = [...item]
          break
        case 'legend':
          item.textStyle =  Object.assign({}, deepCopy(legendTextStyle), item.textStyle || {})
          this.legend = Object.assign({}, deepCopy(legend), item)
          break
        case 'xAxis':
          // if (Array.isArray(item)) {
          //   this.xAxis = item.map(li => {
          //       return Object.assign({}, xAxisOpt, li)
          //   })
          // } else {
          //
          // }
          this.xAxis = Object.assign({}, deepCopy(xAxisOpt), item)
          break
        case 'yAxis':
          // if (Array.isArray(item)) {
          //   this.yAxis = item.map(li => {
          //       return Object.assign({}, yAxisOpt, li)
          //   })
          // } else {
          //
          // }
          this.yAxis = Object.assign({}, deepCopy(yAxisOpt), item)
          break
        case 'dataZoom':
          this.dataZoom = Object.assign({}, deepCopy(dataZoom), item)
          this.dataZoom.end += 1
          this.dataZoom.num = Math.abs(this.dataZoom.start - this.dataZoom.end)
          break
        case 'radar':
          this.radar = Object.assign({}, deepCopy(radar), item)
          break
        case 'series':
          this.series = item.map(li => {
            return Object.assign({}, this.seriesOpt, li)
          })
          // console.log('this.series', JSON.stringify(this.series))
          break
      }
    }
  }
  create () {

  }
  bindEvent (e, callback) {

  }
  bindZoom (offsetX) {
    let ctx = this.ctx
    const { xl, xStart, xEnd, zoomShow, num } = this.getXdataLength()
    if (!zoomShow || xEnd - xStart >= xl) return;
    // const num = xEnd - xStart
    const xs = (this.W - this.cPaddingL - this.cPaddingR) / ((num) || 1)
    const stepNum = Math.round(Math.abs(offsetX) / xs)
    if (this.stepNum === stepNum) {
      return;
    }
    this.stepNum = stepNum
    let start = 0
    if (offsetX > 0) { // 向⬅️
      if (xStart === 0) {
        return;
      }
      start = Math.max(xStart - stepNum, 0)
    } else {
      if (xEnd > xl -1) {
        return;
      }
      start = Math.max(xStart + stepNum, 0)
    }
    if (start === xStart) {
      return;
    }
    const newEnd = Math.min(start + num, xl)
    const newStart = newEnd >= xl ? newEnd - num : start
    this.dataZoom.start = (newEnd === xl && newEnd - newStart < 2) ? (newStart - 1) : newStart
    this.dataZoom.end = (newEnd - this.dataZoom.start < 2) ? (newEnd + 1) : newEnd
    ctx.clearRect(0, 0, this.W, this.H);
    this.previousData = deepCopy(this.animateArr)
    this.animateArr = []
    this.renderType = 'update'
    this.create()
  }

  bindZoomScale (scale) {
    let ctx = this.ctx
    let { xl, xStart, xEnd, zoomShow } = this.getXdataLength()
    if (!zoomShow) return;
    const delta = scale > 1 ? 1 : -1;
    if ((xEnd - xStart <= 1 && delta > 0) || (xStart === 0 && xEnd === xl - 1 && delta < 0)) return
    // 根据滚动方向累加或递减zoomAccumulator
    zoomAccumulator += delta * zoomStep;
    let newXStart = xStart
    let newXEnd = xEnd
    // 当累积到一定程度时，应用变化并重置accumulator
    if (Math.abs(zoomAccumulator) >= 1) {
      newXStart += Math.round(zoomAccumulator);
      newXEnd -= Math.round(zoomAccumulator);

      // 确保xStart和xEnd在有效范围内
      newXStart = Math.max(0, newXStart);
      newXEnd = Math.min(xl, newXEnd);

      // 确保xStart始终小于xEnd
      if (newXStart >= newXEnd) {
        newXStart = Math.max(0, xEnd - 1);
        newXEnd = Math.min(xl, newXStart + 1);
      }
      if (newXStart === xStart && newXEnd === xEnd) return;
      if (newXEnd === xl && newXEnd - newXStart < 2) {
        newXStart -= 1
      } else if (newXEnd - newXStart < 2) {
        newXEnd += 1
      }
      this.dataZoom.start = newXStart
      this.dataZoom.end = newXEnd
      this.dataZoom.num = newXEnd - newXStart
      ctx.clearRect(0, 0, this.W, this.H);
      this.previousData = deepCopy(this.animateArr)
      this.animateArr = []
      this.renderType = 'update'
      this.create()
      zoomAccumulator = 0; // 重置累积量
    }
  }
  setCtxStyle (style) {
    for (const key in style) {
      this.ctx[key] = style[key];
    }
  }

  drawLegend (data) {
    const { show, itemGap, itemTextGap, itemWidth, itemHeight, textStyle, left, top } = this.legend
    if (!show) return;
    let sp = 0;
    let item; let ctx = this.ctx;
    const {color, fontWeight, fontSize, fontFamily} = textStyle
    // 先计算出整体的宽度，然后设置居中
    for (let i = 0; i < data.length; i++) {
      item = data[i]
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'left'
      ctx.textBaseline = "middle";
      ctx.fillStyle = color
      const tw = ctx.measureText(item.name).width
      sp += itemWidth + tw + itemTextGap + itemGap
    }
    ctx.save()
    ctx.translate(this.W * percentageConversion(left) - sp / 2, this.H * percentageConversion(top))
    sp = 0
    this.legendData = []
    for (let i = 0; i < data.length; i++) {
      item = data[i]
      ctx.fillStyle = item.color
      roundRect(ctx, sp, percentageConversion(top), itemWidth, itemHeight, 2)
      ctx.globalAlpha = item.hide ? 0.3 : 1
      ctx.fill()
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'left'
      ctx.textBaseline = "middle";
      ctx.fillStyle = color
      const tw = ctx.measureText(item.name).width
      const th = ctx.measureText(item.name).height
      ctx.fillText(item.name, itemWidth + sp + itemTextGap, percentageConversion(top) + itemHeight / 2)
      // 计算每個图例的距离：上一个的图例宽度 + 上一个的图例文本与图例间隔 + 图例之间的间隔
      sp += itemWidth + tw + itemTextGap + itemGap
      this.legendData.push({
        hide: !!item.hide,
        name: item.name,
        x: itemWidth + sp + itemTextGap,
        y: this.H * percentageConversion(top),
        w: sp,
        h: Math.max(th, itemHeight)
      });
    }
    ctx.restore()
  }

  // 获取x轴开始起点与结束点、长度
  getXdataLength () {
    let xl = this.xAxis.data.length
    let xStart = 0
    let xEnd = xl
    let { show: zoomShow = false, start: zoomStart = 0, end: zoomEnd = 6, num } = this.dataZoom
    if (zoomShow) {
      if (zoomStart > zoomEnd) {
        [zoomStart, zoomEnd] = [zoomEnd, zoomStart]
      }
      xStart = Math.min(zoomStart, xl)
      xEnd = Math.min(zoomEnd, xl)
    }
    return {
      xl,
      xStart,
      xEnd,
      num,
      zoomShow
    }
  }

  adjustVisibleRange(xStart, xEnd, dataLength, scale) {
    // 根据缩放比例更新 xStart 和 xEnd
    const mid = Math.floor((xStart + xEnd) / 2);
    if (scale < 1) {
      xStart = Math.max(0, Math.floor(xStart / scale));
      xEnd = Math.min(dataLength, Math.floor(xEnd * scale));
    } else if (scale > 1) {
      xStart = Math.max(0, Math.floor(xStart * scale));
      xEnd = Math.min(dataLength, Math.floor(xEnd / scale));
    }

    // // 确保调整后的边界仍然有效
    // xStart = Math.max(0, Math.round(xStart));
    // xEnd = Math.min(dataLength, Math.round(xEnd));

     return [xStart, xEnd];
  }
}