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

            if (rCountry.params.name === data[i].name ||
                rCountry.params.name === data[i].alpha2Code || rCountry.params.name === data[i].alpha3Code
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

        if (result === undefined) {
            res.status(404)
        }

        res.end()
    });
});