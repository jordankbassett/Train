var firebaseConfig = {
    apiKey: "AIzaSyA0V5q7U6Vfr2qcbhPRpbBNWTxhyf_IG-8",
    authDomain: "train-99e79.firebaseapp.com",
    databaseURL: "https://train-99e79.firebaseio.com",
    projectId: "train-99e79",
    storageBucket: "train-99e79.appspot.com",
    messagingSenderId: "98354688013",
    appId: "1:98354688013:web:a66aaa7871d35f0f1aa544",
};
firebase.initializeApp(Config);

var trainData = firebase.database();

$("#add-train-btn").on("click",function(){
  var trainName= $("#trainNameInput").val().trim();
  var destination= $("#destinationInput").val().trim();
  var firstTrain= moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10,"years").format("x");
  var frequency= $("#frequencyInput").val().trim();
 
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Uploads train data to the database
  trainData.ref().push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  
  alert("Train successfully added");

  
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  
  var Name = childSnapshot.val().name;
  var Destination = childSnapshot.val().destination;
  var Frequency = childSnapshot.val().frequency;
  var FirstTrain = childSnapshot.val().firstTrain;

  var timeArr = FirstTrain.split(":");
  var trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var Minutes;
  var Arrival;

  
  if (maxMoment === trainTime) {
    Arrival = trainTime.format("hh:mm A");
    Minutes = trainTime.diff(moment(), "minutes");
  } else {
    
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    
    Arrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
  }
  console.log("tMinutes:", Minutes);
  console.log("tArrival:", Arrival);

  // Add each train's data into the table
  $("#train-table > tbody").append($("<tr>").append(
      $("<td>").text(Name),
      $("<td>").text(Destination),
      $("<td>").text(Frequency),
      $("<td>").text(Arrival),
      $("<td>").text(Minutes)
    )
  );
});