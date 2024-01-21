import { InterfaceObj } from '../../utils/chartInterface'
@Extend(Text) function fancy (tooltipInfo) {
  .fontSize(tooltipInfo.textStyle.fontSize || $r('app.float.fontSize'))
  .fontColor(tooltipInfo.textStyle.color || $r('app.float.color'))
  .fontWeight(tooltipInfo.textStyle.fontWeight || $r('app.float.fontWeight'))
  .fontFamily(tooltipInfo.textStyle.fontFamily || $r('app.float.fontFamily'))
}
@Component
export struct Tooltip {
  @Link @Watch('onTooltipInfoUpdated') tooltipInfo: InterfaceObj;
  @State x: number = -1000;
  @State y: number = -1000;

  onTooltipInfoUpdated (): void {
    const { x } = this.tooltipInfo.pos
    if (x + 40 !== this.x) {
      this.x = -10000
      this.y = -10000
    }
  }
  getPos (rect) {
    const { W, H, x, y } = this.tooltipInfo.pos
    const { width, height } = rect
    if (x + 40 + width > W - 10) {
      this.x = x - width + 20
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
      if(this.tooltipInfo.title) {
        Text(this.tooltipInfo.title)
          .fancy(this.tooltipInfo)
          .margin({
            bottom: 8
          })
      }
      ForEach(this.tooltipInfo.data, (item, index) => {
        Text(item.name + '：' + item.num)
          .fancy(this.tooltipInfo)
      })
    }
    .alignItems(HorizontalAlign.Start)
    .padding(this.tooltipInfo.padding)
    .backgroundColor(this.tooltipInfo.backgroundColor)
    .borderColor(this.tooltipInfo.borderColor)
    .borderWidth(this.tooltipInfo.borderWidth)
    .borderRadius(10)
    .position({
      x: this.x,
      y: this.y
    })
    .align(Alignment.Center)
    .onAreaChange((oldValue: Area, newValue: Area) => {
      this.getPos(newValue)
    })
  }
}