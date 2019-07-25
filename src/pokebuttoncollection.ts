import { Pokemon, PokeData } from "./pokemon";
import { PokeButton } from "./pokebutton";
import { Widget } from "./widget";
import { array_contains } from "./util";

export type CollectionConfig = number[];

export class PokeButtonCollection extends Widget
{
    private buttons : PokeButton[] = [];
    private _currentConfig : number[] = [];

    constructor()
    {
        super();

        this.createEvent("selectchange");

        for (let i = 0; i < Pokemon.count; i++)
        {
            let button = new PokeButton(i + 1);
            this.buttons.push(button);
            button.on("selectchange", () =>
            {
                this.emitEvent("selectchange");
            });
        }

        this.appendChild(...this.buttons);
    }

    public get selectedCount() : number
    {
        return this.buttons.filter(button => button.selected).length;
    }

    public get selectedNums() : number[]
    {
        return this.buttons.filter(button => button.selected).map(button => button.data.number);
    }

    public set selectedNums(names : number[])
    {
        this.buttons.forEach(button => button.selected = array_contains(names, button.data.number));
    }

    public clearSelected() : void
    {
        this.buttons.forEach(button => button.selected = false);
    }

    public filterSelected() : void
    {
        this.buttons.forEach((button) =>
        {
            if (button.selected)
            {
                button.show();
            }
            else
            {
                button.hide();
            }
        });
    }

    public get currentConfig() : CollectionConfig
    {
        return this._currentConfig;
    }

    public set currentConfig(config : CollectionConfig)
    {
        console.log(config);
        this.filter(data => array_contains(config, data.number));
    }

    private filter(predicate : (data : PokeData) => boolean) : void
    {
        this._currentConfig = [];
        this.buttons.forEach((button) =>
        {
            if (predicate(button.data))
            {
                button.show();
                this._currentConfig.push(button.data.number);
            }
            else
            {
                button.hide();
            }
        });
    }

    public filterGen(gen : number) : void
    {
        this.filter((data : PokeData) => data.gen === gen);
    }

    public filterType(type : string) : void
    {
        this.filter((data : PokeData) => array_contains(data.types, type));
    }
}