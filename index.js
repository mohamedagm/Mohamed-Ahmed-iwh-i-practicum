const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = 'YOUR_TOKEN_HERE';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
    const url = "https://api.hubspot.com/crm/v3/objects/pets";

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                "Content-Type": "application/json"
            }
        });

        const data = response.data.results;
        res.render('index', { title: 'Pets | HubSpot API', data });

    } catch (error) {
        console.error(error);
        res.send("Error retrieving data.");
    }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cobj', (req, res) => {
    // Title updated to match practicum instructions exactly
    res.render('updates', { title: "Update Custom Object Form | Integrating With HubSpot I Practicum" });
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cobj', async (req, res) => {
    const petObject = {
        properties: {
            name: req.body.name,
            species: req.body.species,
            bio: req.body.bio
        }
    };

    try {
        await axios.post(
            "https://api.hubspot.com/crm/v3/objects/pets",
            petObject,
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                    "Content-Type": "application/json"
                }
            }
        );
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send("Error creating record.");
    }
});


app.listen(3000, () => console.log('Listening on http://localhost:3000'));
