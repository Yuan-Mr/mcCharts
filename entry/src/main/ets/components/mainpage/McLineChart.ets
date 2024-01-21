import { InterfaceObj } from '../../utils/chartInterface'
import DrawLine from '../../utils/drawLine'
import { Chart } from './Chart'
let drawMcLineChart = null
@Component
export struct McLineChart {
  @State options: InterfaceObj = {}
  private click: Function = function (event, params) {}
  private tooltipClick: Function = function (event, params) {}
  aboutToAppear() {
    drawMcLineChart = new DrawLine()
  }
  build() {
    Chart({
      options: $options,
      drawMcChart: drawMcLineChart,
      click: this.click.bind(this),
      tooltipClick: this.tooltipClick.bind(this)
    })
  }
}
