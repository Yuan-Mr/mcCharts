import type { InterfaceObj, LegendInterface, TooltipInterface, SeriesInterface, AxisInterface, DataZoomInterface, RadarInterface } from '../../utils/chartInterface';
import { xAxisOpt, yAxisOpt, tooltip, legend, dataZoom, radar } from "@bundle:com.example.mccharts/entry/ets/utils/defaultOption";
import { deepCopy, assign } from "@bundle:com.example.mccharts/entry/ets/utils/index";
@Observed
export class Options {
    cPaddingT: number = 30;
    cPaddingB: number = 30;
    cPaddingL: number = 30;
    cPaddingR: number = 30;
    color: Array<string> = ['#296DFF', '#ff5495fd', '#ff1acffd', '#ff72e4fd', '#7B72F7', '#F85758', '#FFBF29', '#D1E9F9', '#F5FAFC', '#5A657A',];
    title: InterfaceObj = {};
    legend: LegendInterface = deepCopy(legend);
    dataZoom: DataZoomInterface = deepCopy(dataZoom);
    tooltip: TooltipInterface = deepCopy(tooltip);
    radar: RadarInterface = deepCopy(radar);
    series: Array<SeriesInterface> = [];
    xAxis: AxisInterface = deepCopy(xAxisOpt);
    yAxis: AxisInterface | AxisInterface[] = deepCopy(yAxisOpt);
    constructor(options: InterfaceObj) {
        this.setVal(options);
    }
    setVal(options: InterfaceObj) {
        const keys = Object.keys(options);
        keys.forEach(item => {
            // this[item] = options[item]
            switch (item) {
                case 'cPaddingT':
                    this.cPaddingT = options[item];
                    break;
                case 'cPaddingB':
                    this.cPaddingB = options[item];
                    break;
                case 'cPaddingL':
                    this.cPaddingL = options[item];
                    break;
                case 'tooltip':
                    this.tooltip = options[item];
                    break;
                case 'title':
                    this.title = assign(this.title, options[item]);
                    break;
                case 'color':
                    this.color = options[item];
                    break;
                case 'legend':
                    this.legend = assign(this.legend, options[item]);
                    break;
                case 'xAxis':
                    this.xAxis = assign(this.xAxis, options[item]);
                    break;
                case 'yAxis':
                    this.yAxis = assign(this.yAxis, options[item]);
                    break;
                case 'dataZoom':
                    this.dataZoom = options[item];
                    break;
                case 'radar':
                    this.radar = options[item];
                    break;
                case 'series':
                    const seriesData: SeriesInterface[] = options[item];
                    if (this.series.length === seriesData.length) {
                        this.series = this.series.map((item: SeriesInterface, index): SeriesInterface => {
                            item = assign(item, seriesData[index]);
                            return item;
                        });
                    }
                    else {
                        this.series = options[item];
                    }
                    break;
            }
        });
    }
}
