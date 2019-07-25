import { createElement, httpGET, array_last, $, hideElement, showElement, capitalize } from "./util";
import { Pokemon, PokeData, pokeTypes } from "./pokemon";
import { PokeButton } from "./pokebutton";
import { PokeButtonCollection, CollectionConfig } from "./pokebuttoncollection";
import { ResultCollection } from "./resultcollection";
import { LabelSlider } from "./labeledslider";

type Mode = "none" | "type" | "gen" | "dex";
let currentMode : Mode = "none";
let buttonCollection : PokeButtonCollection;
let progressCounter = 0;
let progressLimit = 0;
let choices : number[][] = [];
let currentConfig : CollectionConfig;
let defaultHeader = $("#title").innerText;
let resultCollection : ResultCollection;
let categories : string[] = [];
let zoomSlider : LabelSlider;
let genCategories =
[
    "Gen I",
    "Gen II",
    "Gen III",
    "Gen IV",
    "Gen V",
    "Gen VI",
    "Gen VII"
];
let typeCategories = pokeTypes.map(type => capitalize(type));

console.log("sup");
Pokemon.init(() =>
{
    resultCollection = new ResultCollection();
    $("#results").appendChild(resultCollection.container);
    $("#results").appendChild($("#share")); // move it back to the bottom

    zoomSlider = new LabelSlider(0.3, 2.5, 0.1, "Zoom", "zoom");
    $("#zoom-container").appendChild(zoomSlider.container);
    zoomSlider.on("slide", (zoom : number) =>
    {
        let size = (96 * zoom).toString();
        let x = $("#pokeImageStyle");
        x.innerHTML = ".pokeButton img { width: " + size + "px; height: " + size + "px; }";
    });
    zoomSlider.value = 1;

    buttonCollection = new PokeButtonCollection();
    $("#main").appendChild(buttonCollection.container);

    buttonCollection.on("selectchange", () =>
    {
        $("#count").innerText = buttonCollection.selectedCount.toString();
    });
    
    $("#nav-type").addEventListener("click", () => doType());
    $("#nav-gen").addEventListener("click", () => doGen());
    $("#nav-dex").addEventListener("click", () => doDex());

    $("#filter").addEventListener("click", () =>
    {
        buttonCollection.filterSelected();
    });

    $("#unfilter").addEventListener("click", () =>
    {
        buttonCollection.currentConfig = currentConfig;
    });

    $("#next").onclick = () =>
    {
        choices[progressCounter] = buttonCollection.selectedNums;
        progressCounter++;

        if (progressCounter === progressLimit)
        {
            resultCollection.display(categories, choices);
            showResults();
        }
        else
        {
            doNavigationThings();
        }
    };

    $("#back").onclick = () =>
    {
        if (progressCounter !== 0)
        {
            choices[progressCounter] = buttonCollection.selectedNums;
            progressCounter--;

            doNavigationThings();
        }
    };

    $("#share-title").addEventListener("input", () => updateShareUrl());

    let url = window.location;
    let params = new URLSearchParams(url.search);

    if (params.has("mode"))
    {
        if (params.has("choices"))
        {
            let cats : string[];
    
            switch (params.get("mode") as Mode)
            {
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
            if (params.has("title"))
            {
                (<HTMLInputElement>$("#share-title")).value = params.get("title");
            }
    
            showResults();
        }
        else
        {
    
            switch (params.get("mode") as Mode)
            {
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

function updateUrlParams(params : Object)
{
    if (window.history.replaceState)
    {
        let url = window.location.href.split("?")[0];

        for (let key in params)
        {
            if (params.hasOwnProperty(key))
            {
                url = updateURLParameter(url, key, params[key]);
            }
        }

        window.history.replaceState({}, null, url)
    }
}

/**
 * http://stackoverflow.com/a/10997390/11236
 */
function updateURLParameter(url, param, paramVal)
{
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL)
    {
        tempArray = additionalURL.split("&");
        for (var i = 0; i < tempArray.length; i++)
        {
            if(tempArray[i].split("=")[0] != param)
            {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function showPokes()
{
    hideElement($("#welcome"));
    hideElement($("#results"));
    showElement($("#main"));
    showElement($("#bottom"));
}

function showResults()
{
    hideElement($("#welcome"));
    hideElement($("#main"));
    hideElement($("#bottom"));
    showElement($("#results"));
    updateShareUrl();
}

function encodedChoices()
{
    let ret = [];

    let encodeNum = (num) =>
    {
        let arr = "abcdefghijklmnopqrstuvwxyz123456789";
        let first = ~~(num / arr.length);
        let second = num % arr.length;

        return arr[first] + arr[second];
    };

    choices.forEach(arr =>
    {
        let str = "";
        arr.forEach(num =>
        {
            str += encodeNum(num);
        });
        ret.push(str);
    });

    return ret.join("0");
}

function decodeChoices(str : string) : number[][]
{
    let ret : number[][] = [];
    let arr = "abcdefghijklmnopqrstuvwxyz123456789";
    str = str.toLowerCase();
    let sections = str.split("0");

    sections.forEach((section, sectionIndex) =>
    {
        ret.push([]);
        for (let i = 0; i < section.length; i += 2)
        {
            let part = section.substr(i, 2);
            let first = arr.indexOf(part[0]) * arr.length;
            let second = arr.indexOf(part[1]);
            ret[sectionIndex].push(first + second);
        }
    });

    return ret;
}

function updateShareUrl()
{
    let baseUrl = window.location.href.split("?")[0];
    if (baseUrl[baseUrl.length - 1] !== "/")
    {
        baseUrl += "/";
    }

    $("#title").innerText = (<HTMLInputElement>$("#share-title")).value;

    let params = new URLSearchParams({
        mode: currentMode,
        choices: encodedChoices(),
        title: (<HTMLInputElement>$("#share-title")).value
    });

    (<HTMLInputElement>$("#share-url")).value = baseUrl + "?" + params.toString().replace(/%2C/g, ",");

    if (window.history)
    {
        window.history.replaceState({}, null, (<HTMLInputElement>$("#share-url")).value);
    }
}

// call when going back/next/initial //
function doNavigationThings()
{
    switch (currentMode)
    {
        case "type":
            buttonCollection.filterType(pokeTypes[progressCounter]);
            $("#title").innerText = "pick ur fav " + pokeTypes[progressCounter] + "s";
            break;
        case "gen":
            buttonCollection.filterGen(progressCounter + 1);
            $("#title").innerText = "pick ur favs from gen " + (progressCounter + 1).toString();
            break;
    }

    buttonCollection.clearSelected();
    currentConfig = buttonCollection.currentConfig;
    if (choices[progressCounter])
    {
        buttonCollection.selectedNums = choices[progressCounter];
    }

    $("#main").scrollTop = 0;
}

function doType()
{
    $("#nav-btns > div.selected") && $().classList.remove("selected");
    $("#nav-type").classList.add("selected");
    (<HTMLInputElement>$("#share-title")).value = "my favs of each type";
    currentMode = "type";
    progressCounter = 0;
    progressLimit = pokeTypes.length;
    choices = [];
    categories = typeCategories;
    updateUrlParams({
        "mode": "type"
    });

    doNavigationThings();
    showPokes();
}

function doGen()
{
    $("#nav-btns > div.selected") && $().classList.remove("selected");
    $("#nav-gen").classList.add("selected");
    (<HTMLInputElement>$("#share-title")).value = "my favs from each gen";
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

function doDex()
{
    alert("ok well obviously i havent done this yet");
}