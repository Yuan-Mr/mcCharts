import { InterfaceObj } from '../../utils/chartInterface'
import { Tooltip, globalBuilder } from './Tooltip'
import { Options } from './Options'
import { Chart as CommonChart } from '../../utils/charts'

@Component
export struct Chart {
  private settings: RenderingContextSettings = new RenderingContextSettings(true)
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)
  private offContext: OffscreenCanvasRenderingContext2D | null = null
  private drawMcChart: CommonChart | null = null;
  private click: Function = () => {};
  private tooltipClick: Function = () => {};
  @ObjectLink @Watch('onCountUpdated') options: Options;
  @Link renderType: string
  @State isTooltipShow: boolean = false
  @State isZoom: boolean = false
  @State isScale: boolean = false
  @State tooltipInfo: InterfaceObj = {}
  private panOption: PanGestureOptions = new PanGestureOptions({ direction: PanDirection.Left | PanDirection.Right, distance: 1 })
  @BuilderParam customTooltip: (tooltipInfo: InterfaceObj) => void = globalBuilder; // 自定义组件

  onCountUpdated(options: Options): void {
    this.isTooltipShow = false
    if (!this.offContext) {
      const offCanvas: OffscreenCanvas = new OffscreenCanvas(this.context.width, this.context.height)
      this.offContext = offCanvas.getContext("2d", this.settings)
    }
    this.drawMcChart && this.drawMcChart.init(this.context, this.options, this.offContext, this.renderType)
  }

  showInfo (flag: boolean, event: InterfaceObj = {}, pos?: InterfaceObj, title?: string, arr?: [], tooltipInfo: InterfaceObj = {}) {
    // const {show, type = 'default'} = tooltipInfo || {}
    if (!tooltipInfo.show) {
      this.isTooltipShow = false
      return;
    }
    this.isTooltipShow = flag
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
          const offCanvas: OffscreenCanvas = new OffscreenCanvas(this.context.width, this.context.height)
          this.offContext = offCanvas.getContext("2d", this.settings)
          this.drawMcChart && this.drawMcChart.init(this.context, this.options, this.offContext, this.renderType, offCanvas)
        })
        .onClick((event) => {
          if (this.drawMcChart) {
            this.drawMcChart.bindEvent({
              localX: event.x,
              localY: event.y,
            }, (flag: boolean, event: InterfaceObj = {}, pos: InterfaceObj = {}, title: string = '', arr: [] = [], tooltipInfo: InterfaceObj = {}) => {
              this.showInfo(flag, event, pos, title, arr, tooltipInfo)
            })
          }
        })
        .gesture(
          PanGesture(this.panOption)
            .onActionStart((event: GestureEvent) => {
              console.info('Pan start')
            })
            .onActionUpdate((event: GestureEvent) => {
              if (event && !this.isScale) {
                if (this.drawMcChart) {
                  this.isTooltipShow = false
                  this.drawMcChart.bindZoom(event.offsetX)
                }
              }
            })
            .onActionEnd(() => {
            })
        )
        .gesture(
          PinchGesture({ fingers: 2, distance: 1 })
            .onActionStart((event: GestureEvent) => {
              this.isScale = true
              this.isTooltipShow = false
            })
            .onActionUpdate((event: GestureEvent) => {
              if (event) {
                if (this.drawMcChart) {
                  this.drawMcChart.bindZoomScale(event.scale)
                }
              }
            })
            .onActionEnd((event: GestureEvent) => {
              this.isScale = false
            })
        )

      if (this.isTooltipShow) {
        Tooltip({
          tooltipInfo: $tooltipInfo,
          customTooltip: this.customTooltip
        })
      }
    }
    .width('100%')
    .height('100%')
  }
}
