import { AxisInterface, LegendInterface, TooltipInterface, SeriesInterface } from './chartInterface'

const seriesOpt: SeriesInterface = {
  name: '',
  color: '',
  lineStyle: {
    color: '',
    width: 1,
    type: 'solid'
  },
  barStyle: {
    color: '',
    width: 30,
    barGap: 0,
    barCategoryGap: 0
  },
  label: {
    show: true,
    color: '#333',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    position: '',
    fontSize: 24,
    formatter: (params) => {
      return params.name
    },
    distanceToLabelLine: 5
  },
  labelLine: {
    show: true, // 默认开启，如果当label的position的值不是outside，则自动隐藏
    length: 10,
    length2: 20,
    minTurnAngle: 90,
    lineStyle: {
      color: '',
      width: 2,
      type: 'solid'
    }
  },
  emphasis: {
    scale: true,
    scaleSize: 4,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 15,
    shadowOffsetX: 0,
    shadowOffsetY: 0
  },
  itemStyle: {
    symbol: 'solidCircle',
    symbolSize: 2,
    symbolColor: '',
    borderWidth: 0,
    borderType: 'solid',
    borderColor: ''
  },
  stack: '', // 数据堆叠
  symbolSize: 5, // 散点图的标记大小
  data: []
}

const axisOpt: AxisInterface = {
  axisLine: { // 坐标轴轴线相关设置。
    show: true,
    lineStyle: {
      color: '#333',
      width: 1,
      type: 'solid'
    }
  },
  axisTick: {
    show: true,
    interval: 4, // 与文本的间隔
    length: 5, // 刻度的长度
    lineStyle: {
      color: '#333',
      width: 1
    }
  },
  axisLabel: {
    color: '#333',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontSize: 18,
  },
  formatter: null,
}

const xAxisOpt: AxisInterface = {
  ...axisOpt,
  data: []
}

const yAxisOpt: AxisInterface = {
  name: '',
  nameTextStyle: {
    color: '#333',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontSize: 18,
  },
  ...axisOpt,
  splitLine: { // 坐标轴中的分隔线。
    show: true,
    lineStyle: {
      color: '#ccc',
      width: 1
    }
  },
  data: []
}

const axisPointer = {
  type: 'line',
  lineStyle: {
    color: '#555',
    width: 1,
    type: 'solid'
  },
  shadowStyle: {
    color: 'rgba(150,150,150,0.3)'
  }
}

// 提示层默认数据
const tooltip: TooltipInterface = {
  show: true,
  type: 'default', // 是否自定义渲染。可选值：default（默认）、custom（自定义）
  axisPointer: axisPointer,
  backgroundColor: 'rgba(50,50,50,0.7)',
  borderColor: '#333',
  borderWidth: 0,
  padding: 10,
  textStyle: {
    color: '#fff',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontSize: 14
  }
}

// 图例的文本样式
const legendTextStyle = {
  color: '#333',
  fontWeight: 'normal',
  fontFamily: 'sans-serif',
  fontSize: 18
}

// 图例的默认数据
const legend: LegendInterface = {
  show: true,
  left: '50%',
  top: '1%',
  itemGap: 10, // 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
  itemTextGap: 5, // 图例图例之间的间隔。
  itemWidth: 16, // 图例标记的图形宽度。
  itemHeight: 8, // 图例标记的图形高度。
  textStyle: legendTextStyle
}


export {
  seriesOpt,
  xAxisOpt,
  yAxisOpt,
  tooltip,
  legendTextStyle,
  legend
}