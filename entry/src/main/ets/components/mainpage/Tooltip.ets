import { InterfaceObj } from '../../utils/chartInterface'
@Builder
function globalBuilder($$: InterfaceObj) {
  Column() {
    if($$.tooltipInfo.title) {
      Text($$.tooltipInfo.title)
        .fancy($$.tooltipInfo)
        .margin({
          bottom: 8
        })
    }
    ForEach($$.tooltipInfo.data, (item: InterfaceObj, index) => {
      Text(item.name + '：' + item.num)
        .fancy($$.tooltipInfo)
    })
  }
  .alignItems(HorizontalAlign.Start)
  .padding($$.tooltipInfo.padding)
  .backgroundColor($$.tooltipInfo.backgroundColor)
  .borderColor($$.tooltipInfo.borderColor)
  .borderWidth($$.tooltipInfo.borderWidth)
  .borderRadius(10)
}

@Extend(Text) function fancy (tooltipInfo: InterfaceObj) {
  .fontSize(tooltipInfo.textStyle.fontSize || 14)
  .fontColor(tooltipInfo.textStyle.color || '#fff')
  .fontWeight(tooltipInfo.textStyle.fontWeight || 'normal')
  .fontFamily(tooltipInfo.textStyle.fontFamily ||'sans-serif')
}

export {
  globalBuilder
}

@Component
export struct Tooltip {
  @Link @Watch('onTooltipInfoUpdated') tooltipInfo: InterfaceObj;
  @State x: number = -1000;
  @State y: number = -1000;
  // 自定义提示组件
  @BuilderParam customTooltip: (tooltipInfo: InterfaceObj) => void = globalBuilder;

  onTooltipInfoUpdated (): void {
    const pos: InterfaceObj = this.tooltipInfo.pos
    const x: number = pos.x
    if (x + 40 !== this.x) {
      this.x = -10000
      this.y = -10000
    }
  }
  getPos (rect: InterfaceObj) {
    const pos: InterfaceObj = this.tooltipInfo.pos
    const W: number = pos.W
    const H: number = pos.H
    const x: number = pos.x
    const y: number = pos.y
    const width: number = rect.width
    const height: number = rect.height
    if (x + 40 + width > W - 10) {
      this.x = Math.max(x - width + 20, 10)
    } else {
      this.x = x + 40
    }
    if (y !== undefined) {
      if (y + 40 + height > H - 10) {
        this.y = y - height + 20
      } else {
        this.y = y
      }
    } else {
      this.y = H / 2 - height / 2
    }
  }
  build() {
    Column () {
      this.customTooltip({
        tooltipInfo: this.tooltipInfo
      })
    }
    .alignItems(HorizontalAlign.Start)
    .position({
      x: this.x,
      y: this.y
    })
    .onAreaChange((oldValue: Area, newValue: Area) => {
      this.getPos(newValue)
    })
  }
}