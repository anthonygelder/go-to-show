function generateHTML(obj) {
    return `
        <div class="event">
            <p>${obj.name}</p>
        </div>
    `
}

function processData(responseData) {
    // console.log(responseData._embedded.events[0].classifications[0].segment.name);



    const showDataHtml = responseData._embedded.events.map(function(obj) {
        // console.log(responseData._embedded.events[0].classifications[0].segment.name);
        const type = responseData._embedded.events[0].classifications[0].segment.name;
        console.log(type);
        // if (type === "Music") {
            return generateHTML(obj);
        // }
    }).join('');

    $('#results').html(showDataHtml);
}

function getEvents(city, zip) {
    let apiUrl = ``;
    if (zip == '') {
        
        apiUrl = `https://app.ticketmaster.com/discovery/v2/events?apikey=CTzeAwSDWbUNHqIaEVP90VJry8rUWbOZ&city=${city}`;
    } else if ( city == '') {
        console.log("here");
        apiUrl = `https://app.ticketmaster.com/discovery/v2/events?apikey=CTzeAwSDWbUNHqIaEVP90VJry8rUWbOZ&postalCode=${zip}`;
    } 
    console.log(apiUrl);
    fetch(apiUrl)
        .then(response => response.json())
        .then(responseJson => processData(responseJson));
        // .then(responseJson => console.log(responseJson));
    
}



function main() {
    $('form').on('submit', function(event) {
        event.preventDefault();
        const city = $(event.currentTarget).find('#city-search').val();
        const zip = $(event.currentTarget).find('#zip-search').val();
        console.log(city, zip);
        getEvents(city, zip);
    })
}

$(main)