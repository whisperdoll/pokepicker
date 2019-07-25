import { Widget } from "./widget";
import { createElement } from "./util";
import { PokeButton } from "./pokebutton";
import { Pokemon } from "./pokemon";

export class ResultCollection extends Widget
{
    constructor()
    {
        super();
    }

    public display(categories : string[], pokeNums : number[][])
    {
        this.innerHTML = "";

        categories.forEach((category, i) =>
        {
            let title = createElement("div", "title");
            title.innerText = category;
            let section = createElement("div", "section");
            pokeNums[i].forEach(num =>
            {
                let btn = new PokeButton(num);
                section.appendChild(btn.container);
            });

            this.appendChild(title, section);
        });
    }
}