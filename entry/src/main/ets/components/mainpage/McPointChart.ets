import { InterfaceObj, OptionInterface } from '../../utils/chartInterface'
import DrawPoint from '../../utils/drawPoint'
import { Chart } from './Chart'
import { Options } from './Options'
import { globalBuilder } from './Tooltip'
import { Chart as CommonChart } from '../../utils/charts'
let drawMcPointChart: CommonChart;
@Component
export struct McPointChart {
  @Prop @Watch('onCountUpdated') options: Options;
  @State chartOption: OptionInterface = {};
  @State renderType: string = 'init'
  private click: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  private tooltipClick: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  @BuilderParam customTooltip: (tooltipInfo: InterfaceObj) => void = globalBuilder; // 自定义组件
  // @Watch 回调
  onCountUpdated(): void {
    this.chartOption = this.options.options
  }
  aboutToAppear() {
    this.onCountUpdated()
    drawMcPointChart = new DrawPoint()
  }
  build() {
    Chart({
      options: $chartOption,
      drawMcChart: drawMcPointChart,
      renderType: this.renderType,
      customTooltip: this.customTooltip,
      click: (event: InterfaceObj, params: InterfaceObj) => {
        this.click(event, params)
      },
      tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
        this.tooltipClick(event, params)
      }
    })
  }
}
