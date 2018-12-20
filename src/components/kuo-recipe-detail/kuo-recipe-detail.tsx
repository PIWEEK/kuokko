import {
    Component,
    Prop
} from '@stencil/core';

@Component({
    tag: 'kuo-recipe-detail',
    styleUrl: 'kuo-recipe-detail.css',
    shadow: true
})
export class KuoRecipeDetail {

    @Prop() recipe: any;

    render() {
        console.log('kuo-recipe-detail', this.recipe);
        return (
            <div class="recipes-layout">
                <article class="recipe">
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
                        <ul class="recipe-ingredients">
                            { this.recipe.ingredients.map((ingredient) => {
                                  return (
                                      <li>
                                          {ingredient.quantity ? `${ingredient.quantity} de ` : ''}
                                          {ingredient.name}
                                      </li>
                                  )}
                            )}
                        </ul>
                    </div>
                </article>

                <section class="recipe-information">
                    <h2 class="recipe-title">Ensalada de pasta con atún y tomate</h2>
                    <div class="recipe-summary">
                        <div class="time">30 minutos</div>
                        <div class="difficulty">Fácil</div>
                        <div class="servings">3 personas</div>
                    </div>
                    <div class="recipe-steps">
                        <ul class="recipe-steps-list">
                            <li>Cocer la pasta</li>
                            <li>Escurrir</li>
                            <li>Echar un chorrito de aceite de oliva (para que se apelmace y seguidamente la dejamos enfriar)</li>
                            <li class="current-step">Escurrir bien el atún del aceite que traen las latas</li>
                            <li>Echarlo en una ensaladera</li>
                            <li>Picar los palitos de cangrejo en rodajas finas</li>
                            <li>Mezclar en la ensaladera con el atún.</li>
                            <li>Mezclar con el queso de cabra en taquitos pequeños. </li>
                            <li>Cortar los tomates cherry a la mitad.</li>
                            <li>Cortar las aceitunas negras en rodajas</li>
                            <li>Dejar las aceitunas rellenas enteras</li>
                            <li>Cocer la pasta</li>
                            <li>Escurrir</li>
                            <li>Echar un chorrito de aceite de oliva (para que se apelmace y seguidamente la dejamos enfriar)</li>
                            <li>Escurrir bien el atún del aceite que traen las latas</li>
                            <li>Echarlo en una ensaladera</li>
                            <li>Picar los palitos de cangrejo en rodajas finas</li>
                            <li>Mezclar en la ensaladera con el atún.</li>
                            <li>Mezclar con el queso de cabra en taquitos pequeños. </li>
                            <li>Cortar los tomates cherry a la mitad.</li>
                            <li>Cortar las aceitunas negras en rodajas</li>
                            <li>Dejar las aceitunas rellenas enteras.</li>
                        </ul>
                    </div>
                </section>
            </div>
        );
    }
}
