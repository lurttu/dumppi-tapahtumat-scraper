const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const URL = 'https://dumppi.fi/tapahtumat/'
const DEBUG = false;

const app = express()

app.get('/tapahtumat', async (req, res) => {
    res.set('Content-Type', 'application/json; charset=utf-8');
    EventObjects = [];
        try {
            const response = await axios.get(URL);
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                const events = $('#em-wrapper > div.css-events-list > table > tbody',html).children();

                events.each(function(i, elem) {                                     //kaivellaan tapahtumien osaset irti ja kasataan JSON-objekti
                    let event = {
                        kapasiteetti : $('b', this).text().replace(/\s\s+/g, ' '),
                        ajankohta: $('td', this).first().text().replace(/\s\s+/g, ' '),
                        nimi: $('a', this).text().replace(/\s\s+/g, ' '),
                        sijainti: $('i', this).text().replace(/\s\s+/g, ' ')
                    };
                EventObjects.push(event);
            });
        }
        res.json({
            Tapahtumat: EventObjects
        });
        } catch (error) {
            console.log(error);
            res.json({
                Err: error.name,
            });
        }
});
if(DEBUG) {
    app.listen(3000, () => {console.log('Open on port 3000');})
} else app.listen();