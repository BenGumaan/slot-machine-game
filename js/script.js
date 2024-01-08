// Get all modals
var modal = document.querySelectorAll(".modal");

// Get all modals' buttons
var buttons = document.querySelectorAll('.cta');

// Get all button elements that close the modal
var closeBtns = document.getElementsByClassName("close-btn");

for (let i = 0; i < buttons.length; i++) {
  const element = buttons[i];
  element.addEventListener('click', (e) => {
    switch (element.dataset.name) {
      case "info":
        console.log("info");
        document.getElementById('info-modal').style.display = "block";
        break;
      case "register":
        console.log("register");
        document.getElementById('register-modal').style.display = "block";
        break;
      case "login":
        console.log("login");
        document.getElementById('login-modal').style.display = "block";
        break;
      case "deposit":
        console.log("deposit");
        document.getElementById('deposit-modal').style.display = "block";
        break;
      case "withdrawal":
        console.log("withdrawal");
        document.getElementById('withdrawal-modal').style.display = "block";
        break;
      case "transactions":
        console.log("transactions");
        document.getElementById('transactions-modal').style.display = "block";
        break;
      case "payouts":
        console.log("payouts");
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
    }
  }
}


$('.left-items a #sound-btn i').click( function() {
  if ($(this).hasClass('fa-volume-high')) {
      $(this).removeClass('fa-volume-high').addClass('fa-volume-xmark');
  } else {
      $(this).removeClass('fa-volume-xmark').addClass('fa-volume-high');
  }
});


function fadeOutEffect() {
  var fadeTarget = document.getElementById("bet-amount");
  fadeTarget.style.opacity = 1;
  var fadeEffect = setInterval(function () {
      if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
          fadeTarget.style.opacity -= 0.1;
          fadeTarget.style.transform = "translateY(2px)";
      } else {
          clearInterval(fadeEffect);
      }
  }, 200);
}

document.getElementById("spinner").addEventListener('click', fadeOutEffect);
document.getElementById("reseter").addEventListener('click', () => {
  var betAmount = document.getElementById("bet-amount");
  betAmount.style.transform = "translateY(-25px)";
});