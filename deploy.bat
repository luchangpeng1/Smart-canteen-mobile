@echo off
REM 构建
call npm run build

REM 进入构建文件夹
cd dist

REM 初始化 git
git init

REM 添加所有文件
git add -A

REM 提交更改
git commit -m "deploy"

REM 推送到 gh-pages 分支
git push -f https://github.com/luchangpeng1/canting.git master:gh-pages

REM 返回上级目录
cd ..