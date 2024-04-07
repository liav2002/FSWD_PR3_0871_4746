import { FXMLHttpRequest } from './FXMLHttpRequest.js';

document.getElementById('showPassLog').addEventListener('change', show_passwordLog)
document.getElementById('showPassSign').addEventListener('change', show_passwordSign)
document.getElementById('login-button').addEventListener('click', login);
document.getElementById('register-page-button').addEventListener('click', swap_register_form);
document.getElementById('login-page-button').addEventListener('click', swap_login_form);
document.getElementById('signin-button').addEventListener('click', sign_up);

function show_passwordLog(){
    var showPasswordCheckbox = document.getElementById('showPassLog');
    var passwordFieldLogin = document.getElementById('login-password');
    var passwordFieldSignIn = document.getElementById('signin-password');
    
    if (showPasswordCheckbox.checked) {
        if (passwordFieldLogin) passwordFieldLogin.type = 'text';
    } else {
        if (passwordFieldLogin) passwordFieldLogin.type = 'password';
    }
}
function show_passwordSign(){
    var showPasswordCheckbox = document.getElementById('showPassSign');
    var passwordFieldLogin = document.getElementById('login-password');
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
        show_error('There are fields not yet filled!')
        return
    }

    var fxml = new FXMLHttpRequest();
    fxml.open(
        'PUT',
        'localhost.com/SignUp',
        {email: user_mail ,username : user_name, password : user_pass},
        function(response) {
            console.log(response)
            if (response.status === 200){
                var user = response.user;
                logged_user = {
                    email: user.email,
                    username : user.username,
                    password: user.password,
                    id : user.id
                };
                
                console.log('Successfuly signed in !');
            }   
            else{
                show_error('Error while trying to sign up !')
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
     'localhost.com/SignIn',
     {username : user_name, password : user_pass},
     function(response) {
        console.log(response)
        if (response.status === 200){
            
            var user = response.user;
            logged_user = {
                email: user.email,
                username : user.username,
                password: user.password,
                id : user.id
            };

            console.log('Successefuly logged in');
        }
        else{
            console.log('Error while trying to log in!');

        }

    });
    fxml.send();

}