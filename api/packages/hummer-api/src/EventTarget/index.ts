
import { HMObject } from "src/HMObject"

const { Document: _Document } = __hummer__

//***********************************************/
// 引擎操作接口挂载点全局上的 ”__hummer__“上
//***********************************************/

export interface EventLisener {
    onEvent(event: any): any;
}

export class EventTarget extends HMObject {

    protected envents: Map<string, Array<EventLisener>>


    public constructor(tag: string, isApi: boolean = true, props: any) {
        super(tag, isApi, props)
        this.envents = new Map()
    }

    //消息事件回调入口
    public onRecieveEvent(event: any) {
        event = this.onHandleRecieveEvent(event);
        this.dispatchEvent(event.eventName, event)
    }


    //事件处理增强/扩展
    protected onHandleRecieveEvent(event: any): any {
        return event;
    }

    /**
     * 绑定 EventTatget
     */
    public bindEventTarget() {
        this.obj.setEventTarget(this.onRecieveEvent)
    }


    public dispatchEvent(eventName: string, event: any) {
        var listeners = this.envents.get(eventName)
        if (listeners != undefined) {
            listeners.forEach((lisener => {
                if (lisener != undefined) {
                    lisener.onEvent(event);
                }
            }))
        } else {
            console.log("未找到事件处理器");
        }

    }


    public addEventListener(eventName: string, eventLisener: EventLisener, useCapture: boolean) {
        var listeners = this.envents.get(eventName)
        if (listeners == undefined) {
            listeners = new Array()
            this.envents.set(eventName, listeners)
        }

        listeners.push(eventLisener)
    }


    public removeEventListener(eventName: string, eventLisener: EventLisener, useCapture: boolean) {
        var listeners = this.envents.get(eventName)
        if (listeners != undefined) {
            if (eventLisener == undefined) {
                listeners.splice(0, listeners.length)
                this.envents.delete(eventName)
            } else {
                const index = listeners.indexOf(eventLisener); // 获取对象在数组中的索引位置
                if (index > -1) {
                    listeners.splice(index, 1); // 通过 splice() 函数将该对象从数组中移除
                } else {
                    console.log("未找到指定对象");
                }
            }
        }

    }
}