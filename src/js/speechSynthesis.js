const VOICES = window.speechSynthesis.getVoices();

export function speak(message) {
  return new Promise((resolve, reject) => {
    const msg = new SpeechSynthesisUtterance();
    let resolved = false;

    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'fr-FR';
    const volume = urlParams.get('volume') || '1'
    const rate = urlParams.get('rate') || '1'
    const pitch = urlParams.get('pitch') || '1'

    msg.voice = VOICES[9];
    msg.volume = parseInt(volume, 10); // 0 to 1
    msg.lang = lang;
    msg.rate = parseFloat(rate); // 0.1 to 10
    msg.pitch = parseFloat(pitch); //0 to 2

    msg.onerror = (e) => {
      console.error(e.error, e);
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

    msg.text = message;
    console.log("[speak] Launching: " + message);
    speechSynthesis.speak(msg);

  });
}
