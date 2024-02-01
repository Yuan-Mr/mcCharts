import DrawPie from '../../utils/drawPie'
import { Chart } from './Chart'
import { Options } from './Options'
import { InterfaceObj } from '../../utils/chartInterface'
import { Chart as CommonChart } from '../../utils/charts'
let drawMcPieChart: CommonChart | null = null

@Component
export struct McPieChart {
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
    drawMcPieChart = new DrawPie()
  }
  build() {
    Chart({
      options: this.chartOption,
      drawMcChart: drawMcPieChart,
      click: (event: InterfaceObj, params: InterfaceObj) => {
        this.click(event, params)
      },
      tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
        this.tooltipClick(event, params)
      }
    })
  }
}


