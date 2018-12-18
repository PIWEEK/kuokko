import * as l from "lodash";
import slugify from "speakingurl";

import * as sr from "./speechRecognition";
import * as synth from "./speechSynthesis";

import StateMachine from "./stm";

// Test the 'speak' UI button
const button = document.getElementById('speak-btn');
button.addEventListener('click', (event) => {
  synth.speak('Hey, Fermati!');
});

function tokenize(text) {
  return text.split(/[^a-zA-Zá-úÁ-ÚñÑüÜ]+/).map(slugify);
}

function matchText(base, incoming) {
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

function initialHandler() {
  return {
    match() { },
    onEnter() {},
    onLeave() {},
    async handle() {
      synth.speak('Benvenutti! Soy kuokko, busca una receta');
    }
  }
}

function searchHandler() {
  const tokens = ["busc", "recet", "de"];

  return {
    async match(input) {
      const matches = matchText(tokens, input);
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

function searchNextResultHandler() {
  const tokens = ["dime", "otr"];

  return {
    async match(input) {
      // debugger
      return !!matchText(tokens, input);
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

function areYouHearMeHandler() {
  const tokens = ["me", "escuch"];

  return {
    hidden: true,

    async match(input) {
      // debugger
      return !!matchText(tokens, input);
    },

    async handle(text) {
      synth.speak("No, paso de ti");
    }
  };
}


function searchInfoHandler() {
  const tokens = ["mas", "info"];

  return {
    async match(input) {
      return !!matchText(tokens, input);
    },

    async handle(text) {
      synth.speak("Es una receta de 4 personas, de dificultad baja. " +
                  "El tiempo de elaboracion es de 40 minutos.")
      synth.speak("¿Empezamos?")
    }
  };
}

function searchInfoTimeHandler() {
  const tokens = ["cuant", "tarda"];

  return {
    async match(input) {
      return !!matchText(tokens, input);
    },

    async handle(text) {
      synth.speak("El tiempo de elaboracion es de 40 minutos. ¿Quieres saber algo mas?")
    }
  };
}

function searchInfoGuestsHandler() {
  const tokens = ["cuant", "comensal"];

  return {
    async match(input) {
      return !!matchText(tokens, input);
    },

    async handle(text) {
      synth.speak("Es una receta para 4 personas.");
    }
  };
}


function searchInfoNoMoreHandler() {
  const tokens = ["no"];

  return {
    async match(input) {
      return !!matchText(tokens, input);
    },

    async handle(text) {
      synth.speak("Genial, ¿Empezamos?");
    }
  };
}


function startHandler() {
  const tokens = ["si"];

  return {
    async match(input) {
      return !!matchText(tokens, input);
    },

    async handle(text) {
      synth.speak("TODO: estamos empezando.")
    }
  };
}



async function onEvent(event) {
  if (this.steps === undefined) {
    this.steps = [];
  }

  const text = l.trim(event[0].transcript);

  console.log(`onEvent => text: '${text}', state: ${this.current.name}, steps: ${this.steps.join("->")}`);


  const feedback = document.querySelector('[data-kuokko="feedback"]');
  feedback.innerHTML = text;

  const handler = await this.matches(text);


  if (handler) {
    console.log("handler found:", handler.name);
    this.steps.push(handler.name);
    this.transitionToHandler(handler, text);
  }
}

(async function() {
  const stm = new StateMachine({
    "": ["search", "hear"],
    "search": ["search", "search/*", "start"],
    "search/info": ["search", "search/*", "start"],
    "search/next": ["search", "search/*", "start"],
    "search/info/time": ["search", "search/info/*"],
    // "search/info/dificulty": ["search", "search/info/*"],
    "search/info/no-more": ["search", "start", "search/next"],
    "start": []
  });

  stm.add("", initialHandler);
  stm.add("hear", areYouHearMeHandler);

  stm.add("search", searchHandler);
  stm.add("search/next", searchNextResultHandler);

  stm.add("search/info", searchInfoHandler);
  stm.add("search/info/time", searchInfoTimeHandler);
  stm.add("search/info/dificulty", searchInfoTimeHandler);
  stm.add("search/info/guests", searchInfoGuestsHandler);
  stm.add("search/info/no-more", searchInfoNoMoreHandler);

  stm.add("start", startHandler);

  await stm.start();

  sr.create().subscribe(onEvent.bind(stm));
})();
