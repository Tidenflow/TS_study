// practice/funcction.ts

type getData = string | number | boolean;
type judge = "YES" | "NO";

function parseInput(data : string) : string[];
function parseInput(data : number) : number;
function parseInput(data : boolean) : judge;

function parseInput(data : getData) : string[] | number | judge {
    if(typeof data === "string") {
        return data.split(", ");
    } else if(typeof data === "number") {
        return data*data;
    }else {
        if(data) return "YES";
        else return "NO";
    }
} 

type testData = string | number;
function testFunc(
    name : string,
    id : number = 18,   //默认参数

) : boolean {
    console.log(id);
    return true;
}

if(testFunc("asdfd",20)){   //输出20
    console.log("yesyes");
}