import { Element } from "../Element";
export declare class HummerElement extends Element {
    __scopedIds: Set<string>;
    __NAME: Symbol | null;
    __view_id: number;
    dataset: any;
    protected __defaultStyle: Record<string, string> | null;
    protected __style: Record<string, string> | null;
    protected __baseStyle: Record<string, string> | null;
    private _enabled;
    private globalProxy;
    constructor(tag: string, name: string | undefined, props: any);
    get enabled(): boolean;
    set enabled(enabled: boolean);
    get disabled(): Boolean;
    set disabled(disabled: Boolean);
    get className(): any;
    get style(): object;
    set style(value: object);
    protected setStyle(value: object, flag?: boolean): void;
    setScopeId(id: string): void;
    updateStyle(): void;
    updateClassStyle(className: string): void;
    handleAnimation(animation: Animation): void;
    setAnimation(animation: Animation): void;
    setElementText(text: string): void;
    getAttribute(key: string): any;
    setAttribute(key: string, value: any): void;
    private setCacheProp;
    protected onHandleRecieveEvent(event: any): any;
}
