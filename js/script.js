// Get all modals
var modal = document.querySelectorAll(".modal");

// Get all modals' buttons
var buttons = document.querySelectorAll('.cta');

// Get all button elements that close the modal
var closeBtns = document.getElementsByClassName("close-btn");

var spinTone = new Audio("res/sounds/spin.mp3");
var winTone = new Audio("res/sounds/win.mp3");
var loseTone = new Audio("res/sounds/lose.mp3");

for (let i = 0; i < buttons.length; i++) {
  const element = buttons[i];
  element.addEventListener('click', (e) => {
    switch (element.dataset.name) {
      case "info":
        document.getElementById('info-modal').style.display = "block";
        break;
      case "register":
        document.getElementById('register-modal').style.display = "block";
        break;
      case "login":
        document.getElementById('login-modal').style.display = "block";
        break;
      case "deposit":
        document.getElementById('deposit-modal').style.display = "block";
        break;
      case "withdrawal":
        document.getElementById('withdrawal-modal').style.display = "block";
        break;
      case "transactions":
        document.getElementById('transactions-modal').style.display = "block";
        break;
      case "payouts":
        document.getElementById('payouts-modal').style.display = "block";
        break;
    
      default:
        break;
    }

    // When the user clicks on <span> (x), close the modal
    for (let i = 0; i < closeBtns.length; i++) {
      const element = closeBtns[i];
      element.onclick = function() {
        let modals = document.getElementsByClassName('modal');
        for (let x = 0; x < modals.length; x++) {
          const element = modals[x];
          element.style.display = "none";

          if (!(modals[x].dataset.name === "info")) {
            modals[x].querySelectorAll("input").forEach((inputField) => {
              inputField.value = "";
            });
          }

        }
      }
    }
    
  }); 
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  for (const item of modal) {
    if (event.target === item) {
      item.style.display = "none";
      if (!(item.dataset.name === "info")) {
        item.querySelectorAll("input").forEach((inputField) => {
          inputField.value = "";
        });
      }
    }
  }
}

$('.left-items a #sound-btn i').click( function() {
  if ($(this).hasClass('fa-volume-high')) {
      $(this).removeClass('fa-volume-high').addClass('fa-volume-xmark');
      toggleAudio(false);
  } else {
      $(this).removeClass('fa-volume-xmark').addClass('fa-volume-high');
      toggleAudio(true);
  }
});

function toggleAudio(x){
  if (x === true) {
    spinTone.volume = 1;
    winTone.volume = 1;
    loseTone.volume = 1;
  } else if (x === false) {
    spinTone.volume = 0;
    winTone.volume = 0;
    loseTone.volume = 0;
  }
}
function fadeOutEffect() {
  var fadeTarget = document.getElementById("bet-amount");
  fadeTarget.style.opacity = 1;
  var fadeEffect = setInterval(function () {
      if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
          fadeTarget.style.opacity -= 0.1;
      } else {
          clearInterval(fadeEffect);
      }
  }, 200);
}

document.getElementById("spinner").addEventListener('click', fadeOutEffect);
