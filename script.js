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

