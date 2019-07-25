import { createElement } from "./util";
import { Widget } from "./widget";
import { Pokemon, PokeData, PokeType } from "./pokemon";

export class PokeButton extends Widget
{
    private $img : HTMLImageElement;
    private $name : HTMLElement;
    public data : PokeData;
    private _selected : boolean;

    constructor(num_or_name : number | string)
    {
        super("pokeButton");

        this.createEvent("selectchange");

        this.$img = <HTMLImageElement>createElement("img");
        this.$name = createElement("div");

        this.appendChild(this.$img, this.$name);

        let data = (typeof(num_or_name) === "number") ? Pokemon.fromNumber(num_or_name) : Pokemon.fromName(num_or_name);
        this.$name.innerText = data.name;
        this.$img.src = data.imageUrl;
        this.data = data;

        this.container.addEventListener("click", () =>
        {
            this.selected = !this.selected;
        });
    }

    public get selected() : boolean
    {
        return this._selected;
    }

    public set selected(selected : boolean)
    {
        this._selected = selected;
        if (this._selected)
        {
            this.container.classList.add("selected");
        }
        else
        {
            this.container.classList.remove("selected");
        }

        this.emitEvent("selectchange");
    }
}