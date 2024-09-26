const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const db = {
  pool: null,
  connect: async function () {
    // this.pool = await sql.connect(`Server=${process.env.DB_SERVER},1433;Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PWD};trustServerCertificate=${process.env.NODE_ENV === 'development'}`);
    this.pool = await sql.connect(`Server=${process.env.DB_SERVER},1433;Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PWD};trustServerCertificate=true`);
  },
  readSqlFile: function (filePath) {
    const fullPath = path.join(__dirname, '..', 'queries', `${filePath}.sql`);
    try {
      return fs.readFileSync(fullPath, { encoding: 'utf8' });
    } catch (error) {
      console.error('Failed to read the SQL file:', error);
      return null;
    }
  },
  query: async function (queryString, params) {
    if (!this.pool) {
      await this.connect();
    }
    const request = this.pool.request();
    for (const key in params) {
      request.input(key, params[key]);
    }
    return await request.query(queryString);
  },
  queryFromPath: async function (filePath, params) {
    try {
      const queryString = this.readSqlFile(filePath);
      if (!queryString) throw new Error('Could not read sql from path: ' + filePath);
      const result = await this.query(queryString, params);
      return this.parseJsonFields(result.recordset);
    } catch (error) {
      // console.error('Error executing query from path:', error);
      throw error;
    }
  },
  parseJsonFields: function (data) {
    return data.map(record => this.parseJsonRecursively(record));
  },
  parseJsonRecursively: function (obj) {
    if (typeof obj === 'string' && this.isJsonString(obj)) {
      return this.parseJsonRecursively(JSON.parse(obj));
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.parseJsonRecursively(item));
    } else if (obj !== null && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          obj[key] = this.parseJsonRecursively(obj[key]);
        }
      }
      return obj;
    } else {
      return obj;
    }
  },
  isJsonString: function (str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
};

module.exports = {
  db
}