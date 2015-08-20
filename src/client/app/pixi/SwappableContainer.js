
/**
 * Created by Vadim Chadyuk on 13.08.2015.
 */

PIXI.Container.prototype.bringToFront = function() {
    if (this.parent) {
        var parent = this.parent;
        parent.removeChild(this);
        parent.addChild(this);
    }
};

PIXI.Container.prototype.removeChild = function(child)
{
    var index = this.children.indexOf( child );

    if ( index !== -1 )
    {
        this.removeChildren(index, index + 1);
    }
    else
    {
        throw new Error(child + " The supplied DisplayObject must be a child of the caller " + this);
    }
};

function SwappableContainer(stage, display, options) {
    var that = this;
    var initialPoint, finalPoint;

    PIXI.Graphics.call(that);

    that.options = options;
    that.stage = stage;
    that.display = display;
    that.MOVE_SPEED = 70;
    that.next = options.next;
    that.previous = options.previous;
    that.current = options.current;
    that.items = options.items;

    that.hitArea = new PIXI.Rectangle(0, 0, display.x, display.y);

    that.interactive = true;

    that.touchstart = function (interactionData) {
        if (that.interactive) {
            initialPoint = interactionData.data.getLocalPosition(this.parent);
        }
    };

    that.touchend = that.touchendoutside = function (interactionData) {
        if (that.interactive) {
            finalPoint = interactionData.data.getLocalPosition(this.parent);
            var xAbs = Math.abs(initialPoint.x - finalPoint.x);
            var yAbs = Math.abs(initialPoint.y - finalPoint.y);
            if (xAbs > 70 || yAbs > 70) {//check if distance between two points is greater then 20 otherwise discard swap event
                if (xAbs > yAbs) {
                    if (finalPoint.x < initialPoint.x) {
                        that.onSwapLeft();
                    }
                    else {
                        that.onSwapRight();
                    }
                }
            }
        }
    }
}

SwappableContainer.prototype = Object.create(PIXI.Graphics.prototype);

SwappableContainer.prototype.onSwapLeft = function() {
    var that = this;
    var nextItem = that.getNextItem();
    if (that.interactive && nextItem) {
        var nextScene = that.next(that.stage, {x: that.display.x, y: 0}, nextItem, that.current.image);
        that.interactive = false;
        requestAnimationFrame(animate);
        function animate() {
            that.current.x -= that.MOVE_SPEED;
            nextScene.x -= that.MOVE_SPEED;
            if (that.current.x < -that.display.x) {
                nextScene.x = 0;
                that.options.onSwapLeft();
                that.stage.removeChild(that.current);
                that.current = nextScene;
                that.interactive = true;
            } else {
                requestAnimationFrame(animate);
            }
        }
    }
};

SwappableContainer.prototype.onSwapRight = function() {
    var that = this;
    var previousItems = that.getPreviousItem();
    if (that.interactive && previousItems) {
        var previousScene = that.previous(that.stage, {x: -that.display.x, y: 0}, previousItems, that.current.image);
        that.interactive = false;
        requestAnimationFrame(animate);
        function animate() {
            that.current.x += that.MOVE_SPEED;
            previousScene.x += that.MOVE_SPEED;
            if (that.current.x > that.display.x) {
                previousScene.x = 0;
                that.options.onSwapRight();
                that.stage.removeChild(that.current);
                that.current = previousScene;
                that.interactive = true;
            } else {
                requestAnimationFrame(animate);
            }
        }
    }
};

SwappableContainer.prototype.getNextItem = function() {
    var that = this;
    var currentItem = that.current.data;
    var currentIndex = that.items.indexOf(currentItem);
    return that.items[currentIndex + 1];
};

SwappableContainer.prototype.getPreviousItem = function() {
    var that = this;
    var currentItem = that.current.data;
    var currentIndex = that.items.indexOf(currentItem);
    return that.items[currentIndex - 1];
}