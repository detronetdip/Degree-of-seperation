// @author Ayondip Jana.
// @github https://github.com/detronetdip/CURD.js
class collection {
  constructor(ct) {
    this.count = ct;
  }
  insertData(data, setFunction) {
    if (typeof data == "object") {
      this[this.count] = data;
      var cindex = this.count;
      this.count++;
      setFunction.set();
      return cindex;
    } else {
      throw new Error("Expected Object Got None");
    }
  }
  count() {
    return this.count;
  }
  insertMany(arrayOfObject, sf) {
    var temp = [];
    arrayOfObject.forEach((e) => {
      temp.push(this.insertData(e, sf));
    });
    return temp;
  }
}
class oldCollection {
  constructor(clcn, oldData, db) {
    this.count = oldData.count;
    this.od = oldData;
    this.init();
    this.instanceOf = clcn;
    this.DB = db;
  }
  init() {
    for (var i = 0; i < this.count; i++) {
      this[i] = this.od[i];
    }
    delete this.od;
  }
  insertData(data) {
    if (typeof data == "object") {
      this[this.count] = data;
      var cindex = this.count;
      this.count++;
      this.setData();
      return cindex;
    } else {
      throw new Error("Expected Object Got None");
    }
  }
  setData() {
    var Data = JSON.parse(localStorage.getItem(this.DB.env.dbname));
    var sync = { ...Data[this.instanceOf], ...this };
    delete sync.DB;
    Data[this.instanceOf] = sync;
    delete sync.instanceOf;
    localStorage.setItem(this.DB.env.dbname, JSON.stringify(Data));
  }
  insertMany(arrayOfObject) {
    var temp = [];
    arrayOfObject.forEach((e) => {
      temp.push(this.insertData(e));
    });
    return temp;
  }
  count() {
    return this.count;
  }
}
class CURD {
  constructor(e) {
    this.env = {
      dbname: "database",
    };
    this.env = { ...this.env, ...e };
    this.database = {};
    this.init();
    this._this = this;
  }
  init() {
    if (!localStorage.getItem(this.env.dbname)) {
      localStorage.setItem(this.env.dbname, JSON.stringify(this.database));
    }
  }
  createCollection(name) {
    if (!this.existsCollection(name)) {
      return (this.database[name] = new collection(0));
    } else {
      var c = this.getCollection(name, this);
      delete c["DB"]["_this"];
      return c;
    }
  }
  set() {
    var previous = JSON.parse(localStorage.getItem(this.env.dbname));
    var final = { ...previous, ...this.database };
    localStorage.setItem(this.env.dbname, JSON.stringify(final));
  }
  getCollection(collection, DB) {
    if (this.existsCollection(collection)) {
      return new oldCollection(collection, this.readData(collection), DB);
    } else {
      throw new Error("Collection doesn't exist");
    }
  }
  refineIds(k) {
    var refinedKeys = [];
    k.forEach((e) => {
      if (typeof parseInt(e) === "number" && !isNaN(parseInt(e))) {
        refinedKeys.push(parseInt(e));
      }
    });
    return refinedKeys;
  }
  findData(collection, data) {
    var k = Object.keys(collection);
    var receivedKeys = Object.keys(data);
    var foundObjects = [];
    var refinedKeys = this.refineIds(k);
    refinedKeys.forEach((value) => {
      var counter = 0;
      receivedKeys.forEach((receivedValues) => {
        if (receivedValues in collection[value]) {
          if (data[receivedValues] == collection[value][receivedValues]) {
            counter++;
          }
        }
      });
      if (receivedKeys.length == counter) {
        var tempObj = collection[value];
        tempObj.objectId = value;
        foundObjects.push(tempObj);
      }
    });
    if (foundObjects == "") {
      return [];
    } else {
      return foundObjects;
    }
  }
  readData(collection = "", data = "") {
    var Data = JSON.parse(localStorage.getItem(this.env.dbname));
    if (collection == "") {
      return Data;
    } else {
      if (!this.existsCollection(collection)) {
        return new Error("Collection Not Found");
      } else {
        if (data == "" && typeof data != "number") {
          return Data[collection];
        } else {
          if (typeof data === "object") {
            return this.findData(Data[collection], data);
          } else if (typeof data === "number") {
            if (Data[collection][data] != undefined) {
              return Data[collection][data];
            } else {
              return new Error("Invalid Id");
            }
          }
        }
      }
    }
  }
  getId(obj, count = "") {
    var temp = [];
    if (count == "" && typeof count != "number") {
      obj.forEach((e) => {
        if ("objectId" in e) {
          temp.push(e.objectId);
        }
      });
      return temp;
    } else {
      if (count < obj.length) {
        return obj[count].objectId;
      } else {
        return new Error("Invalid Index");
      }
    }
  }
  getAllId(collection) {
    if (!this.existsCollection(collection)) {
      return new Error("Collection Not Found");
    } else {
      var Data = JSON.parse(localStorage.getItem(this.env.dbname));
      var k = this.refineIds(Object.keys(Data[collection]));
      return k;
    }
  }
  existsCollection(collection) {
    var Data = JSON.parse(localStorage.getItem(this.env.dbname));
    var keys = Object.keys(Data);
    var counter = 0;
    for (var i = 0; i < keys.length; i++) {
      if (collection === keys[i]) {
        counter++;
      }
    }
    if (counter > 0) {
      return true;
    } else {
      return false;
    }
  }
  deleteField(collection, index = "", field) {
    if (this.existsCollection(collection)) {
      if (index == "" && typeof index != "number") {
        throw new Error("Index Required");
      } else {
        var Data = JSON.parse(localStorage.getItem(this.env.dbname));
        var ExistingIds = this.refineIds(Object.keys(Data[collection]));
        if (ExistingIds.includes(index)) {
          if (field in Data[collection][index]) {
            delete Data[collection][index][field];
            localStorage.setItem(this.env.dbname, JSON.stringify(Data));
          } else {
            console.log(new Error("Field does not exist"));
          }
        } else {
          throw new Error("Invalid Index");
        }
      }
    } else {
      throw new Error("Collection doesn't exist");
    }
  }
  deleteCollection(collection, index = "") {
    if (this.existsCollection(collection)) {
      var Data = JSON.parse(localStorage.getItem(this.env.dbname));
      if (index == "" && typeof index != "number") {
        delete Data[collection];
        localStorage.setItem(this.env.dbname, JSON.stringify(Data));
      } else {
        var ExistingIds = this.refineIds(Object.keys(Data[collection]));
        if (ExistingIds.includes(index)) {
          delete Data[collection][index];
          Data[collection].count = --Data[collection].count;
          localStorage.setItem(this.env.dbname, JSON.stringify(Data));
        } else {
          throw new Error("Invalid Index");
        }
      }
    } else {
      throw new Error("Collection doesn't exist");
    }
  }
  ud(Data, collection, index, updatedData) {
    var newKeys = Object.keys(updatedData);
    newKeys.forEach((e) => {
      Data[collection][index][e] = updatedData[e];
    });
    localStorage.setItem(this.env.dbname, JSON.stringify(Data));
  }
  uD(collection, index, updatedData) {
    if (index == "" && typeof index != "number") {
      throw new Error("Index Required");
    } else {
      var Data = JSON.parse(localStorage.getItem(this.env.dbname));
      var ExistingIds = this.refineIds(Object.keys(Data[collection]));
      if (ExistingIds.includes(index)) {
        if (
          typeof updatedData == "object" &&
          Object.keys(updatedData).length !== 0
        ) {
          this.ud(Data, collection, index, updatedData);
        } else {
          if (Object.keys(updatedData).length === 0) {
            throw new Error("Empty Object can not be passed");
          } else {
            throw new Error("Expected Object got none");
          }
        }
      } else {
        throw new Error("Invalid Index");
      }
    }
  }
  Id(col, obj) {
    return this.getId(this.readData(col, obj), 0);
  }
  updateData(collection, index, updatedData = "") {
    if (this.existsCollection(collection)) {
      if (typeof index == "undefined") {
        throw new Error("Index Required");
      } else {
        if (updatedData == "") {
          throw new Error("Expected Object got none");
        } else {
          if (Array.isArray(index)) {
            if (index.length > 0) {
              index.forEach((id) => {
                this.uD(collection, id, updatedData);
              });
            } else {
              throw new Error("Empty array passed");
            }
          } else {
            this.uD(collection, index, updatedData);
          }
        }
      }
    } else {
      throw new Error("Collection doesn't exist");
    }
  }
  getKeys(e) {
    return this.refineIds(Object.keys(e));
  }
}
export default new CURD();
