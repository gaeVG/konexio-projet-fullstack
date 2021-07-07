$(() => {
    let countries
    
    $("button").click(() => {
        
        if (!$("#userSearch").val()) {
            $("#userSearch").hasClass("is-valid") ? $("input").removeClass("is-valid") : $("#userSearch").addClass("is-invalid")
            $("#helpText").html("Merci de renseigner un pays ou une capitale")
            $("#countryResult")[0].hidden ? $("#countryResult").show() : () => {};
        } else {
            let radio = $(":radio")

            for (let i =0; i < radio.length; i++) {
                if (radio[i].checked) {

                    $.ajax(`http://127.0.0.1:3600/${$(":radio")[i].defaultValue}/${$("input").val()}`)
                    .done(data => {
                        !$("#countryResult")[0].hidden ? $("#countryResult").hide() : () => {};
                        $("#userSearch").hasClass("is-invalid") ? $("input").removeClass("is-invalid") : $("#userSearch").addClass("is-valid")
                        
                        $("#country").html(`<h3>${data.name}</h3>
                        <ul>
                            <li>Capitale : ${data.capital}</li>
                            <li>Région : ${data.region}</li> 
                        </ul>
                        `)
                    })
                    .fail(() => {
                        console.log('fail')
                        $("input").hasClass("is-valid") ? $("input").removeClass("is-valid") : $("#userSearch").addClass("is-invalid");
                        console.log($("#countryResult")[0].hidden)
                        $("#helpText").html("Impossible de trouver un résultat")
                        $("#countryResult")[0].hidden ? $("#countryResult").show() : () => {};
                        $("#country").html("")
                    })
                }
            }        
        }
    })
});