import {McBarChart, McPieChart, McPointChart} from '../components/index'
@Entry
@Component
struct Index {
  build() {
    Column() {
      // McBarChart({
      //   options: {
      //     xAxis:{
      //       data:['周一','周二','周三','周四','周五','周六','周日']
      //     },
      //     yAxis:{
      //       name:'温度'
      //     },
      //     series:[
      //       {
      //         name:'最高气温',
      //         data:[11, 11, 15, 13, 12, 130, 10]
      //       }
      //     ]
      //   }
      // })

      // // 柱状图-x轴属性
      // McBarChart({
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
      //         show: true, // 是否显示
      //         length: 6, // 刻度的长度
      //         lineStyle: {
      //           color: '#ccc', // 刻度线颜色
      //           width: 2 // 刻度线宽度
      //         }
      //       },
      //       axisLabel: {
      //         color: '#bf19ff',
      //         fontWeight: '600',
      //         fontFamily: 'sans-serif',
      //         fontSize: 30,
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

      // // 柱状图-y轴属性
      // McBarChart({
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

      // // 柱状图-legend属性
      // McBarChart({
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

      // // 柱状图-tooltip属性
      // McBarChart({
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

      // 柱状图-series属性
      McBarChart({
        options: {
          xAxis:{
            data:['周一','周二','周三','周四','周五','周六','周日']
          },
          series: [
            {
              name:'最高气温',
              color: '#ff2659f5',
              barStyle: {
                color: '',
                width: 40,
                barGap: 0,
                barCategoryGap: 0
              },
              label: {
                show: true,
                color: '#fffa6262',
                fontWeight: '600',
                fontFamily: 'sans-serif',
                position: '',
                fontSize: 30,
                formatter: (params) => {
                  return params.name
                },
                distanceToLabelLine: 10
              },
              stack: 'total',
              data:[11, 11, 50, 30, 12, 130, 10]
            },
            {
              name:'最低气温',
              barStyle: {
                color: '',
                width: 40,
                barGap: 0,
                barCategoryGap: 0
              },
              label: {
                show: true,
                color: '#fffa6262',
                fontWeight: '600',
                fontFamily: 'sans-serif',
                position: '',
                fontSize: 30,
                formatter: (params) => {
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
              stack: 'total',
              data:[-11, -11, -50, 40, -12, -130, -10]
            }
          ]
        }
      })
    }
    .height('50%')
  }
}