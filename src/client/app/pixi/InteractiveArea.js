
/**
 * Created by Vadim Chadyuk on 13.08.2015.
 */

function InteractiveArea(stage, options) {
    var that = this;

    PIXI.Graphics.call(that);

    that.options = options;
    that.stage = stage;

    that.interactive = true;

    that.hitArea = new PIXI.Rectangle();
    PIXI.Rectangle.apply(that.hitArea, options.sizes);


    that.tap = function() {
        options.onClick(that.stage);
    };

    that.click = function() {
        options.onClick(that.stage);
    };
}

InteractiveArea.prototype = Object.create(PIXI.Graphics.prototype);

