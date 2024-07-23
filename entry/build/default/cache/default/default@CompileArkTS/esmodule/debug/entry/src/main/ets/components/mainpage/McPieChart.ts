if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface McPieChart_Params {
    options?: Options;
    chartOption?: Options;
    renderType?: string;
    click?: Function;
    tooltipClick?: Function;
    titleOption?: InterfaceObj;
    textStyle?: InterfaceObj;
    subtextStyle?: InterfaceObj;
    customTooltip?: (tooltipInfo: InterfaceObj) => void;
}
import DrawPie from "@bundle:com.example.mccharts/entry/ets/utils/drawPie";
import { Chart } from "@bundle:com.example.mccharts/entry/ets/components/mainpage/Chart";
import { Options } from "@bundle:com.example.mccharts/entry/ets/components/mainpage/Options";
import { globalBuilder } from "@bundle:com.example.mccharts/entry/ets/components/mainpage/Tooltip";
import type { InterfaceObj } from '../../utils/chartInterface';
import type { Chart as CommonChart } from '../../utils/charts';
import { assign } from "@bundle:com.example.mccharts/entry/ets/utils/index";
let drawMcPieChart: CommonChart;
function __Text__fancy(textStyle: InterfaceObj): void {
    Text.fontSize(textStyle.fontSize || 14);
    Text.fontColor(textStyle.color || '#fff');
    Text.fontWeight(textStyle.fontWeight || 'normal');
    Text.fontFamily(textStyle.fontFamily || 'sans-serif');
}
export class McPieChart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__options = new SynchedPropertyNesedObjectPU(params.options, this, "options");
        this.__chartOption = new ObservedPropertyObjectPU(new Options({}), this, "chartOption");
        this.__renderType = new ObservedPropertySimplePU('init', this, "renderType");
        this.click = (event: InterfaceObj, params: InterfaceObj) => { };
        this.tooltipClick = (event: InterfaceObj, params: InterfaceObj) => { };
        this.__titleOption = new ObservedPropertyObjectPU({
            show: true,
            text: '',
            subtext: '',
            textAlign: 'center',
            direction: 'column',
            itemGap: 5,
            left: '50%',
            top: '50%' // title 组件离容器上侧的距离。
        }, this, "titleOption");
        this.__textStyle = new ObservedPropertyObjectPU({
            color: '#333',
            fontWeight: 'bolder',
            fontFamily: 'sans-serif',
            position: '',
            fontSize: 18
        }, this, "textStyle");
        this.__subtextStyle = new ObservedPropertyObjectPU({
            color: '#aaa',
            fontWeight: 'normal',
            fontFamily: 'sans-serif',
            position: '',
            fontSize: 12
        }, this, "subtextStyle");
        this.customTooltip = globalBuilder;
        this.setInitiallyProvidedValue(params);
        this.declareWatch("options", this.onCountUpdated);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: McPieChart_Params) {
        this.__options.set(params.options);
        if (params.chartOption !== undefined) {
            this.chartOption = params.chartOption;
        }
        if (params.renderType !== undefined) {
            this.renderType = params.renderType;
        }
        if (params.click !== undefined) {
            this.click = params.click;
        }
        if (params.tooltipClick !== undefined) {
            this.tooltipClick = params.tooltipClick;
        }
        if (params.titleOption !== undefined) {
            this.titleOption = params.titleOption;
        }
        if (params.textStyle !== undefined) {
            this.textStyle = params.textStyle;
        }
        if (params.subtextStyle !== undefined) {
            this.subtextStyle = params.subtextStyle;
        }
        if (params.customTooltip !== undefined) {
            this.customTooltip = params.customTooltip;
        }
    }
    updateStateVars(params: McPieChart_Params) {
        this.__options.set(params.options);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__options.purgeDependencyOnElmtId(rmElmtId);
        this.__chartOption.purgeDependencyOnElmtId(rmElmtId);
        this.__renderType.purgeDependencyOnElmtId(rmElmtId);
        this.__titleOption.purgeDependencyOnElmtId(rmElmtId);
        this.__textStyle.purgeDependencyOnElmtId(rmElmtId);
        this.__subtextStyle.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__options.aboutToBeDeleted();
        this.__chartOption.aboutToBeDeleted();
        this.__renderType.aboutToBeDeleted();
        this.__titleOption.aboutToBeDeleted();
        this.__textStyle.aboutToBeDeleted();
        this.__subtextStyle.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __options: SynchedPropertyNesedObjectPU<Options>;
    get options() {
        return this.__options.get();
    }
    private __chartOption: ObservedPropertyObjectPU<Options>;
    get chartOption() {
        return this.__chartOption.get();
    }
    set chartOption(newValue: Options) {
        this.__chartOption.set(newValue);
    }
    private __renderType: ObservedPropertySimplePU<string>;
    get renderType() {
        return this.__renderType.get();
    }
    set renderType(newValue: string) {
        this.__renderType.set(newValue);
    }
    private click: Function;
    private tooltipClick: Function;
    private __titleOption: ObservedPropertyObjectPU<InterfaceObj>;
    get titleOption() {
        return this.__titleOption.get();
    }
    set titleOption(newValue: InterfaceObj) {
        this.__titleOption.set(newValue);
    }
    private __textStyle: ObservedPropertyObjectPU<InterfaceObj>;
    get textStyle() {
        return this.__textStyle.get();
    }
    set textStyle(newValue: InterfaceObj) {
        this.__textStyle.set(newValue);
    }
    private __subtextStyle: ObservedPropertyObjectPU<InterfaceObj>;
    get subtextStyle() {
        return this.__subtextStyle.get();
    }
    set subtextStyle(newValue: InterfaceObj) {
        this.__subtextStyle.set(newValue);
    }
    private __customTooltip; // 自定义组件
    // @BuilderParam customTitle: (titleInfo: InterfaceObj) => void; // 自定义Title
    // @Watch 回调
    onCountUpdated(): void {
        this.chartOption = new Options(this.options);
        if (this.options.title) {
            this.titleOption = assign(this.titleOption, this.options.title);
            this.textStyle = assign(this.textStyle, this.options.title.textStyle || {});
            this.subtextStyle = assign(this.subtextStyle, this.options.title.subtextStyle || {});
        }
    }
    aboutToAppear() {
        this.onCountUpdated();
        drawMcPieChart = new DrawPie();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new Chart(this, {
                        options: this.chartOption,
                        drawMcChart: drawMcPieChart,
                        renderType: this.__renderType,
                        customTooltip: this.customTooltip,
                        click: (event: InterfaceObj, params: InterfaceObj) => {
                            this.click(event, params);
                        },
                        tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
                            this.tooltipClick(event, params);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/mainpage/McPieChart.ets", line: 66 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            options: this.chartOption,
                            drawMcChart: drawMcPieChart,
                            renderType: this.renderType,
                            customTooltip: this.customTooltip,
                            click: (event: InterfaceObj, params: InterfaceObj) => {
                                this.click(event, params);
                            },
                            tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
                                this.tooltipClick(event, params);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        options: this.chartOption
                    });
                }
            }, { name: "Chart" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.titleOption.show) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.titleOption.direction === 'row') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.position({ x: this.titleOption.left, y: this.titleOption.top });
                                    Row.markAnchor({ x: '50%', y: '50%' });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(String(this.titleOption.text));
                                    __Text__fancy(ObservedObject.GetRawObject(this.textStyle));
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(String(this.titleOption.subtext));
                                    Text.margin({ left: this.titleOption.itemGap });
                                    __Text__fancy(ObservedObject.GetRawObject(this.subtextStyle));
                                }, Text);
                                Text.pop();
                                Row.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.position({ x: this.titleOption.left, y: this.titleOption.top });
                                    Column.markAnchor({ x: '50%', y: '50%' });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(String(this.titleOption.text));
                                    __Text__fancy(ObservedObject.GetRawObject(this.textStyle));
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(String(this.titleOption.subtext));
                                    Text.margin({ top: this.titleOption.itemGap });
                                    __Text__fancy(ObservedObject.GetRawObject(this.subtextStyle));
                                }, Text);
                                Text.pop();
                                Column.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
