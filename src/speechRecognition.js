import * as rxop from "rxjs/operators";
import * as rx from "rxjs";

let counter = 0;

export function create() {
  const stream = new rx.Observable((subscriber) => {
    const id = counter++;

    console.log("speechRecognition:subscribe", id);
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES'; // sets the language of the current SpeechRecognition
    recognition.interimResults = false; // Controls if returns non final results
    recognition.continuous = true; // Single or continuous results
    recognition.maxAlternatives = 1; // Max number of recognized alternatives

    let count = 0;

    recognition.onaudiostart = (event) => {
      console.log("speechRecognition:onaudiostart", id, event);
    };

    recognition.onaudioend = (event) => {
      console.log("speechRecognition:onaudioend", id, event);
    };

    recognition.onend = (event) => {
      console.log("speechRecognition:onend", id, event);
      const error = new Error("End");
      error.error = "no-speech";
      // subscriber.error(error);
    };

    recognition.onerror = (event) => {
      console.log("speechRecognition:onerror", id, event);
      subscriber.error(event);
    };

    recognition.onnomatch = (event) => {
      console.log("speechRecognition:onnomatch", id, event);
    };

    recognition.onstart = (event) => {
      console.log("Speech Recognition initialized");
    };

    recognition.onspeechstart = (event) => {
      console.log("speechRecognition:onspeechstart", id);
    };

    recognition.onspeechstop = (event) => {
      console.log("speechRecognition:onspeechstop", id);
    };

    recognition.onresult = (event) => {
      console.log("speechRecognition:onresult", id);
      console.log(event);
      subscriber.next(event.results[count]);
      count++;
    };

    recognition.start(); // Starts the speech recognition service listening to incoming audio

    return function unsubscribe() {
      console.log("speechRecognition:unsubscribe", id);
      recognition.stop();
      // recognition.abort();
    };
  });

  return stream.pipe(
    rxop.retry(20),
    rxop.delay(300)
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
  );
};
