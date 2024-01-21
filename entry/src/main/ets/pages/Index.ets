import {McLineChart, McBarChart, McPieChart, McPointChart} from '../components/index'
@Entry
@Component
struct Index {
  build() {
    Column() {
      // 折线图
      McLineChart({
        options: {
          xAxis:{
            axisLine: { // 轴线样式
              show: true, // 是否显示
              lineStyle: {
                color: '#ccc',
                width: 2
              }
            },
            axisTick: { // 刻度线配置
              show: false, // 是否显示
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
            },
            formatter: function (name) {
              return '周六'
            },
            data:['周一','周二','周三','周四','周五','周六','周日']
          },
          series:[
            {
              name:'最高气温',
              data:[11, 11, 50, 30, 12, 130, 10]
            }
          ]
        }
      })
      // // 饼图
      // McPieChart({
      //   options: {
      //     series:[
      //       {
      //         name:'最高气温',
      //         data:[
      //           {value:435, name:'直接访问'},
      //           {value:310, name:'邮件营销'},
      //           {value:234, name:'联盟广告'},
      //           {value:135, name:'视频广告'},
      //           {value:1548, name:'搜索引擎'}
      //         ]
      //       }
      //     ]
      //   },
      //   click: function (event, params) {
      //     console.log('11', event, params)
      //   },
      //   tooltipClick: function (event, params) {
      //     console.log('222', event, params)
      //   }
      // })
      // // 柱状图
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
      //         data:[-10, 10, 100, 20, 34, 47, 87]
      //       },
      //       {
      //         name:'最低气温',
      //         data:[-30, 55, 12, 23, -34, 42, 87]
      //       },
      //       {
      //         name:'最低气温',
      //         data:[38, 25, 34, 45, -34, 47, 87]
      //       }
      //     ]
      //   }
      // })
      // 柱状图
      // McPointChart({
      //   options: {
      //     xAxis:{
      //       data: []
      //     },
      //     yAxis:{
      //       name:'温度'
      //     },
      //     series:[
      //       {
      //         name:'最高气温',
      //         data: [
      //           {xVal:28604,yVal:77,num:17096869,name:'Australia'},
      //           {xVal:8604,yVal:50,num:17096869,name:'Australia'}
      //         ]
      //       }
      //     ]
      //   }
      // })
    }
    .height('50%')
  }
}