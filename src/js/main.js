import * as l from "lodash";

import * as sr from "./speechRecognition";
import * as synth from "./speechSynthesis";
import * as handlers from "./handlers";

import StateMachine from "./stm";

// Test the 'speak' UI button
// const button = document.getElementById('speak-btn');
// button.addEventListener('click', (event) => {
//   synth.speak('Hey, Fermati!');
// });

async function onEvent(event) {
  if (this.steps === undefined) {
    this.steps = [];
  }

  const text = l.trim(event[0].transcript);

  console.log(`onEvent => text: '${text}', state: ${this.current.name}, steps: ${this.steps.join("->")}`);

  const handler = await this.matches(text);

  if (handler) {
    console.log("handler found:", handler.name);
    this.steps.push(handler.name);
    this.transitionToHandler(handler, text);
  }
}

(async function() {
  const stm = new StateMachine();

  stm.add("", {
    handler: handlers.initialHandler,
    choices: ["search"]
  });

  stm.add("hear", {
    global: true,
    hidden: true,
    handler: handlers.doYouHearMeHandler
  });

  stm.add("howareyou", {
    global: true,
    hidden: true,
    handler: handlers.howAreYouHandler
  });

  stm.add("search", {
    handler: handlers.searchHandler,
    choices: ["search", "search/**", "start"]
  });

  stm.add("search/next", {
    handler: handlers.searchNextResultHandler,
    choices: ["search", "search/*", "start"]
  });

  stm.add("search/info", {
    handler: handlers.searchInfoHandler,
    choices: ["search", "search/**", "start"]
  });

  stm.add("search/info/time", {
    handler: handlers.searchInfoTimeHandler,
    choices:  ["search/info/no-more","search", "search/**", "start"],
  });

  stm.add("search/info/guests", {
    handler: handlers.searchInfoGuestsHandler,
    choices:  ["search/info/no-more", "search", "search/**", "start"]
  });

  stm.add("search/info/difficulty", {
    handler: handlers.searchInfoDifficultyHandler,
    choices: ["search/info/no-more", "search","search/**", "start"]
  });

  stm.add("search/info/no-more", {
    handler: handlers.searchInfoNoMoreHandler,
    choices: ["search", "start", "search/next"]
  });

  stm.add("start", {
    handler: handlers.startHandler,
    choices: []
  });

  await stm.start();
  sr.create().subscribe(onEvent.bind(stm));
})();
