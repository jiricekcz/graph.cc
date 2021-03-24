"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = exports.Edge = exports.Vertex = void 0;
const module_1 = __importDefault(require("../native/dijkstra/module"));
class UndirectedGraph {
    constructor(vertices, edges) {
        this.vertices = [];
        this.edges = [];
        this.finalized = false;
        this.cache = {};
        this.nameVertexMap = new Map();
        if (vertices)
            this.vertices = vertices;
        if (edges)
            this.edges = edges;
    }
    saveVertex(v) {
        this.nameVertexMap.set(v.name, v);
        this.vertices.push(v);
    }
    addVertex(...val) {
        if (this.finalized)
            throw new Error("Cannot add vertex to a finalized graph.");
        for (const v of val) {
            if (typeof v === "string") {
                this.saveVertex(new Vertex(this, v, this.vertices.length));
            }
            else if (typeof v === "object") {
                this.saveVertex(v);
            }
            else
                throw new TypeError("No mathing overload for vertex creation.");
        }
    }
    saveEdge(e) {
        e.a.neighbours.push(e.b);
        e.b.neighbours.push(e.a);
        this.edges.push(e);
    }
    addEdge(val1, val2, val3) {
        if (this.finalized)
            throw new Error("Cannot add edge to a finalized graph.");
        if (typeof val1 === "string" && typeof val2 === "string" || typeof val1 === "number" && typeof val2 === "number") {
            if (!val3)
                val3 = 1;
            const v1 = this.getVertex(val1);
            const v2 = this.getVertex(val2);
            if (!v1 || !v2)
                throw new ReferenceError("Cannot create an edge from vertex that doesn't exist. Please check you have added the vertex before adding the edge.");
            const e = new Edge(this, v1, v2, val3);
            this.saveEdge(e);
            return;
        }
        else if (!val2 && !val3 && typeof val1 === "object") {
            if (val1 instanceof Vertex)
                throw new TypeError("Cannot add a Vertex as an Edge.");
            this.saveEdge(val1);
            return;
        }
        else if (typeof val1 == "object" && typeof val2 === "object") {
            if (val1 instanceof Edge)
                throw new TypeError("Cannot create Edge from an Edge.");
            const e = new Edge(this, val1, val2, val3);
            this.saveEdge(e);
            return;
        }
        throw new TypeError("No mathing overload for edge creation.");
    }
    getVertex(val) {
        if (typeof val == "string") {
            const v = this.nameVertexMap.get(val);
            if (!v)
                return null;
            return v;
        }
        else if (typeof val == "number") {
            const v = this.vertices[val - 2];
            if (v && v.id == val)
                return v;
            for (const v2 of this.vertices)
                if (v2.id == val)
                    return v2;
            return null;
        }
        throw new Error("No mathing overload for getVertex.");
    }
    finalize() {
        this.finalized = true;
    }
    unfinalize() {
        this.finalized = false;
        this.cache = {};
    }
    get neighbourList() {
        if (this.cache["neighbourList"])
            return this.cache["neighbourList"];
        const list = [];
        for (const v of this.vertices) {
            list[v.id] = [];
        }
        for (const e of this.edges) {
            list[e.a.id].push(e.b.id);
            list[e.b.id].push(e.a.id);
        }
        if (this.finalized)
            this.cache["neighbourList"] = list;
        return list;
    }
    get neighbourListDistances() {
        if (this.cache["neighbourListDistances"])
            return this.cache["neighbourListDistances"];
        const list = [];
        for (const v of this.vertices) {
            list[v.id] = [];
        }
        for (const e of this.edges) {
            list[e.a.id].push({ id: e.b.id, cost: e.cost });
            list[e.b.id].push({ id: e.a.id, cost: e.cost });
        }
        if (this.finalized)
            this.cache["neighbourListDistances"] = list;
        return list;
    }
    get distanceMatrix() {
        if (this.cache["distanceMatrix"])
            return this.cache["distanceMatrix"];
        const matrix = [];
        for (const v of this.vertices) {
            matrix[v.id] = [];
        }
        for (const e of this.edges) {
            matrix[e.a.id][e.b.id] = e.cost;
            matrix[e.b.id][e.a.id] = e.cost;
        }
        if (this.finalized)
            this.cache["distanceMatrix"] = matrix;
        return matrix;
    }
    get neighbourMatrix() {
        if (this.cache["neighbourMatrix"])
            return this.cache["neighbourMatrix"];
        const matrix = [];
        for (const v of this.vertices) {
            matrix[v.id] = [];
        }
        for (const e of this.edges) {
            matrix[e.a.id][e.b.id] = true;
            matrix[e.b.id][e.a.id] = true;
        }
        if (this.finalized)
            this.cache["neighbourMatrix"] = matrix;
        return matrix;
    }
    shortestPath(vertex1, vertex2, algorithm) {
        if (typeof vertex1 == "string") {
            let v = this.getVertex(vertex1);
            if (!v)
                throw new ReferenceError("Vertex not found!");
            vertex1 = v;
        }
        if (typeof vertex2 == "string") {
            let v = this.getVertex(vertex2);
            if (!v)
                throw new ReferenceError("Vertex not found!");
            vertex2 = v;
        }
        switch (algorithm) {
            case "dijkstra-js": {
                return this.dijkstra(vertex1, vertex2);
            }
            case "dijkstra": {
                return this.dijkstraNative(vertex1, vertex2);
            }
            default:
                throw new TypeError("Unknown shortest path algorithm.");
        }
    }
    dijkstraNative(vertex1, vertex2) {
        const p = module_1.default.evaluate(this.neighbourList, this.distanceMatrix, vertex1.id, vertex2.id);
        const ver = [];
        for (const v of p.path) {
            const u = this.getVertex(v);
            if (!u)
                throw new ReferenceError("Cannot find vertex returned by native algorithm.");
            ver.push(u);
        }
        return new Path(this, ver, p.cost);
    }
    dijkstra(vertex1, vertex2) {
        const vertices = [];
        const neighbours = this.neighbourList;
        const distances = this.distanceMatrix;
        for (const v of this.vertices) {
            const dv = new DijsktraVertex(v);
            if (dv.id === vertex1.id)
                dv.distance = 0;
            vertices[dv.id] = dv;
        }
        const unvisited = vertices.concat();
        var current = vertices[vertex1.id];
        while (unvisited.length != 0) {
            let ns = neighbours[current.id].map(v => vertices[v]);
            for (const unvis of ns) {
                if (unvis.visited)
                    continue;
                const newL = current.distance + distances[current.id][unvis.id];
                if (newL < unvis.distance) {
                    unvis.distance = newL;
                    unvis.prev = current;
                }
            }
            current.visited = true;
            for (var i = 0; i < unvisited.length; i++) {
                if (unvisited[i].visited) {
                    unvisited.splice(i, 1);
                    break;
                }
            }
            if (vertices[vertex2.id].visited) {
                const end = vertices[vertex2.id];
                const cost = end.distance;
                const path = [];
                var c = end;
                while (c.id != vertex1.id) {
                    const r = this.getVertex(c.id);
                    if (!r)
                        throw new ReferenceError("Error referencing to vertex ID after dijsktra algorithm.");
                    path.unshift(r);
                    if (!c.prev)
                        throw new ReferenceError("Current vertex doesn't have a previous vertex.");
                    c = c.prev;
                }
                const r = this.getVertex(c.id);
                if (!r)
                    throw new ReferenceError("Cannot find starting vertex.");
                path.unshift(r);
                return new Path(this, path, cost);
            }
            var smallestD = Number.POSITIVE_INFINITY;
            for (const v of unvisited) {
                if (smallestD > v.distance) {
                    smallestD = v.distance;
                    current = v;
                }
            }
        }
        return new Path(this, [], Number.NEGATIVE_INFINITY);
    }
}
exports.default = UndirectedGraph;
class Vertex {
    constructor(graph, name, id) {
        this.neighbours = [];
        this.name = name;
        this.id = id;
        this.graph = graph;
    }
    toString() {
        return `${this.name}`;
    }
}
exports.Vertex = Vertex;
class Edge {
    constructor(graph, a, b, cost = 1) {
        this.a = a;
        this.b = b;
        this.cost = cost;
        this.graph = graph;
    }
}
exports.Edge = Edge;
class Path {
    constructor(graph, vertices, cost) {
        this.graph = graph;
        this.vertices = vertices;
        this.cost = cost;
    }
    get found() {
        return this.cost !== Number.NEGATIVE_INFINITY || this.vertices.length !== 0;
    }
    toString() {
        if (!this.found)
            return `${this.vertices[0]} ≠> ${this.vertices[this.vertices.length]}`;
        return this.vertices.join(" => ") + ` (${this.cost})`;
    }
}
exports.Path = Path;
class DijsktraVertex extends Vertex {
    constructor(vertex) {
        super(vertex.graph, vertex.name, vertex.id);
        this.distance = Number.POSITIVE_INFINITY;
        this.visited = false;
    }
}
//# sourceMappingURL=undirectedGraph.js.map