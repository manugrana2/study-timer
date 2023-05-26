/*
DEFINITION OF THE VARIABLES THAT HOLD THE STATE OF THE APP
*/
let timerSeconds = 0;
var hours = 0;
var minutes = 0;
var seconds = 0;
let timerInterval;

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


function startTimer() {
    document.getElementsByClassName("save").item(0).classList.add('btn-dissabled')
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementsByClassName("start").item(0).classList.toggle('hide')
    document.getElementsByClassName("stop").item(0).classList.toggle('hide')


}

function updateTimer() {
    timerSeconds++;
    minutes = Math.floor(timerSeconds / 60);
    hours = Math.floor(minutes / 60);
    seconds = timerSeconds % 60;
    document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds
    document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes + ':' : minutes + ':'
    document.getElementById("hours").innerText = hours < 10 ? '0' + hours + ':' : hours + ':'
}

function stopTimer() {
    clearInterval(timerInterval);
    document.getElementsByClassName("save").item(0).classList.toggle('btn-dissabled')
    document.getElementsByClassName("stop").item(0).classList.toggle('hide')
    document.getElementsByClassName("restart").item(0).classList.toggle('hide')
    timerSeconds = 0;
}
function restartClock() {
    hours = 0;
    minutes = 0;
    seconds = 0; document.getElementById("seconds").innerText = '00'
    document.getElementById("minutes").innerText = '00:'
    document.getElementById("hours").innerText = '00:'
    document.getElementsByClassName("restart").item(0).classList.toggle('hide')
    document.getElementsByClassName("start").item(0).classList.toggle('hide')
    document.getElementsByClassName("save").item(0).classList.add('btn-dissabled')


}

function saveRecord() {
    // Check if the subject was tagged
    tag = document.getElementsByName('tag').item(0).value.toLowerCase()

    if (tag !== "") {
        document.getElementsByClassName("save").item(0).classList.toggle('btn-dissabled')
        let recordInfo = { "name": tag, "hours": hours, "minutes": minutes, "seconds": seconds, "type": "record" }
        // Check if Tag already exist in localStorage
        // If not exist, reate an object in localStorage to hold the list of subjects, then it can later be retrieved
        const itemExists = localStorage.getItem('subjects') !== null;
        if (!itemExists) {
            localStorage.setItem('subjects', JSON.stringify([tag]));
            //Save the information of the new tag/subject
            localStorage.setItem(tag, JSON.stringify(recordInfo))

        } else {
            //Check if the tag is saved in the subjects array from localStorage
            let subjectsList = JSON.parse(localStorage.getItem('subjects'))
            if (!Object.values(subjectsList).includes(tag)) {
                //Update localStorage subjects key
                subjectsList[Object.keys(subjectsList).length] = tag
                localStorage.setItem('subjects', JSON.stringify(subjectsList));
                //Save the information of the new tag/subject
                localStorage.setItem(tag, JSON.stringify(recordInfo))
            } else {
                // The tag already exist, so we will compute and sum up the time
                let prevTag = JSON.parse(localStorage.getItem(tag))
                hourSum = prevTag['hours'] + hours
                MinSum = prevTag['minutes'] + minutes
                secSum = prevTag['seconds'] + seconds
                if(secSum/60 > 0){
                    MinSum+= Math.floor(secSum /60)
                    secSum = Math.floor(secSum % 60)
                }
                if(MinSum/60 > 0){
                    hourSum+= Math.floor(secSum /60)
                    secSum = Math.floor(secSum % 60)
                    
                }
                recordInfo = { "name": tag, "hours": hourSum, "minutes": MinSum, "seconds": secSum, "type": "record" }
                // Save the updated record to localStorage
                localStorage.setItem(tag, JSON.stringify(recordInfo))

            }

        }
        document.getElementsByClassName('subjects').item(0).innerHTML = "<div class='title'>Your Subjects</div>"
        document.getElementsByClassName('total-time').item(0).innerHTML = "<div class='title'>Time</div>"

        getPrevRecords()

    } else {
        alert('Please insert a name for this activity and try saving again.')
        document.getElementsByName('tag').item(0).focus()
    }
}

// Get the list of previous records
function getPrevRecords() {
    const prevRecords = localStorage.getItem('subjects');
    if (prevRecords) {
        //build the list of previous records
        console.log('The list of subject is ',JSON.parse(prevRecords));
        JSON.parse(prevRecords).forEach(subject => {
            // Check if there is a record for the subject
            subject = localStorage.getItem(subject);
            if(subject !== null && typeof JSON.parse(subject) === 'object'){
                record = JSON.parse(subject)
                subjectElm = document.createElement("div")
                subjectElm.classList.add("record-elm")
                subjectElm.textContent = toTitleCase(record.name)
                subjectTime = document.createElement("div")
                subjectTime.classList.add("record-elm")
                hours = record.hours < 10 ? '0'+record.hours : record.hours
                minutes = record.minutes < 10 ? '0'+record.minutes : record.minutes
                seconds = record.seconds < 10 ? '0'+record.seconds : record.seconds
                subjectTime.textContent = hours+":"+minutes+":"+seconds
                document.getElementsByClassName('subjects').item(0).appendChild(subjectElm)
                document.getElementsByClassName('total-time').item(0).appendChild(subjectTime)

            }

        });
        

    }
}
getPrevRecords()

document.getElementsByClassName("start").item(0).addEventListener("click", startTimer)
document.getElementsByClassName("stop").item(0).addEventListener("click", stopTimer)
document.getElementsByClassName("restart").item(0).addEventListener("click", restartClock)
document.getElementsByClassName("save").item(0).addEventListener("click", saveRecord)