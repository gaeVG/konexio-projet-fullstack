$(() => {
    let countries
    
    $.ajax("http://127.0.0.1:3600/all")
        .done((data) => {

            $("#countriesList").append("<ul>")
            for (i in data) {
                let country =data[i]
                let currencies ="<li>Devises <ul>"

                for (j in country.currencies) {
                    currencies += `<li>${country.currencies[j].symbol} (${country.currencies[j].name})</li>`
                }

                currencies +="</ul></li>"

                $("#countriesList").append(`
                    <li>Pays : ${country.name}</li>
                    <ul>
                        <li>Capitale : ${country.capital}
                        <li>Région : ${country.region} (${country.subregion})
                        ${currencies}
                    </ul>
                `)
            }
            $("#countriesList").append("</ul>")
        });

    
});