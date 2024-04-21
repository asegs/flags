const express = require('express');
const router = express.Router();
const countries = require('../public/resources/countries.json');
const populations = require('../public/resources/country-by-population.json');

const randomIndex = (list) => {
  return Math.floor(Math.random() * list.length);
}

const updateCountriesData = () => {
  const countryNameMapping = {};
  populations.forEach(popTuple => {
    countryNameMapping[popTuple['country']] = popTuple['population'];
  });

  countries.forEach(country => {
    const name = country['name']['common'];
    let pop = countryNameMapping[name];
    if (!pop && pop !== 0) {
      pop = 0;
    }
    country['population'] = pop;
  })

  countries.sort((a,b) => b.population - a.population);
}

updateCountriesData();
const nRandomItems = (list, n) => {
  if (list.length < n) {
    return list;
  }
  const selectedIndexes = new Set();
  while (selectedIndexes.size < n) {
    selectedIndexes.add(randomIndex(list))
  }
  return Array.from(selectedIndexes).map(i => list[i]);
}

/* GET users listing. */
router.get('/getOptions/world/:count', function(req, res, next) {
  const count = req.params['count']
  let cutoff = Number(req.query['cutoff']);
  if (!cutoff) {
    cutoff = countries.length;
  }
  const subset = countries.slice(0, cutoff);
  res.send(nRandomItems(subset, Number(count)));
});

router.get('/getOptions/region/:count', function(req, res, next) {
  const count = req.params['count']
  let cutoff = Number(req.query['cutoff']);
  if (isNaN(cutoff)) {
    cutoff = countries.length;
  }
  const subset = countries.slice(0, cutoff);
  const regions = Array.from(new Set(subset.map(country => country['region'])))
  const randomRegion = regions[randomIndex(regions)];
  console.log(randomRegion);
  const countriesInRegion = subset.filter(country => country['region'] === randomRegion);
  res.send(nRandomItems(countriesInRegion, Number(count)));
});

router.get('/getOptions/subregion/:count', function(req, res, next) {
  const count = req.params['count']
  let cutoff = Number(req.query['cutoff']);
  if (isNaN(cutoff)) {
    cutoff = countries.length;
  }
  const subset = countries.slice(0, cutoff);
  const subregions = Array.from(new Set(subset.map(country => country['subregion'])))
  const randomSubRegion = subregions[randomIndex(subregions)];
  console.log(randomSubRegion)
  const countriesInSubregion = subset.filter(country => country['subregion'] === randomSubRegion);
  res.send(nRandomItems(countriesInSubregion, Number(count)));
});
module.exports = router;
