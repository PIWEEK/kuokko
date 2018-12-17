const msg = new SpeechSynthesisUtterance();

export function create () {
  var voices = window.speechSynthesis.getVoices();

  msg.voice = voices[4]; // Note: some voices don't support altering params
  msg.voiceURI = 'native';
  msg.volume = 1; // 0 to 1
  // msg.rate = 1; // 0.1 to 10
  // msg.pitch = 2; //0 to 2
  msg.lang = 'es-ES';

  msg.onend = function(e) {
    console.log('Finished in ' + event.elapsedTime + ' seconds.');
  };
  console.log(voices);
};

export function speak (message) {
  msg.text = message;
  speechSynthesis.speak(msg);
}
