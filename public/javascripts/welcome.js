var buttonCreateAccount = document.querySelector(".btn-create-account");
// document.cookie = "loginStatus=Invalid";
buttonCreateAccount.addEventListener("click", function() {
    // window.open('https://accounts.google.com/signup', '_blank');
    location.href = "/create.html";
});
// 214746217802-jg3f9mu6oflodrvhott42cjj7ij6palc.apps.googleusercontent.com
// 309978492743-ereano57g6etdgrk4ebno3tge401fjt1.apps.googleusercontent.com
// var YOUR_CLIENT_ID = '214746217802-jg3f9mu6oflodrvhott42cjj7ij6palc.apps.googleusercontent.com';
// var YOUR_REDIRECT_URI = 'http://localhost:3000/homepage.html';
// var queryString = location.hash.substring(1);

// Parse query string to see if page request is coming from OAuth 2.0 server.
// var params = {};
// var regex = /([^&=]+)=([^&]*)/g, m;
// while (m = regex.exec(queryString)) {
//     alert('HELLO WORLD');
//   params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
//   // Try to exchange the param values for an access token.
//   exchangeOAuth2Token(params);
// }

// If there's an access token, try an API request.
// Otherwise, start OAuth 2.0 flow.
// function requestAccess() {
//     var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
//     if (params && params.access_token) {
//         var xhr = new XMLHttpRequest();
//         xhr.open('GET', 'https://www.googleapis.com/drive/v3/about?fields=user&' + 'access_token=' + params.access_token);
//         xhr.onreadystatechange = function(e) {
//             console.log(xhr.response);
//         };
//         xhr.send(null);
//     } else {
//         oauth2SignIn();
//     }
// }

/*
   * Create form to request access token from Google's OAuth 2.0 server.
   */
// function oauth2SignIn() {
//     // Google's OAuth 2.0 endpoint for requesting an access token
//     var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
//
//     // Create element to open OAuth 2.0 endpoint in new window.
//     var form = document.createElement('form');
//     form.setAttribute('method', 'GET'); // Send as a GET request.
//     form.setAttribute('action', oauth2Endpoint);
//
//     // Parameters to pass to OAuth 2.0 endpoint.
//     var params = {
//         'client_id': YOUR_CLIENT_ID,
//         'redirect_uri': YOUR_REDIRECT_URI,
//         'scope': 'openid profile email https://www.googleapis.com/auth/calendar.readonly',
//         'state': 'requesting_access',
//         'include_granted_scopes': 'true',
//         'response_type': 'token'
//     };
//
//     // Add form parameters as hidden input values.
//     for (var p in params) {
//         var input = document.createElement('input');
//         input.setAttribute('type', 'hidden');
//         input.setAttribute('name', p);
//         input.setAttribute('value', params[p]);
//         form.appendChild(input);
//     }
//
//     // Add form to page and submit it to open the OAuth 2.0 endpoint.
//     document.body.appendChild(form);
//     form.submit();
//     document.cookie = "loginStatus=Valid";
// }

/* Verify the access token received on the query string. */
// function exchangeOAuth2Token(params) {
//   var oauth2Endpoint = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
//   if (params['access_token']) {
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', oauth2Endpoint + '?access_token=' + params['access_token']);
//     xhr.onreadystatechange = function (e) {
//       var response = JSON.parse(xhr.response);
//       // When request is finished, verify that the 'aud' property in the
//       // response matches YOUR_CLIENT_ID.
//       if (xhr.readyState == 4 &&
//           xhr.status == 200 &&
//           response['aud'] &&
//           response['aud'] == YOUR_CLIENT_ID) {
//         // Store granted scopes in local storage to facilitate
//         // incremental authorization.
//         params['scope'] = response['scope'];
//         localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
//         if (params['state'] == 'requesting_access') {
//           requestAccess();
//         }
//       } else if (xhr.readyState == 4) {
//         console.log('There was an error processing the token, another ' +
//                     'response was returned, or the token was invalid.')
//       }
//     };
//     xhr.send(null);
//     document.cookie="loginStatus=Valid";
//   }
// }
