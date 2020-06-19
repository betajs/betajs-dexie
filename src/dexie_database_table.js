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
                    return Queries.is_simple_atom(value);
                });
                var result = this.table();
                var canAnd = false;
                if (!Types.is_empty(splt[0])) {
                    var keys = Objs.keys(splt[0]);
                    var values = Objs.values(splt[0]);
                    if (keys.length > 1)
                        result = result.where("[" + keys.join("+") + "]").equals(values);
                    else
                        result = result.where(keys[0]).equals(values[0]);
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
                    result = result.sortBy(Objs.ithKey(options.sort));
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