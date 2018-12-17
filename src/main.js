import * as l from "lodash-es";
// import limax from "limax";

import * as sr from "./speechRecognition";
import * as synth from "./speechSynthesis";

import StateMachine from "./stm";

async function onEvent(event) {
  const text = l.trim(event[0].transcript);
  const feedback = document.querySelector('[data-kuokko="feedback"]');
  feedback.innerHTML = text;

  const handler = await this.matches(text);
  console.log("incoming text:", text);

  if (handler) {
    console.log("handler found:", handler.name);
    this.transitionToHandler(handler, text);
  }
}

function tokenize(text) {
  return text.split(/[^a-zA-Zá-úÁ-ÚñÑüÜ]+/); //.map(limax);
}

function matchText(base, incoming) {
  const incomingTokens = tokenize(incoming)

  let maxIndex = 0;
  let found = 0;

  for (let token of base) {
    const index = incomingTokens.findIndex(o => o === token);
    if (index >= maxIndex) {
      found++;
      maxIndex = index;
    }
  }

  console.log("matchText", base, incomingTokens)

  return found === base.length;
}

function initialHandler() {
  return {
    match() { },
    onEnter() {},
    onLeave() {},
    async handle() {
      console.warn('Manifest para móvil');
      // await synth.speak('¡Los pachachos!');
    }
  }
}

function searchHandler() {
  return {
    async match(input) {
      const tokens = ["buscar", "receta"];
      return matchText(tokens, input);
    },

    async onEnter(text) {
      synth.speak("No tengo recetas");
      console.log("searchHandler:onEnter");
    },

    async handle(text) {
      console.log("searchHandler:handle", text);
    },

    async onLeave() {
    }
  };
}

(async function() {
  const stm = new StateMachine({
    "": ["search"],
    "search": ["search"]
  });

  stm.add("", initialHandler);
  stm.add("search", searchHandler);

  await stm.start()

  sr.create().subscribe(onEvent.bind(stm));
})();
