import { InterfaceObj } from '../../utils/chartInterface'
import DrawPie from '../../utils/drawPie'
import { Chart } from './Chart'
let drawMcPieChart = null
@Component
export struct McPieChart {
  @State options: InterfaceObj = {}
  private click: Function = function (event, params) {}
  private tooltipClick: Function = function (event, params) {}
  aboutToAppear() {
    drawMcPieChart = new DrawPie()
  }
  build() {
    Chart({
      options: $options,
      drawMcChart: drawMcPieChart,
      click: this.click.bind(this),
      tooltipClick: this.tooltipClick.bind(this)
    })
  }
}
