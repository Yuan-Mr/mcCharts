import { InterfaceObj } from '../../utils/chartInterface'
import { Tooltip } from './Tooltip'
@Component
export struct Chart {
  private settings: RenderingContextSettings = new RenderingContextSettings(true)
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)
  private drawMcChart;
  private click;
  private tooltipClick;
  @Link options: InterfaceObj;
  @State isTooltipShow: boolean = false
  @State tooltipInfo: InterfaceObj = {}
  showInfo (flag, event = {}, pos?, title?, arr?, tooltipInfo?) {
    this.isTooltipShow = flag
    const {show, type = 'default'} = tooltipInfo || {}
    if (!show) return;
    this.click && this.click(event, flag ? {
      title,
      data: arr
    } : {})
    if (type !== 'default') {
      this.tooltipClick && this.tooltipClick(event, flag ? { title, pos, data: arr } : {})
    }
    if (!show || type !== 'default') return;
    if (this.isTooltipShow) {
      this.tooltipInfo = {
        ...tooltipInfo,
        pos,
        title,
        data: arr
      }
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
              this.drawMcChart.bindEvent(event, this.showInfo.bind(this))
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
