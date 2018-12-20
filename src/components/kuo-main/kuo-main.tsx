import { Component, State } from '@stencil/core';

@Component({
  tag: 'kuo-main',
  styleUrl: 'kuo-main.css',
  shadow: true
})

export class KuoMain {

  @State() recipes: any[] = [];
  @State() speech: string = '';

  searchRecipes() {
    const baseUrl = (window as any).kuokkoConfig.baseUrl;

    function makeSearch() {
      const url = `${baseUrl}/recipes`;
    
      const request = new Request(url, {
        method: "GET",
        mode: "cors"
      });
    
      return fetch(request).then((response) => {
        return response.json();
      });
    }
    
    function getRecipe(id) {
      const url = `${baseUrl}/recipes/${id}`;
    
      const request = new Request(url, {
        method: "GET",
        mode: "cors"
      });
    
      return fetch(request).then((response) => {
        return response.json();
      });
    }

    return makeSearch().then((results) => {
      return Promise.all(results.map(({id}) => getRecipe(id)));
    });
  }
  
  async componentWillLoad() {
    this.recipes = await this.searchRecipes();

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
          <h1 class="title">Benvenutti!<br /> Soy Kuokko.</h1>
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