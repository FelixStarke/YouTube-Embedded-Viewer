class ToggleButton extends Control {
    constructor(id, text, state) {
        super(id);
        this.text = text;
        this.state = state;

        this.element = document.createElement('input');
        this.element.id = id;
        this.element.className = 'ui-control toggle-button';
        this.element.type = 'button';
        this.element.value = text;
        
        if (state) {
            this.element.classList.add('toggle-button-active');
        } else {
            this.element.classList.add('toggle-button-inactive');
        }

        document.body.appendChild(this.element);
    }
}