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
                return Dexie.delete(this._db);
            }

        };

    });
});