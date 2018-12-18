import * as l from "lodash";
import slugify from "speakingurl";

import * as synth from "./speechSynthesis";

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
  const tokens = ["busc", "recet", "de"];

  return {
    async match(input) {
      const matches = matchTokensList(tokens, input);
      this.state.search = {matches};
      return !!matches;
    },

    async handle(text) {
      const {matches} = this.state.search;
      synth.speak(`Ok, un segundo. Buscando recetas de ${matches.rest.join(" ")}`);

      this.state.searchResultsExposed = 0;
      this.state.searchResults = [
        "Receta de tortilla 1",
        "Receta de tortilla 2",
      ];

      const candidate = this.state.searchResults[this.state.searchResultsExposed];

      synth.speak(`Tengo dos receta de tortilla. `
                  + `Te puede intereresar ${candidate}. ¿Empezamos?`);
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
      this.state.searchResultsExposed++;
      if (this.state.searchResults.length > this.state.searchResultsExposed) {
        const candidate = this.state.searchResults[this.state.searchResultsExposed];
        synth.speak(`La siguiente receta es: ${candidate}. ¿Empezamos?`);
      } else {
        synth.speak(`No hay mas recetas!`);
        this.state.searchResultsExposed--;
      }
    }
  };
}

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


export function searchInfoHandler() {
  const tokens = ["mas", "info"];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      synth.speak("Es una receta de 4 personas, de dificultad baja. " +
                  "El tiempo de elaboracion es de 40 minutos.")
      synth.speak("¿Empezamos?")
    }
  };
}

export function searchInfoTimeHandler() {
  const tokens = ["cuant", "tarda"];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      synth.speak("El tiempo de elaboracion es de 40 minutos. ¿Quieres saber algo mas?")
    }
  };
}

export function searchInfoGuestsHandler() {
  const tokens = ["cuant", "comensal"];

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
  const tokens = ["si"];

  return {
    async match(input) {
      return !!matchTokensList(tokens, input);
    },

    async handle(text) {
      synth.speak("TODO: estamos empezando.")
    }
  };
}

// --- Helpers

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