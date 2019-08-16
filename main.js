let map;

function generateHTML(obj) {
    const city = obj.location.city;

    const lat = obj.location.lat;
    const lng = obj.location.lng;
    map.setCenter({lat: lat, lng: lng});
    new google.maps.Marker({position: {lat: lat,lng: lng}, map: map})
    const mapsUrl = urlStr(obj.venue.displayName); 

    return `
        <tr>
            <td><a href="${obj.uri}" target="_blank">${obj.performance[0].displayName}</a></td>
            <td><a href="https://www.google.com/maps/search/?api=1&query=${mapsUrl}" target="_blank">${obj.venue.displayName}</td>
            <td valign="top">${convertTime(obj.start.time)}</td>
            <td>${city.substring(0, city.length - 8)}</td>
        </tr>
    `
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
    const dateString = newDate.toString();
    const day = dateString.substring(8, 10);
    const month = dateString.substring(4, 7);
    const year = dateString.substring(11, 15);
    const formatDate = `${year}-${convertMonth(month)}-${day}`;
    return formatDate;
}

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

function convertDate(date) {
    let day = date.substring(8);
    let month = date.substring(5, 7);
    let year = date.substring(2,4);
    let newDate = `${month} /${day} /${year}`;
    return newDate;
}

function getEvents(id, date) {
    if (date === '') {
    const newDate = getCurrentDate();
        $('p').html('Tonight?');
        const apiUrl = `https://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json?apikey=lKGlBIRmnawI3yka&min_date=${newDate}&max_date=${newDate}`;

        fetch(apiUrl)
        .then(response => response.json())
        .then(responseJson => processData(responseJson))
    } else {
        const apiUrl = `https://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json?apikey=lKGlBIRmnawI3yka&min_date=${date}&max_date=${date}`;
        let newDate = convertDate(date);
        $('p').html(`On ${newDate}?`);
        
        fetch(apiUrl)
        .then(response => response.json())
        .then(responseJson => processData(responseJson))
    }
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