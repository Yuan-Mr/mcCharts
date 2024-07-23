import { Chart } from "@bundle:com.example.mccharts/entry/ets/utils/charts";
import { calculateNum, drawTexts, drawBreakText } from "@bundle:com.example.mccharts/entry/ets/utils/index";
import { lineStyle as commonLineStyle, axisLineStyle, yLineStyle, label as commonLabel, itemStyle as commonItemStyle, areaStyle as commonAreaStyle } from "@bundle:com.example.mccharts/entry/ets/utils/defaultOption";
/**
 * 折线图
 */
class DrawLine extends Chart {
    constructor() {
        super('line');
    }
    bindEvent(e, callback) {
        const { xl, xStart, xEnd } = this.getXdataLength();
        const xs = (this.W - this.cPaddingL - this.cPaddingR) / ((xEnd - xStart) || 1);
        let index = 0;
        let dataIndex = 0;
        let isLegend = false;
        let pos = {
            x: e.localX,
            y: e.localY
        };
        if (isLegend || this.drawing)
            return;
        // 鼠标位置在图表中时
        if (pos.y > this.cPaddingT && pos.y < this.H - this.cPaddingB && pos.x > this.cPaddingL && pos.x < this.W - this.cPaddingR) {
            // canvas.style.cursor = 'pointer';
            for (let i = 0; i < (xEnd - xStart); i++) {
                if (pos.x > i * xs + this.cPaddingL) {
                    index = i;
                    dataIndex = i + xStart;
                }
            }
            const obj = this.animateArr[0].data[index];
            if (!obj)
                return;
            this.clearGrid(index);
            // 获取处于当前位置的信息
            let arr = [];
            for (let j = 0, item, l = this.animateArr.length; j < l; j++) {
                item = this.animateArr[j];
                if (item.hide)
                    continue;
                arr.push({ name: item.name, num: item.data[index].num });
            }
            // this.showInfo(pos, this.xAxis.data[index], arr);
            // console.log('callback', JSON.stringify(arr))
            callback(true, e, {
                x: obj.x,
                W: this.W,
                H: this.H,
            }, this.xAxis.data[dataIndex], arr, this.tooltip);
        }
        else {
            this.clearGrid();
            callback(false, e);
        }
    }
    clearGrid(index?) {
        let that = this;
        let obj;
        let r = 2;
        let ctx = this.ctx;
        let nameH = 0;
        if (this.yAxis && !Array.isArray(this.yAxis) && this.yAxis.name) {
            nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
        }
        ctx.clearRect(0, 0, that.W, that.H);
        // 画坐标系
        this.drawAxis();
        // 画标签
        this.drawLegend(this.series);
        // 画y轴刻度
        this.drawY();
        ctx.save();
        ctx.translate(that.cPaddingL, that.H - that.cPaddingB);
        // 画标志线
        if (typeof index === 'number') {
            const { axisPointer = {} } = that.tooltip;
            const { type = 'line', lineStyle = {}, shadowStyle } = axisPointer;
            ctx.beginPath();
            obj = that.animateArr[0].data[index];
            ctx.lineWidth = lineStyle.width || 1;
            ctx.strokeStyle = lineStyle.color || '#DDE2EB';
            ctx.moveTo(obj.x, -(that.H - that.cPaddingT - that.cPaddingB - nameH));
            ctx.lineTo(obj.x, 0);
            ctx.stroke();
        }
        for (let i = 0, item, il = that.animateArr.length; i < il; i++) {
            item = that.animateArr[i];
            if (item.hide)
                continue;
            const { lineStyle = {}, itemStyle = {}, color: itemColor, label = {}, data = [], smooth = false, areaStyle = {} } = item;
            const { color = '', width = 1 } = { ...commonLineStyle, ...(lineStyle || {}) };
            const { symbol = commonItemStyle.symbol, symbolSize = commonItemStyle.symbolSize, symbolColor = commonItemStyle.symbolColor, borderWidth = commonItemStyle.borderWidth, borderType = commonItemStyle.borderType, borderColor = commonItemStyle.borderColor } = itemStyle;
            that.setCtxStyle({
                strokeStyle: color || itemColor,
                lineWidth: width
            });
            ctx.beginPath();
            that.drawSmoothLine(ctx, data, smooth, areaStyle);
            const { show: labelShow = commonLabel.show, color: labelColor = commonLabel.color, fontWeight = commonLabel.fontWeight, fontFamily = commonLabel.fontFamily, fontSize = commonLabel.fontSize } = label;
            // 画完曲线后再画圆球
            for (let j = 0, jl = item.data.length; j < jl; j++) {
                obj = item.data[j];
                if (symbol === 'solidCircle' || j === index) {
                    ctx.beginPath();
                    ctx.arc(obj.x, -obj.h, (symbolSize + borderWidth) * (index === j ? 1.5 : 1), 0, Math.PI * 2, false);
                    ctx.fillStyle = borderColor || itemColor;
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(obj.x, -obj.h, symbolSize * (index === j ? 1.5 : 1), 0, Math.PI * 2, false);
                    ctx.fillStyle = symbolColor || itemColor;
                    ctx.fill();
                }
                // 绘画拐点标签
                if (labelShow) {
                    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
                    ctx.fillStyle = labelColor;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const text = String(obj.num);
                    const textWidth = ctx.measureText(text).width; // 获取文字的长度
                    const textHeight = ctx.measureText(text).height; // 获取文字的长度
                    const symbolH = ((symbolSize + borderWidth) / 2) * (index === j ? 2 : 1);
                    ctx.fillText(text, obj.x, -obj.h - textHeight - symbolH);
                }
            }
        }
        ctx.restore();
    }
    animate() {
        let that = this;
        let ctx = this.ctx;
        let xdis = that.W - that.cPaddingL * 2;
        let prev;
        let h = 0;
        let x = 0;
        let y = 0;
        let isStop = true;
        let animateIndexs = [];
        let animateIndex = 0;
        let dataLength = [];
        that.drawing = true;
        function run() {
            // ctx.clearRect(that.cPaddingL, that.cPaddingT, that.W - that.cPaddingL - that.cPaddingT, that.H - that.cPaddingB - that.cPaddingT)
            ctx.save();
            ctx.translate(that.cPaddingL, that.H - that.cPaddingB);
            for (let i = 0, item, il = that.animateArr.length; i < il; i++) {
                item = that.animateArr[i];
                const { lineStyle = {}, itemStyle = {}, color: itemColor, label = {}, smooth = false, data = [], areaStyle = {} } = item;
                if (item.hide || !data || !data.length)
                    continue;
                ctx.beginPath();
                const { color = '', width = 2 } = { ...commonLineStyle, ...(lineStyle || {}) };
                const { show: labelShow = commonLabel.show, color: labelColor = commonLabel.color, fontWeight = commonLabel.fontWeight, fontFamily = commonLabel.fontFamily, fontSize = commonLabel.fontSize } = label;
                that.setCtxStyle({
                    strokeStyle: color || itemColor,
                    lineWidth: width
                });
                that.drawSmoothLine(ctx, data, smooth, areaStyle);
                // animateIndexs.push(animateIndex)
                // dataLength.push(data.length)
                const { symbol = commonItemStyle.symbol, symbolSize = commonItemStyle.symbolSize, symbolColor = commonItemStyle.symbolColor, borderWidth = commonItemStyle.borderWidth, borderType = commonItemStyle.borderType, borderColor = commonItemStyle.borderColor } = itemStyle;
                // 画完曲线后再画圆球
                for (let j = 0, obj, jl = data.length; j < jl; j++) {
                    // if (j < animateIndex) {
                    obj = data[j];
                    obj.y = obj.p = obj.h;
                    // 绘画拐点样式--画实心圆
                    if (symbol === 'solidCircle') {
                        ctx.beginPath();
                        ctx.arc(obj.x, -obj.h, (symbolSize + borderWidth), 0, Math.PI * 2, false);
                        ctx.fillStyle = borderColor || itemColor;
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(obj.x, -obj.h, symbolSize, 0, Math.PI * 2, false);
                        ctx.fillStyle = symbolColor || itemColor;
                        ctx.fill();
                    }
                    // 绘画拐点标签
                    if (labelShow && !obj.isLabel) {
                        obj.isLabel = true;
                        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
                        ctx.fillStyle = labelColor;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        const text = String(obj.num);
                        const textWidth = ctx.measureText(text).width; // 获取文字的长度
                        const textHeight = ctx.measureText(text).height; // 获取文字的长度
                        const symbolH = (symbolSize + borderWidth) / 2;
                        ctx.fillText(text, obj.x, -obj.h - textHeight - symbolH);
                    }
                    // } else {
                    //   break
                    // }
                }
            }
            ctx.restore();
            if (Math.max(...animateIndexs) == Math.max(...dataLength)) {
                that.drawing = false;
                return;
            }
            // setTimeout(() => {
            //   run()
            // }, 1000 / 20)
        }
        run();
    }
    drawSmoothLine(ctx, data, smooth, areaStyle) {
        const { color = commonAreaStyle.color } = areaStyle;
        let f = smooth ? 0.5 : 0.01;
        const points = data.map(item => {
            return { x: item.x, y: -item.h };
        });
        ctx.moveTo(points[0].x, points[0].y);
        let dx1 = 0;
        let dy1 = 0;
        let dx2 = 0;
        let dy2 = 0;
        let prevPoint = points[0];
        let nextPoint = null;
        for (let i = 1; i < points.length; i++) {
            // if (i <= animateIndex) {
            let currtPoint = points[i];
            nextPoint = points[i + 1];
            if (nextPoint) {
                dx2 = -(nextPoint.x - currtPoint.x) * f;
            }
            else {
                dx2 = 0;
                dy2 = 0;
            }
            ctx.bezierCurveTo(prevPoint.x - dx1, prevPoint.y - dy1, currtPoint.x + dx2, currtPoint.y + dy2, currtPoint.x, currtPoint.y);
            dx1 = dx2;
            dy1 = dy2;
            prevPoint = currtPoint;
        }
        // }
        ctx.stroke();
        if (color) {
            ctx.lineTo(data[points.length - 1].x, 0);
            ctx.lineTo(data[0].x, 0);
            if (typeof color === 'string') {
                ctx.fillStyle = color;
            }
            else if (typeof color === 'object') {
                const { direction = [0, 1, 0, 0], colors = [] } = color || {};
                const gradient = ctx.createLinearGradient(this.W / 2 * (direction[0] || 0), -this.H * (direction[1] || 1), this.W / 2 * (direction[2] || 0), -this.H * (direction[0] || 0));
                colors.forEach(item => {
                    gradient.addColorStop(item.offset, item.color);
                });
                ctx.fillStyle = gradient;
            }
            ctx.fill();
        }
        // animateIndex += 1
        // return animateIndex
    }
    create() {
        // 画坐标系
        this.drawAxis();
        // 组织数据
        this.initData();
        // 画标签
        this.drawLegend(this.series);
        // 画y轴刻度
        this.drawY();
        // 执行动画
        this.animate();
    }
    initData() {
        let that = this;
        const { xl, xStart, xEnd } = this.getXdataLength();
        let xs = (this.W - this.cPaddingL - this.cPaddingR) / ((xEnd - xStart) || 1);
        let ydis = this.H - this.cPaddingB - this.cPaddingT;
        let sl = 0;
        let min = 0;
        let max = 0;
        let item;
        let obj;
        let arr = [];
        if (!this.series.length) {
            return;
        }
        for (let i = 0; i < this.series.length; i++) {
            item = this.series[i];
            if (!item.data || !item.data.length) {
                this.series.splice(i--, 1);
                continue;
            }
            // 赋予没有颜色的项
            if (!item.color) {
                item.color = this.color[i];
            }
            item.name = item.name || 'unnamed';
            if (item.hide)
                continue;
            sl++;
            arr = arr.concat(item.data.slice(xStart, xEnd));
        }
        // 计算数据在Y轴刻度
        this.info = calculateNum(arr);
        min = this.info.min;
        max = this.info.max;
        for (let i = 0; i < this.series.length; i++) {
            item = this.series[i];
            if (!this.animateArr[i]) {
                obj = Object.assign({}, {
                    i: i,
                    isStop: true,
                    xl: 0,
                    create: true,
                    ...item,
                    hide: !!item.hide,
                    name: item.name,
                    color: item.color,
                    data: []
                });
                item.data.slice(xStart, xEnd).forEach((d, j) => {
                    obj.data.push({
                        num: d,
                        h: (d - min) / (max - min) * ydis,
                        p: 0,
                        x: Math.round(xs * (j + 1) - xs / 2),
                        y: 0
                    });
                });
                this.animateArr.push(obj);
            }
            else { // 更新
                if (that.animateArr[i].hide && !item.hide) {
                    that.animateArr[i].create = true;
                    that.animateArr[i].xl = 0;
                }
                else {
                    that.animateArr[i].create = false;
                }
                that.animateArr[i].hide = item.hide;
                item.data.slice(0, xl).forEach((d, j) => {
                    that.animateArr[i].data[j].h = Math.floor((d - min) / (max - min) * ydis + 2);
                });
            }
        }
    }
    drawAxis() {
        let that = this;
        const { xl, xStart, xEnd, zoomShow } = this.getXdataLength();
        let ctx = this.ctx;
        let W = this.W;
        let H = this.H;
        let cPaddingL = this.cPaddingL;
        let cPaddingR = this.cPaddingR;
        let cPaddingT = this.cPaddingT;
        let cPaddingB = this.cPaddingB;
        const xWidth = W - cPaddingL - cPaddingR;
        let xs = xWidth / ((xEnd - xStart) || 1); // x轴单位数，每个单位长度
        // this.xs = xs
        // ctx.clearRect(0, 0, W, H)
        // x轴
        ctx.save();
        ctx.translate(cPaddingL, H - cPaddingB);
        const { axisTick, splitLine, axisLine = {}, axisLabel, formatter, data } = this.xAxis;
        const { show: axisLineShow = true } = axisLine;
        const { show: axisTickShow = true, interval = 4, length: axisTickLength = 5, lineStyle = axisLineStyle } = axisTick || {};
        if (axisLineShow) {
            const { color = '#DDE2EB', width = 1 } = { ...axisLineStyle, ...(axisLine.lineStyle || {}) };
            this.setCtxStyle({
                strokeStyle: color,
                lineWidth: width
            });
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(W - cPaddingL - cPaddingR, 0);
            ctx.stroke();
        }
        // x轴刻度
        if (this.xAxis) {
            // 获取是否滚动
            let xInterval = 1;
            const { color = '#999999', fontWeight = 'normal', fontSize = 22, fontFamily = 'sans-serif', overflow = 'none', margin = 5 } = axisLabel;
            // 先判断是否已经超出整条x轴线长度了
            const { interval: axisLabelInterval = 'auto' } = axisLabel;
            if (!zoomShow) {
                xInterval = axisLabelInterval === 'auto' ? 1 : (Math.max(axisLabelInterval, 1) + 1);
                if (axisLabelInterval === 'auto') {
                    let maxTextWidth = 0;
                    data.forEach((obj, i) => {
                        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
                        this.ctx.fillStyle = color;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        obj = String(formatter ? formatter(obj) : obj);
                        const txtW = this.ctx.measureText(obj).width; // 获取文字的长度
                        maxTextWidth += txtW;
                    });
                    if (maxTextWidth > xWidth * 0.8) {
                        xInterval = Math.round(maxTextWidth / (xWidth)) + 1;
                    }
                }
            }
            for (let i = 0; i < (xEnd - xStart); i++) {
                let obj = data[i + xStart];
                let x = xs * (i + 1);
                if (axisTickShow) {
                    const { color = '#DDE2EB', width = 1 } = { ...axisLineStyle, ...(axisTick.lineStyle || {}) };
                    ctx.beginPath();
                    this.setCtxStyle({
                        strokeStyle: color,
                        lineWidth: width
                    });
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, axisTickLength);
                    ctx.stroke();
                }
                this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
                this.ctx.fillStyle = color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                if (i % xInterval === 0 || axisLabelInterval === 0) {
                    obj = String(formatter ? formatter(obj) : obj);
                    // 这里后续可以支持设置文字与x轴的距离
                    const textX = x - xs / 2;
                    const textY = axisTickLength + margin;
                    let textI = obj.length;
                    if (overflow === 'truncate') {
                        textI = drawTexts(ctx, obj, xs);
                        ctx.fillText(obj.substring(0, textI) + (textI !== obj.length ? '...' : ''), textX, textY);
                    }
                    else if (overflow === 'breakAll') {
                        drawBreakText(ctx, obj, xs, {
                            x: textX,
                            y: textY
                        });
                    }
                    else {
                        ctx.fillText(obj.substring(0, textI), textX, textY);
                    }
                }
            }
        }
        ctx.restore();
    }
    drawY() {
        if (!Array.isArray(this.yAxis)) {
            const { axisTick, splitLine, axisLine, axisLabel, nameTextStyle, nameGap = 5 } = this.yAxis;
            const { show: axisTickShow = true, interval: axisTickInterval = 4, length: axisTickLength = 5, lineStyle = axisLineStyle } = axisTick || {};
            const { show: splitLineShow = true } = splitLine || {};
            let ctx = this.ctx;
            let nameH = 0;
            if (this.yAxis && this.yAxis.name) {
                const { color = '#999', fontWeight = 'normal', fontSize = 22, fontFamily = 'sans-serif' } = nameTextStyle;
                this.ctx.fillStyle = color;
                this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
                ctx.textBaseline = 'middle';
                nameH = this.ctx.measureText(this.yAxis.name).height; // 获取文字的长度
                const nameW = this.ctx.measureText(this.yAxis.name).width; // 获取文字的长度
                ctx.fillText(this.yAxis.name, this.cPaddingL - nameW / 2, this.cPaddingT - nameGap);
            }
            let xdis = this.W - this.cPaddingL - this.cPaddingR;
            let ydis = this.H - this.cPaddingB - this.cPaddingT - nameH;
            let yl = this.info.num;
            let ys = ydis / yl;
            // 画Y轴刻度
            ctx.save();
            // ctx.fillStyle = 'hsl(200,100%,60%)'
            ctx.translate(this.cPaddingL, this.H - this.cPaddingB);
            for (let i = 0; i <= yl; i++) {
                if (axisTickShow) {
                    const { color = '#DDE2EB', width = 1 } = { ...axisLineStyle, ...(axisTick.lineStyle || {}) };
                    ctx.beginPath();
                    this.setCtxStyle({
                        strokeStyle: color,
                        lineWidth: width
                    });
                    ctx.moveTo(-axisTickLength, -Math.floor(ys * i));
                    ctx.lineTo(0, -Math.floor(ys * i));
                    ctx.stroke();
                }
                if (i > 0 && splitLineShow) {
                    const { color = '#DDE2EB', width = 1 } = { ...yLineStyle, ...(splitLine.lineStyle || {}) };
                    this.setCtxStyle({
                        strokeStyle: color,
                        lineWidth: width
                    });
                    ctx.beginPath();
                    ctx.moveTo(0, -Math.floor(ys * i));
                    ctx.lineTo(xdis, -Math.floor(ys * i));
                    ctx.stroke();
                }
                const { color = '#999', fontWeight = 'normal', fontSize = 22, fontFamily = 'sans-serif', margin = 0 } = axisLabel;
                this.ctx.fillStyle = color;
                this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                let dim = Math.floor(this.info.step * i + this.info.min);
                let txt = String(this.yAxis.formatter ? this.yAxis.formatter(dim) : dim);
                const txtH = this.ctx.measureText(txt).height; // 获取文字的长度
                const interval = (axisTickShow ? -(axisTickInterval + axisTickLength) : -8) - margin;
                ctx.fillText(txt, interval, -ys * i);
            }
            const { show: axisLineShow = true } = axisLine;
            // y轴
            if (axisLineShow) {
                const { color = '#DDE2EB', width = 1 } = { ...axisLineStyle, ...(axisLine.lineStyle || {}) };
                this.setCtxStyle({
                    strokeStyle: color,
                    lineWidth: width
                });
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, this.cPaddingB + this.cPaddingT + nameH - this.H);
                ctx.stroke();
                // ctx.restore()
            }
            // ctx.save()
            ctx.restore();
        }
    }
}
export default DrawLine;
