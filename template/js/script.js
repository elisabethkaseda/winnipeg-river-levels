
// Date info in JavaScript
// Pulled almost wholly from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

let currentDateTime = '';
let queryDateTime = '';

let month = '';
let day = '';
let year = '';
let hour = '';
let minute = '';
let second = '';

let monthString = '';
let dayString = '';
let yearString = '';
let hourString = '';
let minuteString = '';
let secondString = '';

// We need to get right now's time stamp in a method that can be read.

function getDate() {
    const currentDate = new Date(Date.now());

    month = currentDate.getMonth() + 1;
    day = currentDate.getDate();
    year = currentDate.getFullYear();
    hour = currentDate.getHours();
    minute = currentDate.getMinutes();
    second = currentDate.getSeconds();

    if (month < 10) {
        monthString = '0' + month.toString();
    } else {
        monthString = month.toString();
    }

    if (day < 10) {
        dayString = '0' + day.toString();
    } else {
        dayString = day.toString();
    }

    yearString = year.toString();

    if (hour < 10) {
        hourString = '0' + hour.toString();
    } else {
        hourString = hour.toString();
    }

    if (minute < 10) {
        minuteString = '0' + minute.toString();
    } else {
        minuteString = minute.toString();
    }

    if (second < 10) {
        secondString = '0' + second.toString();
    } else {
        secondString = second.toString();
    }

    currentDateTime = yearString + '-' + monthString + '-' + dayString + 'T' + hourString + ':' + minuteString + ':' + secondString;
}

getDate();

// Now we need to get a time 12 hours ago to set our limits to pull logs from...

function getQueryDateTime() {
    let queryHour = '';
    let queryHourString = '';

    let queryDay = '';
    let queryDayString = '';

    let queryMonth = '';
    let queryMonthString = '';

    let queryYear = '';
    let queryYearString = '';

    // checking if we need to go back a day
    if (hour < 12) {
        queryHour = hour + 12;
        queryDay = day - 1;
    } else {
        queryHour = hour - 12;
        queryDay = day;
    }

    if (queryHour < 10) {
        queryHourString = '0' + queryHour.toString();
    } else {
        queryHourString = queryHour.toString();
    }

    // if we go back a day, do we need to go back a month?
    if (queryDay < 1) {
        if (month == 4 || month == 6 || month == 9 || month == 11) {
            queryDay += 30;
        } else if (month == 2) {
            // yes, this will currently break on leap years...
            queryDay += 28;
        } else {
            queryDay += 31;
        }
        queryMonth = month - 1;
    } else {
        queryMonth = month;
    }

    if (queryDay < 10) {
        queryDayString = '0' + queryDay.toString();
    } else {
        queryDayString = queryDay.toString();
    }

    // if we go back a month, do we need to go back a year? 
    if (queryMonth < 1) {
        queryMonth += 12;
        queryYear = year - 1;
    } else {
        queryYear = year;
    }

    if (queryMonth < 10) {
        queryMonthString = '0' + queryMonth.toString();
    } else {
        queryMonthString = queryMonth.toString();
    }

    queryYearString = queryYear.toString();

    queryDateTime = queryYearString + '-' + queryMonthString + '-' + queryDayString + 'T' + queryHourString + ':' + minuteString + ':' + secondString;
}

getQueryDateTime();

console.log(currentDateTime);
console.log(queryDateTime);

// Basic JSON functionality taken from in-class demos 

const archive = document.querySelector('#archive');
let riverJSON = [];

function getArchiveData() {

    fetch('https://data.winnipeg.ca/resource/tgrf-v2zc.json?$where=reading_date between \'' + queryDateTime + '\' and \'' + currentDateTime + '\'')
    .then(
        response => response.json()
    )
    .then(
        response => {
            riverJSON = response.reverse();
            console.log(riverJSON);

            archive.innerHTML = '';

            // This commented out line will be used for the other functionality that I am ignoring for this assignment.
            // newTr(riverJSON[0]);
            riverJSON.map(newTr);
        }
    )
}

function newTr(dataObject) {
    let tr = document.createElement('tr');

    // gets the date prepped for putting in the table
    let readingDate = dataObject.reading_date;
    // splits timestamp into nicer parts
    let readingDateArray = readingDate.split(/[T\.]/);
    // puts it back together nicely
    readingDate = readingDateArray[0] + ' at ' + readingDateArray[1];

    tr.innerHTML = `<td>${dataObject.river_name}</td>
    <td>${dataObject.location}</td>
    <td>${dataObject.james_feet} ft</td>
    <td>${dataObject.geodetic_feet} ft</td>
    <td>${dataObject.geodetic_metric} m</td>
    <td>${readingDate}</td>`;

    archive.append(tr);
}


// Basic location filter for buttons 

function filterByLocation(thisElement) {
    // This might be a bit clunky, but it works. 
    // Remove active class from other buttons if they already have it and resort the data.
    let activeButton = document.getElementsByClassName('active');
    // console.log(activeButton);


    if (activeButton.length > 0) {
        // names things in the array in the order of keys (array destructuring)
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment 
        const [firstButton] = activeButton;
        // console.log(activeButton[0].innerHTML);
        // console.log(thisElement.innerHTML);

        if (firstButton.innerHTML == thisElement.innerHTML) {
            // Couldn't get it to un-filter, so I just ran the function again... there's probably a better way. 
            getArchiveData();

            firstButton.classList.remove('active');
        }

        // It's throwing an undefinedError at this line, but if I try to put it in an "else" statement, it messes up the whole thing, so... it's staying for now.
        firstButton.classList.remove('active');
    }

    // Add active class to button, clear out table.
    thisElement.classList.add('active');
    archive.innerHTML = '';

    riverJSON
    .filter(x => thisElement.innerHTML == x.location)
    .map(newTr)
}


