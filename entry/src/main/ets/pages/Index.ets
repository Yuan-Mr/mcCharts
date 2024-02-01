import {McLineChart, McBarChart, McPieChart, McPointChart, Options} from '../components/index'
interface InterfaceObj {
  name: string
}
@Entry
@Component
struct Index {
  @State seriesOption: Options = new Options({
    xAxis:{
      data:['周一','周二','周三','周四','周五','周六','周日']
    },
    series: [
      {
        name:'最高气温',
        color: '#ff2659f5',
        lineStyle: {
          color: '#ff2659f5',
          width: 2,
          type: 'solid'
        },
        label: {
          show: true,
          color: '#fffa6262',
          fontWeight: '600',
          fontFamily: 'sans-serif',
          position: '',
          fontSize: 30,
          formatter: (params: InterfaceObj) => {
            return params.name
          },
          distanceToLabelLine: 10
        },
        itemStyle: {
          symbol: 'solidCircle',
          symbolSize: 4,
          symbolColor: '',
          borderWidth: 0,
          borderType: 'solid',
          borderColor: ''
        },
        data:[11, 11, 50, 30, 12, 130, 10]
      }
    ]
  })
  aboutToAppear() {
    setTimeout(() => {
      this.seriesOption.setVal({
        series: [
          {
            name:'最高气温',
            color: '#ff2659f5',
            lineStyle: {
              color: '#ff2659f5',
              width: 2,
              type: 'solid'
            },
            label: {
              show: true,
              color: '#fffa6262',
              fontWeight: '600',
              fontFamily: 'sans-serif',
              position: '',
              fontSize: 30,
              formatter: (params: InterfaceObj) => {
                return params.name
              },
              distanceToLabelLine: 10
            },
            itemStyle: {
              symbol: 'solidCircle',
              symbolSize: 4,
              symbolColor: '',
              borderWidth: 0,
              borderType: 'solid',
              borderColor: ''
            },
            data:[110, 101, 500, 300, 102, 1030, 100]
          }
        ]
      })
    }, 2000)
  }
  build() {
    Column() {
      // // 折线图-x轴属性
      // McLineChart({
      //   options: {
      //     xAxis:{
      //       axisLine: { // 轴线样式
      //         show: true, // 是否显示
      //         lineStyle: {
      //           color: '#ccc',
      //           width: 2
      //         }
      //       },
      //       axisTick: { // 刻度线配置
      //         show: false, // 是否显示
      //         interval: 6, // 与文本的间隔
      //         length: 4, // 刻度的长度
      //         lineStyle: {
      //           color: '#ccc', // 刻度线颜色
      //           width: 2 // 刻度线宽度
      //         }
      //       },
      //       axisLabel: {
      //         color: '#bf19ff',
      //         fontWeight: '600',
      //         fontFamily: 'sans-serif',
      //         fontSize: 24,
      //       },
      //       formatter: function (name) {
      //         return '周六'
      //       },
      //       data:['周一','周二','周三','周四','周五','周六','周日']
      //     },
      //     series:[
      //       {
      //         name:'最高气温',
      //         data:[11, 11, 50, 30, 12, 130, 10]
      //       }
      //     ]
      //   }
      // })

      // // 折线图-y轴属性
      // McLineChart({
      //   options: {
      //     xAxis:{
      //       data:['周一','周二','周三','周四','周五','周六','周日']
      //     },
      //     yAxis: {
      //       name: '单位/摄氏度', // 坐标名称
      //       nameTextStyle: {
      //         color: '#ccc',
      //         fontWeight: 'normal',
      //         fontFamily: 'sans-serif',
      //         fontSize: 18,
      //       },
      //       axisLine: { // 轴线样式
      //         show: true, // 是否显示
      //         lineStyle: {
      //           color: '#ccc',
      //           width: 2
      //         }
      //       },
      //       axisTick: { // 刻度线配置
      //         show: true, // 是否显示
      //         interval: 4, // 与文本的间隔
      //         length: 5, // 刻度的长度
      //         lineStyle: {
      //           color: '#ccc', // 刻度线颜色
      //           width: 2 // 刻度线宽度
      //         }
      //       },
      //       splitLine: { // 坐标轴中的分隔线。
      //         show: true,
      //         lineStyle: {
      //           color: '#4f000000',
      //           width: 2
      //         }
      //       },
      //       axisLabel: {  // x轴文本标签样式
      //         color: '#bf19ff',
      //         fontWeight: '600',
      //         fontFamily: 'sans-serif',
      //         fontSize: 20,
      //       },
      //       formatter: function (name) { // 自定义文本标签
      //         return name + '°C'
      //       },
      //     },
      //     series:[
      //       {
      //         name:'最高气温',
      //         data:[11, 11, 50, 30, 12, 130, 10]
      //       }
      //     ]
      //   }
      // })

      // // 折线图-legend属性
      // McLineChart({
      //   options: {
      //     xAxis:{
      //       data:['周一','周二','周三','周四','周五','周六','周日']
      //     },
      //     legend: {
      //       show: true,
      //       left: '50%',
      //       top: '2%',
      //       itemGap: 10, // 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
      //       itemTextGap: 10, // 图例图例之间的间隔。
      //       itemWidth: 8, // 图例标记的图形宽度。
      //       itemHeight: 8, // 图例标记的图形高度。
      //       textStyle: {
      //         color: '#000',
      //         fontWeight: 'normal',
      //         fontFamily: 'sans-serif',
      //         fontSize: 24
      //       }
      //     },
      //     series:[
      //       {
      //         name:'最高气温',
      //         data:[11, 11, 50, 30, 12, 130, 10]
      //       }
      //     ]
      //   }
      // })

      // // 折线图-tooltip属性
      // McLineChart({
      //   options: {
      //     tooltip: {
      //       show: true,
      //       type: 'default', // 渲染类型。可选值：default（默认）、custom（自定义）
      //       axisPointer: {
      //         type: 'line',
      //         lineStyle: {
      //           color: '#000',
      //           width: 2,
      //           type: 'solid'
      //         }
      //       },
      //       backgroundColor: '#97cccccc',
      //       borderColor: '#333',
      //       borderWidth: 1,
      //       padding: 20,
      //       textStyle: {
      //         color: '#000',
      //         fontWeight: 'normal',
      //         fontFamily: 'sans-serif',
      //         fontSize: 18
      //       }
      //     },
      //     xAxis:{
      //       data:['周一','周二','周三','周四','周五','周六','周日']
      //     },
      //     series:[
      //       {
      //         name:'最高气温',
      //         data:[11, 11, 50, 30, 12, 130, 10]
      //       }
      //     ]
      //   }
      // })

      // 折线图-series属性
      McLineChart({
        options: this.seriesOption
      })
    }
    .height('50%')
  }
}