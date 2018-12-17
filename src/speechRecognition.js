import { Observable } from "rxjs";

export function create() {
  return new Observable((subscriber) => {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES'; // sets the language of the current SpeechRecognition
    recognition.interimResults = false; // Controls if returns non final results
    recognition.continuous = true; // Single or continuous results
    recognition.maxAlternatives = 1; // Max number of recognized alternatives

    let count = 0;

    recognition.onresult = (event) => {
      console.log(event);
      subscriber.next(event.results[count]);
      count++;
    };

    recognition.start(); // Starts the speech recognition service listening to incoming audio

    return function unsubscribe() {
      recognition.abort();
    };
  });
};
