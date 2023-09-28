import DataTypeConverter from "./libs/StructReader/DataTypeConverter";
import StructReader from "./libs/StructReader/StructReader";
import Executor from "./libs/StructReader/Executor";

const params: string[] = process.argv;
params.splice(0, 2);
console.log(params);
if (params.length > 0) {
  Executor.exec(...params).then((response) => console.log(response));
}
