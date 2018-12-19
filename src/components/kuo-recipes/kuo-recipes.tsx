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

  @Prop() recipes: any[];

  componentWillUpdate() {
    console.log('kuo-recipes', this.recipes);
  }
  
  private renderRecipes(recipe, index) {
    if (index === 0) {
      return (
        <div>
          <h1>{recipe.title}</h1>
          <p>{recipe.cookTime}</p>
        </div>
      )
    } else {
      return (
        <div>
          <h2>{recipe.title}</h2>
          <p>{recipe.cookTime}</p>
        </div>
      )
    }
  }
  
  render() {
    console.log('kuo-recipes', this.recipes);
    return (
      <div>
        {this.recipes.map((recipe, index) =>
          <div>
            { this.renderRecipes(recipe, index) }
          </div>
        )}
      </div>
    );
  }
}