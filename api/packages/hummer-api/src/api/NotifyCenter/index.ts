
import { HummerComponent } from "../../HummerComponent"
const { document: _Document } = __Hummer__;

const hm = __Hummer__;
// let __api__: any;

export class NotifyCenter extends HummerComponent {


    public constructor(props: any = {}) {
        super("NotifyCenter", props);
    }

    protected static checkInstance() {
        // __api__ = hm.__api__;
        if (!hm.__notifyCenter__) {
            hm.__notifyCenter__ = NotifyCenter.newInstance();
        }
    }

    protected static newInstance(): NotifyCenter {
        return new NotifyCenter();
    }


    static get instance(): NotifyCenter {
        return hm.__notifyCenter__
    }

    /**
     * 添加事件监听
     *
     * @param event 事件名称
     * @param callback 回调事件
     */
    static addEventListener(event: string, callback: (value: Object) => void) {
        NotifyCenter.checkInstance();
        NotifyCenter.instance.addEventListener(event, callback)
    }

    /**
    * 移除事件监听
    *
    * @param event 事件名称
    * @param callback 回调事件
    */
    static removeEventListener(event: string, callback: (value: Object) => void) {
        NotifyCenter.checkInstance();
        if(!callback){
            NotifyCenter.instance.call("removeAllEventListener", event)
        }else {
            NotifyCenter.instance.removeEventListener(event, callback)
        }

    }



    /**
     * 触发事件
     *
     * @param event 事件名称
     * @param value 消息内容
     */
    static triggerEvent(event: string, value: Object) {
        NotifyCenter.checkInstance();
        NotifyCenter.instance.call("triggerEvent",event, value);
    }



}