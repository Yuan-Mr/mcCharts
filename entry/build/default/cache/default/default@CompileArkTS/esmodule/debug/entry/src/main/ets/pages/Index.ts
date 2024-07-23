if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    defOption?: Options;
    defRadarOption?: Options;
}
import { Options, McRadarChart } from "@bundle:com.example.mccharts/entry/ets/components/index";
import type { chartInterface } from "@bundle:com.example.mccharts/entry/ets/components/index";
function __Text__fancy(tooltipInfo: chartInterface.InterfaceObj): void {
    Text.fontSize(tooltipInfo.textStyle.fontSize || 14);
    Text.fontColor(tooltipInfo.textStyle.color || '#fff');
    Text.fontWeight(tooltipInfo.textStyle.fontWeight || 'normal');
    Text.fontFamily(tooltipInfo.textStyle.fontFamily || 'sans-serif');
}
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__defOption = new ObservedPropertyObjectPU(new Options({
            xAxis: {
                data: ['周一周一周一周', '周二', '周三', '周四', '周五', '周六', '周日'],
                // axisLabel: {
                //   interval: 0
                // },
            },
            yAxis: {
                name: '温度'
            },
            series: [
                {
                    name: '最高气温',
                    data: [11, 11, 15, 13, 12, 13, 10]
                }
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
        , this, "defOption");
        this.__defRadarOption = new ObservedPropertyObjectPU(new Options({
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
        }), this, "defRadarOption");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.defOption !== undefined) {
            this.defOption = params.defOption;
        }
        if (params.defRadarOption !== undefined) {
            this.defRadarOption = params.defRadarOption;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__defOption.purgeDependencyOnElmtId(rmElmtId);
        this.__defRadarOption.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__defOption.aboutToBeDeleted();
        this.__defRadarOption.aboutToBeDeleted();
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
    private __defRadarOption: ObservedPropertyObjectPU<Options>;
    get defRadarOption() {
        return this.__defRadarOption.get();
    }
    set defRadarOption(newValue: Options) {
        this.__defRadarOption.set(newValue);
    }
    customTooltip($$: chartInterface.InterfaceObj, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if ($$.tooltipInfo.title) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create($$.tooltipInfo.title);
                        __Text__fancy($$.tooltipInfo);
                        Text.margin({
                            bottom: 8
                        });
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
                    __Text__fancy($$.tooltipInfo);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, $$.tooltipInfo.data, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
    }
    aboutToAppear() {
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('50%');
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 折线图
                    // McLineChart({
                    //   options: this.defOption
                    // })
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
                    // 雷达图
                    McRadarChart(this, {
                        options: this.defRadarOption
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 199 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            options: this.defRadarOption
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        options: this.defRadarOption
                    });
                }
            }, { name: "McRadarChart" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.mccharts", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false" });
