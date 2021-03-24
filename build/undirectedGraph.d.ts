export default class UndirectedGraph {
    readonly vertices: Array<Vertex>;
    readonly edges: Array<Edge>;
    finalized: boolean;
    cache: any;
    private nameVertexMap;
    constructor(vertices?: Array<Vertex>, edges?: Array<Edge>);
    private saveVertex;
    addVertex(...vertex: Vertex[]): void;
    addVertex(...name: string[]): void;
    private saveEdge;
    addEdge(edge: Edge): void;
    addEdge(vertexName1: string, vertextName2: string, cost?: number): void;
    addEdge(vertexId1: number, vertextId2: number, cost?: number): void;
    addEdge(vertex1: Vertex, vertext2: Vertex, cost?: number): void;
    getVertex(val: string | number): Vertex | null;
    finalize(): void;
    unfinalize(): void;
    get neighbourList(): Array<Array<number>>;
    get neighbourListDistances(): Array<Array<{
        id: number;
        cost: number;
    }>>;
    get distanceMatrix(): Array<Array<number>>;
    get neighbourMatrix(): Array<Array<boolean>>;
    shortestPath(vertex1: Vertex | string, vertex2: Vertex | string, algorithm: ShortestPathAlgorithm): Path;
    private dijkstraNative;
    private dijkstra;
}
export declare class Vertex implements VertexInterface {
    readonly name: string;
    readonly id: number;
    readonly graph: UndirectedGraph;
    readonly neighbours: Array<Vertex>;
    constructor(graph: UndirectedGraph, name: string, id: number);
    toString(): string;
}
export declare class Edge implements EdgeInterface {
    readonly a: Vertex;
    readonly b: Vertex;
    readonly cost: number;
    readonly graph: UndirectedGraph;
    constructor(graph: UndirectedGraph, a: Vertex, b: Vertex, cost?: number);
}
export declare class Path {
    readonly graph: UndirectedGraph;
    readonly vertices: Array<Vertex>;
    readonly cost: number;
    constructor(graph: UndirectedGraph, vertices: Array<Vertex>, cost: number);
    get found(): boolean;
    toString(): string;
}
interface VertexInterface {
    name: string;
}
interface EdgeInterface {
    a: Vertex;
    b: Vertex;
    cost?: number;
}
declare type DijkstraAlgoritm = "dijkstra" | "dijkstra-js";
declare type ShortestPathAlgorithm = DijkstraAlgoritm;
export {};
//# sourceMappingURL=undirectedGraph.d.ts.map