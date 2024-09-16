import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render, fillIn, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | team-member-form', function (hooks) {
  setupRenderingTest(hooks);

  test('it should disable form until all fields are filled', async function (assert) {
    await render(hbs`<TeamMemberForm />`);

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

    await render(hbs`<TeamMemberForm />`);

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

  test('it should load a member into input fields', async function (assert) {
    this.member = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'jd@is.com',
      phone_number: '1234567890',
      role: 'admin',
    };

    await render(hbs`<TeamMemberForm @member={{this.member}} />`);

    assert.dom('[data-test-first-name-input]').hasValue('John');
    assert.dom('[data-test-last-name-input]').hasValue('Doe');
    assert.dom('[data-test-email-input]').hasValue('jd@is.com');
    assert.dom('[data-test-phone-number-input]').hasValue('1234567890');
    assert.dom('[data-test-admin-radio]').isChecked();
  });

  test('it should save a member as an update operation', async function (assert) {
    this.member = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'jd@is.com',
      phone_number: '1234567890',
      role: 'admin',
    };

    this.id = 1;

    const membersService = this.owner.lookup('service:members');
    const routerService = this.owner.lookup('service:router');

    sinon.stub(membersService, 'update').resolves();
    sinon.stub(routerService, 'transitionTo').resolves();

    await render(
      hbs`<TeamMemberForm @id={{this.id}} @member={{this.member}} />`,
    );

    await fillIn('[data-test-first-name-input]', 'UpdatedJohn');

    await click('[data-test-submit-button]');

    assert.ok(
      membersService.update.calledWith(
        this.id,
        sinon.match({ first_name: 'UpdatedJohn' }),
      ),
    );
  });

  test('it should perform a delete operation on clicking delete button', async function (assert) {
    this.member = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'jd@is.com',
      phone_number: '1234567890',
      role: 'admin',
    };

    this.id = 1;

    const membersService = this.owner.lookup('service:members');
    const routerService = this.owner.lookup('service:router');

    sinon.stub(membersService, 'delete').resolves();
    sinon.stub(routerService, 'transitionTo').resolves();

    await render(
      hbs`<TeamMemberForm @id={{this.id}} @member={{this.member}} />`,
    );

    await click('[data-test-delete-button]');

    assert.ok(membersService.delete.calledWith(this.id));
  });
});
