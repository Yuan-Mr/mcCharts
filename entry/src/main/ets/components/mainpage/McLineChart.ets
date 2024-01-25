import DrawLine from '../../utils/drawLine'
import { Chart } from './Chart'
import { Options } from './Options'
let drawMcLineChart = null
@Component
export struct McLineChart {
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
    drawMcLineChart = new DrawLine()
  }
  build() {
    Chart({
      options: this.chartOption,
      drawMcChart: drawMcLineChart,
      click: this.click.bind(this),
      tooltipClick: this.tooltipClick.bind(this)
    })
  }
}

