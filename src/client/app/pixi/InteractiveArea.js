/**
 * Created by Vadim Chadyuk on 13.08.2015.
 */

function InteractiveArea(stage, options) {
    var that = this;

    PIXI.Graphics.call(that);

    that.options = options;
    that.stage = stage;

    that.interactive = true;

    /*that.lineStyle(2, 0x0000FF, 1);
     that.drawRect.apply(that, options.sizes);*/

    that.hitArea = new PIXI.Rectangle();
    PIXI.Rectangle.apply(that.hitArea, options.sizes);

    if (that.options.texture) {
        var sprite = new PIXI.Sprite(that.options.texture);
        sprite.x = options.sizes[0];
        sprite.y = options.sizes[1];
        sprite.width = options.sizes[2];
        sprite.height = options.sizes[3];
        sprite.interactive = true;
        that.addChild(sprite)
    }

    that.tap = function () {
        if (that.interactive) {
            options.onClick(that.stage);
        }
    };

    that.click = function () {
        if (that.interactive) {
            options.onClick(that.stage);
        }
    };
}

InteractiveArea.prototype = Object.create(PIXI.Graphics.prototype);

