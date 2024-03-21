
import { HummerComponent } from "../../HummerComponent"
import { View } from "src/components"; 
const { document: _Document } = __Hummer__;

const hm = __Hummer__;
export class Toast extends HummerComponent {

    public constructor(props: any = {}) {
        super("Toast", props);
    }

    protected static newInstance(): Toast {
        return new Toast();
    }

    protected static checkInstance() {
        if (!hm.__toast__) {
            hm.__toast__ = Toast.newInstance();
        }
    }

    static get instance(): Toast {
        return hm.__toast__
    }


    /**
     * 显示默认Toast
     *
     * @param msg 内容
     * @param duration 时长（安卓上duration<=2000时是短时长，duration>2000是长时长）
     */
    static show(msg: string, duration?: number){
        Toast.checkInstance();
        Toast.instance.show(msg, duration);
    }




    /**
     * 显示自定义Toast
     *
     * @param view 自定义View
     * @param duration 时长（安卓上duration<=2000时是短时长，duration>2000是长时长）
     */
    static custom(view: View, duration: number){
        Toast.checkInstance();
        Toast.instance.custom(view, duration);
    }
   
 

    protected show(msg: string, duration?: number) {
        this.call("show", msg, duration);
    }


    protected custom(view: View, duration: number) {
        this.call("custom", view, duration);
    }

}