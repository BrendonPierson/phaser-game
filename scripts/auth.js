var ref = new Firebase("https://spider-game.firebaseio.com");
if (ref.getAuth() === null) {
  ref.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  });
};