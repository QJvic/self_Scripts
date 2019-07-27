# -*- coding: utf-8 -*-
# code by joe 2019.7.23


import os

def getObjList(path):
    objFileList = []
    ''' 获取指定目录下的所有指定后缀的文件名，返回值不带后缀名'''
    file_list = os.listdir(path)
    # print f_list
    for file in file_list:
        # os.path.splitext():分离文件名与扩展名
        if os.path.splitext(file)[1] == '.obj':
            # print(file)
            objFileList.append(os.path.splitext(file)[0])

    return objFileList


if __name__ == '__main__':

    # 设置
    # clay_viewer的安装路径,前面的双引号不能少
    clay_viewer_Path = "\"D:/Program Files/clay-viewer-0.2.1-win"
    objDicPath = "D:/Z_temp/TEST"  # obj文件夹路径
    outPutPath = "D:/Z_temp/TEST/gltf"  # 输出文件夹路径

    isBinary = False  # 是否把bin合并到gltf中  (不推荐合并，合并后文件太大)
    isBeautify = False  # 是否美化gltf，即是否美化json
    # 设置结束

    convert_exe_Path = clay_viewer_Path + \
        "/resources/app.asar.unpacked/electron/convert/dist/fbx2gltf/fbx2gltf.exe\""  # 后面的双引号不能少
    strCMD = convert_exe_Path+' '
    if(isBeautify):
        strCMD += ' --beautify  '
    if(isBinary):
        strCMD += ' --binary '
    objList = getObjList(objDicPath)

    # os.system(convert_exe_Path)

    for obj in objList:
        strCMD_Convert = '%s -o %s %s ' % (
            strCMD, (outPutPath+'\\'+obj+'.gltf'), (objDicPath+'\\'+obj+'.obj'))
        os.system(strCMD_Convert)
