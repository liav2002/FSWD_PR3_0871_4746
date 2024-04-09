import { FXMLHttpRequest } from './FXMLHttpRequest.js';

document.getElementById('showPassLog').addEventListener('change', show_passwordLog)
document.getElementById('showPassSign').addEventListener('change', show_passwordSign)
document.getElementById('login-button').addEventListener('click', login);
document.getElementById('register-page-button').addEventListener('click', swap_register_form);
document.getElementById('login-page-button').addEventListener('click', swap_login_form);
document.getElementById('signin-button').addEventListener('click', sign_up);

var issueTickets = document.querySelectorAll('.issue');
issueTickets.forEach(function(issueTicket) {
    issueTicket.addEventListener('click', issueClickHandler);
});

// Add event listeners for drag-and-drop
var columns = document.querySelectorAll('.column');
columns.forEach(function(column) {
    column.addEventListener('dragover', allowDrop);
    column.addEventListener('drop', drop);
});

var current_user = {email: "",username: "", password: "", id : ""}

function onLoading() {
    document.getElementById('issues').style.display = 'none'; 
    console.log("search for loggedIn user.")
    var fxml = new FXMLHttpRequest();
    fxml.open(
     'GET',
     'issuesList.com/isAnyoneLoggedIn',
     {},
     function(response) {
        console.log(response)
        if (response.status === 200){
            
            var user = response.user;
            current_user = {
                email: user.email,
                username : user.username,
                password: user.password,
                id : user.id
            };

            document.querySelector('.form').style.display = 'none'; 
            document.getElementById('issues').style.display = 'flex'; 
        }
    });
    fxml.send();
}

function show_passwordLog(){
    var showPasswordCheckbox = document.getElementById('showPassLog');
    var passwordFieldLogin = document.getElementById('login-password');
    
    if (showPasswordCheckbox.checked) {
        if (passwordFieldLogin) passwordFieldLogin.type = 'text';
    } else {
        if (passwordFieldLogin) passwordFieldLogin.type = 'password';
    }
}
function show_passwordSign(){
    var showPasswordCheckbox = document.getElementById('showPassSign');
    var passwordFieldSignIn = document.getElementById('signin-password');
    if (showPasswordCheckbox.checked) {
        if (passwordFieldSignIn) passwordFieldSignIn.type = 'text';
    } else {
        if (passwordFieldSignIn) passwordFieldSignIn.type = 'password';
    }
}
function swap_register_form(){
    var loginForm = document.getElementById('login');
    var signInForm = document.getElementById('signin');
    
    if (loginForm.classList.contains('displayed-block')) {
        loginForm.classList.remove('displayed-block');
        loginForm.classList.add('hidden-block');
        
        signInForm.classList.remove('hidden-block');
        signInForm.classList.add('displayed-block');
    }
}

function swap_login_form(){
    var loginForm = document.getElementById('login');
    var signInForm = document.getElementById('signin');
    
    if (signInForm.classList.contains('displayed-block')) {
        signInForm.classList.remove('displayed-block');
        signInForm.classList.add('hidden-block');
        
        loginForm.classList.remove('hidden-block');
        loginForm.classList.add('displayed-block');
    }
}

function sign_up(event)
{
    var user_mail=document.getElementById("email-box").value;
    var user_name=document.getElementById("signinUserName").value;
    var user_pass=document.getElementById("signin-password").value;

    if (user_mail === '' || user_name === '' || user_pass === ''){
        console.log('There are fields not yet filled!')
        return
    }

    var fxml = new FXMLHttpRequest();
    fxml.open(
        'PUT',
        'issuesList.com/SignUp',
        {email: user_mail ,username : user_name, password : user_pass},
        function(response) {
            console.log(response)
            if (response.status === 200){
                var user = response.user;
                current_user = {
                    email: user.email,
                    username : user.username,
                    password: user.password,
                    id : user.id
                };
                
                console.log('Successfuly signed in !');
                
                document.querySelector('.form').style.display = 'none'; 
                document.getElementById('issues').style.display = 'flex'; 
            }   
            else{
                console.log('Error while trying to sign up !')
                document.getElementById('errorAlready').style.display = 'block'; 
            }
    
        }
    );
    fxml.send();
}

function login(event) {
    var user_name = document.getElementById("loginUserName").value;
    var user_pass = document.getElementById("login-password").value;


    if (user_name === '' || user_pass ===''){
        show_error('Error ! Your username or password is wrong');
        return
    }
    var fxml = new FXMLHttpRequest();
    fxml.open(
     'GET',
     'issuesList.com/Login',
     {username : user_name, password : user_pass},
     function(response) {
        console.log(response)
        if (response.status === 200){
            
            var user = response.user;
            current_user = {
                email: user.email,
                username : user.username,
                password: user.password,
                id : user.id
            };

            console.log('Successefuly logged in');

            document.querySelector('.form').style.display = 'none'; 
            document.getElementById('issues').style.display = 'flex'; 
        }
        else{
            console.log('Error while trying to log in!');

        }

    });
    fxml.send();
}

/* Liav functions for Issues Board */

// Function to close the sliding window
function closeSlidingWindow() {
    var slidingWindow = document.getElementById("sliding-window");
    if (slidingWindow) {
        slidingWindow.style.transition = "width 0.5s ease"; // Add transition for smooth slide effect
        slidingWindow.style.transform = "translateX(100%)"; // Slide out to the right
        setTimeout(function() {
            slidingWindow.style.width = "0"; // Set width to 0 to hide the sliding window
        }, 500); // Wait for the animation to complete before hiding
    }
}

// Function to show issue details in the sliding window
function showIssueDetails(issueId) {
    // Fetch issue details from the server using issueId and display them
    // For now, let's assume we have some dummy data
    var issueDetails = {
        id: issueId,
        name: "Sample Issue " + issueId,
        assignee: "John Doe",
        description: "This is a sample issue description.",
        dueDate: "2024-04-30",
        label: "Todo"
    };

    // Set the content of the sliding window
    var slidingWindowContent = `
        <div class="sliding-window-content">
            <span class="close-btn">&times;</span>
            <h1>${issueDetails.name}</h1>
            <p><strong>Assign:</strong> ${issueDetails.assignee}</p>
            <p><strong>Description:</strong> ${issueDetails.description}</p>
            <p><strong>Due Date:</strong> ${issueDetails.dueDate}</p>
            <p><strong>Label:</strong> ${issueDetails.label}</p>
        </div>
    `;
    
    // Create the sliding window if it doesn't exist
    var slidingWindow = document.getElementById("sliding-window");
    if (!slidingWindow) {
        slidingWindow = document.createElement("div");
        slidingWindow.id = "sliding-window";
        slidingWindow.classList.add("sliding-window");
        document.body.appendChild(slidingWindow);
    }

    // Set the content in the sliding window
    slidingWindow.innerHTML = slidingWindowContent;

    // Display the sliding window with slide effect
    slidingWindow.style.width = "20%"; // Set the width to 20% of the page
    slidingWindow.style.display = "block"; // Set the display to "block" to show the sliding window
    setTimeout(function() {
        slidingWindow.style.transition = "width 0.5s ease"; // Add transition for smooth slide effect
        slidingWindow.style.transform = "translateX(0)"; // Slide in from the right
    }, 100);

    // Add event listener to the close button
    document.querySelector(".close-btn").addEventListener("click", closeSlidingWindow);
}

function issueClickHandler(event) {
    // Get the issue ID associated with the clicked issue
    var issueId = event.target.dataset.issueId;
    console.log(issueId);
    
    // Show issue details in the sliding window
    showIssueDetails(issueId);
}

// Function to handle drag over event
function allowDrop(event) {
    event.preventDefault();
}

// Function to handle drop event
function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var target = event.target;
    if (target.classList.contains("column")) {
        // If drop target is a column, move the dragged issue to the column
        var newIssue = document.createElement("div");
        newIssue.classList.add("issue");
        newIssue.innerText = data;
        target.appendChild(newIssue);
        console.log("Moved issue:", data, "to", target.firstElementChild.innerText);
        // Remove the issue from its previous column
        var draggedIssue = document.querySelector('.issue.dragging');
        if (draggedIssue) {
            draggedIssue.parentNode.removeChild(draggedIssue);
        }
        // Call a function to handle issue change here
    }
}

onLoading();
