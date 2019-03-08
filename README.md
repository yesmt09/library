Libsystem
===
使用Express+Mysql搭建的巴别图书管理系统
---

### 技术栈
* Express-Node.js Web应用程序框架
* Mysql-数据库
* Handlebars-高效率的语义化模板
* Bootstrap-简洁、直观、强悍的前端开发框架
 ```

### 运行前准备
  安装好了`Mysql`后，需要按照项目中的“数据库说明”文件先建立数据表，然后在config.js配置好数据库。<br />
  注意：因为我用到了数据库事务处理，所以Mysql的内核引擎务必设置为支持事务的innoDB.
  ```
  sql> CREATE DATABASE `libsystem` CHARACTER SET utf8 COLLATE utf8_bin;
  sql> use libsystem;
  sql> source sql/libsystem.sql;
  ```

### 运行

1. 通过npm安装本地服务第三方依赖模块(需要已安装Node.js)
 ```
 npm install
 ```

2. 启动Mysql服务

3. 启动node（http://localhost:3000）
 ```
 npm start
 ```
 
### License
  MIT
