class Dropdown extends Control {
    constructor(id, items) {
        super(id);
        this.items = items;

        this.element = document.createElement('select');
        this.element.id = id;
        this.element.className = 'ui-control dropDown';

        for (let i = 0; i < items.length; i++) {
            const item = document.createElement('option');
            item.value = items[i];
            item.textContent = items[i];
            this.element.appendChild(item);
        }

        document.body.appendChild(this.element);
    }
}