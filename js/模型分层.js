const fs = require("fs");
const path = require("path");


let jsonOutPath = gltfPath = "E:\\projects3\\mapbox-project\\public\\data\\subGltf"
let jsonUrlPrePath = "./data/subGltf";

//创建scene.json

let sceneJsonList = [];

let gltfListList = [[], [], []];
fs.readdirSync(gltfPath).filter(function (file) {
    if (path.extname(file).toLowerCase() === '.gltf') {
        let gltfName = path.parse(file).name;
        if (gltfName.indexOf("Object") != -1) {
            gltfListList[0].push(jsonUrlPrePath + '/' + path.parse(file).name + '.gltf')
        }
        else if (gltfName.indexOf("SZJSD") != -1) {
            gltfListList[1].push(jsonUrlPrePath + '/' + path.parse(file).name + '.gltf')
        }
        else if (gltfName.indexOf("ZXJSDL") != -1) {
            gltfListList[2].push(jsonUrlPrePath + '/' + path.parse(file).name + '.gltf')
        }
    }
});


gltfListList.forEach(gltfList => {
    let sceneJson = { "models": [], "offSetX": 0, "offSetY": 0, "offSetZ": 0 };
    gltfList.forEach((gltf, index) => {
        let gltfFullUrl =  gltf;
        let uuid = createUUID(10, 16);
        let gltfNode = {
            "id": uuid,
            "type": "gltf",
            "title": path.parse(gltfFullUrl).name,
            "url": gltfFullUrl
        };
        sceneJson.models.push(gltfNode);
    });
    sceneJsonList.push(sceneJson);
});

sceneJsonList.forEach((sceneJson, index) => {
    //把sceneJson对象转换为json格式字符串
    let content = JSON.stringify(sceneJson);
    //指定创建目录及文件名称
    let file = path.join(jsonOutPath, `scene${index+1}.json`);
    //写入文件
    fs.writeFile(file, content, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('json文件创建成功，地址：' + file);
    });



});

// objFilesList.forEach(objFile => {
//     let gltfFullUrl = jsonUrlPrePath + '/' + path.parse(objFile).name + '.gltf';
//     let uuid = uuid(10, 16);
//     let gltfNode = {
//         "id": "",
//         "type": "gltf",
//         "title": path.parse(objFile).name,
//         "url": gltfFullUrl
//     };
//     sceneJson.models.push(gltfNode);
// });


function createUUID(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}