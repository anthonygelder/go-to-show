function generateHTML(obj) {
    return `
        <div class="event">
            <p>${obj.displayName}</p>
        </div>
    `
}

function processData(responseData) {

    const showDataHtml = responseData.resultsPage.results.event.map(function(obj) {
        // console.log(responseData.resultsPage.results.event);
        return generateHTML(obj);
    }).join('');


    $('#results').html(showDataHtml);
}

function getEvents(id) {
    const apiUrl = `https://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json?apikey=lKGlBIRmnawI3yka`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(responseJson => processData(responseJson));
        // .then(responseJson => console.log(responseJson));
    
}


function getCityId(city) {
    const apiUrl = `https://api.songkick.com/api/3.0/search/locations.json?query=${city}&apikey=lKGlBIRmnawI3yka`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(responseJson => getEvents(responseJson.resultsPage.results.location[0].metroArea.id));
}


function main() {
    $('form').on('submit', function(event) {
        event.preventDefault();
        const city = $(event.currentTarget).find('#city-search').val();
        // const zip = $(event.currentTarget).find('#zip-search').val();
        // console.log(city, zip);
        getCityId(city);
    })
}

$(main)

// ekgXaC6NfwJzIke8BGqob64gLjr4Wl