import { InterfaceObj } from '../../utils/chartInterface'
import DrawBar from '../../utils/drawBar'
import { Chart } from './Chart'
let drawMcBarChart = null
@Component
export struct McBarChart {
  @State options: InterfaceObj = {}
  private click: Function = function (event, params) {}
  private tooltipClick: Function = function (event, params) {}
  aboutToAppear() {
    drawMcBarChart = new DrawBar()
  }
  build() {
    Chart({
      options: $options,
      drawMcChart: drawMcBarChart,
      click: this.click.bind(this),
      tooltipClick: this.tooltipClick.bind(this)
    })
  }
}
