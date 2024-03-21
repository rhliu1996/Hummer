const { document: _Document } = __Hummer__

import { HummerElement } from "../../HummerElement"

export class TextArea extends HummerElement {


    /**
     * 
     * @param id
     * @param name 
     * @param props 
     */
    public constructor(id: string = "", name: string = "", props: any = {}) {
        super("TextArea", name, { ...props, viewId: id });
        this._initAttributes({
            text: '',
            placeholder: '',
            focused: 'false'
        });
        this.addEventListener('input', (event: any) => {
            this._setAttribute("text", event.text, false);
        });
    }


    /**
     * 默认输入内容
     */
    get text() {
        return this._getAttribute('text');
    }

    set text(value: string) {
        this._setAttribute("text", value);
    }

    /**
     * placeholder内容
     */
    get placeholder() {
        return this._getAttribute('placeholder');
    }

    set placeholder(value: string) {
        this._setAttribute("placeholder", value);
    }


    /**
     * 是否处于激活状态
     */
    get focused() {
        return this._getAttribute('focused');
    }

    set focused(value: boolean) {
        this._setAttribute("focused", value);
    }




}