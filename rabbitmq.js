const amqp = require('amqplib');

class ConnectionPool {
  constructor(url, maxConnections) {
    this.url = url;
    this.maxConnections = maxConnections;
    this.pool = [];
    this.acquiredConnections = new Set();
  }

  async createConnection() {
    const connection = await amqp.connect(this.url);
    return connection;
  }

  async acquire() {
    if (this.pool.length > 0) {
      const connection = this.pool.pop();
      this.acquiredConnections.add(connection);
      return connection;
    }

    if (this.acquiredConnections.size < this.maxConnections) {
      const connection = await this.createConnection();
      this.acquiredConnections.add(connection);
      return connection;
    }

    throw new Error('Maximum number of connections reached');
  }

  release(connection) {
    if (this.acquiredConnections.has(connection)) {
      this.acquiredConnections.delete(connection);
      this.pool.push(connection);
    } else {
      throw new Error('Connection not acquired from this pool');
    }
  }

  async close() {
    await Promise.all([...this.acquiredConnections].map(conn => conn.close()));
    await Promise.all(this.pool.map(conn => conn.close()));
    this.pool = [];
    this.acquiredConnections.clear();
  }
}

module.exports = {
  ConnectionPool
}