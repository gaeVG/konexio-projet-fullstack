$(() => {
    let countries = $("#countries")
    let helpText = $("#helpText")
    let regionSelected, typeResearch

    function countryTemplate(data, full) {
        
        if (full) {
            return `<div class="col-12 full">
            
            <h3>${data.name}</h3>
            <h6>βͺ ${data.nativeName}</h6>
            <ul>
                <li>π ${data.capital ? data.capital : "N/C"}</li>
                <li>πͺ ${data.population} ${suffixDemonym(data.demonym)}.</li>
                <li>π ${data.region}</li>
            </ul>
            <div id="mapid"></div>
            </div>
            `

        } else {
            return `<div class="col-12 col-lg-6 col-xl-4 card" id="${data.name}">
            
                <h3>${data.name}</h3>
                <h6 class="mb-4">βͺ ${data.nativeName}</h6>

                    <ul class="d-flex justify-content-around flex-wrap">
                        <li>π ${data.capital ? data.capital : "N/C"}</li>
                        <li>πͺ +${suffixNumber(data.population)} ${suffixDemonym(data.demonym)}</li>
                        <li>π ${data.region}</li>
                        <li>π¨ Langues parlΓ©es : ${data.languages.length}</li>
                    </ul>
            </div>`
        }
    }
    function fetchAll() {

        countries.html(`<div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>`)
        
        let request = "http://localhost:3636/"

        request += regionSelected !== undefined ?  `region/${regionSelected}` : "all";

        $.ajax(request)
            .done(data => {
                countries.empty()
                
                for (let i = 0; i < data.length; i++) {
                    countries.append(countryTemplate(data[i]))
                }
            })
            .fail(() => {
                if ($("#userSearch").hasClass("is-valid")) $("#userSearch").removeClass("is-valid")
                $("#userSearch").addClass("is-invalid")

                countries.empty()
                helpText.html("Impossible de trouver un rΓ©sultat")
            })
    }
    function search(s, user) {
        let userInput =$("userSearch")
        let t

        if (user) {

            if (typeResearch === undefined) {

                if (userInput.hasClass("is-valid")) userInput.removeClass("is-valid")
                userInput.addClass("is-invalid")

                helpText.html("β  Merci de sΓ©lectionner une recherche par nom de Pays ou de Capital")
                fetchAll()
                
                return

            } else if (!s) {

                if (userInput.hasClass("is-valid")) userInput.removeClass("is-valid")
                userInput.addClass("is-invalid")

                helpText.html(`β  Merci de renseigner votre pays ou capitale recherchΓ©-e`)
                fetchAll()

                return

            }

            t =typeResearch

        } else {
            t ="country"
        }

        countries.html(`<div class="spinner-border" role="status">
            <span class="visually-hidden">Chargement...</span>
        </div>`)

            $.ajax(`http://localhost:3636/${t}/${s}`)
        
            .done(data => {

                if (user && regionSelected !== undefined && data.region !== regionSelected) {
                    if ($("#userSearch").hasClass("is-valid")) $("#userSearch").removeClass("is-valid")
                    $("#userSearch").addClass("is-invalid")

                    countries.html("")
                    helpText.html("π Le pays recherchΓ© n'est pas situΓ© dans la rΓ©gion...")
                    fetchAll()

                    return
                }

                helpText.empty()

                if (userInput.hasClass("is-invalid")) userInput.removeClass("is-invalid")
                userInput.addClass("is-valid")

                countries.html(countryTemplate(data, true))
                
                var map = L.map('mapid').setView([data.latlng[0], data.latlng[1]], 13);

                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery Β© <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 16,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1IjoiZ2Fldm1iIiwiYSI6ImNrcXV5MHpxNjA2bngyd3BjZ3Exc29hZGwifQ.1OYZ7D8eUSqWoObrXn5OvQ'
                }).addTo(map);

                
                let infos = L.popup()
                infos
                    .setLatLng([data.latlng[0], data.latlng[1]])
                    .setContent(`π° Capitale: ${data.capital}`)
                    .openOn(map);
            })
            .fail(() => {
                if (userInput.hasClass("is-valid")) userInput.removeClass("is-valid")
                userInput.addClass("is-invalid")

                helpText.html("π Impossible de trouver un rΓ©sultat...")
                fetchAll()
            })
        
    }
    function suffixDemonym(demonym) {
        if (demonym[0] === undefined) return "N/C"

        let vowel = ['a', 'e', 'i', 'o', 'u'].indexOf(demonym[0].toLowerCase()) !== -1

        return vowel ? `d'${demonym}` : `de ${demonym}`
    }
    function suffixNumber(number) {
        if (number < 1000) return "" + number;
        let exp =Math.log(number) / Math.log(1000);

        return `${Math.ceil(number / Math.pow(1000, exp))}${"kMGTPE".charAt(exp -1)}`
    }

    document.addEventListener('click', event => {

        if (event.target.href !== undefined) {
            let target = event.target
        
            switch (target.attributes.data.value) {
                case "Europe":
                case "Americas":
                case "Asia":
                case "Africa":
                case "Oceania":
                case "Polar":
                    regionSelected =target.attributes.data.value
                    $("#region")[0].innerText =target.textContent
                    break
                default:
                    regionSelected =undefined
                    $("#region")[0].innerText = "RΓ©gion"
            }

        } else if (event.target.classList[3] === "card") {

            search(event.target.id)
        } else {

            switch (event.target.id) {
                case "country":
                case "capital":

                    if (typeResearch !== undefined && document.getElementById(typeResearch).classList.contains("btn-light"))
                        document.getElementById(typeResearch).classList.remove("btn-light")

                    typeResearch =event.target.id
                    document.getElementById(typeResearch).classList.add("btn-light")
                    console
                    break
                case "search":
                    search($("#userSearch").val(), true)

                    break
                case "all":
                    fetchAll()
                    break
                case "reload":
                    $("#userSearch").val("")
                    $("#region")[0].innerText = "RΓ©gion"
                    window.location.reload()
            }
        }
    });

    fetchAll();
});