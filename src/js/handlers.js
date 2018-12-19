import * as l from "lodash";
import slugify from "speakingurl";

import * as synth from "./speechSynthesis";
import * as api from "./api";

// --- Handlers

export function initialHandler() {
  return {
    match() { },
    onEnter() {},
    onLeave() {},
    async handle() {
      //synth.speak('Benvenutti! Soy kuokko, busca una receta');
      console.warn('Manifest para móvil');
    }
  }
}

export function searchHandler() {
  const tokens = [
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
      synth.speak(`Ok, un segundo. Buscando recetas de ${matches.rest.join(" ")}`);

      const term = matches.rest.join(" ");
      const results = await api.search(matches.rest.join(" "));

      this.state.searchResults = results;
      this.state.searchResultsFound = results.length;
      this.state.searchResultsIndex = 0;

      if (this.state.searchResultsFound === 0) {
        synth.speak("No he encotrado ninguna receta.");
      } else {
        const candidate = this.state.recipe = this.state.searchResults[this.state.searchResultsIndex];
        if (this.state.searchResultsFound === 1) {
          // const candidate = this.state.searchResults[this.state.searchResultsExposed];
          synth.speak(`Tengo una receta de ${term}. `
                      + `Te puede intereresar ${candidate.title}. ¿Empezamos?`);

        } else {
          if (this.state.searchResultsFound < 6) {
            synth.speak(`Tengo ${length} recetas de ${term}. `
                        + `Te puede intereresar ${candidate.title}. ¿Empezamos?`);
          } else {
            synth.speak(`Tengo muchas recetas de ${term}. `
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
      // debugger
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      this.state.searchResultsIndex++;
      if (this.state.searchResults.length > this.state.searchResultsIndex) {
        const candidate = this.state.recipe = this.state.searchResults[this.state.searchResultsIndex];
        synth.speak(`La siguiente receta es: ${candidate.title}. ¿Empezamos?`);
      } else {
        synth.speak(`No hay mas recetas!`);
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

      let msg = `Es una receta de 4 personas, `;

      if (recipe.dificulty === "easy") {
        msg += "de dificultad baja.";
      } else if (recipe.dificultad === "medium") {
        msg += "de dificultad media.";
      } else {
        msg += "de dificultad alta.";
      }

      const time = parseMinutes(recipe.cookTime);
      msg += `El tiempo de elaboracion es de ${time} minutos`;

      synth.speak(msg)
      synth.speak("¿Empezamos?")
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
      const msg = (`El tiempo de elaboracion es de ${time} minutos` +
                   "¿Quieres saber algo mas?");
      synth.speak(msg);
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
      let msg = "La receta es de dicultad ";

      if (recipe.dificulty === "easy") {
        msg += "baja.";
      } else if (recipe.dificultad === "medium") {
        msg += "media.";
      } else {
        msg += "alta.";
      }

      msg += "¿Quieres saber algo mas?";

      synth.speak(msg)
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
      synth.speak("Es una receta para 4 personas.");
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
      synth.speak("Genial, ¿Empezamos?");
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
      synth.speak("TODO: estamos empezando.")
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
      synth.speak("No, paso de ti");
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
      synth.speak(responses[Math.floor(Math.random() * responses.length)]);
    }
  };
}

// --- Helpers

function parseMinutes(v) {
  const result = /\d+/.exec(v);
  return result[0];
};

function tokenize(text) {
  return text.split(/[^a-zA-Zá-úÁ-ÚñÑüÜ]+/).map(slugify);
}

function matchTokens(base, incoming) {
  incoming = tokenize(incoming);

  let maxIndex = 0;
  let found = 0;

  for (let token of base) {
    for (let i=0; i<incoming.length; i++) {
      const matches = incoming[i].indexOf(token) !== -1;
      if (matches && i >= maxIndex) {
        found++;
        maxIndex = i;
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
