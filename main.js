let map;

// Generating table data
function generateHTML(obj) {
    const city = obj.location.city;

    const lat = obj.location.lat;
    const lng = obj.location.lng;

    map.setCenter({lat: lat, lng: lng});

    const mapsUrl = urlStr(obj.venue.displayName); 
    
    addMarker(obj, mapsUrl);

    return `
        <tr>
            <td><a href="${obj.uri}" target="_blank">${obj.performance[0].displayName}</a></td>
            <td><a href="https://www.google.com/maps/search/?api=1&query=${mapsUrl}" target="_blank">${obj.venue.displayName}</td>
            <td valign="top">${convertTime(obj.start.time)}</td>
            <td>${city.substring(0, city.length - 8)}</td>
        </tr>
    `
}

// Adding markers on the map
function addMarker(obj, url) {
    const contentString = `
        <ul>
            <li><a href="${obj.uri}" target="_blank">${obj.performance[0].displayName}</a></li>
            <li><a href="https://www.google.com/maps/search/?api=1&query=${url}" target="_blank">${obj.venue.displayName}</a></li>
            <li>${convertTime(obj.start.time)}</li>
        </ul>`;
    
    const infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    const marker = new google.maps.Marker({
        position: {lat: obj.location.lat,lng: obj.location.lng},
        map: map
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}

// Generating table header, as the function name implies
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

// Converting string to url string
function urlStr(str) {
    return str.replace(/ /g,"+");
}

// Converting milittary time to standard time.
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

// Processing data that was recieved from API call
function processData(responseData) {
    const showDataHtml = responseData.resultsPage.results.event.map(function(obj) {
        return generateHTML(obj);
    }).join('');

    $('#results').html(showDataHtml);
    $('#results').prepend(generateTableHeader());
}

// Getting current date, like the function name implies
function getCurrentDate() {
    const newDate = new Date();
    const dateString = newDate.toString();
    const day = dateString.substring(8, 10);
    const month = dateString.substring(4, 7);
    const year = dateString.substring(11, 15);
    const formatDate = `${year}-${convertMonth(month)}-${day}`;
    return formatDate;
}


// Converting to readable date format
function convertDate(date) {
    let day = date.substring(8);
    let month = date.substring(5, 7);
    let year = date.substring(2,4);
    let newDate = `${month} /${day} /${year}`;
    return newDate;
}

// Using City Id to get events
function getEvents(id, date) {
    $('#error').empty();
    if (date === getCurrentDate()) {
        $('p').html('Tonight');
    } else {
        let newDate = convertDate(date);
        $('p').html(`On ${newDate}`);
    }
    const apiUrl = `https://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json?apikey=lKGlBIRmnawI3yka&min_date=${date}&max_date=${date}`;
    
    fetch(apiUrl)
    .then(response => response.json())
    .then(responseJson => {
        if (responseJson.status === 'error') {
            throw new Error(responseJson.message)
        }
        processData(responseJson)
    })
    .catch(error => {
        $('#map').hide();
        $('#error').text(`Something went wrong. Try again.`);
    })
}

// Getting City ID to use it to search events. 
function getCityId(city, date) {
    const apiUrl = `https://api.songkick.com/api/3.0/search/locations.json?query=${city}&apikey=lKGlBIRmnawI3yka`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.status === 'error') {
                throw new Error(responseJson.message)
                $('#map').hide();
            }
            getEvents(responseJson.resultsPage.results.location[0].metroArea.id, date)
        })
        .catch(error => {
            $('#error').text(`Something went wrong. Try again.`);
        });
}

// Main function
function main() {
    $('form').on('submit', function(event) {
        event.preventDefault();
        $('#results').empty();
        $('#map').hide();
        const city = $(event.currentTarget).find('#city-search').val();
        let date = $(event.currentTarget).find('#date-search').val();
        if (date === '') {
            date = getCurrentDate();
            $('p').html('Tonight');
        }
        if (date < getCurrentDate()) {
            $('#map').hide();
            $('#error').text(`Date cannot be in the past.`);
        } else {
            $('#map').show();
            getCityId(city, date);
        }
    })
}

// Converting string month to number
function convertMonth(month) {
    switch (month) {
        case "Jan":
            month = "01";
            break;
        case "Feb":
            month = "02";
            break;
        case "Mar":
            month = "03";
            break;
        case "Apr":
            month = "04";
            break;
        case "May":
            month = "05";
            break;
        case "June":
            month = "06";
            break;
        case "July":
            month = "07";
            break;
        case "Aug":
            month = "08";
            break;
        case "Sept":
            month = "09";
            break;
        case "Oct":
            month = "10";
            break;
        case "Nov":
            month = "11";
            break;
        case "Dec":
            month = "12";
        }
    return month;
}

// Initilizing Map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    backgroundColor: 'transparent',
    styles: [
        {
            "elementType": "geometry",
            "stylers": [{"color": "#212121"}]
        },
        {
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#757575"}]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#212121"}]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{"color": "#757575"}]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#9e9e9e"}]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [{"visibility": "off"}]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#bdbdbd"}]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#757575"}]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{"color": "#181818"}]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#616161"}]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#1b1b1b"}]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#2c2c2c"}]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#8a8a8a"}]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{"color": "#373737"}]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{"color": "#3c3c3c"}]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [{"color": "#4e4e4e"}]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#616161"}]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#757575"}]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#000000"}]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#3d3d3d"}]
        }
        ]
    });
}

$(main)