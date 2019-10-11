require('dotenv').config({ path: `${__dirname}/key.env` });

const express = require('express');
const fileUpload = require('express-fileupload');
const csv = require('fast-csv');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

const mongoose = require('mongoose');
const helper = require('./modules/helperFunctions');

mongoose.connect('mongodb://localhost/zipcodes');
mongoose.set('useFindAndModify', false);

const apiKey = process.env.API_KEY;
const ZipCode = require('./models/zipcode');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const { data } = req.files;

  data.mv('./data.csv', (err) => {
    if (err) { return res.status(500).send(err); }
    res.send('File uploaded!');
  });

  let count = 0;

  const promiseArray = [];

  csv
    .parseFile('./data.csv')
    .on('error', (error) => console.error(error))
    .on('data', (row) => {
      // TODO (optimize) instead of checking each row for updates, can store a copy of the entries as CSV.
      // Then diff with updated CSV and only update new rows
      if (count != 0) { // To skip header
        const parsedVals = helper.validCSVRowInput(row); // Only params which are present in row
        promiseArray.push(ZipCode.findOneAndUpdate({ zipCode: parseInt(row[0], 10) }, {
          $set: parsedVals,
        }, { upsert: true }).exec());
      }
      count += 1;
    })
    .on('end', (rowCount) => {
      Promise.all(promiseArray).then((out) => {
        // TODO (optimize) Store stateCode array in DB and update on future updates
        console.log(`Parsed ${rowCount} rows`);
      }).catch((err) => {
        console.log('Promise error', err);
      });
    });
});

app.get('/search', (req, res) => {
  ZipCode.find({}).exec().then((result) => {
    // TODO (optimize) Instead of calculating everytime, store array in DB and retrieve
    const stateCodes = [...new Set(result.map((x) => x.stateCode))].sort();
    res.render('search', { stateCodes });
  });
});

app.get('/update', (req, res) => {
  // Hardcoded during interview
  const url = `http://www.zipcodeapi.com/rest/${apiKey}/info.json/53715/degrees`;

  request({ url }, (error, response, body) => {
    if (error) {
      console.log(error);
      res.redirect('/');
    } else {
      console.log('Response status code: ', response && response.statusCode);
      if (response && response.statusCode === 200) {
        const parsed = JSON.parse(body);

        const zip = parsed.zip_code;
        const { lat } = parsed;
        const { lng } = parsed;
        const { city } = parsed;

        ZipCode.findOneAndUpdate({ zipCode: zip }, {
          $set: {
            city,
          },
        }).exec().then((result) => {
          res.redirect('/search');
        });
      } else {
        res.redirect('/');
      }
    }
  });
});

app.post('/search', (req, res) => {
  const query = {};
  if (req.body.query.zip) {
    const { zip } = req.body.query;
    query.zipCode = zip;
  } else if (!req.body.query.city && !req.body.query.state) {
    console.log('Not enough fields');
    res.redirect('/search');
  }

  if (req.body.query.city) {
    const { city } = req.body.query;
    query.city = city.toUpperCase();
  }

  if (req.body.query.state) {
    const { state } = req.body.query;
    query.stateCode = state.toUpperCase();
  }

  ZipCode.find(query).exec().then((searchResults) => {
    res.render('searchResults', { searchResults });
  });
});

app.get('/match', (req, res) => {
  res.render('matchClose');
});

app.post('/match', (req, res) => {
  const { zip1 } = req.body.query;
  const { zip2 } = req.body.query;
  const { distance } = req.body.query;
  const { unit } = req.body.query;

  const url = `http://www.zipcodeapi.com/rest/${apiKey}/match-close.json/${zip1}, ${zip2}/${distance}/${unit}`;

  request({ url }, (error, response, body) => {
    if (error) {
      console.log(error);
      res.redirect('/');
    } else {
      console.log('Response status code: ', response && response.statusCode);
      if (response && response.statusCode === 200) {
        const promiseArray = [ZipCode.find({ zipCode: zip1 }).exec(), ZipCode.find({ zipCode: zip2 }).exec()];
        Promise.all(promiseArray).then((searchResults) => {
          let isEmpty = false;

          if (JSON.parse(body).length === 0) {
            isEmpty = true;
          }
          // Merge arrays returned by promise
          const merged = [].concat.apply([], searchResults);
          res.render('matchCloseResults', {
            searchResults: merged, body: JSON.parse(body)[0], unit, isEmpty,
          });
        });
      } else {
        res.redirect('/match');
      }
    }
  });
});


app.listen(3000, () => {
  console.log('Web server started');
});
