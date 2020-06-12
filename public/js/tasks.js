const db = firebase.firestore();

$(document).ready(() => {
    firebase.auth().onAuthStateChanged(user => {
		if(user){
            var user = firebase.auth().currentUser;
            console.log(user.email);

            const refresh = setInterval(showAllTasks(user), 500);

		}else{
			window.location.href = "index.html";
		}
	})

	$("form").submit((e) => {
		e.preventDefault();
	})
})

function showAllTasks(user){

    function clearTables(){
        $("#completed-tasks").html("<li class='collection-header'><h4>Completed Tasks</h4></li>");
        $("#tasks").html(`<li class="collection-header"><h4>My Tasks</h4></li>`)
    }

    function initNewTask(details, completed){
        console.log(completed);
        var taskObj = `<li class="collection-item"><div>
        <label>
            <input type="checkbox" onchange="tasksDone(this)" ${(completed ? "checked" : "")}/>
            <span>${details}</span>
        </label>
        <a href="#" onclick="deleteTask(this);" class="secondary-content"><i class="material-icons">delete</i></a>
    </div></li>`;
        var parent = (completed) ? $("#completed-tasks") : $("#tasks");
        $(taskObj).appendTo(parent);
    }

    db.collection("tasks").where("email", "==", user.email).get().then((querySnapshot) => {
        clearTables()
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            let details = doc.data().details;
            let done = doc.data().done;

            console.log(done);

            initNewTask(details, done);
        })
    });
}

function tasksDone(checkBox){
    let user = firebase.auth().currentUser;
    var taskDetails = $(checkBox).siblings("span").html();

    function finishTask(details, finished){
        db.collection("tasks").where("email", "==", user.email).where("details", "==", details).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id);
                db.collection("tasks").doc(doc.id).update({done: finished}).then(() => {
                    showAllTasks(user)
                });
            })
        });
    }

    console.log($(checkBox).is(":checked"));
    finishTask(taskDetails, $(checkBox).is(":checked"));
    // showAllTasks(user);
}

function addNewTask(form){
    console.log("saubmit");
    let details = $(form).children("input").val();
    let user = firebase.auth().currentUser;
    db.collection("tasks").add({
        details: details,
        done: false,
        email: user.email
    }).then(() => {
        // reload all tasks
        showAllTasks(user);
        $(form).children("input").val("");
    }).catch((err) => {console.log(err)});
}


function deleteTask(deleteBtn){
    let user = firebase.auth().currentUser;
    var details = $(deleteBtn).siblings("label").children("span").html();

    db.collection("tasks").where("email", "==", user.email).where("details", "==", details).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            doc.ref.delete().then(() => {
                showAllTasks(user)
            });
        })
        showAllTasks(user);
    })
}


