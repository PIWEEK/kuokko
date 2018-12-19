import { Component, Method } from '@stencil/core';
import { subscribe } from '../../js/events';

@Component({
  tag: 'kuo-main',
  styleUrl: 'kuo-main.css',
  shadow: true
})

export class KuoMain {

  recipes = {};
  
  componentWillLoad() {
    console.log('componentWillLoad');
    subscribe('search', (event) => {
      console.log('main', event);
      // this.recipes = event.payload;
    });
  }

  @Method()
  async renderRecipes(recipes) {
    if (recipes) {
      return (
        <kuo-recipes>
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