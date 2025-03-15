// Configurations
const minMsBetweenKeys = 10;
const utterEachLetter = true;

const textbox = document.getElementById("textbox");

let previousKeyUpTime = 0;

textbox.onkeydown = function(event) {
  // const isAlphanumericCharacter = event.key.match(/^[a-zA-Z0-9]$/);
  const isCharacter = event.key.length === 1;
  // Debounce
  if (isCharacter) {
    if (event.repeat) {
      event.preventDefault();
      return;
    }
    if (new Date().getTime() - previousKeyUpTime < minMsBetweenKeys) {
      event.preventDefault();
      return;
    }
  }

  if (event.key == " " || event.key == "." || event.key == "," || event.key == "!" || event.key == "?") {
    speak();
    return;
  }
  if (event.key == "Enter") {
    speak(true);
    return;
  }
  if (utterEachLetter && isCharacter && !event.altKey && !event.ctrlKey && !event.metaKey) {
    utter(event.key, 0.75);
    return;
  }
}

textbox.onkeyup = function(event) {
  previousKeyUpTime = new Date().getTime();
}

function speak(readSentence = false) {
  var text = document.getElementById("textbox").value;
  const sentences = text.split(/(?<=[.!?])/g);
  if (sentences.length <= 0) {
    return;
  }
  console.log(sentences)
  let finalSentence = sentences[sentences.length - 1];
  let finalSentenceIsEmpty = finalSentence.trim().length === 0;
  if (finalSentenceIsEmpty) {
    if (sentences.length <= 1) {
      return;
    }
    finalSentence = sentences[sentences.length - 2];
  }
  finalSentence = finalSentence.trim();
  console.log(finalSentence)
  if (readSentence || finalSentence[finalSentence.length - 1] === "." || finalSentence[finalSentence.length - 1] === "!" || finalSentence[finalSentence.length - 1] === "?") {
    utter(finalSentence);
    return;
  }
  if (finalSentence[finalSentence.length - 1] === ",") {
    return;
  }
  const finalWord = finalSentence.split(" ").pop();
  utter(finalWord, 0.75);
}

function utter(sentence, rate = 0.6) {
  const speechSynthesisUtterance = new SpeechSynthesisUtterance(sentence);
  speechSynthesisUtterance.rate =rate;
  window.speechSynthesis.speak(speechSynthesisUtterance);
}
