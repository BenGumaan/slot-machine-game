// var persons = {};
// persons["2901465"] = {id: 2901465, name:"Tom"};
// persons["3305579"] = {id: 3305579, name:"Su"};
// persons["6492003"] = {id: 6492003, name:"Pete"};
// try {
//   localStorage["personTable"] = JSON.stringify( persons);
// } catch (e) {
//   alert("Error when writing to Local Storage\n" + e);
// }


// var persons = {};
// try {
//   persons = JSON.parse(localStorage["personTable"]);
// } catch (e) {
//   alert("Error when reading from Local Storage\n" + e);        
// }

const transactionsBtn = document.getElementById("transactions");
const payoutsBtn = document.getElementById("payouts");

transactionsBtn.addEventListener("click", () => {
    const data = localStorage.getItem("Transactions");
    const transactions = JSON.parse(data);
    console.log(transactions);
    document.getElementById("transactions-table").innerHTML = `
        <div>
            ${createTable(transactions)}
        </div>
    `;
});

payoutsBtn.addEventListener("click", () => {
    const data = localStorage.getItem("Payouts");
    const payouts = JSON.parse(data);
    console.log(payouts);
    document.getElementById("payouts-table").innerHTML = `
        <div>
            ${createTable_payouts(payouts)}
        </div>
    `;
});

const createTable = (transactions) => {
    return `
    <table>
    <thead>
        <tr>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Amount</th>
        </tr>
    </thead>
    <tbody>
        ${createTableData(transactions)}
    </tbody>
  </table>
    `;
}

const createTableData = (transactions) => {
    let html = '';
    console.log("transactions: ", transactions.date.length);
    let length = transactions.date.length;
    for (let i = length < 5 ? 0 : length-5; i < length; i++) {
        const date = transactions.date[i];
        const type = transactions.type[i];
        const amount = transactions.amount[i];
        html += `
        <tr>
            <td>${date}</td>
            <td>${type}</td>
            <td>$${amount}</td>
        </tr>
        `;
    }

    return html;
}

const createTable_payouts = (payouts) => {
    return `
    <table>
    <thead>
        <tr>
            <th scope="col">Symbol</th>
            <th scope="col">Payout</th>
        </tr>
    </thead>
    <tbody>
        ${createTableData_payouts(payouts)}
    </tbody>
  </table>
    `;
}

const createTableData_payouts = (payouts) => {
    let html = '';
    console.log("payouts: ", payouts.symbol.length);
    let length = payouts.symbol.length;
    for (let i = length < 5 ? 0 : length-5; i < length; i++) {
        const symbol = payouts.symbol[i];
        const payout = payouts.payout[i];
        html += `
        <tr>
            <td>${symbol}</td>
            <td>$${payout}</td>
        </tr>
        `;
    }

    return html;
}

let transactions; 
const addToLocalStorage = (transaction_type) => {
    const localStorageContent = localStorage.getItem('Transactions');

    transactions = JSON.parse(localStorageContent);

    if (localStorageContent === null) {
        transactions = {
            date: [],
            type: [],
            amount: []
        };
    }
    
    transactions.date.push(new Date().toLocaleDateString('es-pa'));
    transactions.type.push(transaction_type);
    if (transaction_type === "Withdrawal") transactions.amount.push(document.getElementById("subtractedAmount").value);
    if (transaction_type === "Deposit") transactions.amount.push(document.getElementById("addedAmount").value);
    console.log("transactions: ", transactions);
    localStorage.setItem('Transactions', JSON.stringify(transactions));
}

let payouts; 
const addToLocalStorage_payouts = () => {
    const localStorageContent = localStorage.getItem('Payouts');

    payouts = JSON.parse(localStorageContent);

    if (localStorageContent === null) {
        payouts = {
            symbol: [],
            payout: []
        };
    }
    
    payouts.symbol.push(new Date().toDateString());
    payouts.payout.push(document.getElementById("win-amount").textContent);
    console.log("payouts: ", payouts);
    localStorage.setItem('Payouts', JSON.stringify(payouts));
}
