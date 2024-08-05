import DrawLine from '../../utils/drawLine'
import { Chart } from './Chart'
import { Options } from './Options'
import { globalBuilder } from './Tooltip'
import { InterfaceObj, OptionInterface } from '../../utils/chartInterface'
import { Chart as CommonChart } from '../../utils/charts'
let drawMcLineChart: CommonChart;
@Component
export struct McLineChart {
  @Prop @Watch('onCountUpdated') options: Options;
  @State chartOption: OptionInterface = {};
  @State renderType: string = 'init'
  private click: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  private tooltipClick: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  @BuilderParam customTooltip: (tooltipInfo: InterfaceObj) => void = globalBuilder; // 自定义组件
  // @Watch 回调
  onCountUpdated(): void {
    this.renderType = 'update'
    this.chartOption = this.options.options
  }
  aboutToAppear() {
    this.chartOption = this.options.options
    drawMcLineChart = new DrawLine()
  }
  build() {
    Chart({
      options: $chartOption,
      drawMcChart: drawMcLineChart,
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

