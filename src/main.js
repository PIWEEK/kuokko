import * as _ from "lodash-es";

const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const setup = () => {
  var recognition = new SpeechRecognition();
  recognition.lang = 'es-ES'; // sets the language of the current SpeechRecognition 
  recognition.interimResults = false; // Controls if returns non final results 
  recognition.continuous = true; // Single or continuous results
  recognition.maxAlternatives = 1;

  recognition.start();
}
