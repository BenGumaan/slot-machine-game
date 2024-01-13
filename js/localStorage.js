
const transactionsBtn = document.getElementById("transactions");
const payoutsBtn = document.getElementById("payouts");

transactionsBtn.addEventListener("click", () => {
    const data = localStorage.getItem("Transactions");
    const transactions = JSON.parse(data);
    document.getElementById("transactions-table").innerHTML = `
        <div>
            ${createTable_transactions(transactions)}
        </div>
    `;
});

payoutsBtn.addEventListener("click", () => {
    const data = localStorage.getItem("Payouts");
    const payouts = JSON.parse(data);
    document.getElementById("payouts-table").innerHTML = `
        <div>
            ${createTable_payouts(payouts)}
        </div>
    `;
});

const createTable_transactions = (transactions) => {
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
        ${createTableData_transactions(transactions)}
    </tbody>
  </table>
    `;
}

const createTableData_transactions = (transactions) => {
    let html = '';
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

const addToLocalStorage_transactions = (transaction_type) => {
    const localStorageContent = localStorage.getItem('Transactions');
    var DateTime = luxon.DateTime.local().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });    

    transactions = JSON.parse(localStorageContent);

    if (localStorageContent === null) {
        transactions = {
            date: [],
            type: [],
            amount: []
        };
    }
    
    transactions.date.push(DateTime);
    transactions.type.push(transaction_type);
    if (transaction_type === "Withdrawal") transactions.amount.push(document.getElementById("subtractedAmount").value);
    if (transaction_type === "Deposit") transactions.amount.push(document.getElementById("addedAmount").value);
    localStorage.setItem('Transactions', JSON.stringify(transactions));
}

let payouts; 

const addToLocalStorage_payouts = () => {
    const localStorageContent = localStorage.getItem('Payouts');
    var DateTime = luxon.DateTime.local().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });    

    payouts = JSON.parse(localStorageContent);

    if (localStorageContent === null) {
        payouts = {
            symbol: [],
            payout: []
        };
    }
    
    payouts.symbol.push(DateTime);
    payouts.payout.push(document.getElementById("win-amount").textContent);
    localStorage.setItem('Payouts', JSON.stringify(payouts));
}
