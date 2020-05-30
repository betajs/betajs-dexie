Scoped.define("module:DexieDatabase", [
    "data:Databases.Database",
    "base:Promise",
    "module:DexieDatabaseTable",
    "base:Objs",
    "base:Types"
], function(Database, Promise, DexieDatabaseTable, Objs, Types, scoped) {
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
                    this._dexie.version(1).stores(Objs.map(this._config, function(value) {
                        return Types.is_array(value) ? value.join(",") : value;
                    }));
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