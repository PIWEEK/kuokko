import {isUndefined, trim} from "lodash-es";
import * as sr from "./speechRecognition";
import {StateMachine} from "./stm";

async function onEvent(event) {
  const text = trim(event[0].transcript);
  const feedback = document.querySelector('[data-kuokko="feedback"]');
  feedback.innerHTML = text;
  const handler = await this.matches(text);
  console.log("new text:", text);

  const handler = await this.matches(text);
  if (handler) {
    console.log("handler found:", handler);
    this.transitionToHandler(handler);
  }
}

async function main() {
  const stm = new StateMachine({
    "": ["search"],
    "search": ["start", "search"]
  });

  stm.add("", initialHandler);
  stm.add("search", searchHandler);

  await stm.start()

  sr.create().subscribe(onEvent.bind(stm));
}



function initialHandler() {
  return {
    match() { },
    onEnter() {},
    onLeave() {},
    handle() {}

  }
}

function searchHandler() {
  return {
    async match(text) {
<<<<<<< HEAD
      return text.startsWith("empieza a buscar");
=======
      return text.startsWith("buscar");
>>>>>>> Minor fixes.
    },

    async onEnter() {
    },

    async handle(text) {
      console.log("searchHandler:handle", text);
    },

    async onLeave() {
    }
  };
}

main();
