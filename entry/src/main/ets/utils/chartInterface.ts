interface InterfaceObj {
  [key: string]: any,
}

// 图表数据的特征接口
interface interface_data {
  name: string | number,
  value: string | number,
  [key: string]: any,
}

// 图表的特征接口
interface interface_option {
  cWidth?: string | number,
  cHeight?: string | number,
  backgroundColor?: string,
  fontSize?: string | number,
  color?: string,
  cSpace?: number | Array<Number>,
  data?: InterfaceObj[],
  [key: string]: any,
}

// 坐标轴的特征接口
interface AxisInterface {
  type?: string,
  name?: string,
  nameTextStyle?: InterfaceObj,
  nameGap?: number,
  boundaryGap?: boolean,
  axisLine?: InterfaceObj,
  axisTick?: InterfaceObj,
  axisLabel?: InterfaceObj,
  data?: Array<string | number>,
  splitLine?: InterfaceObj,
  formatter?: Function | null
}


// 图例的特征接口
interface LegendInterface {
  show?: boolean,
  left?: string,
  top?: string,
  orient?: string,
  itemGap?: number,
  itemTextGap?: number,
  itemWidth?: number,
  itemHeight?: number,
  textStyle?: InterfaceObj
}

// 提示层的特征接口
interface TooltipInterface {
  show?: boolean,
  type?: string,
  axisPointer?: InterfaceObj,
  backgroundColor?: string,
  borderColor?: string,
  borderWidth?: number,
  padding?: number,
  textStyle?: InterfaceObj
}

// 数据层的特征接口
interface SeriesInterface {
  name?: string,
  color?: string,
  lineStyle?: InterfaceObj,
  barStyle?: InterfaceObj,
  label?: InterfaceObj,
  itemStyle?: InterfaceObj,
  areaStyle?: InterfaceObj,
  labelLine?: InterfaceObj,
  emphasis?: InterfaceObj,
  stack?: string,
  symbolSize?: Number | Function,
  padAngle?: Number
  radius?: string[],
  center?: string[],
  smooth?: boolean,
  data?: Array<string | number | InterfaceObj>
}

// 缩放的特征接口
interface DataZoomInterface {
  show?: boolean,
  num?: number,
  start?: number,
  end?: number
}

// 雷达图的特征接口
interface RadarInterface {
  indicator?: InterfaceObj[],
  center?: Array<string | number>,
  radius?: number | string,
  startAngle?: number,
  nameGap ?: number,
  splitNumber ?: number,
  axisLine?: InterfaceObj,
  axisName?: InterfaceObj,
  splitLine?: InterfaceObj,
  splitArea?: InterfaceObj
}

interface OptionInterface {
  cPaddingT?: number,
  cPaddingB?: number,
  cPaddingL?: number,
  cPaddingR?: number,
  color?: Array<string>,
  title?: InterfaceObj,
  legend?: LegendInterface,
  dataZoom?: DataZoomInterface,
  tooltip?: TooltipInterface,
  radar?: RadarInterface,
  xAxis?: AxisInterface,
  yAxis?: AxisInterface | AxisInterface[],
  series?: Array<SeriesInterface>
}


export {
  AxisInterface,
  InterfaceObj,
  LegendInterface,
  TooltipInterface,
  SeriesInterface,
  DataZoomInterface,
  OptionInterface,
  RadarInterface
}