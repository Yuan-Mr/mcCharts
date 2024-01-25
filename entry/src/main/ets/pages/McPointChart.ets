import {McBarChart, McPieChart, McPointChart, Options} from '../components/index'
@Entry
@Component
struct Index {
  @State defOption: Options = new Options({
    series:[
      {
        name:'高气温',
        data: [
          {xVal: 40, yVal: 26, num: 17096869, name: '广州'},
          {xVal: 20, yVal: 30, num: 17096869, name: '上海'},
          {xVal: 30, yVal: 40, num: 17096869, name: '北京'},
          {xVal: 10, yVal: 28, num: 17096869, name: '深圳'}
        ]
      }
    ]
  })
  @State xOption: Options = new Options({
    xAxis:{
      axisLine: { // 轴线样式
        show: true, // 是否显示
        lineStyle: {
          color: '#ccc',
          width: 2
        }
      },
      axisTick: { // 刻度线配置
        show: true, // 是否显示
        interval: 6, // 与文本的间隔
        length: 4, // 刻度的长度
        lineStyle: {
          color: '#ccc', // 刻度线颜色
          width: 2 // 刻度线宽度
        }
      },
      axisLabel: {
        color: '#bf19ff',
        fontWeight: '600',
        fontFamily: 'sans-serif',
        fontSize: 24,
      }
    },
    series:[
      {
        name:'高气温',
        data: [
          {xVal: 40, yVal: 26, num: 17096869, name: '广州'},
          {xVal: 20, yVal: 30, num: 17096869, name: '上海'},
          {xVal: 30, yVal: 40, num: 17096869, name: '北京'},
          {xVal: 10, yVal: 28, num: 17096869, name: '深圳'}
        ]
      }
    ]
  })
  @State yOption: Options = new Options({
    yAxis: {
      name: '单位/摄氏度', // 坐标名称
      nameTextStyle: {
        color: '#ccc',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 18,
      },
      axisLine: { // 轴线样式
        show: true, // 是否显示
        lineStyle: {
          color: '#ccc',
          width: 2
        }
      },
      axisTick: { // 刻度线配置
        show: true, // 是否显示
        interval: 4, // 与文本的间隔
        length: 5, // 刻度的长度
        lineStyle: {
          color: '#ccc', // 刻度线颜色
          width: 2 // 刻度线宽度
        }
      },
      splitLine: { // 坐标轴中的分隔线。
        show: true,
        lineStyle: {
          color: '#4f000000',
          width: 2
        }
      },
      axisLabel: {  // x轴文本标签样式
        color: '#bf19ff',
        fontWeight: '600',
        fontFamily: 'sans-serif',
        fontSize: 20,
      },
      formatter: function (name) { // 自定义文本标签
        return name + '°C'
      },
    },
    series:[
      {
        name:'高气温',
        data: [
          {xVal: 40, yVal: 26, num: 17096869, name: '广州'},
          {xVal: 20, yVal: 30, num: 17096869, name: '上海'},
          {xVal: 30, yVal: 40, num: 17096869, name: '北京'},
          {xVal: 10, yVal: 28, num: 17096869, name: '深圳'}
        ]
      }
    ]
  })
  @State legendOption: Options = new Options({
    legend: {
      show: true,
      left: '90%',
      top: '2%',
      itemGap: 10, // 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
      itemTextGap: 10, // 图例图例之间的间隔。
      itemWidth: 8, // 图例标记的图形宽度。
      itemHeight: 8, // 图例标记的图形高度。
      textStyle: {
        color: '#000',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 24
      }
    },
    series:[
      {
        name:'高气温',
        data: [
          {xVal: 40, yVal: 26, num: 17096869, name: '广州'},
          {xVal: 20, yVal: 30, num: 17096869, name: '上海'},
          {xVal: 30, yVal: 40, num: 17096869, name: '北京'},
          {xVal: 10, yVal: 28, num: 17096869, name: '深圳'}
        ]
      }
    ]
  })
  @State tooltipOption: Options = new Options({
    tooltip: {
      show: true,
      type: 'default', // 渲染类型。可选值：default（默认）、custom（自定义）
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#000',
          width: 2,
          type: 'solid'
        }
      },
      backgroundColor: '#97cccccc',
      borderColor: '#333',
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: '#000',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 18
      }
    },
    series:[
      {
        name:'高气温',
        data: [
          {xVal: 40, yVal: 26, num: 17096869, name: '广州'},
          {xVal: 20, yVal: 30, num: 17096869, name: '上海'},
          {xVal: 30, yVal: 40, num: 17096869, name: '北京'},
          {xVal: 10, yVal: 28, num: 17096869, name: '深圳'}
        ]
      }
    ]
  })
  @State seriesOption: Options = new Options({
    series:[
      {
        name:'高气温',
        color: '#ff2659f5',
        symbolSize: function (data) {
          return data.xVal
        },
        data: [
          {xVal: 40, yVal: 26, num: 17096869, name: '广州'},
          {xVal: 20, yVal: 30, num: 17096869, name: '上海'},
          {xVal: 30, yVal: 40, num: 17096869, name: '北京'},
          {xVal: 10, yVal: 28, num: 17096869, name: '深圳'}
        ]
      },
      {
        name:'低气温',
        data: [
          {xVal: 40, yVal: 0, num: 17096869, name: '广州'},
          {xVal: 20, yVal: -10, num: 17096869, name: '上海'},
          {xVal: 30, yVal: -20, num: 17096869, name: '北京'},
          {xVal: 10, yVal: 5, num: 17096869, name: '深圳'}
        ]
      }
    ]
  })
  aboutToAppear() {
    setTimeout(() => {
      this.defOption.setVal({
        series:[
          {
            name:'低气温',
            data: [
              {xVal: 40, yVal: 0, num: 17096869, name: '广州'},
              {xVal: 20, yVal: -10, num: 17096869, name: '上海'},
              {xVal: 30, yVal: -20, num: 17096869, name: '北京'},
              {xVal: 10, yVal: 5, num: 17096869, name: '深圳'}
            ]
          }
        ]
      })
    }, 2000)
  }
  build() {
    Column() {
      // // 散点图 -- 默认
      // McPointChart({
      //   options: this.defOption
      // })

      // // 散点图-xAxis属性
      // McPointChart({
      //   options: this.xOption
      // })

      // // 散点图-yAxis属性
      // McPointChart({
      //   options: this.yOption
      // })

      // // 散点图-legend属性
      // McPointChart({
      //   options: this.legendOption
      // })

      // // 散点图-tooltip属性
      // McPointChart({
      //   options: this.tooltipOption
      // })

      // 散点图-series属性
      McPointChart({
        options: this.seriesOption
      })
    }
    .height('50%')
  }
}