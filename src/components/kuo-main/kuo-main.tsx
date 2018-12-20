import { Component, Method, State } from '@stencil/core';

@Component({
  tag: 'kuo-main',
  styleUrl: 'kuo-main.css',
  shadow: true
})

export class KuoMain {

  @State() recipes: any[] = [];
  @State() speech: string = '';
  
  componentWillLoad() {
    document.addEventListener('kuokko:search', (event: any) => {
      console.log('kuokko:search', event.detail);
      this.recipes = event.detail;
    });

    document.addEventListener('kuokko:speech', (event: any) => {
      console.log('kuokko:speech', event.detail);
      this.speech = event.detail;
    });

  }

  @Method()
  renderRecipes(recipes) {
    if (recipes.length) {
      return (
        <kuo-recipes recipes={recipes}></kuo-recipes>
      )
    } else {
      return (
        <p>t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). </p>
      )
    }
  }

  render() {
    return (
      <main class="container">
        <section class="kuokko-area">
          <h1 class="title">Benvenutti! Soy Kuokko.</h1>
          <p class="tagline">¿Qué te apetece cocinar?</p>
          <kuo-avatar speech={this.speech}></kuo-avatar>
          <div class="feedback">
            Escuchando...
          </div>
        </section>
        <section class="kuokko-interactive">
          {
            this.renderRecipes(this.recipes)
          }
        </section>
      </main>
    );
  }
}