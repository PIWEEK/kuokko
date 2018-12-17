import * as rxop from "rxjs/operators";
import * as rx from "rxjs";

export function create() {
  const stream = new rx.Observable((subscriber) => {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES'; // sets the language of the current SpeechRecognition
    recognition.interimResults = false; // Controls if returns non final results
    recognition.continuous = true; // Single or continuous results
    recognition.maxAlternatives = 1; // Max number of recognized alternatives

    let count = 0;

    // recognition.onaudiostart = (event) => {
    //   console.log("onaudiostart", event);
    // };

    // recognition.onaudioend = (event) => {
    //   console.log("onaudioend", event);
    // };

    // recognition.onend = (event) => {
    //   console.log("onend", event);
    // };

    recognition.onerror = (event) => {
      console.log("onerror", event);
      subscriber.error(event);
    };

    recognition.onnomatch = (event) => {
      console.log("onnomatch", event);
    };

    recognition.onstart = (event) => {
      console.log("Speech Recognition initialized");
    };

    recognition.onresult = (event) => {
      console.log(event);
      subscriber.next(event.results[count]);
      count++;
    };

    recognition.start(); // Starts the speech recognition service listening to incoming audio

    return function unsubscribe() {
      console.log("unsubscribe");
      recognition.abort();
    };
  });

  return rx.pipe(
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
  );
};
