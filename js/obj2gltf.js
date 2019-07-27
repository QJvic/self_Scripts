const { execSync, exec } = require('child_process');
const fs = require("fs");
const path = require("path");

/////////设置
const clay_viewer_Path = "D:/Program Files/clay-viewer-0.2.1-win";          //clay_viewer的路径
const objDicPath = "D:\\Z_temp\\children1";                         // obj文件夹路径
const jsonOutPath = outPutPath = "D:\\Z_temp\\GltfModel\\children1";       // 输出文件夹路径，json文件路径
const jsonUrlPrePath = "./data/subGltf";                             //生成的scene.json中，url前面的路径
const execType = 3;                                     //执行cmd时的方法，1为同步，2为异步，异步时较快但输出信息会乱
const isBinary = false;                                       //是否把bin合并到gltf中(不推荐合并，合并后文件太大)
const isBeautify = false;                                     //是否美化gltf，即是否美化json(开启后gltf易读但文件增大)
////////设置结束

/////检查输出文件夹是否存在，递归创建目录
(function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
})(outPutPath);


//////创建cmd命令
let convert_exe_Path = clay_viewer_Path + "/resources/app.asar.unpacked/electron/convert/dist/fbx2gltf/fbx2gltf.exe"; 
if (!fs.existsSync(convert_exe_Path)) {
    console.log("clay转换器未找到，程序退出，请检查路径及文件是否正确");
    process.exit();
}
else {
    convert_exe_Path = ('\"' + convert_exe_Path + '\"');       //加上引号，否则cmd无法识别路径中的空格
}
let strCMD = convert_exe_Path + ' -e animation';
if (isBeautify)
    strCMD += ' --beautify  ';
if (isBinary)
    strCMD += ' --binary  ';



//遍历obj
console.log("获取obj，请稍等...");
const objFilesList = fs.readdirSync(objDicPath).filter(function (file) {
    return path.extname(file).toLowerCase() === '.obj';
});


//遍历执行转换操作
console.log("obj获取成功，开始转换，请稍等...");
objFilesList.forEach(objFile => {
    let gltfFullName = outPutPath + '/' + path.parse(objFile).name + '.gltf';
    let objFullName = objDicPath + '/' + path.parse(objFile).name + '.obj';
    let cmd = strCMD + ' -o ' + gltfFullName + '  ' + objFullName;
    if (execType == 1) {
        ////同步执行cmd
        let result = execSync(cmd);
        console.log(result.toString());
        console.log(gltfFullName + "----完成");
        ///同步执行结束
    }
    else if (execType == 2) {
        ////异步执行cmd
        exec(cmd, function (err, stdout, stderr) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`stdout: ${stdout}`);
            // console.log(`stderr: ${stderr}`);
            console.log(gltfFullName + "----完成");
        });
        ///异步执行结束
    }

});

//转换完成将maps文件夹拷贝过去
(function copyMaps() {
    let fromMapsPath = objDicPath + '/maps';
    let toMapsPath = outPutPath + '/maps';
    fs.exists(fromMapsPath, function (exists) {
        if (!exists) {
            console.log("没有maps文件夹，请检查");
            return
        }
        else {
            copyDir(fromMapsPath, toMapsPath);
            console.log("maps复制完成");
        }
    });

})();

//创建scene.json
let sceneJson = { "models": [], "offSetX": 0, "offSetY": 0, "offSetZ": 0 };
objFilesList.forEach(objFile => {
    let gltfFullUrl = jsonUrlPrePath + '/' + path.parse(objFile).name + '.gltf';
    let gltfNode = {
        "id": "",
        "type": "gltf",
        "title": path.parse(objFile).name,
        "url": gltfFullUrl
    };
    sceneJson.models.push(gltfNode);
});
//把sceneJson对象转换为json格式字符串
let content = JSON.stringify(sceneJson);

//指定创建目录及文件名称
let file = path.join(jsonOutPath, 'scene.json');

//写入文件
fs.writeFile(file, content, function (err) {
    if (err) {
        return console.log(err);
    }
    console.log('json文件创建成功，地址：' + file);
});




/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir(src, dist, callback) {
    fs.access(dist, function (err) {
        if (err) {
            // 目录不存在时创建目录
            fs.mkdirSync(dist);
        }
        _copy(null, src, dist);
    });

    function _copy(err, src, dist) {
        if (err) {
            callback(err);
        } else {
            fs.readdir(src, function (err, paths) {
                if (err) {
                    callback(err)
                } else {
                    paths.forEach(function (path) {
                        var _src = src + '/' + path;
                        var _dist = dist + '/' + path;
                        fs.stat(_src, function (err, stat) {
                            if (err) {
                                callback(err);
                            } else {
                                // 判断是文件还是目录
                                if (stat.isFile()) {
                                    fs.writeFileSync(_dist, fs.readFileSync(_src));
                                } else if (stat.isDirectory()) {
                                    // 当是目录是，递归复制
                                    copyDir(_src, _dist, callback)
                                }
                            }
                        })
                    })
                }
            })
        }
    }
}