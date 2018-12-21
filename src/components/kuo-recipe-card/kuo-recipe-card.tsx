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

  private renderDifficulty(difficulty) {
    switch(difficulty) {
      case 'easy':
        return 'fácil';
      case 'hard':
        return 'difícil';
      default:
        return 'moderado';
    }
  }

  render() {
    const styles = {
      backgroundImage: `url(${this.recipe.photoUrl})`
    };
    return (
      <article class={`recipe ${this.isMain ? 'is-main' : ''}`}>
        <div class="recipe-main">
          <div class="recipe-pic" style={styles}></div>
          {/* <img class="recipe-pic" src={this.renderImage()} alt=""/> */}
          <p class="recipe-author">{this.recipe.author} </p>
          <h1 class="recipe-title">{this.recipe.title}</h1>
          <div class="recipe-summary">
            <span class="time">
              {this.recipe.cookTime}
            </span>
            <span class="difficulty">
              {this.renderDifficulty(this.recipe.difficulty)}
            </span>
            <span class="servings">
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
