const { migrationsInOrder } = require('@dws/muster/dist/nodes/migrations/migrations-in-order');
module.exports = migrationsInOrder[migrationsInOrder.length - 1].versionAfterUpgrade;
