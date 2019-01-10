import createMigrationTester from '../../test/create-migration-tester';
import migration from './from-6-0-to-6-6'; // tslint:disable-line:import-name-case-insensitive

const testMigration = createMigrationTester(migration);

describe('Migration from muster 6.0 to 6.6', () => {
  testMigration('GIVEN a query node', {
    before: {
      $type: 'query',
      data: {
        keys: { $type: 'value', data: { value: 'asdf' } }, // This doesn't matter
        root: { $type: 'root' }, // This doesn't matter
      },
    },
    after: {
      $type: 'query',
      data: {
        keys: { $type: 'value', data: { value: 'asdf' } }, // This doesn't matter
        options: {
          omitNils: false,
        },
        root: { $type: 'root' }, // This doesn't matter
      },
    },
  });

  testMigration('GIVEN a querySet node', {
    before: {
      $type: 'query-set',
      data: {
        children: { $type: 'value', data: { value: 'asdf' } }, // This doesn't matter
        options: {
          bubbleErrorsToTop: false,
        },
        root: { $type: 'root' }, // This doesn't matter
      },
    },
    after: {
      $type: 'query-set',
      data: {
        children: { $type: 'value', data: { value: 'asdf' } }, // This doesn't matter
        options: {
          bubbleErrorsToTop: false,
          omitNils: false,
        },
        root: { $type: 'root' }, // This doesn't matter
      },
    },
  });
});
