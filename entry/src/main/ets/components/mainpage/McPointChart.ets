import { InterfaceObj } from '../../utils/chartInterface'
import DrawPoint from '../../utils/drawPoint'
import { Chart } from './Chart'
import { Options } from './Options'
import { Chart as CommonChart } from '../../utils/charts'
let drawMcPointChart: CommonChart | null = null
@Component
export struct McPointChart {
  @ObjectLink @Watch('onCountUpdated') options: Options;
  @State chartOption: Options = new Options({})
  private click: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  private tooltipClick: Function = (event: InterfaceObj, params: InterfaceObj) => {}
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
      click: (event: InterfaceObj, params: InterfaceObj) => {
        this.click(event, params)
      },
      tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
        this.tooltipClick(event, params)
      }
    })
  }
}
