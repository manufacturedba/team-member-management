import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | team-member-list', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a count of members', async function (assert) {
    this.set('members', [
      { first_name: 'John', role: 'admin' },
      { first_name: 'Jane', role: 'user' },
    ]);

    // Template block usage:
    await render(hbs`
      <TeamMemberList @members={{this.members}} />
    `);

    assert.dom('[data-test-member-count]').containsText('2');
  });

  test('it renders member details', async function (assert) {
    this.set('members', [
      {
        first_name: 'J',
        last_name: 'D',
        phone_number: '555',
        email: 'jd@is.com',
        role: 'user',
      },
    ]);

    // Template block usage:
    await render(hbs`
      <TeamMemberList @members={{this.members}} />
    `);

    assert.dom('[data-test-member-name]').hasText('J D');
    assert.dom('[data-test-member-phone-number]').hasText('555');
    assert.dom('[data-test-member-email]').hasText('jd@is.com');
  });

  test('it notates when members are admins', async function (assert) {
    this.set('members', [{ first_name: 'J', last_name: 'D', role: 'admin' }]);

    // Template block usage:
    await render(hbs`
      <TeamMemberList @members={{this.members}} />
    `);

    assert.dom('[data-test-member-name]').hasText('J D (admin)');
  });
});
