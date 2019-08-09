function generateHTML(obj) {
    const city = obj.location.city;
    
 
    return `
        <tr>
            <td>${obj.performance[0].displayName} ${convertTime(obj.start.time)}</td>
            <td>${obj.venue.displayName}</td>
            <td>${city.substring(0, city.length - 8)}</td>
        </tr>
    `
}

function generateTableHeader() {
    return `
    <tr>
        <th>Artist</th>
        <th>Venue</th>
        <th>Location</th>
    </tr>
    `
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

    console.log(responseData.resultsPage.results.event)
    $('#results').html(showDataHtml);
    $('#results').prepend(generateTableHeader());

}

function getCurrentDate() {

    const newDate = new Date();
    
    const formatDate = newDate.toISOString().substring(0, 10);
    
    return formatDate;
}

function getEvents(id, date) {
    
    if (date === '') {
        date = getCurrentDate();
        const apiUrl = `https://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json?apikey=lKGlBIRmnawI3yka&min_date=${date}&max_date=${date}`;
    }

    const apiUrl = `https://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json?apikey=lKGlBIRmnawI3yka&min_date=${date}&max_date=${date}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(responseJson => processData(responseJson));
}


function getCityId(city, date) {
    const apiUrl = `https://api.songkick.com/api/3.0/search/locations.json?query=${city}&apikey=lKGlBIRmnawI3yka`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(responseJson => getEvents(responseJson.resultsPage.results.location[0].metroArea.id, date));
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

$(main)

// ekgXaC6NfwJzIke8BGqob64gLjr4Wl