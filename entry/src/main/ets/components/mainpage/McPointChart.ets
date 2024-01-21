import { InterfaceObj } from '../../utils/chartInterface'
import DrawPoint from '../../utils/drawPoint'
import { Chart } from './Chart'
let drawMcPointChart = null
@Component
export struct McPointChart {
  @State options: InterfaceObj = {}
  private click: Function = function (event, params) {}
  private tooltipClick: Function = function (event, params) {}
  aboutToAppear() {
    drawMcPointChart = new DrawPoint()
  }
  build() {
    Chart({
      options: $options,
      drawMcChart: drawMcPointChart,
      click: this.click.bind(this),
      tooltipClick: this.tooltipClick.bind(this)
    })
  }
}
