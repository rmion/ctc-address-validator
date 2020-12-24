// import { NPAs } from "./NPAs.mjs"
const NPAs = require('./NPAs.js')
const axios = require('axios');

const coordMap = NPAs.map(function (item) {
    return item.geometry.coordinates;
  }).map(function (arr) {
    return arr[0][0]
  });

function isPointInsidePolygon(point, poly) {
    var x = point.lng, y = point.lat;
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var xi = poly[i][0], yi = poly[i][1];
        var xj = poly[j][0], yj = poly[j][1];
  
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
  };        

exports.handler = async function(event, context) {
    let street = event.queryStringParameters.street;
    let city = event.queryStringParameters.city;
    let state = event.queryStringParameters.state;
    let zip = event.queryStringParameters.zip;

    let response = await axios.get(`https://api.geocod.io/geocode?q=${street}+${city}+${state}+${zip}&api_key=0705bbee5f2cd5555ec0bcff5c772fecc777255`)
    let location = response.data.results[0].location

    var resultList = []
    var coords = { lat: location.lat, lng: location.lng }
    coordMap.forEach(function(poly) {
        resultList.push(
            isPointInsidePolygon(
                coords,
                poly
            )
        )
    })
    return {
        statusCode: 200,
        body: JSON.stringify({ valid: resultList.includes(true) }, null, 3)
    }
}