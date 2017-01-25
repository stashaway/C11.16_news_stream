/**
 * Created by baultik on 1/24/17.
 */
/**
 * Tree node to hold {@link StreamSet} or {@link Stream} objects
 * @param name
 */
var streamSet = function StreamSet(name) {
    this.streams = [];
    this.viewers = 0;
    this.id = name;
};
/**
 * Add a {@link StreamSet} or {@link Stream} child
 * @param {StreamSet|Stream} stream
 */
streamSet.prototype.add = function (stream) {
    //this.viewers += parseInt(stream.viewers);
    this.streams.push(stream);
};
/**
 * Find a {@link StreamSet} or {@link Stream} in this nodes children
 * @param id ID of the node to find - stream id or category name
 * @returns {StreamSet|Stream|null} The node
 */
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
/**
 * Sort by a {@link Stream} property
 * @param property
 */
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