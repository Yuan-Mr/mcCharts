import type { InterfaceObj, AxisInterface, LegendInterface, TooltipInterface, SeriesInterface, DataZoomInterface, RadarInterface } from './chartInterface';
const lineStyle: InterfaceObj = {
    color: '',
    width: 1,
    type: 'solid'
};
const barStyle: InterfaceObj = {
    color: '',
    width: 30,
    barGap: 3,
    barCategoryGap: 0,
    borderRadius: false // 新增圆形
};
const label: InterfaceObj = {
    show: true,
    color: '#999',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    position: '',
    fontSize: 24,
    distanceToLabelLine: 5
};
const itemStyle: InterfaceObj = {
    symbol: 'none',
    symbolSize: 3,
    symbolColor: '',
    borderWidth: 0,
    borderType: 'solid',
    borderColor: '' // 新增
};
// 新增区域颜色
const areaStyle: InterfaceObj = {
    color: ''
};
const seriesOpt: SeriesInterface = {
    name: '',
    color: '',
    lineStyle: {
        color: '',
        width: 2,
        type: 'solid'
    },
    barStyle,
    label: {
        ...label,
        formatter: (params) => {
            return params.name;
        }
    },
    labelLine: {
        show: true,
        length: 10,
        length2: 20,
        minTurnAngle: 90,
        lineStyle
    },
    emphasis: {
        scale: true,
        scaleSize: 4,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 15,
        shadowOffsetX: 0,
        shadowOffsetY: 0
    },
    areaStyle,
    itemStyle,
    stack: '',
    symbolSize: 0,
    smooth: false,
    padAngle: 0,
    data: []
};
const axisLineStyle: InterfaceObj = {
    ...lineStyle,
    color: '#DDE2EB'
};
const axisOpt: AxisInterface = {
    axisLine: {
        show: true,
        lineStyle: axisLineStyle
    },
    axisTick: {
        show: true,
        interval: 4,
        length: 5,
        lineStyle: axisLineStyle
    },
    axisLabel: {
        color: '#999999',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 22,
        interval: 'auto',
        margin: 5,
        overflow: 'none' // 新增的x轴的文本长度超出的处理， none（无）， truncate（截断），breakAll（换行）
    },
    formatter: null,
};
const xAxisOpt: AxisInterface = {
    ...axisOpt,
    data: []
};
const yLineStyle: InterfaceObj = {
    ...lineStyle,
    color: '#DDE2EB'
};
const yAxisOpt: AxisInterface = {
    name: '',
    nameTextStyle: {
        color: '#999999',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 22,
    },
    nameGap: 5,
    ...axisOpt,
    axisLabel: {
        ...axisOpt.axisLabel,
        margin: 0, // 新增的刻度标签与轴线之间的距离。
    },
    splitLine: {
        show: true,
        lineStyle: yLineStyle
    },
    data: []
};
const axisPointer = {
    type: 'line',
    lineStyle: yLineStyle,
    shadowStyle: {
        color: 'rgba(150,150,150,0.2)'
    }
};
// 提示层默认数据
const tooltip: TooltipInterface = {
    show: true,
    type: 'default',
    axisPointer: axisPointer,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderColor: 'rgba(0,0,0,0.7)',
    borderWidth: 0,
    padding: 12,
    textStyle: {
        color: '#fff',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 14
    }
};
// 图例的文本样式
const legendTextStyle = {
    color: '#333',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontSize: 20
};
// 图例的默认数据
const legend: LegendInterface = {
    show: true,
    left: '50%',
    top: '1%',
    itemGap: 10,
    itemTextGap: 5,
    itemWidth: 16,
    itemHeight: 8,
    textStyle: legendTextStyle
};
// 缩放的默认数据，新增
const dataZoom: DataZoomInterface = {
    show: false,
    num: 7,
    start: 0,
    end: 6
};
// 雷达图的配置信息, 新增
const radar: RadarInterface = {
    indicator: [],
    center: ['50%', '50%'],
    radius: '75%',
    startAngle: 90,
    nameGap: 10,
    splitNumber: 5,
    // 雷达图每个指示器名称的配置项。
    axisName: {
        show: true,
        color: '#999',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 22,
        width: 30,
        overflow: 'breakAll' // 新增的x轴的文本长度超出的处理， none（无）， truncate（截断），breakAll（换行）
    },
    // 坐标轴轴线相关设置。
    axisLine: {
        show: true,
        lineStyle: {
            color: '#DBDBDB',
            width: 1
        }
    },
    // 坐标轴在 grid 区域中的分隔线。
    splitLine: {
        show: true,
        lineStyle: {
            color: '#DBDBDB',
            width: 1
        }
    },
    // 坐标轴在 grid 区域中的分隔区域，默认显示。
    splitArea: {
        show: true,
        areaStyle: {
            colors: ['#fff', 'rgba(200,200,200,0.2)']
        }
    }
};
export { lineStyle, axisLineStyle, yLineStyle, barStyle, itemStyle, areaStyle, label, seriesOpt, xAxisOpt, yAxisOpt, tooltip, legendTextStyle, legend, dataZoom, radar };
