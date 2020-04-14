var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var convert = require('xml-js');
var covid19ImpactEstimator = require('../estimator');

router.post(['/on-covid-19/*', '/on-covid-19'], function(req, res, next) {
  let route = req.path.split('/')
  const json = covid19ImpactEstimator(req.body); // @todo: add validations
  const options = {compact: true, ignoreComment: true, spaces: 4};
  const xml = convert.json2xml(json, options);

  if(route[route.length-1] == 'xml'){
    res.set('Content-Type', 'application/xml');
    res.type('application/xml');
    res.status(200).send(xml);
  }
  res.send(json);
});

router.get('/on-covid-19/logs', function(req, res, next) {
  let file = fs.readFileSync(path.join(appRoot, 'access.log'), 'utf8');
  res.set('Content-Type', 'text/plain');
  res.type('text/plain');
  res.send(file);
});

module.exports = router;