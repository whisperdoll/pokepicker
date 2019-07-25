var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./util", "./widget", "./pokemon"], function (require, exports, util_1, widget_1, pokemon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PokeButton = /** @class */ (function (_super) {
        __extends(PokeButton, _super);
        function PokeButton(num_or_name) {
            var _this = _super.call(this, "pokeButton") || this;
            _this.createEvent("selectchange");
            _this.$img = util_1.createElement("img");
            _this.$name = util_1.createElement("div");
            _this.appendChild(_this.$img, _this.$name);
            var data = (typeof (num_or_name) === "number") ? pokemon_1.Pokemon.fromNumber(num_or_name) : pokemon_1.Pokemon.fromName(num_or_name);
            _this.$name.innerText = data.name;
            _this.$img.src = data.imageUrl;
            _this.data = data;
            _this.container.addEventListener("click", function () {
                _this.selected = !_this.selected;
            });
            return _this;
        }
        Object.defineProperty(PokeButton.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (selected) {
                this._selected = selected;
                if (this._selected) {
                    this.container.classList.add("selected");
                }
                else {
                    this.container.classList.remove("selected");
                }
                this.emitEvent("selectchange");
            },
            enumerable: true,
            configurable: true
        });
        return PokeButton;
    }(widget_1.Widget));
    exports.PokeButton = PokeButton;
});
//# sourceMappingURL=pokebutton.js.map