// practice/funcction.ts
function parseInput(data) {
    if (typeof data === "string") {
        return data.split(", ");
    }
    else if (typeof data === "number") {
        return data * data;
    }
    else {
        if (data)
            return "YES";
        else
            return "NO";
    }
}
function testFunc(name, id) {
    if (id === void 0) { id = 18; }
    console.log(id);
    return true;
}
if (testFunc("asdfd", 20)) { //输出20
    console.log("yesyes");
}
