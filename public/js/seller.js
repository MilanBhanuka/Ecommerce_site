let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');

// checknig user is logged in or not
window.onload = () => {
    if(user){
        if(!compareToken(user.authToken, user.email)){
            location.replace('/login');
        }
    } else{
        location.replace('/login');
    }
}