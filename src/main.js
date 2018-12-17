import * as rxop from "rxjs/operators";
import * as rx from "rxjs";

import {isUndefined, trim} from "lodash-es";
import * as sr from "./speechRecognition";
import * as synth from "./speechSynthesis";
import {StateMachine} from "./stm";

async function onEvent(event) {
  const text = trim(event[0].transcript);
  const feedback = document.querySelector('[data-kuokko="feedback"]');
  feedback.innerHTML = text;
<<<<<<< HEAD

  const handler = await this.matches(text);
  console.log("incoming text:", text);

=======
  const handler = await this.matches(text);
>>>>>>> Pachachos
  if (handler) {
    console.log("handler found:", handler.name);
    this.transitionToHandler(handler, text);
  }
}

function initialHandler() {
  return {
    match() { },
    onEnter() {},
    onLeave() {},
    handle() {
      synth.create();
      synth.speak('¡Los pachachos!');
    }
  }
}

function searchHandler() {
  return {
    async match(text) {
      return (text.startsWith("coco")
              && text.includes("búscame")
              && text.includes("receta"));
    },

    async onEnter(text) {
      console.log("searchHandler:onEnter");
    },

    async handle(text) {
      console.log("searchHandler:handle", text);
    },

    async onLeave() {
    }
  };
}

async function main() {
  const stm = new StateMachine({
    "": ["search"],
    "search": ["search"]
  });

  stm.add("", initialHandler);
  stm.add("search", searchHandler);

  await stm.start()

  sr.create()
    .pipe(
      rxop.retryWhen((errors) => {
        return errors.pipe(
          rxop.flatMap((err) => {
            if (err.error === "no-speech") {
              return rx.of(1);
            } else {
              return rx.throwError(err);
            }
          }),
          rxop.delay(500)
        );
      })
    )
    .subscribe(onEvent.bind(stm));
}



main();
