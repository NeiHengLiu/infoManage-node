/**
 * DB库
 */
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

class Db {
  /** 
   * 单例
   * 解决多次实例化不享问题
  */
  static getInstance() {
    if(!Db.instance){
      Db.instance = new Db();
    }
    return Db.instance;
  }

  constructor() {
    this.dbClient = null
    this.connect()
  }

  /**
   * 连接数据库
   */
  connect() {
    const _that = this;
    return new Promise((resolve, reject) => {
      if(!_that.dbClient){
        MongoClient.connect(config.dbUrl, (err, client) => {
          if(err){
            reject(err);
            return;
          };
          _that.dbClient = client.db(config.dbName);
          resolve(_that.dbClient);
        })
      } else {
        resolve(_that.dbClient)
      }
    })
  }

  /**
   * 查询数据
   * collectionName: 集合名称
   * json: 查询条件
   */
  find(collectionName, json = {}) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        let result = db.collection(collectionName).find(json);
        result.toArray((err,docs) => {
          if(err){
            reject(err);
            return;
          } else {
            resolve(docs);
          }
        })
      })
    })
  }

  /**
   * 更新数据
   * collectionName: 集合名称
   * oldJson: 更新条件
   * newJson: 更新内容
   */
  update(collectionName, oldJson = {}, newJson = {}) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).updateOne(oldJson, {
          $set: newJson
        }, (err, result) => {
          if(err){
            reject(err);
            return;
          }
          resolve(result)
        })
      })
    })
  }

  /**
   * 删除数据
   * collectionName: 集合名称
   * json: 删除条件
   */
  remove(collectionName, json = {}) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).removeOne(json, (err, result) => {
          if(err){
            reject(err);
            return;
          }
          resolve(result);
        })
      })
    })
  }

  /**
   * 新増数据
   * collectionName: 集合名称
   * json: 插入数据
   */
  insert(collectionName, json = {}) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).insertOne(json, (err, result) => {
          if(err){
            reject(err);
            return;
          }
          resolve(result);
        })
      })
    })
  }
}

module.exports = Db.getInstance()