// Sign up function
let users = [];
function signUp(e) {
    var username = document.getElementById('reg-username').value;
    var email = document.getElementById('reg-email').value;
    var password = document.getElementById('reg-password').value;
    var DateTime = luxon.DateTime.local().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });    

    if (!username || !email || !password) {
        alert("You have to fill in the fields!");
        return false;
    } else if (checkUser(username)) {
        alert("User already registered!");
        return false;
    } else {
        const localStorageUsers = localStorage.getItem('Users');

        users = JSON.parse(localStorageUsers);
    
        if (localStorageUsers === null) {
            users = [];
        }
        
        let user = {
            id: Date.now(),
            username: username,
            email: email,
            password: password,
            dateJoined: DateTime
            // dateJoined: new Date().toDateString()
        };
        users.push(user);
    
        const json = JSON.stringify(users);
        localStorage.setItem('Users', json);
    
        document.querySelector('.welcome-message #name').textContent = username;
        userInformation(user);
        document.getElementById('register-modal').style.display = "none";    

    }
    
    document.getElementById('reg-username').value = ""
    document.getElementById('reg-email').value = ""
    document.getElementById('reg-password').value = ""
}


function signIn(e) {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    let registered = false;
    
    if (!username || !password) {
        alert("You have to fill in the fields!");
        return false;
    } else {
        const localStorageUsers = localStorage.getItem('Users');

        users = JSON.parse(localStorageUsers);
        
        if (localStorageUsers === null) {
            users = [];
        }

        let user;
        for (let i = 0; i < users.length; i++) {
            user = users[i];
            if (user.username === username && user.password === password) {
                registered = true;
                document.querySelector('.welcome-message #name').textContent = username;
                document.getElementById('login-modal').style.display = "none";    
            }
        }
        document.getElementById('username').value = "";    
        document.getElementById('password').value = "";    

        if (!registered) {
            alert("Incorrect username or password!");
        }
    
        userInformation(user);
    }
   
}

function userInformation(user) {
    document.getElementById('info-username').value = user.username;
    document.getElementById('info-email').value = user.email;
    document.getElementById('info-dateJoined').value = user.dateJoined;
}



function checkUser(username) {
    const localStorageUsers = localStorage.getItem('Users');
    users = JSON.parse(localStorageUsers);

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.username === username) {
            return true;
        }
    }

    return false;
} 
