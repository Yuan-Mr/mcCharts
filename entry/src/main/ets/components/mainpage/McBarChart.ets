import DrawBar from '../../utils/drawBar'
import { Chart } from './Chart'
import { Options } from './Options'
import { globalBuilder } from './Tooltip'
import { InterfaceObj, OptionInterface } from '../../utils/chartInterface'
import { Chart as CommonChart } from '../../utils/charts'
let drawMcBarChart: CommonChart;
@Component
export struct McBarChart {
  @Prop @Watch('onCountUpdated') options: Options;
  @State chartOption: OptionInterface = {};
  @State renderType: string = 'init'
  private click: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  private tooltipClick: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  @BuilderParam customTooltip: (tooltipInfo: InterfaceObj) => void = globalBuilder; // 自定义组件
  // @Watch 回调
  onCountUpdated(options: Options): void {
    this.renderType = 'update'
    this.chartOption = this.options.options
  }
  aboutToAppear() {
    this.chartOption = this.options.options
    drawMcBarChart = new DrawBar()
  }
  build() {
    Chart({
      options: $chartOption,
      drawMcChart: drawMcBarChart,
      customTooltip: this.customTooltip,
      renderType: this.renderType,
      click: (event: InterfaceObj, params: InterfaceObj) => {
        this.click(event, params)
      },
      tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
        this.tooltipClick(event, params)
      }
    })
  }
}
