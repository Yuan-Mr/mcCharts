interface InterfaceObj {
  [key: string]: any;
}

// 图表数据的特征接口
interface interface_data {
  name: string | number;
  value: string | number;
  [key: string]: any;
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
  [key: string]: any;
}

// 坐标轴的特征接口
interface AxisInterface {
  name?: string,
  nameTextStyle?: InterfaceObj,
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
  name: string,
  lineStyle?: InterfaceObj,
  barStyle?: InterfaceObj,
  label?: InterfaceObj,
  itemStyle?: InterfaceObj,
  stack?: string,
  data: any[]
}


export {
  AxisInterface,
  InterfaceObj,
  LegendInterface,
  TooltipInterface,
  SeriesInterface
}
