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
define(["require", "exports", "./widget", "./util", "./pokebutton"], function (require, exports, widget_1, util_1, pokebutton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResultCollection = /** @class */ (function (_super) {
        __extends(ResultCollection, _super);
        function ResultCollection() {
            return _super.call(this) || this;
        }
        ResultCollection.prototype.display = function (categories, pokeNums) {
            var _this = this;
            this.innerHTML = "";
            categories.forEach(function (category, i) {
                var title = util_1.createElement("div", "title");
                title.innerText = category;
                var section = util_1.createElement("div", "section");
                pokeNums[i].forEach(function (num) {
                    var btn = new pokebutton_1.PokeButton(num);
                    section.appendChild(btn.container);
                });
                _this.appendChild(title, section);
            });
        };
        return ResultCollection;
    }(widget_1.Widget));
    exports.ResultCollection = ResultCollection;
});
//# sourceMappingURL=resultcollection.js.map