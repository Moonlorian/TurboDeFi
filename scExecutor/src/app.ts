import StructReader from "./libs/StructReader/StructReader";

const structReader = new StructReader("proteo");

//Show struct reader general information:
structReader.info();

//Show struct reader information about custom types declarated inside the file
structReader.customFieldsInfo();

//Show modules information
structReader.modulesInfo();