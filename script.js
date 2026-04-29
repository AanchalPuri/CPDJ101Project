function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

function enterSite() {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('main-site').style.display = 'block';
  document.body.style.overflow = 'auto';
  document.querySelector('.tablinks').click();
}

function checkPassword() {
  const input = document.getElementById('results-password').value;
  const msg = document.getElementById('password-msg');
  const correctPassword = 'cpdj101'; // change this to whatever you want

  if (input === correctPassword) {
    msg.textContent = '✓ Correct! Redirecting...';
    msg.className = 'password-msg success';
    setTimeout(() => {
      window.open('https://docs.google.com/forms/placeholder-results-link', '_blank');
    }, 1000);
  } else {
    msg.textContent = '✗ Incorrect password.';
    msg.className = 'password-msg error';
    document.getElementById('results-password').value = '';
  }
}

document.querySelector(".tablinks").click();

// minigame logic
let realLeft = true;  // determines which side the real image is on
let score = 0;
let canGuess = false;

async function startRound() {
  canGuess = false;
  const status = document.getElementById('game-status');
  const nextBtn = document.getElementById('next-btn');

  status.textContent = "Loading faces...";
  status.style.color = "inherit";
  nextBtn.style.display = "none";

  const imgLeft = document.getElementById('img-left');
  const imgRight = document.getElementById('img-right');
  const boxLeft = imgLeft.parentElement;
  const boxRight = imgRight.parentElement;

  // reset styles
  boxLeft.style.borderColor = "transparent";
  boxRight.style.borderColor = "transparent";
  imgLeft.src = "";
  imgRight.src = "";

  try {
    // real face from randomuser api: https://www.randomuser.me/documentation#howto
    const realResult = await fetch('https://randomuser.me/api/');
    const realJson = await realResult.json();
    const realImgUrl = realJson.results[0].picture.large;

    // ai face from thispersondoesnotexist using timestamp
    const timestamp = new Date().getTime();
    const aiImgUrl = 'https://thispersondoesnotexist.com/?v=${timestamp}';

    realLeft = Math.random() < 0.5;  // randomize position of real face

    imgLeft.src = realLeft ? realImgUrl : aiImgUrl;
    imgRight.src = realLeft ? aiImgUrl : realImgUrl;

    // wait for images to load before letting the user guess
    let imagesLoaded = 0;
    const checkLoad = () => {
      imagesLoaded++;
      if(imagesLoaded === 2) {
        status.textContent = "Which face is real? Click to guess";
        canGuess = true;
      }
    }

    imgLeft.onload = checkLoad;
    imgRight.onload = checkLoad;

    // apply a different filter to the real/ai images to make the resolution disparity less obvious
    realImg = realLeft ? imgLeft : imgRight;
    aiImg = realLeft ? imgRight : imgLeft;
    // ai image should be blurred more than the real one because it has higher resolution
    realImg.style.filter = "blur(0.6px) contrast(1.0)";
    aiImg.style.filter = "blur(1.2px) contrast(1.0)";

  } catch(error) {
    status.textContent = "Failed to load images :(";
    nextBtn.style.display = "inline-block";
  }
}

function makeGuess(isLeftSide) {
  if(!canGuess) return;
  canGuess = false;

  const correct = (isLeftSide && realLeft) || (!isLeftSide && !realLeft);
  const status = document.getElementById('game-status');
  const boxLeft = document.getElementById('img-left').parentElement;
  const boxRight = document.getElementById('img-right').parentElement;

  // highlight boxes to reveal correct answer
  const correctColor = "#4CAF50"
  const incorrectColor = "#F44336"
  boxLeft.style.borderColor = realLeft ? correctColor : incorrectColor;
  boxRight.style.borderColor = realLeft ? incorrectColor : correctColor;

  if(correct) {
    status.textContent = "Correct! That is a real human.";
    status.style.color = correctColor;
    score++;
    document.getElementById('score').textContent = score;
  } else {
    status.textContent = "Incorrect! That person is AI-generated.";
    status.style.color = incorrectColor;
  }

  document.getElementById('next-btn').style.display = "inline-block";

}

startRound();