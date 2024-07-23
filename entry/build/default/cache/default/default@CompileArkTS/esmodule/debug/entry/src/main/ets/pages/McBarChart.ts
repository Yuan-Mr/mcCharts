if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface mcBarChart_Params {
    defOption?: Options;
    xAxisOption?: Options;
    yAxisOption?: Options;
    legendOption?: Options;
    tooltipOption?: Options;
    seriesOption?: Options;
    dataZoomOption?: Options;
}
import { McBarChart, Options } from "@bundle:com.example.mccharts/entry/ets/components/index";
import type { chartInterface } from "@bundle:com.example.mccharts/entry/ets/components/index";
class mcBarChart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__defOption = new ObservedPropertyObjectPU(new Options({
            xAxis: {
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            series: [
                {
                    name: '最高气温',
                    data: [11, 11, 15, 13, 12, 130, 10]
                }
            ]
        }), this, "defOption");
        this.__xAxisOption = new ObservedPropertyObjectPU(new Options({
            xAxis: {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#333'
                    }
                },
                axisTick: {
                    show: false, // 是否显示
                },
                axisLabel: {
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
        }), this, "xAxisOption");
        this.__yAxisOption = new ObservedPropertyObjectPU(new Options({
            xAxis: {
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] // 数据
            },
            yAxis: {
                name: '单位/摄氏度',
                nameTextStyle: {
                    color: '#000'
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#000',
                        width: 1
                    }
                },
                axisTick: {
                    show: false,
                    interval: 6,
                    length: 10,
                    lineStyle: {
                        color: '#000',
                        width: 1 // 刻度线宽度
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        // color: '#000',
                        width: 1
                    }
                },
                axisLabel: {
                    color: '#000',
                    fontWeight: '600',
                    fontFamily: 'sans-serif',
                    fontSize: 20,
                    margin: 0
                },
                formatter: (name: string) => {
                    return name + '°C';
                }
            },
            series: [
                {
                    name: '最高气温',
                    data: [11, 11, 15, 13, 12, 130, 10]
                }
            ]
        }), this, "yAxisOption");
        this.__legendOption = new ObservedPropertyObjectPU(new Options({
            xAxis: {
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] // 数据
            },
            legend: {
                left: '80%',
                top: '2%',
                itemGap: 20,
                itemTextGap: 10,
                itemHeight: 10,
                textStyle: {
                    color: '#000',
                    fontWeight: '600',
                    fontFamily: 'sans-serif',
                    fontSize: 24
                }
            },
            series: [
                {
                    name: '最高气温',
                    data: [11, 11, 15, 13, 12, 130, 10]
                },
                {
                    name: '最高气温2',
                    data: [11, 11, 15, 13, 12, 130, 10]
                }
            ]
        }), this, "legendOption");
        this.__tooltipOption = new ObservedPropertyObjectPU(new Options({
            xAxis: {
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] // 数据
            },
            tooltip: {
                borderColor: '#f72659f5',
                borderWidth: 1,
                backgroundColor: '#fff',
                textStyle: {
                    color: '#000'
                }
            },
            series: [
                {
                    name: '最高气温',
                    data: [11, 11, 15, 13, 12, 130, 10]
                }
            ]
        })
        // 存在负数的时候异常，需要处理
        , this, "tooltipOption");
        this.__seriesOption = new ObservedPropertyObjectPU(new Options({
            xAxis: {
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] // 数据
            },
            series: [
                {
                    name: '最高气温',
                    color: '#ff2659f5',
                    barStyle: {
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
                            return params.name;
                        },
                        distanceToLabelLine: 10
                    },
                    // stack: 'total', // 是否显示堆叠柱子
                    data: [11, 11, 35, 13, 12, 130, 100] // 数据
                },
                {
                    name: '最高气温',
                    barStyle: {
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
                            return params.name;
                        },
                        distanceToLabelLine: 10
                    },
                    // stack: 'total', // 是否显示堆叠柱子
                    data: [11, 11, 15, 13, 12, 130, 100] // 数据
                },
                {
                    name: '最高气温',
                    barStyle: {
                        borderRadius: true
                    },
                    label: {},
                    // stack: 'total', // 是否显示堆叠柱子
                    data: [11, 11, 15, 13, 12, 130, 200] // 数据
                }
            ]
        }), this, "seriesOption");
        this.__dataZoomOption = new ObservedPropertyObjectPU(new Options({
            xAxis: {
                axisLabel: {
                    interval: 0,
                    fontSize: 18,
                    overflow: 'breakAll'
                },
                data: ['周一周一周一周一周一', '周三周三周三周三周三', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日'] // 数据
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
        }), this, "dataZoomOption");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: mcBarChart_Params) {
        if (params.defOption !== undefined) {
            this.defOption = params.defOption;
        }
        if (params.xAxisOption !== undefined) {
            this.xAxisOption = params.xAxisOption;
        }
        if (params.yAxisOption !== undefined) {
            this.yAxisOption = params.yAxisOption;
        }
        if (params.legendOption !== undefined) {
            this.legendOption = params.legendOption;
        }
        if (params.tooltipOption !== undefined) {
            this.tooltipOption = params.tooltipOption;
        }
        if (params.seriesOption !== undefined) {
            this.seriesOption = params.seriesOption;
        }
        if (params.dataZoomOption !== undefined) {
            this.dataZoomOption = params.dataZoomOption;
        }
    }
    updateStateVars(params: mcBarChart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__defOption.purgeDependencyOnElmtId(rmElmtId);
        this.__xAxisOption.purgeDependencyOnElmtId(rmElmtId);
        this.__yAxisOption.purgeDependencyOnElmtId(rmElmtId);
        this.__legendOption.purgeDependencyOnElmtId(rmElmtId);
        this.__tooltipOption.purgeDependencyOnElmtId(rmElmtId);
        this.__seriesOption.purgeDependencyOnElmtId(rmElmtId);
        this.__dataZoomOption.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__defOption.aboutToBeDeleted();
        this.__xAxisOption.aboutToBeDeleted();
        this.__yAxisOption.aboutToBeDeleted();
        this.__legendOption.aboutToBeDeleted();
        this.__tooltipOption.aboutToBeDeleted();
        this.__seriesOption.aboutToBeDeleted();
        this.__dataZoomOption.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __defOption: ObservedPropertyObjectPU<Options>;
    get defOption() {
        return this.__defOption.get();
    }
    set defOption(newValue: Options) {
        this.__defOption.set(newValue);
    }
    private __xAxisOption: ObservedPropertyObjectPU<Options>;
    get xAxisOption() {
        return this.__xAxisOption.get();
    }
    set xAxisOption(newValue: Options) {
        this.__xAxisOption.set(newValue);
    }
    private __yAxisOption: ObservedPropertyObjectPU<Options>;
    get yAxisOption() {
        return this.__yAxisOption.get();
    }
    set yAxisOption(newValue: Options) {
        this.__yAxisOption.set(newValue);
    }
    private __legendOption: ObservedPropertyObjectPU<Options>;
    get legendOption() {
        return this.__legendOption.get();
    }
    set legendOption(newValue: Options) {
        this.__legendOption.set(newValue);
    }
    private __tooltipOption: ObservedPropertyObjectPU<Options>;
    get tooltipOption() {
        return this.__tooltipOption.get();
    }
    set tooltipOption(newValue: Options) {
        this.__tooltipOption.set(newValue);
    }
    // 存在负数的时候异常，需要处理
    private __seriesOption: ObservedPropertyObjectPU<Options>;
    get seriesOption() {
        return this.__seriesOption.get();
    }
    set seriesOption(newValue: Options) {
        this.__seriesOption.set(newValue);
    }
    private __dataZoomOption: ObservedPropertyObjectPU<Options>;
    get dataZoomOption() {
        return this.__dataZoomOption.get();
    }
    set dataZoomOption(newValue: Options) {
        this.__dataZoomOption.set(newValue);
    }
    customTooltip($$: chartInterface.InterfaceObj, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if ($$.tooltipInfo.title) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create($$.tooltipInfo.title);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.name + '：' + item.num);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, $$.tooltipInfo.data, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
    }
    aboutToAppear() {
        setTimeout(() => {
            // 使用Option实例对象的setVal方法来实现，修改什么属性就传什么
            this.seriesOption.setVal({
                series: [
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
            });
        }, 2000);
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height(300);
        }, Row);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
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
                    McBarChart(this, {
                        options: this.seriesOption
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/McBarChart.ets", line: 317 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            options: this.seriesOption
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        options: this.seriesOption
                    });
                }
            }, { name: "McBarChart" });
        }
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "mcBarChart";
    }
}
registerNamedRoute(() => new mcBarChart(undefined, {}), "", { bundleName: "com.example.mccharts", moduleName: "entry", pagePath: "pages/McBarChart", pageFullPath: "entry/src/main/ets/pages/McBarChart", integratedHsp: "false" });
