if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Chart_Params {
    settings?: RenderingContextSettings;
    context?: CanvasRenderingContext2D;
    offContext?: OffscreenCanvasRenderingContext2D | null;
    drawMcChart?: CommonChart | null;
    click?: Function;
    tooltipClick?: Function;
    options?: Options;
    renderType?: string;
    isTooltipShow?: boolean;
    isZoom?: boolean;
    isScale?: boolean;
    tooltipInfo?: InterfaceObj;
    panOption?: PanGestureOptions;
    customTooltip?: (tooltipInfo: InterfaceObj) => void;
}
import type { InterfaceObj } from '../../utils/chartInterface';
import { Tooltip, globalBuilder } from "@bundle:com.example.mccharts/entry/ets/components/mainpage/Tooltip";
import type { Options } from './Options';
import type { Chart as CommonChart } from '../../utils/charts';
export class Chart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.settings = new RenderingContextSettings(true);
        this.context = new CanvasRenderingContext2D(this.settings);
        this.offContext = null;
        this.drawMcChart = null;
        this.click = () => { };
        this.tooltipClick = () => { };
        this.__options = new SynchedPropertyNesedObjectPU(params.options, this, "options");
        this.__renderType = new SynchedPropertySimpleTwoWayPU(params.renderType, this, "renderType");
        this.__isTooltipShow = new ObservedPropertySimplePU(false, this, "isTooltipShow");
        this.__isZoom = new ObservedPropertySimplePU(false, this, "isZoom");
        this.__isScale = new ObservedPropertySimplePU(false, this, "isScale");
        this.__tooltipInfo = new ObservedPropertyObjectPU({}, this, "tooltipInfo");
        this.panOption = new PanGestureOptions({ direction: PanDirection.Left | PanDirection.Right, distance: 1 });
        this.customTooltip = globalBuilder;
        this.setInitiallyProvidedValue(params);
        this.declareWatch("options", this.onCountUpdated);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Chart_Params) {
        if (params.settings !== undefined) {
            this.settings = params.settings;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.offContext !== undefined) {
            this.offContext = params.offContext;
        }
        if (params.drawMcChart !== undefined) {
            this.drawMcChart = params.drawMcChart;
        }
        if (params.click !== undefined) {
            this.click = params.click;
        }
        if (params.tooltipClick !== undefined) {
            this.tooltipClick = params.tooltipClick;
        }
        this.__options.set(params.options);
        if (params.isTooltipShow !== undefined) {
            this.isTooltipShow = params.isTooltipShow;
        }
        if (params.isZoom !== undefined) {
            this.isZoom = params.isZoom;
        }
        if (params.isScale !== undefined) {
            this.isScale = params.isScale;
        }
        if (params.tooltipInfo !== undefined) {
            this.tooltipInfo = params.tooltipInfo;
        }
        if (params.panOption !== undefined) {
            this.panOption = params.panOption;
        }
        if (params.customTooltip !== undefined) {
            this.customTooltip = params.customTooltip;
        }
    }
    updateStateVars(params: Chart_Params) {
        this.__options.set(params.options);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__options.purgeDependencyOnElmtId(rmElmtId);
        this.__renderType.purgeDependencyOnElmtId(rmElmtId);
        this.__isTooltipShow.purgeDependencyOnElmtId(rmElmtId);
        this.__isZoom.purgeDependencyOnElmtId(rmElmtId);
        this.__isScale.purgeDependencyOnElmtId(rmElmtId);
        this.__tooltipInfo.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__options.aboutToBeDeleted();
        this.__renderType.aboutToBeDeleted();
        this.__isTooltipShow.aboutToBeDeleted();
        this.__isZoom.aboutToBeDeleted();
        this.__isScale.aboutToBeDeleted();
        this.__tooltipInfo.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private settings: RenderingContextSettings;
    private context: CanvasRenderingContext2D;
    private offContext: OffscreenCanvasRenderingContext2D | null;
    private drawMcChart: CommonChart | null;
    private click: Function;
    private tooltipClick: Function;
    private __options: SynchedPropertyNesedObjectPU<Options>;
    get options() {
        return this.__options.get();
    }
    private __renderType: SynchedPropertySimpleTwoWayPU<string>;
    get renderType() {
        return this.__renderType.get();
    }
    set renderType(newValue: string) {
        this.__renderType.set(newValue);
    }
    private __isTooltipShow: ObservedPropertySimplePU<boolean>;
    get isTooltipShow() {
        return this.__isTooltipShow.get();
    }
    set isTooltipShow(newValue: boolean) {
        this.__isTooltipShow.set(newValue);
    }
    private __isZoom: ObservedPropertySimplePU<boolean>;
    get isZoom() {
        return this.__isZoom.get();
    }
    set isZoom(newValue: boolean) {
        this.__isZoom.set(newValue);
    }
    private __isScale: ObservedPropertySimplePU<boolean>;
    get isScale() {
        return this.__isScale.get();
    }
    set isScale(newValue: boolean) {
        this.__isScale.set(newValue);
    }
    private __tooltipInfo: ObservedPropertyObjectPU<InterfaceObj>;
    get tooltipInfo() {
        return this.__tooltipInfo.get();
    }
    set tooltipInfo(newValue: InterfaceObj) {
        this.__tooltipInfo.set(newValue);
    }
    private panOption: PanGestureOptions;
    private __customTooltip; // 自定义组件
    onCountUpdated(options: Options): void {
        this.isTooltipShow = false;
        if (!this.offContext) {
            const offCanvas: OffscreenCanvas = new OffscreenCanvas(this.context.width, this.context.height);
            this.offContext = offCanvas.getContext("2d", this.settings);
        }
        this.drawMcChart && this.drawMcChart.init(this.context, this.options, this.offContext, this.renderType);
    }
    showInfo(flag: boolean, event: InterfaceObj = {}, pos?: InterfaceObj, title?: string, arr?: [
    ], tooltipInfo: InterfaceObj = {}) {
        // const {show, type = 'default'} = tooltipInfo || {}
        if (!tooltipInfo.show) {
            this.isTooltipShow = false;
            return;
        }
        this.isTooltipShow = flag;
        this.click && this.click(event, flag ? {
            title,
            data: arr
        } : {});
        if (tooltipInfo.type !== 'default') {
            this.tooltipClick && this.tooltipClick(event, flag ? { title, pos, data: arr } : {});
        }
        if (!tooltipInfo.show || tooltipInfo.type !== 'default')
            return;
        if (this.isTooltipShow) {
            this.tooltipInfo = {
                pos,
                title,
                data: arr
            };
            const keys = Object.keys(tooltipInfo);
            keys.forEach(item => {
                this.tooltipInfo[item] = tooltipInfo[item];
            });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.width('100%');
            Canvas.height('100%');
            Canvas.onReady(() => {
                const offCanvas: OffscreenCanvas = new OffscreenCanvas(this.context.width, this.context.height);
                this.offContext = offCanvas.getContext("2d", this.settings);
                this.drawMcChart && this.drawMcChart.init(this.context, ObservedObject.GetRawObject(this.options), this.offContext, this.renderType, offCanvas);
            });
            Canvas.onClick((event) => {
                if (this.drawMcChart) {
                    this.drawMcChart.bindEvent({
                        localX: event.x,
                        localY: event.y,
                    }, (flag: boolean, event: InterfaceObj = {}, pos: InterfaceObj = {}, title: string = '', arr: [
                    ] = [], tooltipInfo: InterfaceObj = {}) => {
                        this.showInfo(flag, event, pos, title, arr, tooltipInfo);
                    });
                }
            });
            Gesture.create(GesturePriority.Low);
            PanGesture.create(this.panOption);
            PanGesture.onActionStart((event: GestureEvent) => {
                console.info('Pan start');
            });
            PanGesture.onActionUpdate((event: GestureEvent) => {
                if (event && !this.isScale) {
                    if (this.drawMcChart) {
                        this.isTooltipShow = false;
                        this.drawMcChart.bindZoom(event.offsetX);
                    }
                }
            });
            PanGesture.onActionEnd(() => {
            });
            PanGesture.pop();
            Gesture.pop();
            Gesture.create(GesturePriority.Low);
            PinchGesture.create({ fingers: 2, distance: 1 });
            PinchGesture.onActionStart((event: GestureEvent) => {
                this.isScale = true;
                this.isTooltipShow = false;
            });
            PinchGesture.onActionUpdate((event: GestureEvent) => {
                if (event) {
                    if (this.drawMcChart) {
                        this.drawMcChart.bindZoomScale(event.scale);
                    }
                }
            });
            PinchGesture.onActionEnd((event: GestureEvent) => {
                this.isScale = false;
            });
            PinchGesture.pop();
            Gesture.pop();
        }, Canvas);
        Canvas.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isTooltipShow) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Tooltip(this, {
                                    tooltipInfo: this.__tooltipInfo,
                                    customTooltip: this.customTooltip
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/mainpage/Chart.ets", line: 115 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        tooltipInfo: this.tooltipInfo,
                                        customTooltip: this.customTooltip
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "Tooltip" });
                    }
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
