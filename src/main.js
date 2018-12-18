import * as l from "lodash";
import slugify from "speakingurl";

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
      synth.speak('Soy kuokko, busca una receta');
      console.warn('Manifest para móvil');
    }
  }
}

function searchHandler() {
  const STATE_SYM = Symbol("searchHandler");
  const tokens = ["busc", "recet", "de"];

  return {
    async match(input) {
      const matches = matchText(tokens, input);
      this[STATE_SYM] = matches;
      return !!matches;
    },

    async onEnter(text) {
      console.log("searchHandler:onEnter");
    },

    async handle(text) {
      const state = this[STATE_SYM];
      synth.speak(`Ok, un segundo. Buscando recetas de ${state.rest.join(" ")}`);

      console.log("searchHandler:handle", state);
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

  await stm.start();

  sr.create().subscribe(onEvent.bind(stm));
})();
