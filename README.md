# betajs-dexie 0.0.4
[![Code Climate](https://codeclimate.com/github/betajs/betajs-dexie/badges/gpa.svg)](https://codeclimate.com/github/betajs/betajs-dexie)
[![NPM](https://img.shields.io/npm/v/betajs-dexie.svg?style=flat)](https://www.npmjs.com/package/betajs-dexie)


BetaJS-Dexie is a Dexie / IndexedDB wrapper for BetaJS.



## Getting Started


You can use the library in the browser and compile it as well.

#### Browser

```javascript
	<script src="betajs/dist/betajs.min.js"></script>
	<script src="betajs-data/dist/betajs-data.min.js"></script>
	<script src="https://unpkg.com/dexie@latest/dist/dexie.min.js"></script>
	<script src="betajs-dexie/dist/betajs-dexie.min.js"></script>
``` 

#### Compile

```javascript
	git clone https://github.com/betajs/betajs-dexie.git
	npm install
	grunt
```



## Basic Usage


We provide a simple abstraction for databases and tables, with a concrete implementation for Dexie.

First, you instantiate a database, e.g. a Dexie:

```javascript
	var database = new BetaJS.Data.Databases.Dexie.DexieDatabase("database", {
	     'table1': "indexkey1,indexkey2",
         ...
    });
```
 
The `DexieDatabase` class inherits from the abstract `Database` class.

Once you have a `database` instance, you can access database tables / collections as follows:

```javascript
	var table = database.getTable('my-table-name');
```

A `table` instance allows you to perform the typical (asynchronous) CRUD operations on the table:

```javascript
	table.insertRow({row data}).success(function (inserted) {...}).error(function (error) {...});
	
	table.removeRow({remove query}).success(function () {...}).error(function (error) {...});
	table.removeById(id).success(function () {...}).error(function (error) {...});
	
	table.updateRow({update query}, {row data}).success(function (updated) {...}).error(function (error) {...});
	table.updateById(id, {row data}).success(function (updated) {...}).error(function (error) {...});
	
	table.find({search query}, {limit, skip, sort}).success(function (rowIterator) {...}).error(function (error) {...});
	table.findOne({search query}, {skip, sort}).success(function (row) {...}).error(function (error) {...});
	table.findById(id).success(function (row) {...}).error(function (error) {...});
``` 

In most cases, you would not access database table instances directly but through the abstraction of a store.

Database Stores allow you to access a database table through the abstract of a `Store`, providing all the additional functionality from the `BetaJS-Data` module.

Once you have instantiated your `database` instance, you can create a corresponding `Store` for a table as follows, e.g. for a Dexie:

```javascript
	var store = new BetaJS.Data.Stores.DatabaseStore(database, "my-database-table");
```


## Links
| Resource   | URL |
| :--------- | --: |
| Homepage   | [https://betajs.com](https://betajs.com) |
| Git        | [git://github.com/betajs/betajs-dexie.git](git://github.com/betajs/betajs-dexie.git) |
| Repository | [https://github.com/betajs/betajs-dexie](https://github.com/betajs/betajs-dexie) |
| Blog       | [https://blog.betajs.com](https://blog.betajs.com) | 
| Twitter    | [https://twitter.com/thebetajs](https://twitter.com/thebetajs) | 
 



## Compatability
| Target | Versions |
| :----- | -------: |


## CDN
| Resource | URL |
| :----- | -------: |
| betajs-dexie.js | [http://cdn.rawgit.com/betajs/betajs-dexie/master/dist/betajs-dexie.js](http://cdn.rawgit.com/betajs/betajs-dexie/master/dist/betajs-dexie.js) |
| betajs-dexie.min.js | [http://cdn.rawgit.com/betajs/betajs-dexie/master/dist/betajs-dexie.min.js](http://cdn.rawgit.com/betajs/betajs-dexie/master/dist/betajs-dexie.min.js) |
| betajs-dexie-noscoped.js | [http://cdn.rawgit.com/betajs/betajs-dexie/master/dist/betajs-dexie-noscoped.js](http://cdn.rawgit.com/betajs/betajs-dexie/master/dist/betajs-dexie-noscoped.js) |
| betajs-dexie-noscoped.min.js | [http://cdn.rawgit.com/betajs/betajs-dexie/master/dist/betajs-dexie-noscoped.min.js](http://cdn.rawgit.com/betajs/betajs-dexie/master/dist/betajs-dexie-noscoped.min.js) |



## Dependencies
| Name | URL |
| :----- | -------: |
| betajs | [Open](https://github.com/betajs/betajs) |
| betajs-data | [Open](https://github.com/betajs/betajs-data) |


## Weak Dependencies
| Name | URL |
| :----- | -------: |
| betajs-scoped | [Open](https://github.com/betajs/betajs-scoped) |


## Main Contributors

- Oliver Friedmann

## License

Apache-2.0







