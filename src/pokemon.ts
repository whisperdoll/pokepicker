import Storage from "./storage";
import { httpGET } from "./util";

export type PokeType = "normal" | "fighting" | "flying" | "poison" | "ground" | "rock" | "bug" | "ghost" | "steel" | "fire" | "water" | "grass" | "electric" | "psychic" | "ice" | "dragon" | "dark" | "fairy";
export const pokeTypes = [ "normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy" ];

export interface PokeData
{
    name : string;
    number : number;
    gen : number;
    types : PokeType[];
    imageUrl : string;
}

export class Pokemon
{
    private static data : PokeData[] = []; // in order

    static init(callback : () => void) : void
    {
        httpGET("data.json", (result : string) =>
        {
            this.data = JSON.parse(result);
            callback();
            (<any>window).data = this.data;
        });
    }

    static get count() : number
    {
        return this.data.length;
    }

    static fromName(name : string) : PokeData
    {
        return this.data.find(pokeData => pokeData.name.toLowerCase() === name.toLowerCase());
    }

    static fromNumber(number : number) : PokeData
    {
        return this.data[number - 1];
    }

    static fromGen(gen : number) : PokeData[]
    {
        return this.data.filter(pokeData => pokeData.gen === gen);
    }
}