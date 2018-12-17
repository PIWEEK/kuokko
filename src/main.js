import * as _ from "lodash-es";

const setup = () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'es-ES'; // sets the language of the current SpeechRecognition 
  recognition.interimResults = false; // Controls if returns non final results 
  recognition.continuous = true; // Single or continuous results
  recognition.maxAlternatives = 1; // Max number of recognized alternatives
  
  recognition.onstart = onStart;
  recognition.onaudiostart = onAudioStart;
  recognition.onresult = handleResult;
  recognition.onend = onEnd;
  recognition.onerror = handleAudioError;
  
  recognition.start(); // Starts the speech recognition service listening to incoming audio
}

/* Fired when the speech recognition service has begun listening to incoming audio */
const onStart = () => {
  console.log('Speech recognition service has started');
}

/* Fired when the user agent has started to capture audio. */
const onAudioStart = () => {
  console.log('Audio capturing started');
}

/* Fired when the speech recognition service returns a valid result */
const handleResult = (event) => {
  console.log(event);
  for(let caca of event.results) {
    console.log(caca[0].transcript);
  }
}

/* Fired when the speech recognition service has disconnected. */
const onEnd = () => {
  console.log('Speech recognition service disconnected');
}

/* Fired when a speech recognition error occurs. */
const handleAudioError = () => {
  console.error(`Speech recognition error detected: ${event.error}`);
}

setup();
