
import { HummerComponent } from "../../HummerComponent"



export type Env = {
    platform: string,
    osVersion: string,
    appVersion: string,
    appName: string,
    statusBarHeight: number
    safeAreaBottom: number
    deviceWidth: number
    deviceHeight: number
    availableWidth: number
    availableHeight: number
    scale: number
}

export type PageInfo = {
    id: string;
    url: string;
    animated: boolean;
    params?: any
  };
  
  
export class HummerApi extends HummerComponent {

    private static instance: HummerApi;

    public constructor(props: any = {}) {
        super("Hummer", props);
    }

    protected static newInstance(): HummerApi {
        return new HummerApi();
    }

    protected static checkInstance() {
        if (!HummerApi.instance) {
            HummerApi.instance = HummerApi.newInstance();
        }
    }

    /**
     * 获取全局env
     *
     */
    static getEnv(): Env {
        HummerApi.checkInstance();
        return HummerApi.instance.getEnv();
    }

    protected getEnv(): Env {
       return this.call("getEnv");
    }


    /**
     * 获取pageInfo
     *
     */
    static getPageInfo(): PageInfo {
        HummerApi.checkInstance();
        return HummerApi.instance.getPageInfo();
    }

    protected getPageInfo(): PageInfo {
       return this.call("getPageInfo");
    }



    /**
     * 设置setPageResult
     *
     */
    static setPageResult(param: any) {
        HummerApi.checkInstance();
        return HummerApi.instance.setPageResult(param);
    }

    protected setPageResult(param: any) {
       return this.call("setPageResult", param);
    }


}