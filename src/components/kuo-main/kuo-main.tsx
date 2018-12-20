import { Component, State } from '@stencil/core';
import Fragment from 'stencil-fragment'

@Component({
    tag: 'kuo-main',
    styleUrl: 'kuo-main.css',
    shadow: true
})

export class KuoMain {
    @State() state?: 'list' | 'detail' = 'list';
    @State() recipes: any[] = [];
    @State() speech: string = '';

    @State() detail: any;
    @State() step: number;

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
        const recipes = this.recipes = await this.searchRecipes();

        document.addEventListener('kuokko:search', (event: any) => {
            console.log('kuokko:search', event.detail);
            this.recipes = event.detail;
            this.state = 'list';
        });

        document.addEventListener('kuokko:speech', (event: any) => {
            console.log('kuokko:speech', event.detail);
            this.speech = event.detail;
        });

        document.addEventListener('kuokko:terminate', () => {
            console.log('kuokko:terminate');
            this.recipes = recipes;
        });

        document.addEventListener('kuokko:recipe', (event: any) => {
            console.log('kuokko:recipe', event);
            this.state = 'detail';
            this.detail = event.detail;
            this.step = null;
        });

        document.addEventListener('kuokko:recipe:step', (event: any) => {
            console.log('kuokko:recipe:step', event);
            this.step = event.detail;
        });

    }

    render() {
        let section = null;

        switch(this.state) {
            case 'list':
                section = <kuo-recipes recipes={this.recipes}></kuo-recipes>;
                break;

            case 'detail':
                section = <kuo-recipe-detail recipe={this.detail} step={this.step}></kuo-recipe-detail>;
                break;
        }

        return (
            <Fragment>
                <section class="kuokko-area kuokko-sticky">
                  <div class="kuokko-sticky">
                    <h1 class="title">Benvenutti! Soy Kuokko.</h1>
                    <p class="tagline">¿Qué te apetece cocinar?</p>
                    <kuo-avatar speech={this.speech}></kuo-avatar>
                    <div class="feedback">
                        Escuchando...
                    </div>
                  </div>
                </section>
                <section class="kuokko-interactive">
                  { section }
                </section>
            </Fragment>
        );
    }
}
