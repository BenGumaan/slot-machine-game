(function () {
    "use strict";
  
    const ROWS = 1;
    const COLS = 3;

    const SYMBOLS_COUNT = {
        "🍎": 2,
        "🍉": 4,
        // "🍕": 6,
        // "🍗": 8
    }
    const SYMBOL_VALUES = {
        "❓": 0,
        "🍎": 5,
        "🍉": 4,
        "🍕": 3,
        "🍗": 2
    }

    // Variables
    const doors = document.querySelectorAll(".door"); // I make it outside because I'll use it in 2 separate functions
    let win = document.getElementById("win-amount");
    let resultMsg = document.getElementById("result-msg");
    let balanceAmount = document.getElementById("balance-amount");
    let balanceAmountNum = document.getElementById("balance-amount-num");
    let betAmount = document.getElementById("bet-amount");
    let betAmountInput = document.getElementById("bet-amount-input");
    let spinner = document.getElementById("spinner");
    let reseter = document.getElementById("reseter");
    let increaseBetBtn = document.getElementById("increase-bet");
    let decreaseBetBtn = document.getElementById("decrease-bet");
    let depositBtn = document.getElementById("deposit-btn");
    let withdrawBtn = document.getElementById("withdrawal-btn");
    const readyBet = document.querySelectorAll(".ready-bet li");

    // Event handlers
    spinner.addEventListener("click", spin);
    reseter.addEventListener("click", init);
    increaseBetBtn.addEventListener("click", increaseBet);
    decreaseBetBtn.addEventListener("click", decreaseBet);
    depositBtn.addEventListener("click", depositMoney);
    withdrawBtn.addEventListener("click", withdrawMoney);

    // Functions
    async function spin() {
		spinTone.play();

        if (checkBalance()) {
            betAmount.style.color = "#FF7676";
            balanceAmountNum.textContent -= parseInt(betAmountInput.value);
            betAmount.textContent = `-$${parseInt(betAmountInput.value)}`;
            init(false, 2);
        } else {
            spinner.disabled = false;
            reseter.disabled = true;
            betAmount.style.opacity = "0";
            return false;
        }

        for (const door of doors) {
            const boxes = door.querySelector(".boxes");
            const duration = parseInt(boxes.style.transitionDuration);
            boxes.style.transform = "translateY(0)";
            await new Promise((resolve) => setTimeout(resolve, duration * 100));
        }     
    }
  
    function init(firstInit = true, duration = 1) {
        spinner.disabled = false;
        reseter.disabled = true;
        win.textContent = `0`;

        document.getElementById('result-msg').textContent = `Hit the spinner 👆`
        var reels = []; // Create a reels array
        var last = [];

        for (const door of doors) { // 3 times loop

            if (firstInit) {
                door.dataset.spinned = "0";
            } else if (door.dataset.spinned === "1") {
                // Make the button disabled
                return false;
            }
    
            const boxes = door.querySelector(".boxes");
            const boxesClone = boxes.cloneNode(false);
    
            const pool = ["❓"];

            if (!firstInit) { // If the spinner is hit
                spinner.disabled = true;
                reseter.disabled = false;
                document.getElementById('result-msg').textContent = `Spinning...`;
                betAmount.style.opacity = "1";

                const sybmols = [];
                for (const [sybmol, count] of Object.entries(SYMBOLS_COUNT)) {
                    for (let i = 0; i < count; i++) {
                        sybmols.push(sybmol)
                    }
                }
            
                for (let i = 0; i < COLS; i++) {
                    const reelSymbols = [...sybmols]; // Create a copy of 'symbols' array
                    for (let j = 0; j < ROWS; j++) {
                        const randomIndex = Math.floor(Math.random() * reelSymbols.length);
                        const selectedSymbol = reelSymbols[randomIndex];
                        reels.push(selectedSymbol); // Take a randome symbol and push it to the 'reels' array 
                        reelSymbols.splice(randomIndex, 1); // Make sure you remove that symbol from the copy array 'reelSymbols'
                    }
                }

                pool.push(...reels);

                boxesClone.addEventListener(
                    "transitionstart",
                    function () {
                        door.dataset.spinned = "1";
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
                        if (door.classList.contains("d-3")) {
                            const bet = parseInt(betAmount.textContent.substr(2));
                            if (showMessage(getWinnings(reels, bet))) addToLocalStorage_payouts();         
                        }
                    },
                    { once: true }
                );
            }

            for (let i = pool.length - 1; i >= 0; i--) { // 1 - 1 => i = 0
                const box = document.createElement("div");
                box.classList.add("box");
                box.style.width = door.clientWidth + "px";
                box.style.height = door.clientHeight + "px";
                box.textContent = pool[i]; // pool[0]
                boxesClone.appendChild(box);
            }
            last.push(pool.pop());
            boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
            boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
            door.replaceChild(boxesClone, boxes); // replace boxes (old) with boxesClone (new)
        }
        reels = last;
    }


    const checkBalance = () => {
        if (parseInt(balanceAmountNum.textContent) <= 0) {
            resultMsg.textContent = "You ran out of balance!";
            return false;
        } 
        else if (parseInt(balanceAmountNum.textContent) < parseInt(betAmountInput.value)) {
            resultMsg.textContent = "You don't have enough balance 😢";
            return false;
        }
        return true;
    }

    const showMessage = (winnings) => {
        if (winnings === 0) {
            loseTone.play();
            document.getElementById('result-msg').textContent = `You won nothing!`;
            document.getElementById('win-amount').textContent = 0;
            return false;
        }

        winTone.play();
        resultMsg.textContent = `You won $${winnings}!`;
        win.textContent = `${winnings}`;
        balanceAmountNum.textContent = `${parseInt(balanceAmountNum.textContent) + winnings}`;
        return true;
    }

    const getWinnings = (reels, bet) => {
        let winnings = 0;
        let allSame = true;

        for (const symbol of reels) {
            if (symbol != reels[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings = parseInt(bet) * SYMBOL_VALUES[reels[0]];
        }

        return winnings;
    }

    function increaseBet() {
        betAmountInput.value = parseInt(betAmountInput.value) + 10;
    }

    function decreaseBet() {
        if (betAmountInput.value < 10) {
            betAmountInput.value = 0;
        } else {
            betAmountInput.value = parseInt(betAmountInput.value) - 10;
        }
    }

    function depositMoney() {
        let addedAmount = document.getElementById("addedAmount");

        if (parseInt(addedAmount.value) <= 0 || isNaN(addedAmount.value) || addedAmount.value === "") {
            alert("Please enter a valid number!");
        } else {
            balanceAmountNum.textContent = parseInt(balanceAmountNum.textContent) + parseInt(document.getElementById("addedAmount").value)
            betAmount.textContent = `+$${parseInt(document.getElementById("addedAmount").value)}`;
            addToLocalStorage("Deposit");
            document.getElementById('deposit-modal').style.display = "none";
            var fadeTarget = betAmount;
            fadeTarget.style.opacity = 1;
            fadeTarget.style.color = "green";
            var fadeEffect = setInterval(function () {
                if (!fadeTarget.style.opacity) {
                    fadeTarget.style.opacity = 1;
                }
                if (fadeTarget.style.opacity > 0) {
                    fadeTarget.style.opacity -= 0.1;
                    // fadeTarget.style.transform = "translateY(2px)";
                } else {
                    clearInterval(fadeEffect);
                }
            }, 200);
            addedAmount.value = "";
        }
    }

    function withdrawMoney() {
        let subtractedAmount = document.getElementById("subtractedAmount");

        if (parseInt(subtractedAmount.value) <= 0 || isNaN(subtractedAmount.value) || subtractedAmount.value === "" || parseInt(subtractedAmount.value) > parseInt(balanceAmountNum.textContent)) {
            alert("Please enter a valid number!");
        } else {
            balanceAmountNum.textContent = parseInt(balanceAmountNum.textContent) - parseInt(document.getElementById("subtractedAmount").value)
            betAmount.textContent = `-$${parseInt(document.getElementById("subtractedAmount").value)}`;
            addToLocalStorage("Withdrawal");
            document.getElementById('withdrawal-modal').style.display = "none";
            var fadeTarget = betAmount;
            fadeTarget.style.opacity = 1;
            fadeTarget.style.color = "#FF7676";
            var fadeEffect = setInterval(function () {
                if (!fadeTarget.style.opacity) {
                    fadeTarget.style.opacity = 1;
                }
                if (fadeTarget.style.opacity > 0) {
                    fadeTarget.style.opacity -= 0.1;
                    // fadeTarget.style.transform = "translateY(2px)";
                } else {
                    clearInterval(fadeEffect);
                }
            }, 200);
            subtractedAmount.value = "";
        }
    }

    for (const betAmount of readyBet) {
        betAmount.addEventListener("click", (e) => {
            for (const betAmount of readyBet) {
                betAmount.classList.remove('active');
            }
            document.getElementById("bet-amount-input").value = parseInt(betAmount.dataset.amount);
            betAmount.classList.add('active');
        })
    }
   
    
    init();
  })();
  
