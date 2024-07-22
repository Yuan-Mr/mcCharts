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
struct mcPieChart {
  @State seriesOption: Options = new Options({
    // title: {
    //   show: true,
    //   text: '程序员学习分布', // 主标题文本
    //   subtext: '100% 占比', // 副标题文本
    // },
    // tooltip: {
    //   borderColor: '#f72659f5',
    //   borderWidth: 1,
    //   backgroundColor: '#fff',
    //   textStyle: { // 文本样式配置
    //     color: '#000'
    //   }
    // },
    series:[
      {
        radius: ['60%', '50%'], // 饼图外半径
        // label: { // 文本标签的配置
        //   show: false
        // },
        data:[
          {value:10, name:'鸿蒙'},
          {value:30, name:'Java'},
          {value:34, name:'JavaScript'},
          {value:21, name:'Python'}
        ]
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
  aboutToAppear(): void {
    setTimeout(() => {
      this.seriesOption.setVal({
        series: [
          {
            data: [
              { value: 40, name: '鸿蒙' },
              { value: 30, name: 'Java' },
              { value: 34, name: 'JavaScript' },
              { value: 21, name: 'Python' }
            ]
          }
        ]
      })
    }, 2000)
  }
  build() {
    Row() {
      McPieChart({
        options: this.seriesOption
      })
    }
    .height('50%')
  }
}