import * as l from "lodash";
import slugify from "speakingurl";

import * as synth from "./speechSynthesis";
import * as api from "./api";
import * as events from "./events";

// --- Handlers

export function initialHandler() {
  return {
    match() { },
    onEnter() {},
    onLeave() {},
    async handle() {
      await synth.speak('Benvenutti! Soy kuokko, busca una receta');
    }
  }
}

export function searchHandler() {
  const tokens = [
    ["dam", "recet", "de"],
    ["busc", "recet", "de"],
    ["tien", "recet", "de"],
  ];

  return {
    async match(input) {
      const matches = matchTokensList(tokens, input);
      this.state.search = {matches};
      return !!matches;
    },

    async handle(text) {
      const {matches} = this.state.search;
      await synth.speak(`Ok, un segundo. Buscando recetas de ${matches.rest.join(" ")}`);

      const term = matches.rest.join(" ");
      const results = await api.search(matches.rest.join(" "));

      events.emit("search", results);

      this.state.searchResults = results;
      this.state.searchResultsFound = results.length;
      this.state.searchResultsIndex = 0;

      if (this.state.searchResultsFound === 0) {
        await synth.speak("No he encotrado ninguna receta.");
      } else {
        const candidate = this.state.recipe = this.state.searchResults[this.state.searchResultsIndex];

        events.emit("recipe", candidate);
        if (this.state.searchResultsFound === 1) {
          // const candidate = this.state.searchResults[this.state.searchResultsExposed];
          await synth.speak(`Tengo una receta de ${term}. `
                      + `Te puede intereresar ${candidate.title}. ¿Empezamos?`);

        } else {
          if (this.state.searchResultsFound < 6) {
            await synth.speak(`Tengo ${this.state.searchResultsFound} recetas de ${term}. `
                        + `Te puede intereresar ${candidate.title}. ¿Empezamos?`);
          } else {
            await synth.speak(`Tengo muchas recetas de ${term}. `
                        + `Te puede intereresar ${candidate.title}. ¿Empezamos?`);
          }
        }
      }
    }
  };
}

export function searchNextResultHandler() {
  const tokens = [
    ["dime", "otr"],
    ["dame", "otr"],
    ["siguiente"]
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      this.state.searchResultsIndex++;
      if (this.state.searchResults.length > this.state.searchResultsIndex) {
        const candidate = this.state.recipe = this.state.searchResults[this.state.searchResultsIndex];
        await synth.speak(`La siguiente receta es: ${candidate.title}. ¿Empezamos?`);
      } else {
        await synth.speak(`No hay mas recetas!`);
        this.state.searchResultsIndex--;
      }
    }
  };
}

export function searchInfoHandler() {
  const tokens = ["mas", "info"];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      const recipe = this.state.recipe;

      let msg = "";

      if (recipe.servings === 1) {
        msg += `Es una receta para 1 persona, `;
      } else {
        msg += `Es una receta para ${recipe.servings} personas, `;
      }

      if (recipe.dificulty === "easy") {
        msg += "de dificultad baja.";
      } else if (recipe.dificultad === "medium") {
        msg += "de dificultad media.";
      } else {
        msg += "de dificultad alta.";
      }

      const time = parseMinutes(recipe.cookTime);
      msg += `El tiempo de elaboración es de ${time} minutos`;

      await synth.speak(msg)
      await synth.speak("¿Empezamos?")
    }
  };
}

export function searchInfoTimeHandler() {
  const tokens = [
    ["cuant", "tarda"],
    ["cuant", "tiemp"]
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      const recipe = this.state.recipe;
      const time = parseMinutes(recipe.cookTime);
      const msg = (`El tiempo de elaboración es de ${time} minutos` +
                   "¿Quieres saber algo mas?");
      await synth.speak(msg);
    }
  };
}

export function searchInfoDifficultyHandler() {
  const tokens = [
    ["muy", "dificil"],
    ["que", "dificult", "tiene"]
  ]

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      const recipe = this.state.recipe;
      let msg = "La receta es de dificultad ";

      if (recipe.dificulty === "easy") {
        msg += "baja.";
      } else if (recipe.dificultad === "medium") {
        msg += "media.";
      } else {
        msg += "alta.";
      }

      msg += "¿Quieres saber algo mas?";

      await synth.speak(msg)
    }
  };
}

export function searchInfoGuestsHandler() {
  const tokens = [
    ["cuant", "comensal"],
    ["cuant", "pers"]
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      const recipe = this.state.recipe;
      if (recipe.servings === 1) {
        await synth.speak(`Es una receta para 1 persona.`);
      } else {
        await synth.speak(`Es una receta para ${recipe.servings} personas.`);
      }
    }
  };
}


export function searchInfoNoMoreHandler() {
  const tokens = ["no"];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      await synth.speak("Genial, ¿Empezamos?");
    }
  };
}


export function startHandler() {
  const tokens = [
    ["si"],
    ["empezamos"],
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      await synth.speak("Perfecto, Primero vamos a preparar los ingredientes, ¿Preparado?");
    }
  };
}

export function recipeIngredientsHandler() {
  const tokens = [
    ["si"],
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      const recipe = this.state.recipe;
      await synth.speak("Ok, los ingredientes son:");

      for (let item of recipe.ingredients) {
        const result = [];
        if (item.quantity) {
          result.push(item.quantity, "de");
        }

        result.push(item.name);

        if (item.preparation) result.push(item.preparation);

        await synth.speak(`${result.join(" ")},`);
      }

      await synth.speak("¿Los tienes preparados?");
    }
  };
}

export function recipeIngredientsReadyHandler() {
  const tokens = [
    ["si"],
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      const recipe = this.state.recipe;

      this.state.recipeSteps = recipe.method.reduce((acc, {steps}) => {
        return [...acc, ...steps];
      }, []);

      this.state.recipeStepsNumber = this.state.recipeSteps.length;
      this.state.recipeCurrentStep = -1;

      await synth.speak("Pues empecemos:");
      this.transitionTo("recipe/preparation/nextstep");
    }
  };
}

export function recipePreparationNextStep() {
  const tokens = [
    ["siguient", "paso"],
    ["siguient", "cuoco"],
    ["siguient", "coco"],
    ["siguiente"],
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      const recipe  = this.state.recipe;
      const steps   = this.state.recipeSteps;
      const current = ++this.state.recipeCurrentStep;

      if (current < steps.length) {
        const step = steps[current];
        console.log(step);

        if (step.action === "add") {
          await synth.speak(`Añada ${step.ingredient.name}.`);
          if (step.note) {
            await synth.speak(step.note);
          }
        } else if (step.action === "wait") {
          await synth.speak(`Espere ${step.time}.`);
          if (step.note) {
            await synth.speak(step.note);
          }
        } else if (step.action === "technique") {
          await synth.speak(`${step.technique.name}.`)
          if (step.note) {
            await synth.speak(step.note);
          }
        } else if (step.action === "other") {
          await synth.speak(step.description);
        } else {
          await synth.speak("Esta receta es una mierda y no esta completa!");
        }
      }

      if (current === steps.length-1) {
        await synth.speak(`Y ya esta, ya tienes tu ${recipe.title}.`);
        this.stop();
      }
    }
  };
}


export function recipePreparationRepeatStep() {
  const tokens = [
    ["pued", "repetir"],
    ["repit", "paso"],
    ["repit"],
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      this.state.recipeCurrentStep--;
      await synth.speak("Claro!");
      this.transitionTo("recipe/preparation/nextstep");
    }
  };
}

export function globalTimerHandler() {
  const tokens = [
    ["temporizador", "a"],
    ["temporizador", "de"],
    ["timer", "de"],
  ];

  return {
    async match(input) {
      const matches = matchTokensList(tokens, input);

      this.state.timer = {matches};
      return !!matches;
    },

    async handle(text) {
      const numRe = /\d+/;
      const unitRe = /(?:minutos|segundos)/;
      const matches = this.state.timer.matches.rest;

      if (matches.length >= 2 &&
          matches[0] === "un" &&
          matches[1] === "minuto") {

        await synth.speak("Ok, timer iniciado.");

        this.state.timer.cursor = setTimeout(async () => {
          await synth.speak(`El timer de ${matches.join(" ")} ha terminado.`);
        }, 60*1000);
      } else if (matches.length >= 2 &&
                 numRe.test(matches[0]) &&
                 unitRe.test(matches[1])) {
        let time = null;

        if (matches[1] === "minutos") {
          time = parseInt(matches[0], 10) * 60;
        } else {
          time = parseInt(matches[0], 10);
        }

        await synth.speak("Ok, timer iniciado.");

        this.state.timer.cursor = setTimeout(async () => {
          await synth.speak(`El timer de ${matches.join(" ")} ha terminado.`);
        }, time*1000);
      }

    }
  };
}

// --- Special Handlers

export function doYouHearMeHandler() {
  const tokens = [
    ["me", "escuch"],
    ["me", "oye"],
    ["me", "hace", "cas"]
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      await synth.speak("No, paso de tí");
    }
  };
}

export function howAreYouHandler(){
  const tokens = [
    ["com", "estas"],
    ["como", "va"],
    ["estas", "bien"]
  ];

  const responses = [
    "Eccellente!"
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      await synth.speak(responses[Math.floor(Math.random() * responses.length)]);
    }
  };
}

export function iHaveOneQuestionHandler(){
  const tokens = [
    ["tengo", "una", "pregunta"],
  ];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      synth.speak("27 centimetros");
    }
  };
}

export function fallback() {
  const tokens = [
    ["rapido"],
  ];
  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle() {
      const results = await api.search("ensalada");

      this.state.searchResults = results;
      this.state.searchResultsFound = results.length;
      this.state.searchResultsIndex = 0;
      this.state.recipe = results[0];

      this.transitionTo("recipe/ready");
    }
  }
}

// --- Helpers

function parseMinutes(v) {
  const result = /\d+/.exec(v);
  return result[0];
};

function tokenize(text) {
  return text.split(/[^0-9a-zA-Zá-úÁ-ÚñÑüÜ]+/).map(slugify);
}

function matchTokens(base, incoming) {
  incoming = tokenize(incoming);

  let maxIndex = -1;
  let found = 0;

  for (let token of base) {
    for (let i=0; i<incoming.length; i++) {
      const matchingToken = token;
      const incomingItem = incoming[0]

      const matches = incoming[i].indexOf(token) !== -1;
      if (matches && i > maxIndex) {
        found++;
        maxIndex = i;
        break;
      }
    }
  }

  if (found === base.length) {
    return {
      rest: incoming.slice(maxIndex+1),
      data: incoming
    };
  } else {
    return null;
  }
}

function matchTokensList(tokensList, incoming) {
  if (l.isString(tokensList[0])) {
    tokensList = [tokensList]
  };

  let matches = false;
  for (let item of tokensList) {
    matches = matchTokens(item, incoming);
    if (matches) return matches;
  }

  return matches;
}
