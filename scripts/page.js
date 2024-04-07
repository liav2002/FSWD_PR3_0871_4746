

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
