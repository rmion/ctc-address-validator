import { NPAs } from "./NPAs.mjs"

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

exports.handler = function(event, context, callback) {
    var resultList = []
    var coords = { lat: event.queryStringParameters.lat, lng: event.queryStringParameters.lng }
    coordMap.forEach(function(poly) {
        resultList.push(
            isPointInsidePolygon(
                coords,
                poly
            )
        )
    })
    callback(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
          },
        statusCode: 200,
        body: JSON.stringify({ valid: resultList.includes(true) }, null, 3)
    });
}