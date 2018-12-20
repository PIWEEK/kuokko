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

  private renderRecipes(recipe, index) {
    if (index === 0) {
      return (
        <kuo-recipe-card recipe={recipe} is-main={true}></kuo-recipe-card>
      )
    } else {
      return (
        <kuo-recipe-card recipe={recipe}></kuo-recipe-card>
      )
    }
  }

  render() {
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
          Parece que ha habido un problema en el servidor
        </p>
      )
    }
  }
}
