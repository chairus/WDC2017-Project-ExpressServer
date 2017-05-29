var buttonCreateAccount = document.querySelector(".btn-create-account");
buttonCreateAccount.addEventListener("click", function() {
    location.href = "/create.html";
});

// New Google-Sign-In(GSI) using onSignIn
function onSignIn(googleUser) {
     // Useful data for client-side scripts:
    var profile = googleUser.getBasicProfile();

    // Authenticating with server
    // The ID token to pass to backend:
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/users/verify_token');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.responseText) { // Invalid googleID
            alert('Invalid googleID');
            return location.replace('/');
        }
        location.replace('/homepage.html');
    };
    xhr.send('idtoken=' + id_token);
}
