#include <node.h>
#include <vector>
namespace dijkstra {
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
        double cost;
        std::vector<unsigned int> path;
    };
    void main(const FunctionCallbackInfo<Value>&args) {
        Isolate* isolate = args.GetIsolate();
        if (args.Length() != 2) {
            ThrowTypeError(isolate, "Incorrect number of arguments. Expected 2.");
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
        Local<Context> context = isolate->GetCurrentContext();

        Local<Array> neighbourList = Local<Array>::Cast(args[0]);
        Local<Array> distanceMatrix = Local<Array>::Cast(args[1]);
        
        std::vector<std::vector<unsigned int>> list;
        std::vector<std::vector<double>> matrix;

        
        // creating the list
        unsigned int l = neighbourList->Length();

        for (unsigned int i = 0; i < l; ++i) {
            Local<Value> e = neighbourList->Get(context, i).ToLocalChecked();
            if (!e->IsArray()) {
                ThrowTypeError(isolate, "Expected the fisrt argument (an Array) to contain only the type Array.");
                return;
            }
            Local<Array> vals = Local<Array>::Cast(e);
            unsigned int m = vals->Length();
            for (unsigned int j = 0; j < m; ++j) {
                Local<Value> v2 = vals->Get(context, j).ToLocalChecked();
                if (!e->IsNumber()) {
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

        for (unsigned int i = 0; i < l; ++i) {
            Local<Value> e = distanceMatrix->Get(context, i).ToLocalChecked();
            if (!e->IsArray()) {
                ThrowTypeError(isolate, "Expected the second argument (an Array) to contain only the type Array.");
                return;
            }
            Local<Array> vals = Local<Array>::Cast(e);
            unsigned int m = vals->Length();
            for (unsigned int j = 0; j < m; ++j) {
                Local<Value> v2 = vals->Get(context, j).ToLocalChecked();
                if (!e->IsNumber()) {
                    ThrowTypeError(isolate, "Expected the second argument to be of the type Array<Array<number>>.");
                    return;
                }
                Local<Number> val = Local<Number>::Cast(v2);
                double v = val->Value();
                matrix[i][j] = v;
            }
        } 

    }
    Path dijkstra(std::vector<std::vector<unsigned int>> neighbours, std::vector<std::vector<double>> distanceMatrix) {
        
    }
    
    void Initilize(Local<Object> exports) {
        NODE_SET_METHOD(exports, "evaluate", main);
    }
    NODE_MODULE(NODE_GYP_MODULE_NAME, Initilize);
}