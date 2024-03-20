
import { HummerComponent } from "../../HummerComponent"
// const { document: _Document, __api__ } = __Hummer__

export class NotifyCenter extends HummerComponent {

    public static instance: NotifyCenter;

    public constructor(props: any = {}) {
        super("NotifyCenter", props);
    }

    public static newInstance(): NotifyCenter {
        return new NotifyCenter();
    }

    public static checkInstance() {
        // if (!__api__.notifyCenter) {
        //     __api__.notifyCenter = NotifyCenter.newInstance();
        // }
        if (!NotifyCenter.instance) {
            NotifyCenter.instance = NotifyCenter.newInstance();
        }
    }


    // protected get instance(): NotifyCenter{
    //     // return  __api__.notifyCenter
    //     return NotifyCenter.instance
    // }
   
    /**
     * 添加事件监听
     *
     * @param event 事件名称
     * @param callback 回调事件
     */
    override addEventListener(event: string, callback: (value: Object) => void) {
        NotifyCenter.checkInstance();
        super.addEventListener(event, callback)
    }

    /**
    * 移除事件监听
    *
    * @param event 事件名称
    * @param callback 回调事件
    */
    override removeEventListener(event: string, callback: (value: Object) => void) {
        NotifyCenter.checkInstance();
        if(!callback){
            NotifyCenter.instance.call("removeAllEventListener", event)
        }
        super.removeEventListener(event, callback)
    }



    /**
     * 触发事件
     *
     * @param event 事件名称
     * @param value 消息内容
     */
    protected triggerEvent(event: string, value: Object) {
        NotifyCenter.checkInstance();
        NotifyCenter.instance.call("triggerEvent", event, value);
    }


}