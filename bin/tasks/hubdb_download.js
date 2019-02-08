const _ = require('underscore');
const BaseTask = require('./base_task').BaseTask;
const CONSTANTS = require('./constants');
const fs = require('fs');
const knex = require('knex');
const logger = require('gulplog');
const Promise = require('promise');
const request = require('request-promise');
const shell = require('shelljs');

// Default number of sqlite rows inserted in a single transaction.
// You shouldn't experience performance issues with a batch size of 1,
// but increasing this value with the --batchSize parameter may speed things
// up. Depending on your data, increasing the batchSize may result in a sqlite
// 'too many SQL variables' error.
const DEFAULT_BATCH_SIZE = 1;

const taskName = 'download-hubdb';

class HubDbTask extends BaseTask {
  constructor() {
    const requiredArgs = ['hapikey', 'pathToContextDir'];
    super(taskName, requiredArgs);
  }

  static getTaskName() {
    return taskName;
  }

  async run() {
    const args = this.args;
    logger.info('Fetching all table meta data');
    const tables = await this.getObjects(CONSTANTS.BASE_HUBDB_API_URL, 'tables', { hapikey: args.hapikey });
    const activeTables = tables.filter(this.tableIsActive);

    const portalId = activeTables[0].portalId;

    const baseHubDbPath = this.project_root + "/" + args.pathToContextDir + '/hubdb/' + portalId;

    logger.info('Removing %s/*, if it exists', baseHubDbPath);
    shell.rm('-r', baseHubDbPath);
    shell.mkdir('-p', baseHubDbPath);
    logger.info('Writing table metadata to %s/*', baseHubDbPath);
    this.writeTablesMetaData(baseHubDbPath, activeTables);

    logger.info('Fetching rows for all tables');
    const allRows = await this.getAllRows(portalId, activeTables);
    const tablesWithRows = _.zip(activeTables, allRows);

    logger.info('Populating database');
    const dbOptions = {
      client: 'sqlite3',
      fileName: baseHubDbPath + '/hubdb.db',
      useNullAsDefault: true,
      batchSize: args.batchSize || DEFAULT_BATCH_SIZE
    };
    await this.populateDatabase(tablesWithRows, dbOptions);
  }

  async populateDatabase(tablesAndRows, dbOptions) {
    const db = knex({
      client: dbOptions.client,
      connection: {
        filename: dbOptions.fileName
      },
      "useNullAsDefault": dbOptions.useNullAsDefault
    });

    const dbPromises = tablesAndRows.map((tableAndRows) => {
      const table = tableAndRows[0];
      const rows = tableAndRows[1];

      return this.createAndPopulateTable(db, table, rows, dbOptions);
    });

    return Promise.all(dbPromises).finally(() => db.destroy());
  }

  createAndPopulateTable(db, hubDbTable, rows, dbOptions) {
    logger.info('Creating table %d', hubDbTable.id);
    return db.schema.createTable(hubDbTable.id.toString(), (table) => {
      table.integer('hs_id');
      table.integer('hs_created_at');
      table.text('hs_path');

      hubDbTable.columns.forEach((column) => {
        const columnInfo = this.getColumnSchemaInfo(column);
        table[columnInfo.type](columnInfo.name);
      });
    })
    .then(() => this.insertRowsIntoTable(db, hubDbTable, rows, dbOptions))
    .catch((error) => {
      logger.warn('An error occurred while populating table %d: ', hubDbTable.id, error);
    });
  }

  insertRowsIntoTable(db, hubDbTable, rows, dbOptions) {
    const rowsToInsert = rows.objects.map((row) => this.transformHubDbRowToSqliteRow(hubDbTable, row));
    return db.batchInsert(hubDbTable.id.toString(), rowsToInsert, dbOptions.batchSize).then(() => {
      logger.info('Finished inserting %d rows for table %d', rowsToInsert.length, hubDbTable.id);
    });
  }

  transformHubDbRowToSqliteRow(hubDbTable, row) {
    const data = {
      hs_id: row.id,
      hs_created_at: row.createdAt,
      hs_path: row.path
    };

    const columnNameLookup = this.getColumnIdToNameLookup(hubDbTable);
    const columnTypeLookup = this.getColumnIdToTypeLookup(hubDbTable);
    _.each(row.values, (value, key) => {
      const columnName = columnNameLookup[key];
      const columnType = columnTypeLookup[key];
      data[columnName] = this.getSqliteValue(columnType, value);
    });

    return data;
  }

  getColumnIdToTypeLookup(hubDbTable) {
    const typeLookup = {};
    hubDbTable.columns.forEach((column) => {
      typeLookup[column.id] = column.type;
    });

    return typeLookup;
  }

  getColumnIdToNameLookup(hubDbTable) {
    const nameLookup = {};
    hubDbTable.columns.forEach((column) => {
      nameLookup[column.id] = column.name;
    });

    return nameLookup;
  }

  getSqliteValue(type, value) {
    if (_.isUndefined(value)) {
      return value;
    } else if (type === 'SELECT') {
      return value.id;
    } else if (type === 'FOREIGN_ID') {
      return this.dehydratedListString(value);
    } else if (type === 'MULTISELECT') {
      return this.dehydratedListString(value);
    } else if (_.isObject(value)) {
      return JSON.stringify(value);
    }

    return value;
  }

  getColumnSchemaInfo(column) {
    const type = this.getSqliteTypeFromHubDbType(column);
    const name = column.name;

    return {
      type,
      name,
    };
  }

  getSqliteTypeFromHubDbType(column) {
    const intTypes = ['DATE', 'DATETIME', 'NUMBER', 'BOOLEAN', 'SELECT'];
    const type = column.type;

    if (_.contains(intTypes, type)) {
      return 'integer';
    }

    return 'text';
  }

  dehydratedListString(list) {
    return "," +
      list.map((listHash) => listHash.id)
      + ",";
  }

  getHubDbTableRows(portalId, tableId) {
    const url = CONSTANTS.BASE_HUBDB_API_URL + 'tables/' + tableId + '/rows?portalId=' + portalId;
    return request.get(url);
  }

  async getAllRows(portalId, tables) {
    const getRowPromises = tables.map((table) => this.getHubDbTableRows(portalId, table.id).then(response => {
        logger.info('Fetched %d rows for tableId %d (%s)', table.rowCount, table.id, table.name);
        return response;
      })
    );

    return Promise.all(getRowPromises).then(responses => responses.map(JSON.parse));
  }

  writeTablesMetaData(path, tables) {
    tables.forEach((table) => {
      const writeToFile = path + '/table-meta-' + table.id + '.json';
      fs.writeFileSync(writeToFile, JSON.stringify(table, null, 2));
    });
  }

  tableIsActive(table) {
    return table.publishedAt > 0 && !table.deleted;
  }
}

module.exports = { HubDbTask }
