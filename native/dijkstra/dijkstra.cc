#include <node.h>
#include <vector>
#include <iostream>
#include <limits>
namespace Algorithm {
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Object;
    using v8::Number;
    using v8::Value;
    using v8::Exception;
    using v8::String;
    using v8::Array;
    using v8::Context;

    void ThrowTypeError(Isolate* isolate, char* txt) {
        isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, txt).ToLocalChecked()));
    }
    struct Path {
        Path() {
            cost = 0;
            path = std::vector<unsigned int>();
        }
        double cost;
        std::vector<unsigned int> path;
    };
    long int binarySearch(std::vector<unsigned int> arr, unsigned int l, unsigned int r, unsigned int x) {
        if (r >= l) {
            unsigned int mid = l + (r - l) / 2;

            if (arr[mid] == x)
                return mid;

            if (arr[mid] > x)
                return binarySearch(arr, l, mid - 1, x);

            return binarySearch(arr, mid + 1, r, x);
        }
        return -1;
    }
    long int binarySearch(std::vector<unsigned int> arr, unsigned int x) {
        return binarySearch(arr, 0, arr.size(), x);
    }

    inline std::vector<unsigned int> reverse(std::vector<unsigned int> vect) {
        std::vector<unsigned int> rv;


    }
    Path dijkstra(std::vector<std::vector<unsigned int>> neighbours, std::vector<std::vector<double>> distanceMatrix, unsigned int origin, unsigned int destination) {
        Path p = Path();
        unsigned int l = neighbours.size();
        
        std::vector<double> distances;
        distances.reserve(l);

        std::vector<unsigned int> unvisited;
        unsigned int unvisitedCount = l;

        double infinity = std::numeric_limits<double>::infinity();
        for (unsigned int i = 0; i < l; i++) {
            distances[i] = infinity;
            unvisited[i] = i;
        }
        distances[origin] = 0;
        
        std::vector<bool> visited;
        visited.reserve(l);
        

        std::vector<unsigned int> prev;
        prev.reserve(l);

        unsigned int current = origin;

        while (unvisitedCount != 0) {
            std::vector<unsigned int> ns = neighbours[current];
            unsigned int nsCount = ns.size();
            for (unsigned int i = 0; i < nsCount; ++i) {
                unsigned int n = ns[i];
                if (visited[n]) continue;

                double newDist = distances[current] + distanceMatrix[current][n];
                if (newDist > distances[n]) {
                    distances[n] = newDist;
                    prev[n] = current;
                }
            }
            visited[current] = true;
            unvisitedCount -= 1;
            unsigned int ind = binarySearch(unvisited, current);
            unvisited.erase(unvisited.begin() + ind);

            if (visited[destination]) {
                double cost = distances[destination];
                std::vector<unsigned int> path;

                unsigned int curr = destination;
                while (curr != origin) {
                    path.push_back(curr);
                    curr = prev[curr];
                }
                path.push_back(curr);

                path = reverse(path);
                p.path = path;
                p.cost = cost;
                return p;
            }
            double largeD = INFINITY;
            for (unsigned int i = 0; i < unvisited; ++i) {
                if (distances[unvisited[i]] < largeD) {
                    largeD = distances[unvisited[i]];
                    current = unvisited[i];
                }
            }
        }
        p.path = std::vector<unsigned int>();
        p.cost = -INFINITY;
        return p; 
    }

    void main(const FunctionCallbackInfo<Value>&args) {
        Isolate* isolate = args.GetIsolate();
        if (args.Length() != 4) {
            ThrowTypeError(isolate, "Incorrect number of arguments. Expected 4 (number[][], number[][], number, number).");
            return;
        }
        if (!args[0]->IsArray()) {
            ThrowTypeError(isolate, "Expected the first argument to be an Array.");
            return;
        }
        if (!args[1]->IsArray()){
            ThrowTypeError(isolate, "Expected the second argument to be an Array.");
            return;
        }
        if (!args[2]->IsNumber()){
            ThrowTypeError(isolate, "Expected the second argument to be a Number.");
            return;
        }
        if (!args[2]->IsNumber()){
            ThrowTypeError(isolate, "Expected the second argument to be a Number.");
            return;
        }

        Local<Context> context = isolate->GetCurrentContext();

        Local<Number> origin = Local<Number>::Cast(args[2]);
        Local<Number> destination = Local<Number>::Cast(args[3]);

        Local<Array> neighbourList = Local<Array>::Cast(args[0]);
        Local<Array> distanceMatrix = Local<Array>::Cast(args[1]);
        
        std::vector<std::vector<unsigned int>> list;
        std::vector<std::vector<double>> matrix;

        unsigned int from = origin->Value();
        unsigned int to = destination->Value();
        
        // creating the list
        unsigned int l = neighbourList->Length();
        list.reserve(l);

        for (unsigned int i = 0; i < l; ++i) {
            Local<Value> e = neighbourList->Get(context, i).ToLocalChecked();
            if (!e->IsArray()) {
                ThrowTypeError(isolate, "Expected the fisrt argument (an Array) to contain only the type Array.");
                return;
            }
            Local<Array> vals = Local<Array>::Cast(e);

            unsigned int m = vals->Length();
            list[i].reserve(m);
            
            for (unsigned int j = 0; j < m; ++j) {
                Local<Value> v2 = vals->Get(context, j).ToLocalChecked();
                if (!v2->IsNumber()) {
                    ThrowTypeError(isolate, "Expected the first argument to be of the type Array<Array<number>>.");
                    return;
                }
                Local<Number> val = Local<Number>::Cast(v2);
                unsigned int v = val->Value();
                list[i][j] = v;
            }
        } 

        // creating the matrix
        l = distanceMatrix->Length();
        matrix.reserve(l);

        for (unsigned int i = 0; i < l; ++i) {
            Local<Value> e = distanceMatrix->Get(context, i).ToLocalChecked();
            if (!e->IsArray()) {
                ThrowTypeError(isolate, "Expected the second argument (an Array) to contain only the type Array.");
                return;
            }
            Local<Array> vals = Local<Array>::Cast(e);

            unsigned int m = vals->Length();
            matrix[i].reserve(m);

            for (unsigned int j = 0; j < m; ++j) {
                Local<Value> v2 = vals->Get(context, j).ToLocalChecked();
                if (!v2->IsNumber()) {
                    ThrowTypeError(isolate, "Expected the second argument to be of the type Array<Array<number>>.");
                    return;
                }
                Local<Number> val = Local<Number>::Cast(v2);
                double v = val->Value();
                matrix[i][j] = v;
            }
        } 

        

        if (from >= matrix.size() || to >= matrix.size()) {
            ThrowTypeError(isolate, "Destination or origin out of range.");
            return;
        }
       
        
        Path rtr = dijkstra(list, matrix, from, to);

        Local<Object> rv = Object::New(isolate);

        Local<Number> cost = Number::New(isolate, rtr.cost);
        Local<Array> path = Array::New(isolate);
        
        l = rtr.path.size();

        for (unsigned int i = 0; i < l; ++i) {
            path->Set(context, i, Number::New(isolate, rtr.path[i]));
        }

        
        
        rv->Set(context, String::NewFromUtf8(isolate, "cost").ToLocalChecked(), cost);
        
        Local<String> pathString = String::NewFromUtf8(isolate, "path").ToLocalChecked();
        rv->Set(context, pathString, path);
        
        args.GetReturnValue().Set(rv);
        return;
    }
    
    
    void Initilize(Local<Object> exports) {
        NODE_SET_METHOD(exports, "evaluate", main);
    }
    NODE_MODULE(NODE_GYP_MODULE_NAME, Initilize);
}