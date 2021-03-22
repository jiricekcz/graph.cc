export default class UndirectedGraph {
    readonly vertices: Array<Vertex> = [];
    readonly edges: Array<Edge> = [];
    finalized: boolean = false;
    cache: any = {};

    private nameVertexMap: Map<string, Vertex> = new Map<string, Vertex>();
    constructor(vertices?: Array<Vertex>, edges?: Array<Edge>) {
        if (vertices) this.vertices = vertices;
        if (edges) this.edges = edges;
    }

    private saveVertex(v: Vertex): void {
        this.nameVertexMap.set(v.name, v);
        this.vertices.push(v);
    }
    addVertex(vertex: Vertex): void;
    addVertex(name: string): void;
    addVertex(val: string | Vertex): void {
        if (this.finalized) throw new Error("Cannot add vertex to a finalized graph.")
        if (typeof val === "string") {
            this.saveVertex(new Vertex(val, this.vertices.length))
        } else if (typeof val === "object") {
            this.saveVertex(val)
        }
        throw new TypeError("No mathing overload for vertex creation.");
    }
    private saveEdge(e: Edge): void {
        this.edges.push(e);
    }

    addEdge(edge: Edge): void;
    addEdge(vertexName1: string, vertextName2: string, cost?: number): void;
    addEdge(vertexId1: number, vertextId2: number, cost?: number): void;
    addEdge(vertex1: Vertex, vertext2: Vertex, cost?: number): void;
    addEdge(val1: string | number | Edge | Vertex, val2?: string | number | Vertex, val3?: number): void {
        if (this.finalized) throw new Error("Cannot add edge to a finalized graph.")
        if (typeof val1 === "string" && typeof val2 === "string" || typeof val1 === "number" && typeof val2 === "number") {
            if (!val3) val3 = 1;
            const v1 = this.getVertex(val1);
            const v2 = this.getVertex(val2);
            if (!v1 || !v2) throw new ReferenceError("Cannot create an edge from vertex that doesn't exist. Please check you have added the vertex before adding the edge.");
            const e = new Edge(v1, v2, val3);
            this.saveEdge(e);
        } else if (!val2 && !val3 && typeof val1 === "object") {
            if (val1 instanceof Vertex) throw new TypeError("Cannot add a Vertex as an Edge.");
            this.saveEdge(val1);
        } else if (typeof val1 == "object" && typeof val2 === "object") {
            if (val1 instanceof Edge) throw new TypeError("Cannot create Edge from an Edge.");
            const e = new Edge(val1, val2, val3);
            this.saveEdge(e);
        }
        throw new TypeError("No mathing overload for edge creation.");
    }

    getVertex(val: string | number): Vertex | null {
        if (typeof val == "string") {
            const v = this.nameVertexMap.get(val);
            if (!v) return null;
            return v;
        } else if (typeof val == "number") {
            const v = this.vertices[val - 1];
            if (v.id == val) return v;
            for (const v2 of this.vertices) if (v2.id == val) return v2;
            return null;
        }
        throw new Error("No mathing overload for getVertex.")
    }
    finalize() {
        this.finalized = true;
    }
    unfinalize() {
        this.finalized = false;
        this.cache = {};
    }
}
export class Vertex implements VertexInterface {
    readonly name: string;
    readonly id: number;
    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }
}
export class Edge implements EdgeInterface {
    readonly a: Vertex;
    readonly b: Vertex;
    readonly cost?: number;
    constructor(a: Vertex, b: Vertex, cost?: number) {
        this.a = a;
        this.b = b;
        this.cost = cost;
    }
}
interface VertexInterface {
    name: string;
}
interface EdgeInterface {
    a: Vertex;
    b: Vertex;
    cost?: number;
}