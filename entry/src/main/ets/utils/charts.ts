import { AxisInterface, LegendInterface, TooltipInterface, SeriesInterface, InterfaceObj } from './chartInterface'
import { deepCopy } from './index'
import { seriesOpt, xAxisOpt, yAxisOpt, tooltip, legend, legendTextStyle } from './defaultOption'
import { percentageConversion, roundRect } from './index'
/**
 * 图表基类
 */
export class Chart {
  type: string;
  ctx: any;
  W: number;
  H: number;
  cPaddingT: number = 20;
  cPaddingB: number = 30;
  cPaddingL: number = 30;
  cPaddingR: number = 30;
  activeIndex: number | null = null;
  color: Array<string> = ['#bf19ff', '#854cff', '#5f45ff', '#02cdff', '#0090ff', '#314976', '#f47a75', '#009db2', '#024b51', '#0780cf', '#765005'];
  legend: LegendInterface = deepCopy(legend);
  legendData: Array<InterfaceObj> = [];
  tooltip: TooltipInterface = deepCopy(tooltip);
  series: Array<SeriesInterface> = [];
  xAxis: AxisInterface = deepCopy(xAxisOpt);
  yAxis: AxisInterface | AxisInterface[] = deepCopy(yAxisOpt);
  animateArr: Array<InterfaceObj> = [];
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

  init (ctx, opt) {
    this.ctx = ctx
    this.W = ctx.width
    this.H = ctx.height
    // this.ctx.imageSmoothingQuality = 'high'
    this.setOption(opt)
    this.create()
  }
  setOption (opt) {
    for (const key in opt) {
      const item = opt[key]
      switch (key) {
        case 'cPaddingT':
          this.cPaddingT = Number(key)
          break
        case 'cPaddingB':
          this.cPaddingB = Number(key)
          break
        case 'cPaddingL':
          this.cPaddingL = Number(key)
          break
        case 'tooltip':
          this.tooltip = Object.assign({}, deepCopy(tooltip), item)
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
        case 'series':
          this.series = item.map(li => {
            return Object.assign({}, this.seriesOpt, li)
          })
          // console.log('this.series', JSON.stringify(this.series))
          break
        default:
          this[key] = item
      }
    }
  }
  create () {

  }
  setCtxStyle (style) {
    for (const key in style) {
      this.ctx[key] = style[key];
    }
  }

  drawLegend (data) {
    const {show, itemGap, itemTextGap, itemWidth, itemHeight, textStyle, left, top} = this.legend
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
}