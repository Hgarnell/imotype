const typingText = document.querySelector(".typing-text p");
inpField = document.querySelector(".wrapper .input-field");
mistakeTag = document.querySelector(".mistake span");
wpmTag = document.querySelector(".WPM span");
cpmTag = document.querySelector(".CPM span");
resetBtn = document.querySelector("button");
timeTag = document.querySelector(".time span b");

let timer,
  maxTime = 60,
  timeLeft = maxTime,
  charIndex = (mistakes = isTyping = 0);

//function for selecting random paragraph
function randomParagraph() {
  //select a random number thats always less than the length of the paragraph array
  let randIndex = Math.floor(Math.random() * paragraphs.length);
  typingText.innerHTML = "";

  //selecting a random pragraph and then splitting each individual character
  //add each character into a span tag, which should then be inside a p tag
  paragraphs[randIndex].split("").forEach((span) => {
    let spanTag = `<span>${span}</span>`;
    typingText.innerHTML += spanTag;
  });
  //focus on the input field either when key pressed or click
  document.addEventListener("keydown", () => inpField.focus());
  typingText.addEventListener("click", () => inpField.focus());
}

//initiate typing function
function initTyping() {
  //find charcters in the span tag
  // typedchar variable is set to typed characters split in the input box
  const characters = typingText.querySelectorAll("span");
  let typedChar = inpField.value.split("")[charIndex];
  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      //if not typing then start timer, otherwise don't restart
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }
    //if the user hasn't entered a charcter, or if they press backspace
    if (typedChar == null) {
      //go back one index and decrement charINdex
      charIndex--;
      //decrement mistakes only if the charIndex span has incorrect class
      if (characters[charIndex].classList.contains("incorrect")) {
        mistakes--;
      }
      //remove charindex span correct or incorrect
      characters[charIndex].classList.remove("correct", "incorrect");
    } else {
      //if correct character is typed then assign correct to the span
      if (characters[charIndex].innerText == typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        //if incorrect character is typed then assign incorrect to the span and increase mistakes
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      //increment char index by one
      charIndex++;
    }
    //remove the previous active character and add the new charindex as active
    characters.forEach((span) => span.classList.remove("active"));
    characters[charIndex].classList.add("active");
    const elapsedSeconds = maxTime - timeLeft;

    //calculate wpm
    const numCompleteWords = typingText.innerText
      .slice(0, charIndex)
      .trim()
      .split(" ").length;

    let wpm = Math.round(numCompleteWords / (elapsedSeconds / 60));

    // set wpm to 0 if the wpm is less than 0, null or infinity
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    //update text in result detail parameters
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = charIndex - mistakes;
    wpmTag.innerText = wpm;
  } else {
    inpField.value = "";
    clearInterval(timer);
  }
}

//function for starting the timer
function initTimer() {
  //if time left is greater than timer then decrement timer

  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
  } else {
    clearInterval(timer);
  }
}
function resetGame() {
  randomParagraph();
  inpField.value = "";
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  mistakeTag.innerText = mistakes;
  cpmTag.innerText = 0;
  wpmTag.innerText = 0;
}
randomParagraph();

inpField.addEventListener("input", initTyping);
resetBtn.addEventListener("click", resetGame);
