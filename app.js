  /* global firebase moment */

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAIvI7aB3YwQRDU3-JiYNTGzSWNwamb4Rc",
    authDomain: "trainsched-12dee.firebaseapp.com",
    databaseURL: "https://trainsched-12dee.firebaseio.com",
    projectId: "trainsched-12dee",
    storageBucket: "",
    messagingSenderId: "21454552250"
  };
  firebase.initializeApp(config);

var db = firebase.database();

var name = "";
var destination = "";
var firstTrain = "";
var frequency = 0;
var nextArrival;
var minutesAway = 0;
var currentTime = moment();

// function updateTime(){
//   currentTime = moment();
// }
// setInterval( updateTime, 60000);

$("#submit").on("click", function(event){
  event.preventDefault();
  if($("#trainName").val().trim() != "" && $("#destination").val().trim()!="" && $("#frequency").val().trim()!=0 && $("#firstTrain").val().trim() != ""){
  
    name = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();
    firstTrain = $("#firstTrain").val().trim(); //in HH:mm
  
     
    db.ref().push({
      name: name,
      destination: destination,
      frequency: frequency,
      firstTrain: firstTrain,
    });
    
    $("#trainName").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#firstTrain").val("");
    
  }
  else{
    alert("Please provide all the requested information");
  }
  
  
});


db.ref().on("child_added", function(snap){
  firstTrain = moment(snap.val().firstTrain, "hh:mm").subtract(1,"years").format("HH:mm");
  var timeOut = moment(currentTime, "HH:mm").diff(moment(firstTrain, "HH:mm"), "minutes");
  var intoLastRun = timeOut % snap.val().frequency;
  minutesAway = snap.val().frequency - intoLastRun;
  nextArrival = moment(currentTime, "HH:mm").add(minutesAway, "minutes").format("HH:mm");

    $("#schedule").append(
                            "<tr>" +
                            "<td>" + snap.val().name + "</td>" +
                            "<td>" + snap.val().destination + "</td>" +
                            "<td>" + snap.val().frequency + "</td>" +
                            "<td>" + nextArrival + "</td>" +
                            "<td>" + minutesAway + "</td>" +
                            "</tr>"
                          );
});

                        