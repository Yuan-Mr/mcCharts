import DrawBar from '../../utils/drawBar'
import { Chart } from './Chart'
import { Options } from './Options'
let drawMcBarChart = null
@Component
export struct McBarChart {
  @ObjectLink @Watch('onCountUpdated') options: Options;
  @State chartOption: Options = new Options({})
  private click: Function = function (event, params) {}
  private tooltipClick: Function = function (event, params) {}
  // @Watch 回调
  onCountUpdated(options: Options): void {
    this.chartOption = new Options(this.options)
  }
  aboutToAppear() {
    this.chartOption = new Options(this.options)
    drawMcBarChart = new DrawBar()
  }
  build() {
    Chart({
      options: this.chartOption,
      drawMcChart: drawMcBarChart,
      click: this.click.bind(this),
      tooltipClick: this.tooltipClick.bind(this)
    })
  }
}
