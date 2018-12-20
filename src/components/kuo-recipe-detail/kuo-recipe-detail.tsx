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
    @Prop() step: any;

    stepToString(step) {
        let result = [];

        if (step.action === "add") {
            if (step.ingredient.quantity) {
                result.push(`Añada ${step.ingredient.quantity} de ${step.ingredient.name}.`);
            } else {
                result.push(`Añada ${step.ingredient.name}.`);
            }
        } else if (step.action === "wait") {
            result.push(`Espere ${step.time}.`);
        } else if (step.action === "technique") {
            result.push(`${step.technique.name}.`)
        } else if (step.action === "other") {
            result.push(step.description);
        } else {
            result.push("Esta receta es una mierda y no esta completa!");
        }

        if (step.note) {
            result.push(step.note);
        }

        return result;
    }

    humanReadableInstructions() {
        const instructions = this.recipe.method.reduce((acc, v) => acc.concat(v.steps), []);
        return instructions.map((step) => ({ text: this.stepToString(step).join('. '), current: step === this.step }));
    }

    render() {
        console.log('kuo-recipe-detail', this.recipe);
        return (
            <div class="recipes-layout">
                <kuo-recipe-card recipe={this.recipe} is-main={true}></kuo-recipe-card>
                <section class="recipe-information">
                    <div class="recipe-steps">
                        <ul class="recipe-steps-list">
                            {
                                this.humanReadableInstructions().map(({text, current}) => (
                                    <li class={ current ? "current-step" : "" }>{ text }</li>
                                ))
                            }
                        </ul>
                    </div>
                </section>
            </div>
        );
    }
}
