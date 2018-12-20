const VOICES = window.speechSynthesis.getVoices();

export function speak(message) {
  return new Promise((resolve, reject) => {
    const msg = new SpeechSynthesisUtterance();
    let resolved = false;

    msg.voice = VOICES[9];
    msg.volume = 1; // 0 to 1
    msg.lang = 'it-IT';
    // msg.rate = 1; // 0.1 to 10
    // msg.pitch = 2; //0 to 2

    msg.onerror = (e) => {
      console.log(e.error, e);
      reject(e);
    };

    msg.onend = function(e) {
      console.log(`[speak] End '${message}' (elapsed ${event.elapsedTime})`);
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    setTimeout(() => {
      if (!resolved) {
        console.warn("Resolved by timeout!!")
        resolved = true;
        resolve();
      }
    }, message.length * 100 + 1000)

    // msg.onboundary= (e) => console.log("[speak] boundary " + message, e);
    // msg.onmark = (e) => console.log("[speak] mark " + message, e);
    // msg.onpause = (e) => console.log("[speak] pause " + message, e);
    // msg.onresume = (e) => console.log("[speak] resume " + message, e);
    // msg.onstart = (e) => console.log("[speak] start " + message, e);

    msg.text = message;
    console.log("[speak] Launching: " + message);
    speechSynthesis.speak(msg);

  });
}
