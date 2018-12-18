import * as l from "lodash";
import slugify from "speakingurl";

import * as sr from "./speechRecognition";
import * as synth from "./speechSynthesis";

import StateMachine from "./stm";

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
      console.warn('Manifest para móvil');
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
  const tokens = ["dim", "otr"];

  return {
    async match(input) {
      return !!matchText(tokens, input);
    },

    async handle(text) {
      this.state.searchResultsExposed++;
      if (this.state.searchResults.length < this.state.searchResultsExposed) {
        const candidate = this.state.searchResults[this.state.searchResultsExposed];
        synth.speak(`La siguiente receta es: ${candidate}. ¿Empezamos?`);
      }
    }
  };
}

function searchInfoHandler() {
  const tokens = ["mas", "info"];

  return {
    async match(input) {
      debugger
      return !!matchText(tokens, input);
    },

    async handle(text) {
      synth.speak("Es una receta de 4 personas, de dificultad baja. " +
                  "El tiempo de elaboracion es de 40 minutos.")
      synth.speak("¿Empezamos?")
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
    "": ["search"],
    "search": ["search", "search:info", "search:info:time", "start"],
    "search:info": ["search:info", "start", "search:next"],
    "search:next": ["search:info", "search:next", "start"],
    "start": []
  });

  stm.add("", initialHandler);
  stm.add("search", searchHandler);
  stm.add("search:info", searchInfoHandler);
  stm.add("start", startHandler);

  await stm.start();

  sr.create().subscribe(onEvent.bind(stm));
})();
