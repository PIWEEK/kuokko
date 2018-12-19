import { Component } from '@stencil/core';
// import * as rxOp from 'rxjs/operators';
// import bus from '../../js/events';

@Component({
  tag: 'kuo-main',
  styleUrl: 'kuo-main.css',
  shadow: true
})

export class MyComponent {

  private recipes = {};
  
  componentWillLoad() {
    console.log('componentWillLoad');
    // bus.pipe(
    //   rxOp.filter((message) => {
    //     return message.type = "search";
    //   })
    // ).subscribe((event) => {
    //   this.recipes = event.payload;
    // });
  }

  private renderRecipes(recipes) {
    if (recipes) {
      return <kuo-recipes></kuo-recipes>;
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