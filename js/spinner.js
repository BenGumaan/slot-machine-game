(function () {
    "use strict";
  
    const ROWS = 3;
    const COLS = 3;

    const SYMBOLS_COUNT = {
        "🍎": 2,
        "🍉": 4,
        "🍕": 6,
        "🍗": 8
    }
    const SYMBOL_VALUES = {
        "🍎": 5,
        "🍉": 4,
        "🍕": 3,
        "🍗": 2
    }
    const itemsX = ["🍎","🍎","🍎","❌"];
    const items = [
      "7️⃣",
      "❌",
      "🍓",
      "🍋",
      "🍉",
      "🍒",
      "💵",
      "🍊",
      "🍎",
    ];
    // document.querySelector(".info").textContent = items.join(" ");
    let lastArr = [];

    const doors = document.querySelectorAll(".door");
    document.querySelector("#spinner").addEventListener("click", spin);
    document.querySelector("#reseter").addEventListener("click", init);

    document.querySelector("#increase-bet").addEventListener("click", increaseBet);
    document.querySelector("#decrease-bet").addEventListener("click", decreaseBet);
    
    // Deposit Event
    document.getElementById("deposit-btn").addEventListener("click", () => {
        if (parseInt(document.getElementById("addedAmount").value) <= 0 || isNaN(document.getElementById("addedAmount").value) || document.getElementById("addedAmount").value === "") {
            alert("Please enter a valid number!");
            console.log("Please enter a valid number!");
        } else {
            balanceAmount.textContent = parseInt(balanceAmount.textContent) + parseInt(document.getElementById("addedAmount").value)
            betAmount.textContent = `+$${parseInt(document.getElementById("addedAmount").value)}`;
            addToLocalStorage("Deposit");
            document.getElementById('deposit-modal').style.display = "none";
            var fadeTarget = document.getElementById("bet-amount");
            fadeTarget.style.opacity = 1;
            fadeTarget.style.color = "green";
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
        document.getElementById("addedAmount").value = "";
    })
    // Withdrawal Event
    document.getElementById("withdrawal-btn").addEventListener("click", () => {
        if (parseInt(document.getElementById("subtractedAmount").value) <= 0 || isNaN(document.getElementById("subtractedAmount").value) || document.getElementById("subtractedAmount").value === "" || parseInt(document.getElementById("subtractedAmount").value) > parseInt(balanceAmount.textContent)) {
            alert("Please enter a valid number!");
            console.log("Please enter a valid number!");
        } else {
            // win.textContent = parseInt(win.textContent) - parseInt(document.getElementById("subtractedAmount").value)
            balanceAmount.textContent = parseInt(balanceAmount.textContent) - parseInt(document.getElementById("subtractedAmount").value)
            betAmount.textContent = `-$${parseInt(document.getElementById("subtractedAmount").value)}`;
            addToLocalStorage("Withdrawal");
            document.getElementById('withdrawal-modal').style.display = "none";
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
        document.getElementById("subtractedAmount").value = "";
    })

    const readyBet = document.querySelectorAll(".ready-bet li");
    for (const betAmount of readyBet) {
        betAmount.addEventListener("click", (e) => {
            for (const betAmount of readyBet) {
                betAmount.classList.remove('active');
            }
            document.getElementById("bet-amount-input").value = parseInt(betAmount.dataset.amount);
            betAmount.classList.add('active');
            console.log(betAmount);
        })
    }
    

    let win = document.getElementById("win-amount");
    let resultMsg = document.getElementById("result-msg");
    let balanceAmount = document.getElementById("balance-amount");
    let betAmount = document.getElementById("bet-amount");
    let betAmountInput = document.getElementById("bet-amount-input");

    async function spin() {
        init(false, 1, 2);
        if (parseInt(balanceAmount.textContent) <= 0) {
            resultMsg.textContent = "You ran out of balance 😢";
            betAmount.textContent = "";
            return false;
        } else if (parseInt(betAmountInput.value) > parseInt(balanceAmount.textContent)) {
            resultMsg.textContent = "You don't have enough balance 😢";
            betAmount.textContent = "";
            return false;
        }
        // document.getElementById('bet-amount').classList.add('animate');
        document.getElementById("spinner").disabled = true;
        document.getElementById("reseter").disabled = false;
        for (const door of doors) {
            const boxes = door.querySelector(".boxes");
            const duration = parseInt(boxes.style.transitionDuration);
            boxes.style.transform = "translateY(0)";
            await new Promise((resolve) => setTimeout(resolve, duration * 100));
        }
        
        setTimeout(() => {
            const winnings = getWinnings(lastArr);
            betAmount.textContent = `-$${parseInt(betAmountInput.value)}`;
            balanceAmount.textContent = `${parseInt(balanceAmount.textContent)+parseInt(winnings)}`;
            win.textContent = `${parseInt(winnings)}`;
            if (winnings) addToLocalStorage_payouts();
        }, 2000);         
    }
  
    function init(firstInit = true, groups = 1, duration = 1) {
        document.getElementById("spinner").disabled = false;
        document.getElementById("reseter").disabled = true;
        resultMsg.textContent = `Hit the spinner 👆`;
        let count = 0;

        for (const door of doors) {
            if (firstInit) {
                door.dataset.spinned = "0";
            } else if (door.dataset.spinned === "1") {
                alert("Reset the game!")
                return false;
            }
    
            const boxes = door.querySelector(".boxes");
            const boxesClone = boxes.cloneNode(false);
    
            const pool = ["❓"];
            if (!firstInit) {
                const arr = [];
                for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                    arr.push(...itemsX);
                }
                pool.push(...shuffle(arr));
        
                boxesClone.addEventListener(
                    "transitionstart",
                    function () {
                    door.dataset.spinned = "1";
                    resultMsg.textContent = `Spinning...`;
                    count++;
                    if (count === 1) {
                        if (parseInt(balanceAmount.textContent) <= 0) {
                            resultMsg.textContent = `You ran out of balance!`;
                            return false;
                        }
                        balanceAmount.textContent = `${parseInt(balanceAmount.textContent)-parseInt(betAmountInput.value)}`;
                        betAmount.textContent = `-$${parseInt(betAmountInput.value)}`;
                    }
                    this.querySelectorAll(".box").forEach((box) => {
                        box.style.filter = "blur(1px)";
                    });
                    },
                    { once: true }
                );
                
                boxesClone.addEventListener(
                    "transitionend",
                    function () {
                        this.querySelectorAll(".box").forEach((box, index) => {
                            box.style.filter = "blur(0)";
                            if (index > 0) this.removeChild(box);
                        });
                        resultMsg.textContent = `You won ${getWinnings(lastArr)} X your bet${getWinnings(lastArr) === 0 ? "." : " 😍" }`;
                    },
                    { once: true }
                );
            }

            for (let i = pool.length - 1; i >= 0; i--) {
                const box = document.createElement("div");
                box.classList.add("box");
                box.style.width = door.clientWidth + "px";
                box.style.height = door.clientHeight + "px";
                box.textContent = pool[i];
                boxesClone.appendChild(box);
            }
            boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
            boxesClone.style.transform = `translateY(-${
            door.clientHeight * (pool.length - 1)
            }px)`;
            door.replaceChild(boxesClone, boxes);
        }
    }
    
    function shuffle([...arr]) {
      let m = arr.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      lastArr.push(arr[arr.length-1]);
      return arr;
    }
    
    const getWinnings = (lastArr) => {
        let winnings = 0;
        let allSame = true;

        for (const symbol of lastArr) {
            
            if (symbol != lastArr[0]) {
                allSame = false;
                break;
            }

        }
        
        if (allSame) {
            winnings = 2 * parseInt(betAmountInput.value);
            console.log("winnings: ", winnings);
        }

        return winnings;
    }

    function increaseBet() {
        let amountInt = parseInt(document.getElementById('bet-amount-input').value);
        document.getElementById('bet-amount-input').value = amountInt + 10; 
    }

    function decreaseBet() {
        let amountInt = parseInt(document.getElementById('bet-amount-input').value);
        if (amountInt < 10) {
            document.getElementById('bet-amount-input').value = 0;
        } else {
            document.getElementById('bet-amount-input').value = amountInt - 10; 
        }
    }

    init();
  })();
  