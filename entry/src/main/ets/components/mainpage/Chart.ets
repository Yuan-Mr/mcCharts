import { InterfaceObj } from '../../utils/chartInterface'
import { Tooltip } from './Tooltip'
import { Options } from './Options'
import { Chart as CommonChart } from '../../utils/charts'
@Component
export struct Chart {
  private settings: RenderingContextSettings = new RenderingContextSettings(true)
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)
  private drawMcChart: CommonChart | null = null;
  private click: Function = () => {};
  private tooltipClick: Function = () => {};
  @ObjectLink @Watch('onCountUpdated') options: Options;
  @State isTooltipShow: boolean = false
  @State tooltipInfo: InterfaceObj = {}
  onCountUpdated(options: Options): void {
    this.drawMcChart.init(this.context, this.options)
  }

  showInfo (flag: boolean, event: InterfaceObj = {}, pos?: InterfaceObj, title?: string, arr?: [], tooltipInfo?: InterfaceObj) {
    this.isTooltipShow = flag
    // const {show, type = 'default'} = tooltipInfo || {}
    if (!tooltipInfo.show) return;
    this.click && this.click(event, flag ? {
      title,
      data: arr
    } : {})
    if (tooltipInfo.type !== 'default') {
      this.tooltipClick && this.tooltipClick(event, flag ? { title, pos, data: arr } : {})
    }
    if (!tooltipInfo.show || tooltipInfo.type !== 'default') return;
    if (this.isTooltipShow) {
      this.tooltipInfo = {
        pos,
        title,
        data: arr
      }
      const keys = Object.keys(tooltipInfo)
      keys.forEach(item => {
        this.tooltipInfo[item] = tooltipInfo[item]
      })
    }
  }
  build() {
    Column () {
      Canvas(this.context)
        .width('100%')
        .height('100%')
        .onReady(() => {
          this.drawMcChart.init(this.context, this.options)
        })
        .gesture(
          TapGesture({ count: 1 })
            .onAction((event: GestureEvent) => {
              // console.log(JSON.stringify())
              this.drawMcChart.bindEvent(event, (flag: boolean, event: InterfaceObj = {}, pos: InterfaceObj = {}, title: string = '', arr: [] = [], tooltipInfo: InterfaceObj = {}) => {
                this.showInfo(flag, event, pos, title, arr, tooltipInfo)
              })
            })
        )
      if (this.isTooltipShow) {
        Tooltip({
          tooltipInfo: $tooltipInfo
        })
      }
    }
    .width('100%')
    .height('100%')
  }
}
