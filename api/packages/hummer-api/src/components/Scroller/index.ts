const { document: _Document } = __Hummer__

import { HummerElement } from "../../HummerElement"
import { View } from "../View"

export class Scroller extends HummerElement {

    protected _bounces: boolean = true;

    protected _showScrollBar: boolean = false;

    protected _onLoadMore: (state: number) => void = () => { };

    protected _onRefresh: (state: number) => void = () => { };

    protected _refreshView: View = new View();
    protected _loadMoreView: View = new View();




    /**
     * 
     * @param id
     * @param name 
     * @param props 
     */
    public constructor(id: string = "", name: string = "", props: any = {}) {
        super("Scroller", name, { ...props, viewId: id });
    }


    /**
    * 下拉刷新时展示的视图
    */
    get refreshView() {
        return this._refreshView;
    }

    set refreshView(value: View) {
        this._refreshView = value;
        this._setAttribute("refreshView", value);
    }

    /**
    * 上拉加载更多时展示的视图
    */
    get loadMoreView() {
        return this._loadMoreView;
    }

    set loadMoreView(value: View) {
        this._loadMoreView = value;
        this._setAttribute("loadMoreView", value);
    }


    /**
     * 上拉加载时触发的回调
     */
    get onLoadMore() {
        return this._onLoadMore;
    }

    set onLoadMore(value: (state: number) => void) {
        this._onLoadMore = value;
        this._setAttribute("onLoadMore", value);
    }


    /**
     * 下拉刷新时触发的回调
     */
    get onRefresh() {
        return this._onRefresh;
    }

    set onRefresh(value: (state: number) => void) {
        this._onRefresh = value;
        this._setAttribute("onRefresh", value);
    }




    /**
     * 滑动到边缘时是否有回弹效果
     */
    get bounces() {
        return this._bounces;
    }

    set bounces(value: boolean) {
        this._bounces = value;
        this._setAttribute("bounces", value);
    }

    /**
     * 滑动时是否显示滚动条
     */
    get showScrollBar() {
        return this._showScrollBar;
    }

    set showScrollBar(value: boolean) {
        this._showScrollBar = value;
        this._setAttribute("showScrollBar", value);
    }


    /**
     * 滚动到指定坐标（单位：dp/pt/hm/px）
     */
    scrollTo(x: Object, y: Object) {
        this.call("scrollTo", x, y);
    }

    /**
    * 滚动到指定坐标（单位：dp/pt/hm/px）
    */
    scrollBy(dx: Object, dy: Object) {
        this.call("scrollBy", dx, dy);
    }


    /**
    * 滚动到顶部
    */
    scrollToTop() {
        this.call("scrollToTop");
    }


    /**
    * 滚动到底部
    */
    scrollToBottom() {
        this.call("scrollToBottom");
    }



    /**
    * 滚动到顶部事件监听
    */
    setOnScrollToTopListener(callback: () => void) {
        this.addEventListener('onScrollTop',callback)
    }

    /**
     * 滚动到底部事件监听
     */
    setOnScrollToBottomListener(callback: () => void) {
        this.addEventListener('onScrollBottom',callback)
    }



    /**
    * 结束下拉刷新
    */
    stopPullRefresh() {
        this.call("stopPullRefresh");
    }


    /**
     * 结束上拉加载更多
     * 
     * @param enable 下次能否继续触发加载更多
     */
    stopLoadMore(enable: boolean) {
        this.call("stopLoadMore", enable);
    }

}