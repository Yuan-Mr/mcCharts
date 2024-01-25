import DrawPie from '../../utils/drawPie'
import { Chart } from './Chart'
let drawMcPieChart = null
import { Options } from './Options'
@Component
export struct McPieChart {
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
    drawMcPieChart = new DrawPie()
  }
  build() {
    Chart({
      options: this.chartOption,
      drawMcChart: drawMcPieChart,
      click: this.click.bind(this),
      tooltipClick: this.tooltipClick.bind(this)
    })
  }
}


