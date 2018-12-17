import {isUndefined} from "lodash-es";
import * as sr from "./speechRecognition";
import {StateMachine} from "./fsm";

async function onEvent(event) {
  const text = event[0].transcript;
  const handler = await this.matches(text);

  if (handler) {
    this.transitionToHandler(handler);
  }
}

async function main() {
  const stm = new StateMachine({
    "": ["search", "info"],
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
      return text.startsWith("empeza buscar");
    },

    async onEnter() {
    },

    async handle(text) {
      console.log("kaka");
    },

    async onLeave() {
    }
  };
}

main();
