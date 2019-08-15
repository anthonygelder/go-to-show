let map;

function generateHTML(obj) {
    const city = obj.location.city;

    const lat = obj.location.lat;
    const lng = obj.location.lng;
    map.setCenter({lat: lat, lng: lng});
    addMarker(lat, lng);
    const mapsUrl = urlStr(obj.venue.displayName); 
        

    return `
        <tr>
            <td><a href="${obj.uri}" target="_blank">${obj.performance[0].displayName}</a></td>
            <td><a href="https://www.google.com/maps/search/?api=1&query=${mapsUrl}" target="_blank">${obj.venue.displayName}</td>
            <td>${convertTime(obj.start.time)}</td>
            <td>${city.substring(0, city.length - 8)}</td>
        </tr>
    `
}

function addMarker(lat, lng) {
    new google.maps.Marker({position: {lat: lat,lng: lng}, map: map})

}


function generateTableHeader() {
    return `
    <tr>
        <th align="left">Artist</th>
        <th align="left">Venue</th>
        <th align="left">Time</th>
        <th align="left">City</th>
    </tr>
    `
}

function urlStr(str) {
    return str.replace(/ /g,"+");
}
  

function convertTime(time) {
    if (time === null) {
        return 'N/A'
    } else {
        let amPm;
        let militaryHrMn = time.substring(0, time.length - 3);
        
        let minutes = militaryHrMn.substring(3);
        
        let hour = time.substring(0, time.length - 6);
        
        if (hour > 12) {
            hour = hour - 12;
            amPm = "pm";
        } else {
            amPm = "am";
        }
        return `${hour}:${minutes}${amPm}`;
    }
}

function processData(responseData) {
    const showDataHtml = responseData.resultsPage.results.event.map(function(obj) {
        return generateHTML(obj);
    }).join('');

    $('#results').html(showDataHtml);
    $('#results').prepend(generateTableHeader());

}

function getCurrentDate() {
    const newDate = new Date();
    const formatDate = newDate.toISOString().substring(0, 10);
    return formatDate;
}

function convertDate(date) {
    let day = date.substring(8);
    let month = date.substring(5, 7);
    let year = date.substring(2,4);
    let newDate = `${month}/${day}/${year}`;
    return newDate;
}


function getEvents(id, date) {
    if (date === '') {
        date = getCurrentDate();
        $('p').html('Tonight?');
        const apiUrl = `https://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json?apikey=lKGlBIRmnawI3yka&min_date=${date}&max_date=${date}`;
    }

    const apiUrl = `https://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json?apikey=lKGlBIRmnawI3yka&min_date=${date}&max_date=${date}`;
    let newDate = convertDate(date);
    $('p').html(`On ${newDate}?`);
    fetch(apiUrl)
        .then(response => response.json())
        .then(responseJson => processData(responseJson))
}


function getCityId(city, date) {
    const apiUrl = `https://api.songkick.com/api/3.0/search/locations.json?query=${city}&apikey=lKGlBIRmnawI3yka`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.status === 'error') {
                throw new Error(responseJson.message)
            }
            getEvents(responseJson.resultsPage.results.location[0].metroArea.id, date)
        })
        .catch(error => {
            $('#error').text(`Invalid City`);
        });
}


function main() {
    $('form').on('submit', function(event) {
        event.preventDefault();
        const city = $(event.currentTarget).find('#city-search').val();
        const date = $(event.currentTarget).find('#date-search').val();
        getCurrentDate();
        getCityId(city, date);
    })
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    backgroundColor: 'transparent'
  });
}


// var regIcon = {
//     url: "https://maps.google.com/mapfiles/ms/micons/blue.png",
//     scaledSize: new google.maps.Size(32, 32)
//   };
//   var largeIcon = {
//     url: "https://maps.google.com/mapfiles/ms/micons/blue.png",
//     scaledSize: new google.maps.Size(48, 48)
//   }



































$(main)