const cors = require("cors")
const express =require("express")
const app = express()
const data =require("../data/countriesData.json")
const port = 3600

app.use(cors())


app.listen(port, () => {
    
    app.get('/all', (req, res) => {
        res.send(data);
    });
});