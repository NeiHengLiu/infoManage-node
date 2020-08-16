const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbUrl = 'mongodb://localhost:27017';

const dbName = 'mallManage';


// MongoClient.connect(dbUrl, function(err, client){
//   if(err){
//     console.log(err);
//     return;
//   }

//   const db = client.db(dbName);

//   db.collection('user').insertOne({
//     'name': '李四',
//     'age': 21,
//     'sex': '女',
//     'status': '1'
//   }, function(err, result){
//     if(!err){
//       console.log('增加数据成功！');
//     }
//     client.close();
//   })
// })

console.time(`start`)
MongoClient.connect(dbUrl, function(err, client){
  if(err){
    console.log(err);
    return;
  }
  
  const db = client.db(dbName);

  let result = db.collection('user').find();

  result.toArray((err, docs) => {
    console.timeEnd(`start`);
    console.log(docs);
  })
})