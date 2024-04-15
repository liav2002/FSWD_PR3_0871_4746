import { FXMLHttpRequest } from './FXMLHttpRequest.js';

document.getElementById('showPassLog').addEventListener('change', show_passwordLog)
document.getElementById('showPassSign').addEventListener('change', show_passwordSign)
document.getElementById('login-button').addEventListener('click', login);
document.getElementById('register-page-button').addEventListener('click', swap_register_form);
document.getElementById('login-page-button').addEventListener('click', swap_login_form);
document.getElementById('signin-button').addEventListener('click', sign_up);

var current_user = {email: "",username: "", password: "", id : ""}
var issueLabel = "";
//#region Login/Signin
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
        document.getElementById('errorAlready').innerText= 'There are fields not yet filled!';
        document.getElementById('errorAlready').style.display = 'block'; 
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
                
                document.getElementById("email-box").value = "";
                document.getElementById("signinUserName").value = "";
                document.getElementById("signin-password").value = "";

                loadIssuesBoard();
            }   
            else{
                document.getElementById('errorAlready').innerText= 'User already exist!';
                document.getElementById('errorAlready').style.display = 'block'; 
            }
    
        }
    );
    document.getElementById('errorAlready').style.display = 'none'; 
    document.getElementById('errorNotExist').style.display = 'none'; 
    fxml.send();

}

function login(event) {
    var user_name = document.getElementById("loginUserName").value;
    var user_pass = document.getElementById("login-password").value;


    if (user_name === '' || user_pass ===''){
        document.getElementById('errorNotExist').style.display = 'block'; 
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

            document.getElementById("loginUserName").value = "";
            document.getElementById("login-password").value = "";

            loadIssuesBoard();
        }
        else{
            document.getElementById('errorNotExist').style.display = 'block'; 
        }

    });
    document.getElementById('errorAlready').style.display = 'none'; 
    document.getElementById('errorNotExist').style.display = 'none'; 
    fxml.send();
}

function logoutClickHandler(event) {
    var fxml = new FXMLHttpRequest();
        fxml.open(
        'POST',
        'issuesList.com/Logout',
        {},
        function(response) {
            console.log(response)
            if (response.status === 200){       
                current_user = {email: "",username: "", password: "", id : ""};
                document.getElementById('issues').style.display = 'none'; 
                document.getElementById('logout').style.display = 'none'; 
                document.querySelector('.form').style.display = 'block'; 
                swap_login_form();
            }
            else{
                console.log('Error while trying to logout !');
            }
        });
        fxml.send();
}

//#endregion Login/Signin

//#region IssuesBoard

function loadIssuesBoard() {
    document.querySelector('.form').style.display = 'none'; 
    document.getElementById('issues').style.display = 'flex'; 
    document.getElementById('logout').style.display = 'block'; 

    document.querySelectorAll('.add-issue-btn').forEach(function(btn) {
        btn.addEventListener('click', handleAddIssueClick);
    });

    document.getElementById("logout-btn").addEventListener("click", logoutClickHandler);

    var fxml = new FXMLHttpRequest();
    fxml.open(
     'GET',
     'issuesList.com/GetIssues',
     {},
     function(response) {
        console.log(response)
        if (response.status === 200){
            var issueMap = response.issues;

            document.querySelectorAll('.column').forEach(column => {
                const issueContainers = column.querySelectorAll('.issue-container');
                issueContainers.forEach(issueContainer => {
                    column.removeChild(issueContainer);
                });
            });

            if (issueMap instanceof Map) {
                console.log('Client successefuly get issues');

                issueMap.forEach(issue => {
                    const issueContainer = document.createElement('div');
                    issueContainer.classList.add('issue-container');

                    const issueDiv = document.createElement('div');
                    issueDiv.classList.add('issue');
                    issueDiv.draggable = true;
                    issueDiv.dataset.issueId = issue.id;
                    issueDiv.textContent = "#" + issue.id + " " + issue.title + " (" + issue.assignee + ")";

                    issueDiv.addEventListener('click', issueClickHandler);
                    issueDiv.addEventListener('dragstart', function(event) {
                        event.dataTransfer.setData("text", event.target.dataset.issueId);
                    });

                    const trashMark = document.createElement('div');
                    trashMark.classList.add('trash-mark');
                    trashMark.innerHTML = '&#128465;'; // trash can emoji
                    trashMark.addEventListener('click', function(event) {
                        removeIssue(event);
                    });

                    issueContainer.appendChild(issueDiv);
                    issueContainer.appendChild(trashMark);

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
                            columnClass = '.todo';
                    }

                    document.querySelector(columnClass).appendChild(issueContainer);
                });

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

function closeSlidingWindow() {
    var slidingWindow = document.getElementById("sliding-window");
    if (slidingWindow) {
        slidingWindow.style.transition = "width 0.5s ease";
        slidingWindow.style.transform = "translateX(100%)";
        setTimeout(function() {
            slidingWindow.style.width = "0"; 
        }, 500);
    }
}

function showIssueDetails(issueId) {
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

            var slidingWindowContent = `
                <div class="sliding-window-content">
                    <span class="close-btn">&times;</span>
                    <h2>#${issueDetails.id}</h2>
                    <h1>${issueDetails.name}</h1>
                    <p><strong>Assign:</strong> ${issueDetails.assignee}</p>
                    <p><strong>Description:</strong> ${issueDetails.description}</p>
                    <p><strong>Due Date:</strong> ${issueDetails.dueDate}</p>
                    <p><strong>Label:</strong> ${issueDetails.label}</p>
                </div>
            `;

            var slidingWindow = document.getElementById("sliding-window");
            if (!slidingWindow) {
                slidingWindow = document.createElement("div");
                slidingWindow.id = "sliding-window";
                slidingWindow.classList.add("sliding-window");
                document.body.appendChild(slidingWindow);
            }

            slidingWindow.innerHTML = slidingWindowContent;

            slidingWindow.style.width = "20%"; 
            slidingWindow.style.display = "block"; 
            setTimeout(function() {
                slidingWindow.style.transition = "width 0.5s ease"; 
                slidingWindow.style.transform = "translateX(0)";
            }, 100);

            document.querySelector(".close-btn").addEventListener("click", closeSlidingWindow);
        }
        else{
            console.log('Error while trying to get Issue (id: ' + issueId + ')');
        }
    });
    fxml.send();
}

function issueClickHandler(event) {
    var issueId = event.target.dataset.issueId;
    
    showIssueDetails(issueId);
}

function allowDrop(event) {
    event.preventDefault();
}

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


function handleAddIssueClick(event) {
    var boardId = event.target.dataset.boardId;
    

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
    var fxml = new FXMLHttpRequest();
    fxml.open(
        'GET',
        'issuesList.com/GetUsers',
        {},
        function(response) {
            console.log(response);
            if (response.status === 200){       
                var users = response.users;
                const selectElement = document.getElementById('assignee');

                selectElement.innerHTML = '';

                var existingUsernames = {};

                users.forEach(username => {
                    if (!existingUsernames[username]) {
                        const option = document.createElement('option');
                        option.value = username;
                        option.textContent = username;
                        selectElement.appendChild(option);
                        existingUsernames[username] = true;
                    }
                });
            }
        });
        
    fxml.send();
    
    var newIssueForm = document.getElementById('new-issue');
    newIssueForm.style.visibility = 'visible';
    newIssueForm.style.opacity = '1';
    
    var closeButton = document.getElementById('close-issue-form');
    closeButton.addEventListener('click', function() {
        var newIssueForm = document.getElementById('new-issue');
        newIssueForm.style.visibility = 'hidden';
        newIssueForm.style.opacity = '0';
    });

    var submitButton = document.querySelector('#new-issue-form-inner input[type="submit"]');
    var errorMessage = document.getElementById('new-issue-error-message');
    errorMessage.style.display = 'none'; 


    submitButton.addEventListener('click', function(event) {
        event.preventDefault();
        var issueTitle = document.getElementById('issue-title').value.trim();
        var issueDueDate = document.getElementById('due-date').value.trim();
        var userAssignee = document.getElementById('assignee').value.trim();
        var issueDescription = document.getElementById('description').value.trim();
    
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

            var newIssueForm = document.getElementById('new-issue');
            newIssueForm.style.visibility = 'hidden';
            newIssueForm.style.opacity = '0';
            document.getElementById('issue-title').value = '';
            document.getElementById('due-date').value = '';
            document.getElementById('assignee').value = '';
            document.getElementById('description').value = '';
            issueLabel=null;
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


//#endregion IssuesBoard
onLoading();
