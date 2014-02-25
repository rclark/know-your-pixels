var SphericalMercator = require('sphericalmercator');
var spherical = require('spherical');
var ss = require('simple-statistics');
ss.mixin();

module.exports = { distances: distances, deviations: stddev };

function distances(z, lat, size) {
    size = size || 256;
    var sm = new SphericalMercator({ size: size });
    var maxPx = ( size * Math.pow(2, z) ) / 2;
    var yPx = sm.px([0, lat], z)[1];

    return {
        x: spherical.distance(
            sm.ll([0, yPx], z),
            sm.ll([1, yPx], z)
        ),
        y: spherical.distance(
            sm.ll([0, yPx], z),
            sm.ll([0, yPx + 1], z)
        )
    };
}

function stddev(z, size) {
    size = size || 256;
    var d = [];
    for (var lat = 0; lat < 86; lat++) {
        d.push(distances(z, lat, size));
    }
    var x = d.map(function(distance) { return distance.x });
    var y = d.map(function(distance) { return distance.y });
    return { x: x.standard_deviation(), y: y.standard_deviation() };
}