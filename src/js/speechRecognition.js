import * as rxop from "rxjs/operators";
import * as rx from "rxjs";
import * as events from "./events";

let counter = 0;

function internalCreate() {
  return new rx.Observable((subscriber) => {
    const id = counter++;

    // console.log("speechRecognition:subscribe", id);
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES'; // sets the language of the current SpeechRecognition
    recognition.interimResults = false; // Controls if returns non final results
    recognition.continuous = false; // Single or continuous results
    recognition.maxAlternatives = 1; // Max number of recognized alternatives

    let stoped = false;
    let error = null;

    recognition.onaudiostart = (event) => {
      // console.log("speechRecognition:onaudiostart", id, event);
    };

    recognition.onaudioend = (event) => {
      // console.log("speechRecognition:onaudioend", id, event);
    };

    recognition.onend = (event) => {
      if (stoped) return;
      // console.log("speechRecognition:onend", id, event);
      setTimeout(() => {
        stoped = true;
        if (error) {
          subscriber.error(error);
        } else {
          error = new Error("End");
          error.error = "no-speech";
          subscriber.error(error);
        }
      }, 300);
    };

    recognition.onerror = (event) => {
      if (stoped) return;
      error = event

      // setTimeout(() => {

      //   stoped = true;
      //   subscriber.error(event);
      // }, 300);
    };

    recognition.onnomatch = (event) => {
      // console.log("speechRecognition:onnomatch", id, event);
    };

    recognition.onstart = (event) => {
      // console.log("speechRecognition:onstart", id);
      // // console.log("Speech Recognition initialized");
    };

    recognition.onspeechstart = (event) => {
      events.emit("speech", 'start');
      // console.log("speechRecognition:onspeechstart", id);
    };

    recognition.onspeechend = (event) => {
      events.emit("speech", "end");
      // console.log("speechRecognition:onspeechend", id);
    };

    recognition.onresult = (event) => {
      // console.log("speechRecognition:onresult", id, event);
      events.emit("speech", "match");
      subscriber.next(event.results[event.resultIndex]);
    };

    recognition.start(); // Starts the speech recognition service listening to incoming audio

    return function unsubscribe() {
      // console.log("speechRecognition:unsubscribe", id);
      recognition.stop();
      // recognition.abort();
    };
  });
}

export function create() {
  return internalCreate().pipe(
    // rxop.timeout(15000),
    rxop.retry(1000000000),
    rxop.delay(500)
  );
};

// rxop.retryWhen((errors) => {
//   return errors.pipe(
//     rxop.flatMap((err) => {
//       if (err.error === "no-speech") {
//         return rx.of(1);
//       } else {
//         return rx.throwError(err);
//       }
//     }),
//     rxop.delay(1000)
//   );
// })

