define(["require", "exports", "./util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pokeTypes = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
    var Pokemon = /** @class */ (function () {
        function Pokemon() {
        }
        Pokemon.init = function (callback) {
            var _this = this;
            util_1.httpGET("data.json", function (result) {
                _this.data = JSON.parse(result);
                callback();
                window.data = _this.data;
            });
        };
        Object.defineProperty(Pokemon, "count", {
            get: function () {
                return this.data.length;
            },
            enumerable: true,
            configurable: true
        });
        Pokemon.fromName = function (name) {
            return this.data.find(function (pokeData) { return pokeData.name.toLowerCase() === name.toLowerCase(); });
        };
        Pokemon.fromNumber = function (number) {
            return this.data[number - 1];
        };
        Pokemon.fromGen = function (gen) {
            return this.data.filter(function (pokeData) { return pokeData.gen === gen; });
        };
        Pokemon.data = []; // in order
        return Pokemon;
    }());
    exports.Pokemon = Pokemon;
});
//# sourceMappingURL=pokemon.js.map