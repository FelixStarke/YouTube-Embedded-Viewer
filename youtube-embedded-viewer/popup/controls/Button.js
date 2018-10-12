class Button extends Control {
    constructor(id, text) {
        super(id);
        this.text = text;
        
        this.element = document.createElement('input');
        this.element.id = id;
        this.element.className = 'ui-control button';
        this.element.type = 'button';
        this.element.value = text;

        document.body.appendChild(this.element);
    }
}