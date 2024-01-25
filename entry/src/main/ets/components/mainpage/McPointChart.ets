import { InterfaceObj } from '../../utils/chartInterface'
import DrawPoint from '../../utils/drawPoint'
import { Chart } from './Chart'
import { Options } from './Options'
let drawMcPointChart = null
@Component
export struct McPointChart {
  @ObjectLink @Watch('onCountUpdated') options: Options;
  @State chartOption: Options = new Options({})
  private click: Function = function (event, params) {}
  private tooltipClick: Function = function (event, params) {}
  // @Watch 回调
  onCountUpdated(): void {
    this.chartOption = new Options(this.options)
  }
  aboutToAppear() {
    this.onCountUpdated()
    drawMcPointChart = new DrawPoint()
  }
  build() {
    Chart({
      options: this.chartOption,
      drawMcChart: drawMcPointChart,
      click: this.click.bind(this),
      tooltipClick: this.tooltipClick.bind(this)
    })
  }
}
