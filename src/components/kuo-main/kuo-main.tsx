import { Component, Method, State } from '@stencil/core';

@Component({
  tag: 'kuo-main',
  styleUrl: 'kuo-main.css',
  shadow: true
})

export class KuoMain {

  @State() recipes: any[] = [];
  
  componentWillLoad() {
    document.addEventListener('kuokko:search', (event: any) => {
      console.log('kuokko:search', event.detail);
      this.recipes = event.detail;
    });
  }

  @Method()
  renderRecipes(recipes) {
    console.log('renderRecipes', recipes)
    if (recipes) {
      return (
        <kuo-recipes recipes={recipes}>
        </kuo-recipes>
      ) 
    }
  }

  render() {
    return (
      <main class="container">
        <h1 class="title">Benvenutti! Soy Kuokko.</h1>
        <p class="tagline">¿Qué te apetece cocinar?</p>
        <kuo-avatar></kuo-avatar>
        { this.renderRecipes(this.recipes) }
        <div class="feedback">
          Escuchando...
        </div>
      </main>
    );
  }
}