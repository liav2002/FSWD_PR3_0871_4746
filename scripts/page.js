import { FXMLHttpRequest } from './FXMLHttpRequest.js';

document.getElementById('showPassLog').addEventListener('change', show_passwordLog)
document.getElementById('showPassSign').addEventListener('change', show_passwordSign)
document.getElementById('login-button').addEventListener('click', login);
document.getElementById('register-page-button').addEventListener('click', swap_register_form);
document.getElementById('login-page-button').addEventListener('click', swap_login_form);
document.getElementById('signin-button').addEventListener('click', sign_up);

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

            loadIssuesBoard();
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
                
                loadIssuesBoard();
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

            loadIssuesBoard();
        }
        else{
            console.log('Error while trying to log in!');

        }

    });
    fxml.send();
}

/* Liav functions for Issues Board */

function loadIssuesBoard() {
    document.querySelector('.form').style.display = 'none'; 
    document.getElementById('issues').style.display = 'flex'; 

    // Initialized click event to '+' button for adding new issues to the board.
    document.querySelectorAll('.add-issue-btn').forEach(function(btn) {
        btn.addEventListener('click', handleAddIssueClick);
    });

    // Load issues the storage in the server
    var fxml = new FXMLHttpRequest();
    fxml.open(
     'GET',
     'issuesList.com/GetIssues',
     {},
     function(response) {
        console.log(response)
        if (response.status === 200){
            var issueMap = response.issues;

            // Clean the board by removing all issues from each column
            document.querySelectorAll('.column').forEach(column => {
                // Remove all issue containers
                const issueContainers = column.querySelectorAll('.issue-container');
                issueContainers.forEach(issueContainer => {
                    column.removeChild(issueContainer);
                });
            });

            if (issueMap instanceof Map) {
                console.log('Client successefuly get issues');

                // Iterate over the Map entries
                issueMap.forEach(issue => {
                    // Create a new container div for the issue
                    const issueContainer = document.createElement('div');
                    issueContainer.classList.add('issue-container');

                    // Create a new div for the issue
                    const issueDiv = document.createElement('div');
                    issueDiv.classList.add('issue');
                    issueDiv.draggable = true;
                    issueDiv.dataset.issueId = issue.id;
                    issueDiv.textContent = issue.title;

                    // Add event listener for clicking on the issue
                    issueDiv.addEventListener('click', issueClickHandler);
                    issueDiv.addEventListener('dragstart', function(event) {
                        event.dataTransfer.setData("text", event.target.dataset.issueId);
                    });

                    // Create a trash mark
                    const trashMark = document.createElement('div');
                    trashMark.classList.add('trash-mark');
                    trashMark.innerHTML = '&#128465;'; // Unicode for trash can emoji
                    trashMark.addEventListener('click', function(event) {
                        // Call the removeIssue function when the trash mark is clicked
                        removeIssue(event);
                    });

                    // Append the issue div and trash mark to the issue container
                    issueContainer.appendChild(issueDiv);
                    issueContainer.appendChild(trashMark);

                    // Find the appropriate column based on the issue label
                    let columnClass;
                    switch (issue.label) {
                        case 'Todo':
                            columnClass = '.todo';
                            break;
                        case 'In Process':
                            columnClass = '.in_process';
                            break;
                        case 'Review':
                            columnClass = '.review';
                            break;
                        case 'Bug':
                            columnClass = '.bug';
                            break;
                        case 'Done':
                            columnClass = '.done';
                            break;
                        default:
                            columnClass = '.todo'; // Default to Todo if label doesn't match any column
                    }

                    // Append the issue div to the appropriate column
                    document.querySelector(columnClass).appendChild(issueContainer);
                });

                // Add event listeners for drag-and-drop
                var columns = document.querySelectorAll('.column');
                columns.forEach(function(column) {
                    column.addEventListener('dragover', allowDrop);
                    column.addEventListener('drop', drop);
                });
            }
            else {
                console.log('Issues map is empty');
            }
        }
        else{
            console.log('Error while trying to get issues!');
        }
    });
    fxml.send();
}

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
    var fxml = new FXMLHttpRequest();
    fxml.open(
     'GET',
     'issuesList.com/GetIssue',
     {id: issueId},
     function(response) {
        console.log(response)
        if (response.status === 200){
            var issue = response.issue;
            var issueDetails = {
                id: issue.id,
                name: issue.title,
                assignee: issue.assignee,
                description: issue.description,
                dueDate: issue.dueDate,
                label: issue.label
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
        else{
            console.log('Error while trying to get Issue (id: ' + issueId + ')');
        }
    });
    fxml.send();
}

function issueClickHandler(event) {
    // Get the issue ID associated with the clicked issue
    var issueId = event.target.dataset.issueId;
    
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
    var issue_id = event.dataTransfer.getData("text");
    var target = event.target;
    var new_lable = target.firstElementChild.innerText;
    if (target.classList.contains("column")) {
        console.log("Moved issue:", issue_id, "to", new_lable);

        var fxml = new FXMLHttpRequest();
        fxml.open(
        'PUT',
        'issuesList.com/ChangeIssueLabel',
        {id: issue_id, new_lable: new_lable},
        function(response) {
            console.log(response)
            if (response.status === 200){
                console.log('Successefuly tranfered');
                loadIssuesBoard();
            }
            else{
                console.log('Error while trying transfer issue');
            }

        });
        fxml.send();
    }
}

// Function to add '+' button for adding new issues.
function handleAddIssueClick(event) {
    var boardId = event.target.dataset.boardId;
    var issueLabel = "";

    //Get specific board label
    switch (boardId) {
        case "0":
            issueLabel = "Todo";
            break;
        case "1":
            issueLabel = "In Process";
            break;
        case "2":
            issueLabel = "Review";
            break;
        case "3":
            issueLabel = "Bug";
            break;
        case "4":
            issueLabel = "Done";
            break;
        default:
            console.log("Invalid board ID");
    }

    // Get users list to the select box
    var fxml = new FXMLHttpRequest();
    fxml.open(
     'GET',
     'issuesList.com/GetUsers',
     {},
     function(response) {
        console.log(response)
        if (response.status === 200){       
            var users = response.users;
            const selectElement = document.getElementById('assignee');
            users.forEach(username => {
                const option = document.createElement('option');
                option.value = username;
                option.textContent = username;
                selectElement.appendChild(option);
            });
        }
    });
    fxml.send();


    // Toggle visibility of the new issue form
    var newIssueForm = document.getElementById('new-issue');
    newIssueForm.style.visibility = 'visible';
    newIssueForm.style.opacity = '1';
    
    // Add click event listener to close the form
    var closeButton = document.getElementById('close-issue-form');
    closeButton.addEventListener('click', function() {
        var newIssueForm = document.getElementById('new-issue');
        newIssueForm.style.visibility = 'hidden';
        newIssueForm.style.opacity = '0';
    });

    // handle submit button
    var submitButton = document.querySelector('#new-issue-form-inner input[type="submit"]');
    var errorMessage = document.getElementById('new-issue-error-message');
    errorMessage.style.display = 'none'; 

    submitButton.addEventListener('click', function(event) {
        // Prevent form submission
        event.preventDefault();
    
        // Validate form fields (example validation)
        var issueTitle = document.getElementById('issue-title').value.trim();
        var issueDueDate = document.getElementById('due-date').value.trim();
        var userAssignee = document.getElementById('assignee').value.trim();
        var issueDescription = document.getElementById('description').value.trim();
    
        // Check if any field is empty
        if (issueTitle === '' || issueDueDate === '' || userAssignee === '' || issueDescription === '') {
            errorMessage.textContent = 'All fields are required!';
            errorMessage.style.display = 'block'; 
        } else {
            errorMessage.style.display = 'none'; 
            var fxml = new FXMLHttpRequest();
            fxml.open(
                'POST',
                'issuesList.com/AddIssue',
                {assignee: userAssignee, title: issueTitle, label: issueLabel, description: issueDescription, dueDate: issueDueDate},
                function(response) {
                    console.log(response)
                    if (response.status === 200){ 
                        loadIssuesBoard();
                    }   
                    else{
                        console.log('Error while trying to add issue !');
                    }
                }
            );
            fxml.send();

            // close and reset form
            var newIssueForm = document.getElementById('new-issue');
            newIssueForm.style.visibility = 'hidden';
            newIssueForm.style.opacity = '0';
            document.getElementById('issue-title').value = '';
            document.getElementById('due-date').value = '';
            document.getElementById('assignee').value = '';
            document.getElementById('description').value = '';
        }
    });
}

function removeIssue(event) {
    const confirmed = confirm("Are you sure you want to remove this issue?");
    const issueId = event.target.parentElement.querySelector('.issue').dataset.issueId;

    if (confirmed) {
        console.log("User confirmed to remove the issue with ID:", issueId);
        var fxml = new FXMLHttpRequest();
        fxml.open(
        'DELETE',
        'issuesList.com/DeleteIssue',
        {id: issueId},
        function(response) {
            console.log(response)
            if (response.status === 200){       
                loadIssuesBoard();
            }
            else{
                console.log('Error while trying to remove issue !');
            }
        });
        fxml.send();
    } else {
        console.log("User canceled removing the issue with ID:", issueId);
    }
}

onLoading();
