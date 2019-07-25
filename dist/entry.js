define(["require", "exports", "./util", "./pokemon", "./pokebuttoncollection", "./resultcollection", "./labeledslider"], function (require, exports, util_1, pokemon_1, pokebuttoncollection_1, resultcollection_1, labeledslider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var currentMode = "none";
    var buttonCollection;
    var progressCounter = 0;
    var progressLimit = 0;
    var choices = [];
    var currentConfig;
    var defaultHeader = util_1.$("#title").innerText;
    var resultCollection;
    var categories = [];
    var zoomSlider;
    var genCategories = [
        "Gen I",
        "Gen II",
        "Gen III",
        "Gen IV",
        "Gen V",
        "Gen VI",
        "Gen VII"
    ];
    var typeCategories = pokemon_1.pokeTypes.map(function (type) { return util_1.capitalize(type); });
    console.log("sup");
    pokemon_1.Pokemon.init(function () {
        resultCollection = new resultcollection_1.ResultCollection();
        util_1.$("#results").appendChild(resultCollection.container);
        util_1.$("#results").appendChild(util_1.$("#share")); // move it back to the bottom
        zoomSlider = new labeledslider_1.LabelSlider(0.3, 2.5, 0.1, "Zoom", "zoom");
        util_1.$("#zoom-container").appendChild(zoomSlider.container);
        zoomSlider.on("slide", function (zoom) {
            var size = (96 * zoom).toString();
            var x = util_1.$("#pokeImageStyle");
            x.innerHTML = ".pokeButton img { width: " + size + "px; height: " + size + "px; }";
        });
        zoomSlider.value = 1;
        buttonCollection = new pokebuttoncollection_1.PokeButtonCollection();
        util_1.$("#main").appendChild(buttonCollection.container);
        buttonCollection.on("selectchange", function () {
            util_1.$("#count").innerText = buttonCollection.selectedCount.toString();
        });
        util_1.$("#nav-type").addEventListener("click", function () { return doType(); });
        util_1.$("#nav-gen").addEventListener("click", function () { return doGen(); });
        util_1.$("#nav-dex").addEventListener("click", function () { return doDex(); });
        util_1.$("#filter").addEventListener("click", function () {
            buttonCollection.filterSelected();
        });
        util_1.$("#unfilter").addEventListener("click", function () {
            buttonCollection.currentConfig = currentConfig;
        });
        util_1.$("#next").onclick = function () {
            choices[progressCounter] = buttonCollection.selectedNums;
            progressCounter++;
            if (progressCounter === progressLimit) {
                resultCollection.display(categories, choices);
                showResults();
            }
            else {
                doNavigationThings();
            }
        };
        util_1.$("#back").onclick = function () {
            if (progressCounter !== 0) {
                choices[progressCounter] = buttonCollection.selectedNums;
                progressCounter--;
                doNavigationThings();
            }
        };
        util_1.$("#share-title").addEventListener("input", function () { return updateShareUrl(); });
        var url = window.location;
        var params = new URLSearchParams(url.search);
        if (params.has("mode")) {
            if (params.has("choices")) {
                var cats = void 0;
                switch (params.get("mode")) {
                    case "gen":
                        cats = genCategories;
                        currentMode = "gen";
                        break;
                    case "type":
                        cats = typeCategories;
                        currentMode = "type";
                        break;
                    default:
                        return;
                }
                choices = decodeChoices(params.get("choices"));
                resultCollection.display(cats, choices);
                if (params.has("title")) {
                    util_1.$("#share-title").value = params.get("title");
                }
                showResults();
            }
            else {
                switch (params.get("mode")) {
                    case "gen":
                        doGen();
                        break;
                    case "type":
                        doType();
                        break;
                    default:
                        return;
                }
            }
        }
    });
    function updateUrlParams(params) {
        if (window.history.replaceState) {
            var url = window.location.href.split("?")[0];
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    url = updateURLParameter(url, key, params[key]);
                }
            }
            window.history.replaceState({}, null, url);
        }
    }
    /**
     * http://stackoverflow.com/a/10997390/11236
     */
    function updateURLParameter(url, param, paramVal) {
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";
        if (additionalURL) {
            tempArray = additionalURL.split("&");
            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i].split("=")[0] != param) {
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }
        var rows_txt = temp + "" + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    }
    function showPokes() {
        util_1.hideElement(util_1.$("#welcome"));
        util_1.hideElement(util_1.$("#results"));
        util_1.showElement(util_1.$("#main"));
        util_1.showElement(util_1.$("#bottom"));
    }
    function showResults() {
        util_1.hideElement(util_1.$("#welcome"));
        util_1.hideElement(util_1.$("#main"));
        util_1.hideElement(util_1.$("#bottom"));
        util_1.showElement(util_1.$("#results"));
        updateShareUrl();
    }
    function encodedChoices() {
        var ret = [];
        var encodeNum = function (num) {
            var arr = "abcdefghijklmnopqrstuvwxyz123456789";
            var first = ~~(num / arr.length);
            var second = num % arr.length;
            return arr[first] + arr[second];
        };
        choices.forEach(function (arr) {
            var str = "";
            arr.forEach(function (num) {
                str += encodeNum(num);
            });
            ret.push(str);
        });
        return ret.join("0");
    }
    function decodeChoices(str) {
        var ret = [];
        var arr = "abcdefghijklmnopqrstuvwxyz123456789";
        str = str.toLowerCase();
        var sections = str.split("0");
        sections.forEach(function (section, sectionIndex) {
            ret.push([]);
            for (var i = 0; i < section.length; i += 2) {
                var part = section.substr(i, 2);
                var first = arr.indexOf(part[0]) * arr.length;
                var second = arr.indexOf(part[1]);
                ret[sectionIndex].push(first + second);
            }
        });
        return ret;
    }
    function updateShareUrl() {
        var baseUrl = window.location.href.split("?")[0];
        if (baseUrl[baseUrl.length - 1] !== "/") {
            baseUrl += "/";
        }
        util_1.$("#title").innerText = util_1.$("#share-title").value;
        var params = new URLSearchParams({
            mode: currentMode,
            choices: encodedChoices(),
            title: util_1.$("#share-title").value
        });
        util_1.$("#share-url").value = baseUrl + "?" + params.toString().replace(/%2C/g, ",");
        if (window.history) {
            window.history.replaceState({}, null, util_1.$("#share-url").value);
        }
    }
    // call when going back/next/initial //
    function doNavigationThings() {
        switch (currentMode) {
            case "type":
                buttonCollection.filterType(pokemon_1.pokeTypes[progressCounter]);
                util_1.$("#title").innerText = "pick ur fav " + pokemon_1.pokeTypes[progressCounter] + "s";
                break;
            case "gen":
                buttonCollection.filterGen(progressCounter + 1);
                util_1.$("#title").innerText = "pick ur favs from gen " + (progressCounter + 1).toString();
                break;
        }
        buttonCollection.clearSelected();
        currentConfig = buttonCollection.currentConfig;
        if (choices[progressCounter]) {
            buttonCollection.selectedNums = choices[progressCounter];
        }
        util_1.$("#main").scrollTop = 0;
    }
    function doType() {
        util_1.$("#nav-btns > div.selected") && util_1.$().classList.remove("selected");
        util_1.$("#nav-type").classList.add("selected");
        util_1.$("#share-title").value = "my favs of each type";
        currentMode = "type";
        progressCounter = 0;
        progressLimit = pokemon_1.pokeTypes.length;
        choices = [];
        categories = typeCategories;
        updateUrlParams({
            "mode": "type"
        });
        doNavigationThings();
        showPokes();
    }
    function doGen() {
        util_1.$("#nav-btns > div.selected") && util_1.$().classList.remove("selected");
        util_1.$("#nav-gen").classList.add("selected");
        util_1.$("#share-title").value = "my favs from each gen";
        currentMode = "gen";
        progressCounter = 0;
        progressLimit = 7;
        choices = [];
        categories = genCategories;
        updateUrlParams({
            "mode": "gen"
        });
        doNavigationThings();
        showPokes();
    }
    function doDex() {
        alert("ok well obviously i havent done this yet");
    }
});
//# sourceMappingURL=entry.js.map