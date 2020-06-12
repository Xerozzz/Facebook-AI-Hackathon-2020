
// WHEN USER LOGS IN OR LOGS OUT
$(() => {
	firebase.auth().onAuthStateChanged(user => {
		if(user){
			userSignedIn(user);
		}else{
			userNotSignedIn();
			console.log("not signed in");
		}
	})

	$("form").submit((e) => {
		e.preventDefault();
	})
})

function logOut(){
	firebase.auth().signOut().then(() => {
		console.log("Sign Out Successful");
		// goHome();
	})
	.catch((err) => {
	})
}

function userSignedIn(user){

	$(".signed-out").hide();
	$(".signed-in").show();

	$("#user-text").html(user.email);

}

function userNotSignedIn(){
	$(".signed-out").show();
	$(".signed-in").hide();
}

function filterInputs(){
	var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	var pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

	var email = document.getElementById("email").value;
	var uid = document.getElementById("uid").value;
	var pwd1 = document.getElementById("pwd1").value;
	var pwd2 = document.getElementById("pwd2").value;

	if(email == "" || uid == "" || pwd1 == "" || pwd2 == ""){
		setErrorMsg("Please fill in all fields!");
	}else if(!emailRegex.test(email)){
		setErrorMsg("Please enter a valid email");
	}else if(pwd1 != pwd2){
		setErrorMsg("Passwords have to be identical");
	}else if(!pwdRegex.test(pwd1)){
		setErrorMsg("Password must be at least 8 characters in length, have 1 lowercase letter, 1 uppercase letter and 1 digit");
	}else{
		firebase.auth().createUserWithEmailAndPassword(email, pwd1).then(() => {
			console.log("Sign up successful!");

			updateUserDisplayName(uid);
		})
		.catch(function(error)
		{
			var errorCode = error.code;
			var errorMsg = error.message;

			if(errorCode == "auth/email-already-in-use"){
				setErrorMsg("Email already in use!");
			}else{
				setErrorMsg(errorMsg);
			}
		});
	}
}

function updateUserDisplayName(uid){
	var user = firebase.auth().currentUser;
	// console.log(user);
	if (user){
		user.updateProfile({
			displayName: uid
		}).then(() => {
			console.log(user.displayName);

			// goHome();
		}).catch((error) => {

		})
	}else{
		console.log("Nobody is signed in");
	}
}

function goHome(){
	window.location.href = "index.html";
}

function setErrorMsg(msg){
	var errorMsg = $("#signup-error-msg");
	errorMsg.html(`<div class="card-panel red white-text lighten-2">${msg}</div>`);
}
function setSignInErrorMsg(msg){
	var errLabel = $("#signin-error-msg");
	errLabel.html(`<div class="card-panel red white-text lighten-2">${msg}</div>`);
}

function resetAllInputFields(){
	console.log("Reset!");

	// document.getElementById("email").value = "";
	// document.getElementById("uid").value = "";
	// document.getElementById("pwd1").value = "";
	// document.getElementById("pwd2").value = "";

	// $("uid-login").val("");
	// $("pwd-login").val("");

	$("input").val("");

	$("#signup-error-msg").children("div").remove();
	$("#signin-error-msg").children("div").remove();

	$(".modal").modal("close");
}

function signUpWithEmail(){
	filterInputs();
}

function signInWithEmail(){
	var email = $("#email-login").val();
	var pwd = $("#pwd-login").val();

	console.log(email);
	console.log(pwd);

	if(email == "" || pwd == ""){
		setSignInErrorMsg("Please fill in all fields!");
	}else{
		firebase.auth().signInWithEmailAndPassword(email, pwd).then(() => {
			resetAllInputFields();
		})
		.catch((err) => {
			setSignInErrorMsg("Sign In Unsuccessful.")
		})
	}
}

function signInWithGoogle(){
	console.log("Signing in with google...");
	var googleProvider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithRedirect(googleProvider);
}
