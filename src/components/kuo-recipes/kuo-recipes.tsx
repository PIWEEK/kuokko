import {
  Component,
  Prop
} from '@stencil/core';

@Component({
  tag: 'kuo-recipes',
  styleUrl: 'kuo-recipes.css',
  shadow: true
})

export class KuoRecipes {

  @Prop() recipes: any[] = [];

  private renderIngredients(ingredients) {
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

  private renderRecipes(recipe, index) {
    if (index === 0) {
      return (
        <article class="recipe recipe-first">
          <div class="recipe-main">
            <img class="recipe-pic" src="https://loremflickr.com/480/200/delicious" alt=""/>
            <p class="recipe-author">{recipe.author} </p>
            <h1 class="recipe-title">{recipe.title}</h1>
            <div class="recipe-data">
              <span>
                {recipe.cookTime}
              </span>
              <span>
                {recipe.difficulty}
              </span>
              <span>
                {recipe.servings}
              </span>
            </div>
          </div>
          <div class="recipe-aside">
            {  this.renderIngredients(recipe.ingredients) }
          </div>
        </article>
      )
    } else {
      return (
        <article class="recipe recipe-secondary">
          <img class="recipe-pic" src="https://loremflickr.com/480/200/savoury" alt=""/>
          <p class="recipe-author">{recipe.author}</p>
          <h2 class="recipe-title">{recipe.title}</h2>
          <div class="recipe-data">
            <span>
              {recipe.cookTime}
            </span>
            <span>
              {recipe.difficulty}
            </span>
            <span>
              {recipe.servings}
            </span>
          </div>
        </article>
      )
    }
  }
  
  render() {
    console.log('kuo-recipes', this.recipes);
    if (this.recipes.length) {
      return (
        <div class="recipes-layout">
          {this.recipes.map((recipe, index) =>
            this.renderRecipes(recipe, index) 
          )}
        </div>
      );
    } else {
      return (
        <p>
          t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
        </p>
      )
    }
  }
}