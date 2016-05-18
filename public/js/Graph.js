/**
 * Created by withGod on 5/18/16.
 */
var Graph = function() {
    this.nodes = {};
    this.edges = [];
};

Graph.prototype = {
    addNode: function(ib, content) {
        /* testing if node is already existing in the graph */
        if(this.nodes[ib] === undefined) {
            this.nodes[ib] = new Graph.Node(ib, content);
        }
        return this.nodes[ib];
    },
    addEdge: function(from, to) {
        var f = this.addNode(from);
        var t = this.addNode(to);
        var edge = new Graph.Edge({ from: f, to: t });
        f.edges.push(edge);
        this.edges.push(edge);
        t.edges.push(edge);
        return edge;
    }
}