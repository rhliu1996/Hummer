const { document: _Document } = __Hummer__

import { Node } from "../Node"
import { BasicAnimation } from "../anim/BasicAnimation"
import { KeyframeAnimation } from "../anim/KeyframeAnimation"

/**
 * Element 
 * 
 * 需要对齐前端Element方法，参数MDN
 * 
 *
 */
export class Element extends Node {

    /**
     * 元素属性集合
     */
    private _attributes: Record<string, any> = {};


    /**
     * 样式集合
     */
    private _style: Record<string, string> | null = {};

    /**
     * 动画集合
     */
    private _animationMap: Map<string, BasicAnimation | KeyframeAnimation> | undefined  = undefined; 

    /**
     * 节点构造函数
     * 
     * @param tag  节点标签
     * @param name 节点名称
     * @param props  构造参数
     */
    constructor(tag: string, name: string = tag, props: any = undefined) {
        super(tag, name, props)
    }

    /**
    * 设置属性
    * 
    * @param key 属性名称
    * @param value  属性值
    */
    public setAttribute(key: string, value: any) {
        this._setAttribute(key, value);
    }


    protected _setAttribute(key: string, value: any,update:boolean= true) {
        this._attributes[key] = value;
        if(update){
            this.obj.setAttributes({ [key]: value });
        }
    }


    /**
    * 初始化属性
    * 
    * @param attribute  属性
    */
    protected _initAttributes(attribute: object) {
        this._attributes = attribute || {};
        this.obj.setAttributes(attribute);
    }

    /**
     * 设置属性
     * 
     * @param attribute  属性
     */
    protected _setAttributes(attribute: object) {
        this._attributes = { ...this._attributes, ...attribute }
        this.obj.setAttributes(attribute);
    }


    /**
     * 获取属性名
     * @param key 属性名
     */
    public getAttribute(key: string) {
        return this._getAttribute(key);
    }

    protected _getAttribute(key: string) {
        return this._attributes[key];
    }


    public setEnable(enabled: any) {
        this._setAttribute("enable", enabled);
    }


    public getEnable(): any {
        return this._getAttribute("enable");
    }

    /**
     * 设置样式
     * 
     * @param style 样式对象
     * @param flag 标记
     */
    protected setStyle(style: object, flag: boolean = false) {
        this._setStyles(style);
    }


    protected _setStyles(style: object | any) {
        //TODO 临时代码，待优化
        let newStyle: any = {};
        if (style.margin) {
            newStyle.marginLeft = style.margin;
            newStyle.marginTop = style.margin;
            newStyle.marginRight = style.margin;
            newStyle.marginBottom = style.margin;
        }
        if (style.padding) {
            newStyle.paddingLeft = style.padding;
            newStyle.paddingTop = style.padding;
            newStyle.paddingRight = style.padding;
            newStyle.paddingBottom = style.padding;
        }
        if (style.borderStyle) {
            newStyle.borderLeftStyle = style.borderStyle;
            newStyle.borderTopStyle = style.borderStyle;
            newStyle.borderRightStyle = style.borderStyle;
            newStyle.borderBottomStyle = style.borderStyle;
        }
        if (style.borderColor) {
            newStyle.borderLeftColor = style.borderColor;
            newStyle.borderTopColor = style.borderColor;
            newStyle.borderRightColor = style.borderColor;
            newStyle.borderBottomColor = style.borderColor;
        }
        if (style.borderWidth) {
            newStyle.borderLeftWidth = style.borderWidth;
            newStyle.borderTopWidth = style.borderWidth;
            newStyle.borderRightWidth = style.borderWidth;
            newStyle.borderBottomWidth = style.borderWidth;
        }

        if (style.borderRadius) {
            newStyle.borderTopLeftRadius = style.borderRadius;
            newStyle.borderTopRightRadius = style.borderRadius;
            newStyle.borderBottomLeftRadius = style.borderRadius;
            newStyle.borderBottomRightRadius = style.borderRadius;
        }

        this._style = { ...newStyle, ...style };
        this.obj.setStyles(this._style);
    }


    public getStyle() {
        return this._style || {}
    }

    /**
     *  添加动画
     * 
     * @param animation 动画对象
     * @param key  动画唯一key
     */
    public addAnimation(animation: BasicAnimation | KeyframeAnimation, key: string = "") {
        this._addAnimation(animation, key);
    }



    private _addAnimation(animation: BasicAnimation | KeyframeAnimation, key: string = "") {
        // 监听动画的开始和结束事件
        let startFunc = animation._startFunc;
        let endFunc = animation._endFunc;
        
        if(!this.envents.has(key)){
            this.addEventListener("__onStart__", startFunc);
            this.addEventListener("__onEnd__", endFunc);
        }

        // 临时存储，方面后面移除监听
        this._animationMap && this._animationMap.set(key, animation)
        this.obj.addAnimation(animation, key);
    }

    /**
     * 移除指定动画
     * @param key 动画对象的唯一key
     */
    public removeAnimationForKey(key: string) {
        this._removeAnimationForKey(key);
    }

    private _removeAnimationForKey(key: string) {
       // 移除事件监听
       let anim = this._animationMap &&  this._animationMap.get(key);
       if(this.envents.has(key) && anim){
         this.removeEventListener("__onStart__", anim._startFunc);
         this.removeEventListener("__onEnd__", anim._endFunc);
       }

       this.obj.removeAnimationForKey(key);
    }

    /**
     * 移除全部动画
     */
    public removeAllAnimation() {
        this._removeAllAnimation();
    }


    private _removeAllAnimation() {
        // 移除事件监听
        this.removeEventListener("__onStart__")
        this.removeEventListener("__onEnd__")
        this._animationMap = undefined
        this.obj.removeAllAnimation();
    }

    /**
     * 获取视图区域
     * @param callback  区域信息回调
     */
    public getRect(callback: Function) {
        this.obj.getRect((rect: object) => {
            callback.call(this, rect);
        })
    }


    /**
     * 获取节点调试信息
     * 
     * @param callback 
     * @param id 
     */
    public dbg_getDescription(callback: Function, id: Number) {
        console.log("dbg_getDescription()");
    }

}