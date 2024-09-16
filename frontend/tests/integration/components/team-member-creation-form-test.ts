import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render, fillIn, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | team-member-creation-form', function (hooks) {
  setupRenderingTest(hooks);

  test('it should disable form until all fields are filled', async function (assert) {
    await render(hbs`<TeamMemberCreationForm />`);

    // Template block usage:
    await render(hbs`
      <TeamMemberCreationForm>
        template block text
      </TeamMemberCreationForm>
    `);

    assert.dom('[data-test-submit-button]').isDisabled();

    await fillIn('[data-test-first-name-input]', 'John');
    await fillIn('[data-test-last-name-input]', 'Doe');
    await fillIn('[data-test-email-input]', 'jd@is.com');
    await fillIn('[data-test-phone-number-input]', '1234567890');
    await fillIn('[data-test-admin-radio]', 'admin');
  });

  test('it should submit member payload on submission and redirect to list view', async function (assert) {
    const membersService = this.owner.lookup('service:members');
    const routerService = this.owner.lookup('service:router');

    sinon.stub(membersService, 'add').resolves();
    sinon.stub(routerService, 'transitionTo').resolves();

    await render(hbs`<TeamMemberCreationForm />`);

    // Template block usage:
    await render(hbs`
      <TeamMemberCreationForm>
        template block text
      </TeamMemberCreationForm>
    `);

    await fillIn('[data-test-first-name-input]', 'John');
    await fillIn('[data-test-last-name-input]', 'Doe');
    await fillIn('[data-test-email-input]', 'jd@is.com');
    await fillIn('[data-test-phone-number-input]', '1234567890');
    await fillIn('[data-test-admin-radio]', 'admin');

    await click('[data-test-submit-button]');

    assert.ok(
      membersService.add.calledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'jd@is.com',
        phone_number: '1234567890',
        role: 'admin',
      }),
    );

    assert.ok(routerService.transitionTo.calledWith('list'));
  });
});
