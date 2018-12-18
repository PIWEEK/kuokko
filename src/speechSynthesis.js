const VOICES = window.speechSynthesis.getVoices();

export function speak(message) {
  return new Promise((resolve, reject) => {
    const msg = new SpeechSynthesisUtterance();

    msg.voice = VOICES[9];
    msg.volume = 1; // 0 to 1
    msg.lang = 'it-IT';
    // msg.rate = 1; // 0.1 to 10
    // msg.pitch = 2; //0 to 2

    msg.onerror = (e) => {
      console.log(e);
      reject(e);
    };

    msg.onend = function(e) {
      console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };

    msg.text = message;
    speechSynthesis.speak(msg);

    resolve();
  });
}
