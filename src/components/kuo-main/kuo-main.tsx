import { Component, State } from '@stencil/core';

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
          <kuo-recipes recipes={this.recipes}></kuo-recipes>
        </section>
      </main>
    );
  }
}