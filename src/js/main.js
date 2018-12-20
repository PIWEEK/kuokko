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
  const text = l.trim(event[0].transcript);

  console.log(`onEvent => text: '${text}', state: ${this.current.name}, steps: ${this.steps.join("->")}`);

  const handler = await this.matches(text);
  if (handler) {
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

  stm.add("recipe/ingredients", {
    handler: handlers.recipeIngredientsHandler,
    choices: ["recipe/ready"]
  });

  stm.add("recipe/ready", {
    handler: handlers.recipeIngredientsReadyHandler,
    choices: ["recipe/preparation/nextstep"],
  });

  stm.add("recipe/preparation/nextstep", {
    handler: handlers.recipePreparationNextStep,
    choices: ["recipe/preparation/nextstep", "recipe/preparation/repeatstep"],
  });

  stm.add("recipe/preparation/repeatstep", {
    // hidden: true,
    handler: handlers.recipePreparationRepeatStep,
    choices: [],
  });

  stm.add("start", {
    handler: handlers.startHandler,
    choices: ["recipe/ingredients"]
  });

  stm.add("timer", {
    hidden: true,
    global: true,
    handler: handlers.globalTimerHandler
  });

  // stm.add("fallback", {
  //   global: true,
  //   handler: handlers.fallback,
  // });

  document.querySelector("body").addEventListener("click", async (event) => {
    const subscription = sr.create().subscribe(onEvent.bind(stm));
    await stm.start(subscription);
    window.stm = stm;
  });


})();
