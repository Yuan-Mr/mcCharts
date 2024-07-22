import DrawPie from '../../utils/drawPie'
import { Chart } from './Chart'
import { Options } from './Options'
import { globalBuilder } from './Tooltip'
import { InterfaceObj } from '../../utils/chartInterface'
import { Chart as CommonChart } from '../../utils/charts'
import { assign } from '../../utils/index'
let drawMcPieChart: CommonChart;
@Extend(Text) function fancy (textStyle: InterfaceObj) {
  .fontSize(textStyle.fontSize || 14)
  .fontColor(textStyle.color || '#fff')
  .fontWeight(textStyle.fontWeight || 'normal')
  .fontFamily(textStyle.fontFamily ||'sans-serif')
}

@Component
export struct McPieChart {
  @ObjectLink @Watch('onCountUpdated') options: Options;
  @State chartOption: Options = new Options({})
  @State renderType: string = 'init'
  private click: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  private tooltipClick: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  @State titleOption: InterfaceObj = {
    show: true,
    text: '', // 主标题文本
    subtext: '', // 副标题文本
    textAlign: 'center', // 整体（包括 text 和 subtext）的水平对齐。
    direction: 'column', // 排版。column垂直，row水平
    itemGap: 5, // 主副标题之间的间距。
    left: '50%', // title 组件离容器左侧的距离。
    top: '50%' // title 组件离容器上侧的距离。
  };
  @State textStyle: InterfaceObj = {
    color: '#333',
    fontWeight: 'bolder',
    fontFamily: 'sans-serif',
    position: '',
    fontSize: 18
  };
  @State subtextStyle: InterfaceObj = {
    color: '#aaa',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    position: '',
    fontSize: 12
  };
  @BuilderParam customTooltip: (tooltipInfo: InterfaceObj) => void = globalBuilder; // 自定义组件

  // @BuilderParam customTitle: (titleInfo: InterfaceObj) => void; // 自定义Title
  // @Watch 回调
  onCountUpdated(): void {
    this.chartOption = new Options(this.options)
    if (this.options.title) {
      this.titleOption = assign(this.titleOption, this.options.title)
      this.textStyle = assign(this.textStyle, this.options.title.textStyle || {})
      this.subtextStyle = assign(this.subtextStyle, this.options.title.subtextStyle || {})
    }
  }
  aboutToAppear() {
    this.onCountUpdated()
    drawMcPieChart = new DrawPie()
  }

  build() {
    Column() {
      Chart({
        options: this.chartOption,
        drawMcChart: drawMcPieChart,
        renderType: this.renderType,
        customTooltip: this.customTooltip,
        click: (event: InterfaceObj, params: InterfaceObj) => {
          this.click(event, params)
        },
        tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
          this.tooltipClick(event, params)
        }
      })
      if (this.titleOption.show) {
        if (this.titleOption.direction === 'row') {
          Row() {
            Text(String(this.titleOption.text)).fancy(this.textStyle)
            Text(String(this.titleOption.subtext)).margin({left: this.titleOption.itemGap }).fancy(this.subtextStyle)
          }.position({x: this.titleOption.left, y: this.titleOption.top}).markAnchor({x: '50%', y: '50%'})
        } else {
          Column() {
            Text(String(this.titleOption.text)).fancy(this.textStyle)
            Text(String(this.titleOption.subtext)).margin({top: this.titleOption.itemGap}).fancy(this.subtextStyle)
          }.position({x: this.titleOption.left, y: this.titleOption.top}).markAnchor({x: '50%', y: '50%'})
        }
      }
    }.width('100%').height('100%')
  }
}


