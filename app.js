var clockStates = {"work":25*60,"break": 5*60,"rest":15*60};
var time = 0
var intervalID = undefined
var isRunning = false
var workflow = []
var currentWorkflow = "work"
var audio = new Audio('timer-with-ding.wav');

var convertTime = function (seconds) {
    var minutes = Math.floor(seconds/60);
    seconds = (seconds - (minutes*60)).toString();
    if (seconds.length < 2) {
        seconds = "0" + seconds
    }
    minutes = minutes.toString()
    if (minutes.length < 2) {
        minutes = "0" + minutes
    }
    return minutes + ":" + seconds;
};

var renderTimer = function () {
    $(".timer").html(convertTime(time));
    var currentClass = "." + currentWorkflow
    if ($(currentClass).hasClass("highlight")){} else {
        $(".workflow-commands .button").removeClass("highlight");
        $(currentClass).addClass("highlight");
    }
};

var timerEnded = function() {
    audio.play(); //play sound
    if (workflow.length == 6) {
        workflow = []
    }
    var next
    workflow.push(currentWorkflow);
    if (currentWorkflow == "work") {
        switch (workflow.filter(function(el) { return el == "work"}).length) {
            case 1:
                next = "break";
                break;
            case 2:
                next = "break";
                break;
            case 3:
                next = "rest";
                break;
        }
    } else if (currentWorkflow == "break" || currentWorkflow == "rest") {
        next = "work"
    } 
    time = clockStates[next]
    currentWorkflow = next
    startTimer();
}

var startTimer = function () {
       intervalID = setInterval(function (){
                if (time === 0) {
                    stopTimer()
                    timerEnded()
                }
                else {
                    time = time-1
                }
                renderTimer()
            }, 1000)
            isRunning = true;
};

var stopTimer = function() {
    clearInterval(intervalID)
    isRunning = false;
}

var setStartButton = function () {
    $(".start-timer").html("Start").removeClass("pause").addClass("start");
}

var setPauseButton = function () {
    $(".start-timer").html("Pause").removeClass("start").addClass("pause")
}

$(document).ready(function () {
    

    
    // initial value
    time = clockStates["work"]
    renderTimer()
    
    
    //click listeners to reset timer
    $(".workflow-commands .work").on("click", function (){
        currentWorkflow = "work"
        time = clockStates[currentWorkflow]
        renderTimer()
        stopTimer()
        setStartButton()
    })
    
    $(".workflow-commands .break").on("click", function (){
        currentWorkflow = "break"
        time = clockStates[currentWorkflow]
        renderTimer()
        stopTimer()
        setStartButton()
    })
    
    $(".workflow-commands .rest").on("click", function (){
        currentWorkflow = "rest"
        time = clockStates[currentWorkflow]
        renderTimer()
        stopTimer()
        setStartButton()
    })
    
    $(".timer-control .start-timer").on("click", function () {
        if (isRunning) {
            stopTimer()
        } else {
            startTimer()
        }
        if ($(".start-timer").hasClass("pause")) {
            setStartButton()
        } else {
            setPauseButton()
        }
        
    })
    
    $(".timer-control .reset-timer").on("click", function() {
        stopTimer()
        currentWorkflow = "work"
        workflow = []
        time = clockStates[currentWorkflow]
        renderTimer()
        setStartButton()
    })
    
});
