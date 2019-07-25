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
define(["require", "exports", "./pokemon", "./pokebutton", "./widget", "./util"], function (require, exports, pokemon_1, pokebutton_1, widget_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PokeButtonCollection = /** @class */ (function (_super) {
        __extends(PokeButtonCollection, _super);
        function PokeButtonCollection() {
            var _this = _super.call(this) || this;
            _this.buttons = [];
            _this._currentConfig = [];
            _this.createEvent("selectchange");
            for (var i = 0; i < pokemon_1.Pokemon.count; i++) {
                var button = new pokebutton_1.PokeButton(i + 1);
                _this.buttons.push(button);
                button.on("selectchange", function () {
                    _this.emitEvent("selectchange");
                });
            }
            _this.appendChild.apply(_this, _this.buttons);
            return _this;
        }
        Object.defineProperty(PokeButtonCollection.prototype, "selectedCount", {
            get: function () {
                return this.buttons.filter(function (button) { return button.selected; }).length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PokeButtonCollection.prototype, "selectedNums", {
            get: function () {
                return this.buttons.filter(function (button) { return button.selected; }).map(function (button) { return button.data.number; });
            },
            set: function (names) {
                this.buttons.forEach(function (button) { return button.selected = util_1.array_contains(names, button.data.number); });
            },
            enumerable: true,
            configurable: true
        });
        PokeButtonCollection.prototype.clearSelected = function () {
            this.buttons.forEach(function (button) { return button.selected = false; });
        };
        PokeButtonCollection.prototype.filterSelected = function () {
            this.buttons.forEach(function (button) {
                if (button.selected) {
                    button.show();
                }
                else {
                    button.hide();
                }
            });
        };
        Object.defineProperty(PokeButtonCollection.prototype, "currentConfig", {
            get: function () {
                return this._currentConfig;
            },
            set: function (config) {
                console.log(config);
                this.filter(function (data) { return util_1.array_contains(config, data.number); });
            },
            enumerable: true,
            configurable: true
        });
        PokeButtonCollection.prototype.filter = function (predicate) {
            var _this = this;
            this._currentConfig = [];
            this.buttons.forEach(function (button) {
                if (predicate(button.data)) {
                    button.show();
                    _this._currentConfig.push(button.data.number);
                }
                else {
                    button.hide();
                }
            });
        };
        PokeButtonCollection.prototype.filterGen = function (gen) {
            this.filter(function (data) { return data.gen === gen; });
        };
        PokeButtonCollection.prototype.filterType = function (type) {
            this.filter(function (data) { return util_1.array_contains(data.types, type); });
        };
        return PokeButtonCollection;
    }(widget_1.Widget));
    exports.PokeButtonCollection = PokeButtonCollection;
});
//# sourceMappingURL=pokebuttoncollection.js.map