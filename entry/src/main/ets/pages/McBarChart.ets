import {
  McLineChart,
  McBarChart,
  McPieChart,
  McPointChart,
  Options,
  chartInterface,
  McRadarChart
} from '../components/index'

@Entry
@Component
struct mcBarChart {
  @State defOption: Options = new Options({
    xAxis:{
      data:['周一','周二','周三','周四','周五','周六','周日']
    },
    series:[
      {
        name:'最高气温',
        data:[11, 11, 15, 13, 12, 130, 10]
      }
    ]
  })

  @State xAxisOption: Options = new Options({
    xAxis: {
      axisLine: { // 轴线样式
        show: true, // 是否显示
        lineStyle: {
          color: '#333'
        }
      },
      axisTick: { // 刻度线配置
        show: false, // 是否显示
      },
      axisLabel: {  // x轴文本标签样式
        color: '#333',
        fontWeight: '600',
        fontSize: 22
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] // 数据
    },
    yAxis: {
      name: '温度'
    },
    series: [
      {
        name: '最高气温',
        data: [11, 11, 15, 13, 12, 130, 10]
      }
    ]
  })

  @State yAxisOption: Options = new Options({
    xAxis:{
      data: ['周一','周二','周三','周四','周五','周六','周日'] // 数据
    },
    yAxis:{
      name: '单位/摄氏度', // 坐标名称
      nameTextStyle: { // 名称样式
        color: '#000'
      },
      axisLine: { // 轴线样式
        show: false, // 是否显示
        lineStyle: {
          color: '#000',
          width: 1
        }
      },
      axisTick: { // 刻度线配置
        show: false, // 是否显示
        interval: 6, // 与文本的间隔
        length: 10, // 刻度的长度
        lineStyle: {
          color: '#000', // 刻度线颜色
          width: 1 // 刻度线宽度
        }
      },
      splitLine: { // 坐标轴中的分隔线。
        show: true,
        lineStyle: {
          // color: '#000',
          width: 1
        }
      },
      axisLabel: {  // x轴文本标签样式
        color: '#000',
        fontWeight: '600',
        fontFamily: 'sans-serif',
        fontSize: 20,
        margin: 0
      },
      formatter: (name: string) => { // 自定义文本标签
        return name + '°C'
      }
    },
    series:[
      {
        name:'最高气温',
        data:[11, 11, 15, 13, 12, 130, 10]
      }
    ]
  })

  @State legendOption: Options = new Options({
    xAxis:{
      data: ['周一','周二','周三','周四','周五','周六','周日'] // 数据
    },
    legend: {
      left: '80%', // 距离左侧位置
      top: '2%', // 距离顶部的位置
      itemGap: 20, // 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
      itemTextGap: 10, // 图例图例之间的间隔。
      itemHeight: 10, // 图例标记的图形高度。
      textStyle: {
        color: '#000',
        fontWeight: '600',
        fontFamily: 'sans-serif',
        fontSize: 24
      }
    },
    series:[
      {
        name:'最高气温',
        data:[11, 11, 15, 13, 12, 130, 10]
      },
      {
        name:'最高气温2',
        data:[11, 11, 15, 13, 12, 130, 10]
      }
    ]
  })


  @State tooltipOption: Options = new Options({
    xAxis:{
      data: ['周一','周二','周三','周四','周五','周六','周日'] // 数据
    },
    tooltip: {
      borderColor: '#f72659f5',
      borderWidth: 1,
      backgroundColor: '#fff',
      textStyle: { // 文本样式配置
        color: '#000'
      }
    },
    series:[
      {
        name:'最高气温',
        data:[11, 11, 15, 13, 12, 130, 10]
      }
    ]
  })


  // 存在负数的时候异常，需要处理
  @State seriesOption: Options = new Options({
    xAxis:{
      data: ['周一','周二','周三','周四','周五','周六','周日'] // 数据
    },
    series:[
      {
        name:'最高气温',
        color: '#ff2659f5', // 自定义颜色
        barStyle: { // 柱子的样式配置
          color: '',
          width: 10,
          borderRadius: true
        },
        label: {
          show: true,
          color: '#fffa6262',
          fontWeight: '600',
          fontFamily: 'sans-serif',
          position: '',
          fontSize: 30,
          formatter: (params: chartInterface.InterfaceObj): string => {
            return params.name
          },
          distanceToLabelLine: 10
        },
        // stack: 'total', // 是否显示堆叠柱子
        data: [11, 11, 35, 13, 12, 130, 100] // 数据
      },
      {
        name:'最高气温',
        barStyle: { // 柱子的样式配置
          color: ''
        },
        label: {
          show: true,
          color: '#fffa6262',
          fontWeight: '600',
          fontFamily: 'sans-serif',
          position: '',
          fontSize: 30,
          formatter: (params: chartInterface.InterfaceObj): string => {
            return params.name
          },
          distanceToLabelLine: 10
        },
        // stack: 'total', // 是否显示堆叠柱子
        data: [11, 11, 15, 13, 12, 130, 100] // 数据
      },
      {
        name:'最高气温',
        barStyle: {
          borderRadius: true
        },
        label: {
        },
        // stack: 'total', // 是否显示堆叠柱子
        data: [11, 11, 15, 13, 12, 130, 200] // 数据
      }
    ]
  })

  @State dataZoomOption: Options = new Options({
    xAxis:{
      axisLabel: {
        interval: 0,
        fontSize: 18,
        overflow: 'breakAll'
      },
      data: ['周一周一周一周一周一','周三周三周三周三周三','周三','周四','周五','周六','周日', '周一','周二','周三','周四','周五','周六','周日'] // 数据
    },
    dataZoom: {
      show: true,
      start: 3,
      end: 8
    },
    series: [
      {
        name: '最高气温',
        data: [10, 10, 120, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: '最高气温1',
        data: [10, 3, 20, 20, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0]
      }
    ]
  })

  @Builder
  customTooltip($$: chartInterface.InterfaceObj) {
    if ($$.tooltipInfo.title) {
      Text($$.tooltipInfo.title)
    }
    ForEach($$.tooltipInfo.data, (item: chartInterface.InterfaceObj, index) => {
      Text(item.name + '：' + item.num)
    })
  };

  aboutToAppear() {
    setTimeout(() => {
      // 使用Option实例对象的setVal方法来实现，修改什么属性就传什么
      this.seriesOption.setVal({
        series:[
          {
            data: [-101, 110, -150, 193, 112, -13, 10] // 数据
          },
          {
            data: [-71, 211, 15, 13, 12, -130, -100] // 数据
          },
          {
            data: [11, -11, -15, -13, -12, 130, 0] // 数据
          }
        ]
      })
    }, 2000)
    // this.defOption.setVal({
    //   xAxis:{
    //     axisLabel: {  // x轴文本标签样式
    //       color: '#000',
    //       fontWeight: '600',
    //       fontSize: 25
    //     },
    //     data: ['周一二','周二','周三','周四','周五','周六','周日'] // 数据
    //   },
    //   series: [
    //     {
    //       name:'最高气温1',
    //       data:[100, -100, 100]
    //     }
    //   ]
    // })
  }

  build() {
    Row() {
      // McBarChart({
      //   options: this.defOption
      // })

      // McBarChart({
      //   options: this.xAxisOption
      // })

      // McBarChart({
      //   options: this.yAxisOption
      // })

      // McBarChart({
      //   options: this.legendOption
      // })

      // McBarChart({
      //   options: this.tooltipOption
      // })

      // McBarChart({
      //   options: this.tooltipOption,
      //   customTooltip: this.customTooltip
      // })

      McBarChart({
        options: this.seriesOption
      })

      // 这里要处理一下动画效果
      // McBarChart({
      //   options: this.dataZoomOption
      // })


    }
    .height(300)
  }
}