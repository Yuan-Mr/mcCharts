if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Tooltip_Params {
    tooltipInfo?: InterfaceObj;
    x?: number;
    y?: number;
    customTooltip?: (tooltipInfo: InterfaceObj) => void;
}
import type { InterfaceObj } from '../../utils/chartInterface';
function globalBuilder($$: InterfaceObj, parent = null) {
    const __$$__ = $$;
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, $$ = __$$__) => {
        Column.create();
        Column.alignItems(HorizontalAlign.Start);
        Column.padding($$.tooltipInfo.padding);
        Column.backgroundColor($$.tooltipInfo.backgroundColor);
        Column.borderColor($$.tooltipInfo.borderColor);
        Column.borderWidth($$.tooltipInfo.borderWidth);
        Column.borderRadius(10);
    }, Column);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, $$ = __$$__) => {
        If.create();
        if ($$.tooltipInfo.title) {
            (parent ? parent : this).ifElseBranchUpdateFunction(0, () => {
                (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, $$ = __$$__) => {
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
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, $$ = __$$__) => {
        ForEach.create();
        const forEachItemGenFunction = (_item, index) => {
            const item = _item;
            (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, $$ = __$$__) => {
                Text.create(item.name + '：' + item.num);
                __Text__fancy($$.tooltipInfo);
            }, Text);
            Text.pop();
        };
        (parent ? parent : this).forEachUpdateFunction(elmtId, $$.tooltipInfo.data, forEachItemGenFunction, undefined, true, false);
    }, ForEach);
    ForEach.pop();
    Column.pop();
}
function __Text__fancy(tooltipInfo: InterfaceObj): void {
    Text.fontSize(tooltipInfo.textStyle.fontSize || 14);
    Text.fontColor(tooltipInfo.textStyle.color || '#fff');
    Text.fontWeight(tooltipInfo.textStyle.fontWeight || 'normal');
    Text.fontFamily(tooltipInfo.textStyle.fontFamily || 'sans-serif');
}
export { globalBuilder };
export class Tooltip extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__tooltipInfo = new SynchedPropertyObjectTwoWayPU(params.tooltipInfo, this, "tooltipInfo");
        this.__x = new ObservedPropertySimplePU(-1000, this, "x");
        this.__y = new ObservedPropertySimplePU(-1000, this, "y");
        this.customTooltip = globalBuilder;
        this.setInitiallyProvidedValue(params);
        this.declareWatch("tooltipInfo", this.onTooltipInfoUpdated);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Tooltip_Params) {
        if (params.x !== undefined) {
            this.x = params.x;
        }
        if (params.y !== undefined) {
            this.y = params.y;
        }
        if (params.customTooltip !== undefined) {
            this.customTooltip = params.customTooltip;
        }
    }
    updateStateVars(params: Tooltip_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__tooltipInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__x.purgeDependencyOnElmtId(rmElmtId);
        this.__y.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tooltipInfo.aboutToBeDeleted();
        this.__x.aboutToBeDeleted();
        this.__y.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __tooltipInfo: SynchedPropertySimpleOneWayPU<InterfaceObj>;
    get tooltipInfo() {
        return this.__tooltipInfo.get();
    }
    set tooltipInfo(newValue: InterfaceObj) {
        this.__tooltipInfo.set(newValue);
    }
    private __x: ObservedPropertySimplePU<number>;
    get x() {
        return this.__x.get();
    }
    set x(newValue: number) {
        this.__x.set(newValue);
    }
    private __y: ObservedPropertySimplePU<number>;
    get y() {
        return this.__y.get();
    }
    set y(newValue: number) {
        this.__y.set(newValue);
    }
    // 自定义提示组件
    private __customTooltip;
    onTooltipInfoUpdated(): void {
        const pos: InterfaceObj = this.tooltipInfo.pos;
        const x: number = pos.x;
        if (x + 40 !== this.x) {
            this.x = -10000;
            this.y = -10000;
        }
    }
    getPos(rect: InterfaceObj) {
        const pos: InterfaceObj = this.tooltipInfo.pos;
        const W: number = pos.W;
        const H: number = pos.H;
        const x: number = pos.x;
        const y: number = pos.y;
        const width: number = rect.width;
        const height: number = rect.height;
        if (x + 40 + width > W - 10) {
            this.x = Math.max(x - width + 20, 10);
        }
        else {
            this.x = x + 40;
        }
        if (y !== undefined) {
            if (y + 40 + height > H - 10) {
                this.y = y - height + 20;
            }
            else {
                this.y = y;
            }
        }
        else {
            this.y = H / 2 - height / 2;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.position({
                x: this.x,
                y: this.y
            });
            Column.onAreaChange((oldValue: Area, newValue: Area) => {
                this.getPos(newValue);
            });
        }, Column);
        this.customTooltip.bind(this)(makeBuilderParameterProxy("customTooltip", { tooltipInfo: () => (this["__tooltipInfo"] ? this["__tooltipInfo"] : this["tooltipInfo"]) }), this);
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
