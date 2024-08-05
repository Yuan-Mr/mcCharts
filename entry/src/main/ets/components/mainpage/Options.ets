import { InterfaceObj, LegendInterface, TooltipInterface, SeriesInterface, AxisInterface, DataZoomInterface, RadarInterface, OptionInterface } from '../../utils/chartInterface'
import { xAxisOpt, yAxisOpt, tooltip, legend, legendTextStyle, dataZoom, radar } from '../../utils/defaultOption'
import { deepCopy, assign } from '../../utils/index'

export class Options {
  options: OptionInterface = {
    cPaddingT: 30,
    cPaddingB: 30,
    cPaddingL: 30,
    cPaddingR: 20,
    color: ['#296DFF', '#ff5495fd', '#ff1acffd', '#ff72e4fd', '#7B72F7', '#F85758', '#FFBF29', '#D1E9F9', '#F5FAFC', '#5A657A'],
    title: {},
    legend: deepCopy(legend),
    dataZoom: deepCopy(dataZoom),
    tooltip: deepCopy(tooltip),
    radar: deepCopy(radar),
    xAxis: deepCopy(xAxisOpt),
    yAxis: deepCopy(yAxisOpt),
    series: []
  }
  cPaddingT: number = 30;
  cPaddingB: number = 30;
  cPaddingL: number = 30;
  cPaddingR: number = 20;
  color: Array<string> = [];
  title: InterfaceObj = {};
  legend: LegendInterface = {};
  dataZoom: DataZoomInterface = {};
  tooltip: TooltipInterface = {};
  radar: RadarInterface = {};
  xAxis: AxisInterface = {};
  yAxis: AxisInterface | AxisInterface[] = {};
  series: Array<SeriesInterface> = [];

  constructor(options: OptionInterface) {
    this.setVal(options)
  }

  setVal (options: OptionInterface) {
    const oldOptions: OptionInterface = deepCopy(this.options)
    const keys = ['cPaddingT', 'cPaddingB', 'cPaddingL', 'cPaddingR', 'color', 'title', 'legend', 'xAxis', 'yAxis', 'tooltip', 'radar', 'dataZoom', 'series']
    for (let i = 0; i < keys.length; i++) {
      const item = keys[i]
      if (options[item] === undefined) continue
      switch (item) {
        case 'cPaddingT':
          oldOptions.cPaddingT = options[item]
          break
        case 'cPaddingB':
          oldOptions.cPaddingB = options[item]
          break
        case 'cPaddingL':
          oldOptions.cPaddingL = options[item]
          break
        case 'cPaddingR':
          oldOptions.cPaddingR = options[item]
          break
        case 'tooltip':
          oldOptions.tooltip = options[item]
          break
        case 'title':
          oldOptions.title = assign(oldOptions.title, options[item])
          break
        case 'color':
          oldOptions.color = options[item]
          break
        case 'legend':
          oldOptions.legend = assign(oldOptions.legend, options[item])
          break
        case 'xAxis':
          oldOptions.xAxis = assign(oldOptions.xAxis, options[item])
          break
        case 'yAxis':
          oldOptions.yAxis = assign(oldOptions.yAxis, options[item])
          break
        case 'dataZoom':
          oldOptions.dataZoom = options[item]
          break
        case 'radar':
          oldOptions.radar = assign(oldOptions.radar, options[item])
          break
        case 'series':
          const seriesData: SeriesInterface[] | undefined = options[item]
          if (oldOptions.series && seriesData) {
            if (oldOptions.series.length === seriesData.length) {
              oldOptions.series = oldOptions.series.map((item: SeriesInterface, index): SeriesInterface => {
                item = assign(item, seriesData[index])
                return item
              })
            } else {
              oldOptions.series = options[item]
            }
          } else {
            oldOptions.series = options[item]
          }
          break
      }
    }
    this.options = oldOptions
  }
}