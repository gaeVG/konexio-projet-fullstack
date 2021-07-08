const cors = require("cors")
const express =require("express")
const app = express()
const data =require("../data/countriesData.json")
const port = 3600

app.use(cors())

app.listen(port, () => {

    app.get('/all', (_, res) => {
        res.send(data);
    });

    app.get('/country/:name', (rCountry, res) => {
        let result

        for (i in data) {

            if (rCountry.params.name.toLowerCase() === data[i].name.toLowerCase() ||
                rCountry.params.name.toLowerCase() === data[i].alpha2Code.toLowerCase() || rCountry.params.name.toLowerCase() === data[i].alpha3Code.toLowerCase()
            ) {
                result =res.send(data[i])

            }
        }

        if (result === undefined) {
            res.status(404)
        }

        res.end()
    });

    app.get('/capital/:name', (rCountry, res) => {
        let result

        for (i in data) {

            if (rCountry.params.name === data[i].capital) {
                result =res.send(data[i])
            }
        }

        if (result === undefined) res.status(404)

        res.end()
    });

    app.get('/region/:name', (rRegion, res) => {
        let result =res.json(data.filter(country => {
            return country.region === rRegion.params.name
        }));

        if (result === undefined) res.status(404)

        res.end()
    });
});