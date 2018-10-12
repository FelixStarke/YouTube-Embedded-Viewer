class Control {
    constructor(id) {
        this.id = id;
        this.element = null;
    }

    /*get id() {
        return this.id;
    }*/

    /*get element() {
        return this.element;
    }*/

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }

    show() {
        if (this.element) {
            this.element.style.display = 'initial';
        }
    }
}