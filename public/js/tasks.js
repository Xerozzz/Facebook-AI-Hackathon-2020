const db = firebase.firestore();
const functions = firebase.functions();
//const {Wit, log} = require("node-wit");
//const client = new Wit({accessToken: "PEDIZ6QF3QCF3XLTCABYX4WO4V54DWMM"});

var gStream, recorder, input;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext;

var recordButton, stopButton;

$(document).ready(() => {
    recordButton = $("#start-record");
    stopButton = $("#stop-record");
})

function predictMsg(msg, callback){
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.wit.ai/message?v=20200609&q=" + msg);
    request.setRequestHeader("Authorization", "Bearer PEDIZ6QF3QCF3XLTCABYX4WO4V54DWMM");
    request.send();
    request.onload = () => {
        // console.log(request);
        if(request.status){
            let resp = JSON.parse(request.response);

            // console.log(resp.entities["wit$message_subject:message_subject"]['0'].value);
            let subject_arr = resp.entities["wit$message_subject:message_subject"];

            let result = {value: "", command: ""};
            subject_arr.forEach((entity) => {
                result.value = entity.value;
            })
            // console.log(result);
            callback(null, result);
        }else{
            console.log(request.statusText);
            callback(request.statusText, null);
        }
    }
}

function speechToText(blob){
    console.log(blob);
    axios.post('https://cors-anywhere.herokuapp.com/https://api.wit.ai/speech?v=20200609', blob, {
        headers:{
            "Authorization": "Bearer PEDIZ6QF3QCF3XLTCABYX4WO4V54DWMM",
            "Content-Type": "audio/wav"
        }
    })
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    })
    // let request = new XMLHttpRequest();
    // request.open("POST", "https://cors-anywhere.herokuapp.com/https://api.wit.ai/speech?v=20200609");
    // request.setRequestHeader("Authorization", "Bearer PEDIZ6QF3QCF3XLTCABYX4WO4V54DWMM");
    // request.setRequestHeader("Content-Type", "audio/wav");
    // // request.setRequestHeader("Origin", "ai-can-do.web.app");
    // request.send({"binary-data": blob});
    // request.onload = () => {
    //     if(request.status){
    //         let resp = JSON.parse(request.response);
    //         console.log(resp);
    //     }
    // }
}

// function playback(blob){
//     var url = URL.createObjectURL(blob);
//     var au = document.createElement("audio");

//     au.control = true;
//     au.src = url;


// }

function startRecording(){
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
    .then((stream) => {
        gStream = stream;
        input = audioContext.createMediaStreamSource(gStream);
        rec = new Recorder(input, {
            numChannels: 1
        })
        rec.record();
        console.log("Record start");
        recordButton.addClass("disabled");
        stopButton.removeClass("disabled");
    }).catch((err) => {
        recordButton.removeClass("disabled");
        stopButton.addClass("disabled");
    })
}

function stopRecording(){
    recordButton.removeClass("disabled");
    stopButton.addClass("disabled");
    rec.stop();
    gStream.getAudioTracks()[0].stop();
    rec.exportWAV(speechToText);
}


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
        //console.log(completed);
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
            // console.log(doc.data());
            let details = doc.data().details;
            let done = doc.data().done;

            // console.log(done);

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
    console.log("submit");
    let details = $(form).children("input").val();
    let user = firebase.auth().currentUser;

    //let result = await predictMsg(details);
    predictMsg(details, (err, result) => {
        db.collection("tasks").add({
            details: result.value,
            done: false,
            email: user.email
        }).then(() => {
            // reload all tasks
            showAllTasks(user);
            $(form).children("input").val("");
        })
    });
    
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


