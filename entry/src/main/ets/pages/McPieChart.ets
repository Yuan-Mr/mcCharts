import {McBarChart, McPieChart, McPointChart} from '../components/index'
@Entry
@Component
struct Index {
  build() {
    Column() {
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
      //   // click: function (event, params) {
      //   //   console.log('11', event, params)
      //   // },
      //   // tooltipClick: function (event, params) {
      //   //   console.log('222', event, params)
      //   // }
      // })

      // // 柱状图-legend属性
      // McPieChart({
      //   options: {
      //     legend: {
      //       show: true,
      //       left: '50%', // 距离左侧位置
      //       top: '2%', // 距离顶部的位置
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
      //         data:[
      //           {value:435, name:'直接访问'},
      //           {value:310, name:'邮件营销'},
      //           {value:234, name:'联盟广告'},
      //           {value:135, name:'视频广告'},
      //           {value:1548, name:'搜索引擎'}
      //         ]
      //       }
      //     ]
      //   }
      // })

      // // 柱状图-tooltip属性
      // McPieChart({
      //   options: {
      //     tooltip: {
      //       show: true,
      //       type: 'default', // 渲染类型。可选值：default（默认）、custom（自定义）
      //       axisPointer: { // 提示线的配置
      //         type: 'line',
      //         lineStyle: {
      //           color: '#000',
      //           width: 2,
      //           type: 'solid'
      //         }
      //       },
      //       backgroundColor: '#97cccccc', // 背景颜色
      //       borderColor: '#333',
      //       borderWidth: 1,
      //       padding: 20,
      //       textStyle: { // 文本样式配置
      //         color: '#000',
      //         fontWeight: 'normal',
      //         fontFamily: 'sans-serif',
      //         fontSize: 18
      //       }
      //     },
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
      //   }
      // })

      // // 柱状图-series属性
      // McPieChart({
      //   options: {
      //     series:[
      //       {
      //         name:'最高气温',
      //         label: {
      //           show: true,
      //           color: '#fffa6262',
      //           fontWeight: '600',
      //           fontFamily: 'sans-serif',
      //           position: 'center',
      //           fontSize: 30,
      //           formatter: (params) => {
      //             return 'name：' + params.name
      //           },
      //           distanceToLabelLine: 10
      //         },
      //         labelLine: {
      //           show: true, // 默认开启，如果当label的position的值不是outside，则自动隐藏
      //           length: 10,
      //           length2: 20,
      //           lineStyle: {
      //             color: '#000',
      //             width: 1,
      //             type: 'solid'
      //           }
      //         },
      //         emphasis: {
      //           scale: true,
      //           scaleSize: 10,
      //           shadowColor: 'rgba(248, 57, 57, 1.00)',
      //           shadowBlur: 20,
      //           shadowOffsetX: 10,
      //           shadowOffsetY: 10
      //         },
      //         data:[
      //           {value:435, name:'直接访问'},
      //           {value:310, name:'邮件营销'},
      //           {value:234, name:'联盟广告'},
      //           {value:135, name:'视频广告'},
      //           {value:1548, name:'搜索引擎'}
      //         ]
      //       }
      //     ]
      //   }
      // })

      // 环形
      McPieChart({
        options: {
          series:[
            {
              name:'最高气温',
              radius: ['80%', '50%'], // 饼图内半径、内半径
              center: ['40%', '60%'], // 饼图中心位置
              data:[
                {value:435, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
              ]
            }
          ]
        }
      })
    }
    .height('50%')
  }
}