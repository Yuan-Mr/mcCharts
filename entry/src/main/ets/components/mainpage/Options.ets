import { InterfaceObj, LegendInterface, TooltipInterface, SeriesInterface, AxisInterface, DataZoomInterface, RadarInterface, OptionInterface } from '../../utils/chartInterface'
import { xAxisOpt, yAxisOpt, tooltip, legend, legendTextStyle, dataZoom, radar } from '../../utils/defaultOption'
import { deepCopy, assign } from '../../utils/index'

@Observed
export class Options {
  cPaddingT: number | undefined = 30;
  cPaddingB: number | undefined = 30;
  cPaddingL: number | undefined = 30;
  cPaddingR: number | undefined = 20;
  color: Array<string> | undefined = ['#296DFF', '#ff5495fd', '#ff1acffd', '#ff72e4fd', '#7B72F7', '#F85758', '#FFBF29', '#D1E9F9', '#F5FAFC', '#5A657A',];
  title: InterfaceObj | undefined = {};
  legend: LegendInterface | undefined = deepCopy(legend);
  dataZoom: DataZoomInterface | undefined = deepCopy(dataZoom);
  tooltip: TooltipInterface | undefined = deepCopy(tooltip);
  radar: RadarInterface | undefined = deepCopy(radar);
  xAxis: AxisInterface | undefined = deepCopy(xAxisOpt);
  yAxis: AxisInterface | AxisInterface[] | undefined = deepCopy(yAxisOpt);
  series: Array<SeriesInterface> | undefined = [];

  constructor(options: OptionInterface) {
    this.setVal(options)
  }

  setVal (options: OptionInterface) {
    const keys = ['cPaddingT', 'cPaddingB', 'cPaddingL', 'cPaddingR', 'color', 'title', 'legend', 'xAxis', 'yAxis', 'tooltip', 'radar', 'dataZoom', 'series']
    for (let i = 0; i < keys.length; i++) {
      const item = keys[i]
      if (options[item] === undefined) continue
      switch (item) {
        case 'cPaddingT':
          this.cPaddingT = options[item]
          break
        case 'cPaddingB':
          this.cPaddingB = options[item]
          break
        case 'cPaddingL':
          this.cPaddingL = options[item]
          break
        case 'cPaddingR':
          this.cPaddingR = options[item]
          break
        case 'tooltip':
          this.tooltip = options[item]
          break
        case 'title':
          this.title = assign(this.title, options[item])
          break
        case 'color':
          this.color = options[item]
          break
        case 'legend':
          this.legend = assign(this.legend, options[item])
          break
        case 'xAxis':
          this.xAxis = assign(this.xAxis, options[item])
          break
        case 'yAxis':
          this.yAxis = assign(this.yAxis, options[item])
          break
        case 'dataZoom':
          this.dataZoom = options[item]
          break
        case 'radar':
          this.radar = options[item]
          break
        case 'series':
          const seriesData: SeriesInterface[] | undefined = options[item]
          if (this.series && seriesData) {
            if (this.series.length === seriesData.length) {
              this.series = this.series.map((item: SeriesInterface, index): SeriesInterface => {
                item = assign(item, seriesData[index])
                return item
              })
            } else {
              this.series = options[item]
            }
          } else {
            this.series = options[item]
          }
          break
      }
    }
  }
}