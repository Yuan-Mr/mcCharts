if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface McBarChart_Params {
    options?: Options;
    chartOption?: Options;
    renderType?: string;
    click?: Function;
    tooltipClick?: Function;
    customTooltip?: (tooltipInfo: InterfaceObj) => void;
}
import DrawBar from "@bundle:com.example.mccharts/entry/ets/utils/drawBar";
import { Chart } from "@bundle:com.example.mccharts/entry/ets/components/mainpage/Chart";
import { Options } from "@bundle:com.example.mccharts/entry/ets/components/mainpage/Options";
import { globalBuilder } from "@bundle:com.example.mccharts/entry/ets/components/mainpage/Tooltip";
import type { InterfaceObj } from '../../utils/chartInterface';
import type { Chart as CommonChart } from '../../utils/charts';
let drawMcBarChart: CommonChart;
export class McBarChart extends ViewPU {
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
        this.customTooltip = globalBuilder;
        this.setInitiallyProvidedValue(params);
        this.declareWatch("options", this.onCountUpdated);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: McBarChart_Params) {
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
        if (params.customTooltip !== undefined) {
            this.customTooltip = params.customTooltip;
        }
    }
    updateStateVars(params: McBarChart_Params) {
        this.__options.set(params.options);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__options.purgeDependencyOnElmtId(rmElmtId);
        this.__chartOption.purgeDependencyOnElmtId(rmElmtId);
        this.__renderType.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__options.aboutToBeDeleted();
        this.__chartOption.aboutToBeDeleted();
        this.__renderType.aboutToBeDeleted();
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
    private __customTooltip; // 自定义组件
    // @Watch 回调
    onCountUpdated(options: Options): void {
        this.renderType = 'update';
        this.chartOption = this.options;
    }
    aboutToAppear() {
        this.chartOption = this.options;
        drawMcBarChart = new DrawBar();
    }
    initialRender() {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new Chart(this, {
                        options: this.chartOption,
                        drawMcChart: drawMcBarChart,
                        customTooltip: this.customTooltip,
                        renderType: this.__renderType,
                        click: (event: InterfaceObj, params: InterfaceObj) => {
                            this.click(event, params);
                        },
                        tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
                            this.tooltipClick(event, params);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/mainpage/McBarChart.ets", line: 26 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            options: this.chartOption,
                            drawMcChart: drawMcBarChart,
                            customTooltip: this.customTooltip,
                            renderType: this.renderType,
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
    }
    rerender() {
        this.updateDirtyElements();
    }
}
