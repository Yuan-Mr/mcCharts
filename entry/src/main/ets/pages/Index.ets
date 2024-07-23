import window from '@ohos.window';
import router from '@ohos.router';
import {
  McLineChart,
  McBarChart,
  McHorBarChart,
  McPieChart,
  McPointChart,
  Options,
  chartInterface,
  McRadarChart
} from '../components/index'

@Extend(Text)
function fancy(tooltipInfo: chartInterface.InterfaceObj) {
  .fontSize(tooltipInfo.textStyle.fontSize || 14)
  .fontColor(tooltipInfo.textStyle.color || '#fff')
  .fontWeight(tooltipInfo.textStyle.fontWeight || 'normal')
  .fontFamily(tooltipInfo.textStyle.fontFamily || 'sans-serif')
}

@Entry
@Component
struct Index {
  @State defOption: Options = new Options({
    xAxis: {
      type: 'value',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // axisLabel: {
      //   interval: 0
      // },
    },
    yAxis: {
      type: 'category',
      name: '温度'
    },
    series: [
      {
        name: '最高气温',
        barStyle: {
            width: 20,
            borderRadius:10,

        },
        data: [11,13,15]
      },
    ]
  })
  // @State defOption: Options = new Options({
  //   series:[
  //     {
  //       name:'最高气温',
  //       data: [
  //         {value:435, name:'直接访问'},
  //         {value:310, name:'邮件营销'},
  //         {value:234, name:'联盟广告'},
  //         {value:135, name:'视频广告'},
  //         {value:1548, name:'搜索引擎'}
  //       ]
  //     }
  //   ]
  // })

  // @State defOption: Options = new Options({
  //   xAxis:{
  //     data:['周一', '周一']
  //   },
  //   yAxis:{
  //     name:'温度'
  //   },
  //   series:[
  //     {
  //       name:'最高气温',
  //       data:[30, 60],
  //       stack: 'stack1',
  //       barStyle: {
  //         width: 20
  //       }
  //     },
  //     {
  //       name:'最高气温2',
  //       data:[60, 10],
  //       stack: 'stack1',
  //       barStyle: {
  //         width: 20
  //       }
  //     },
  //     {
  //       name:'最高气温3',
  //       data:[60, 10],
  //       stack: 'stack2',
  //       barStyle: {
  //         width: 20
  //       }
  //     },
  //     {
  //       name:'最高气温3',
  //       data:[60, 10],
  //       stack: 'stack2',
  //       barStyle: {
  //         width: 20
  //       }
  //     },
  //     {
  //       name:'最高气温3',
  //       data:[60, 10],
  //       stack: 'stack2',
  //       barStyle: {
  //         width: 20
  //       }
  //     }
  //   ]
  // })
  @State defRadarOption: Options = new Options({
    radar: {
      indicator: [
        { name: 'Sales' },
        { name: 'Administration' },
        { name: 'Information Technology' },
        { name: 'Customer Support' },
        { name: 'Development' },
        { name: 'Marketing' }
      ]
    },
    series: [
      {
        name: '最高气温',
        // areaStyle: {
        //   color: {
        //     direction: [0, 1, 0, 0],
        //     colors: [
        //       {
        //         offset: 0,
        //         color: 'red'
        //       },
        //       {
        //         offset: 1,
        //         color: '#ff265fe5'
        //       }
        //     ]
        //   }
        // },
        data: [110, 120, 15, 13, 12, 10, 10]
      },
      {
        name: '最高气温2',
        // areaStyle: {
        //   color: {
        //     direction: [0, 1, 0, 0],
        //     colors: [
        //       {
        //         offset: 0,
        //         color: 'red'
        //       },
        //       {
        //         offset: 1,
        //         color: '#ff265fe5'
        //       }
        //     ]
        //   }
        // },
        data: [10, 120, 105, 130, 12, 10, 10]
      },
    ]
  })

  @Builder
  customTooltip($$: chartInterface.InterfaceObj) {
    if ($$.tooltipInfo.title) {
      Text($$.tooltipInfo.title)
        .fancy($$.tooltipInfo)
        .margin({
          bottom: 8
        })
    }
    ForEach($$.tooltipInfo.data, (item: chartInterface.InterfaceObj, index) => {
      Text(item.name + '：' + item.num)
        .fancy($$.tooltipInfo)
    })
  };

  aboutToAppear() {
  }

  build() {
    Column() {
      // 折线图 McBarChart McHorBarChart
      McHorBarChart({
        options: this.defOption
      })
      // 饼图
      // McPieChart({
      //   options: this.defOption
      //   // click: function (event, params) {
      //   //   console.log('11', event, params)
      //   // },
      //   // tooltipClick: function (event, params) {
      //   //   console.log('222', event, params)
      //   // }
      // })

      // McBarChart({
      //   options: this.defOption
      // })

      // // 雷达图
      // McRadarChart({
      //   options: this.defRadarOption
      // })

    }
    .height('50%')
  }
}