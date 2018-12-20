import {
    Component,
    Prop
} from '@stencil/core';

@Component({
    tag: 'kuo-recipe-card',
    styleUrl: 'kuo-recipe-card.css',
    shadow: true
})
export class KuoRecipeDetail {

  @Prop() recipe: any;
  @Prop() isMain: boolean = false;

  hostData() {
    return {
      'class': { 'is-main': this.isMain }
    };
  }

  private renderIngredients(ingredients) {
    if(this.isMain) {
      return (
        <ul class="recipe-ingredients">
          { ingredients.map((ingredient) => {
            return (
              <li>
                {ingredient.quantity ? `${ingredient.quantity} de ` : ''}
                {ingredient.name}
              </li>
            )}
          )}
        </ul>
      )
    }
    return null;
  }

  render() {
    return (
      <article class={`recipe ${this.isMain ? 'is-main' : null}`}>
        <div class="recipe-main">
          <img class="recipe-pic" src="https://loremflickr.com/480/200/food/all" alt=""/>
          <p class="recipe-author">{this.recipe.author} </p>
          <h1 class="recipe-title">{this.recipe.title}</h1>
          <div class="recipe-data">
            <span>
              {this.recipe.cookTime}
            </span>
            <span>
              {this.recipe.difficulty}
            </span>
            <span>
              {this.recipe.servings}
            </span>
          </div>
        </div>
        <div class="recipe-aside">
          {this.renderIngredients(this.recipe.ingredients)}
        </div>
      </article>
    );
  }
}
