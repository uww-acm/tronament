function Canvas(element) {
    this.element = element;
    this.context = element.getContext("2d");
}

Canvas.prototype.getWidth = function() {
    return this.element.width;
}

Canvas.prototype.getHeight = function() {
    return this.element.height;
}
