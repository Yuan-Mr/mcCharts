import DrawBar from '../../utils/drawBar'
import { Chart } from './Chart'
import { Options } from './Options'
import { InterfaceObj } from '../../utils/chartInterface'
import { Chart as CommonChart } from '../../utils/charts'
let drawMcBarChart: CommonChart | null = null
@Component
export struct McBarChart {
  @ObjectLink @Watch('onCountUpdated') options: Options;
  @State chartOption: Options = new Options({})
  private click: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  private tooltipClick: Function = (event: InterfaceObj, params: InterfaceObj) => {}
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
      click: (event: InterfaceObj, params: InterfaceObj) => {
        this.click(event, params)
      },
      tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
        this.tooltipClick(event, params)
      }
    })
  }
}
