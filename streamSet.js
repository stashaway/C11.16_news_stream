/**
 * Created by baultik on 1/24/17.
 */

var streamSet = function StreamSet(name) {
    this.streams = [];
    this.viewers = 0;
    this.id = name;
};

streamSet.prototype.add = function (stream) {
    //this.viewers += parseInt(stream.viewers);
    this.streams.push(stream);
};

streamSet.prototype.find = function (id) {
    for (var i = 0; i < this.streams.length; i++) {
        if (this.streams[i].id == id) {
            return this.streams[i];
        }

        if (this.streams[i].hasOwnProperty("streams")) {
            var node = this.streams[i].find(id);
            if (node != null) return node;
        }
    }
    return null;
};

streamSet.prototype.sort = function (property) {
    for (var i = 0; i < this.streams.length; i++) {
        if (this.streams[i].hasOwnProperty("streams")) {
            this.streams[i].sort(property);
        }
    }

    this.streams.sort(function (a, b) {
        return b[property] - a[property];
    })
};

module.exports = streamSet;