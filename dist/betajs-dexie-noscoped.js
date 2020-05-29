/*!
betajs-dexie - v0.0.2 - 2020-05-29
Copyright (c) Oliver Friedmann
Apache-2.0 Software License.
*/

(function () {
var Scoped = this.subScope();
Scoped.binding('module', 'global:BetaJS.Data.Databases.Dexie');
Scoped.binding('base', 'global:BetaJS');
Scoped.binding('data', 'global:BetaJS.Data');
Scoped.define("module:", function () {
	return {
    "guid": "5bd48095-7aea-4962-b1d3-75a575bce453",
    "version": "0.0.2",
    "datetime": 1590791570509
};
});
Scoped.assumeVersion('base:version', '~1.0.96');
Scoped.assumeVersion('data:version', '~1.0.41');
Scoped.define("module:DexieDatabaseTable", [
    "data:Databases.DatabaseTable",
    "base:Promise",
    "base:Iterators.ArrayIterator",
    "base:Tokens",
    "base:Objs",
    "base:Types",
    "data:Queries"
], function(DatabaseTable, Promise, ArrayIterator, Tokens, Objs, Types, Queries, scoped) {

    var RESERVED_KEYS = ["weak"];

    return DatabaseTable.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            table: function() {
                if (!this.__table)
                    this.__table = this._database._getTable(this._table_name);
                return this.__table;
            },

            primary_key: function() {
                return "_id";
            },

            _insertRow: function(row) {
                if (!row[this.primary_key()])
                    row[this.primary_key()] = Tokens.generate_token();
                return Promise.fromNativePromise(this.table().add(row)).mapSuccess(function(result) {
                    return row;
                }, this);
            },

            _removeRow: function(query) {
                return Promise.fromNativePromise(this.table()['delete'](query[this.primary_key()]));
            },

            _findOne: function(query) {
                if (!query[this.primary_key()])
                    return inherited._findOne.call(this, query);
                return Promise.fromNativePromise(this.table().get(query[this.primary_key()]));
            },

            _updateRow: function(query, row) {
                return Promise.fromNativePromise(this.table().update(query[this.primary_key()], row)).mapSuccess(function() {
                    return row;
                });
            },

            _encode: function(data) {
                data = Objs.map(data, function(value) {
                    return value && (Types.is_object(value) || Types.is_array(value)) ? this._encode(value) : value;
                }, this);
                RESERVED_KEYS.forEach(function(key) {
                    if (key in data) {
                        data[key + "_reserved"] = data[key];
                        delete data[key];
                    }
                });
                return data;
            },

            _decode: function(data) {
                data = Objs.map(data, function(value) {
                    return value && (Types.is_object(value) || Types.is_array(value)) ? this._decode(value) : value;
                }, this);
                RESERVED_KEYS.forEach(function(key) {
                    if ((key + "_reserved") in data) {
                        data[key] = data[key + "_reserved"];
                        delete data[key + "_reserved"];
                    }
                });
                return data;
            },

            _clear: function() {
                return Promise.fromNativePromise(this.table().clear());
            },

            _find: function(query, options) {
                query = query || {};
                if (!query || Types.is_empty(query)) {
                    return Promise.fromNativePromise(this.table().toArray()).mapSuccess(function(cols) {
                        return new ArrayIterator(cols);
                    }, this);
                }
                var splt = Objs.splitObject(query, function(value) {
                    return Queries.isEqualValueKey(value);
                });
                var result = this.table();
                var canAnd = false;
                if (!Types.is_empty(splt[0])) {
                    result = result.where(Objs.keys(splt[0])).equals(Objs.values(splt[0]));
                    canAnd = true;
                }
                query = splt[1];
                if (!Types.is_empty(query) && canAnd) {
                    result = result.and(function(row) {
                        return Queries.evaluate(query, row);
                    });
                }
                options = options || {};
                if (options.sort)
                    result = result.orderBy(Objs.ithKey(options.sort));
                if (options.skip)
                    result = result.offset(options.skip);
                if (options.limit)
                    result = result.limit(options.limit);
                return Promise.fromNativePromise(result.toArray()).mapSuccess(function(cols) {
                    if (!Types.is_empty(query) && !canAnd) {
                        cols = cols.filter(function(row) {
                            return Queries.evaluate(query, row);
                        });
                    }
                    return new ArrayIterator(cols);
                }, this).error(function(e) {
                    console.warn(e);
                });
            }

        };
    });
});
Scoped.define("module:DexieDatabase", [
    "data:Databases.Database",
    "base:Promise",
    "module:DexieDatabaseTable"
], function(Database, Promise, DexieDatabaseTable, scoped) {
    return Database.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(db, tables) {
                inherited.constructor.call(this);
                this._db = db;
                this._config = tables || {};
                this._dexie = null;
            },

            destroy: function() {
                this._unbind();
                inherited.destroy.call(this);
            },

            _unbind: function() {
                if (this._dexie) {
                    this._dexie.close();
                    this._dexie = null;
                }
            },

            _bind: function() {
                if (!this._dexie) {
                    this._dexie = new Dexie(this._db);
                    this._dexie.version(1).stores(this._config);
                    this._dexie.open();
                }
            },

            _tableClass: function() {
                return DexieDatabaseTable;
            },

            _getTable: function(tableName) {
                this._bind();
                return this._dexie[tableName];
            },

            deleteDatabase: function() {
                this._unbind();
                return Dexie['delete'](this._db);
            }

        };

    });
});
}).call(Scoped);