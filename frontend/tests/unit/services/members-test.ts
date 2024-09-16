import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';
import sinon from 'sinon';

module('Unit | Service | members', function (hooks) {
  setupTest(hooks);

  let memberService = null;

  hooks.beforeEach(function () {
    memberService = this.owner.lookup('service:members');
  });

  test('it fetches members once', async function (assert) {
    const member = { first_name: 'John' };
    const memberResponse = [{ fields: member }];
    sinon
      .stub(window, 'fetch')
      .resolves({ ok: true, json: () => memberResponse });

    const fetchedMembers = await memberService.fetch();

    assert.deepEqual(fetchedMembers, [member]);
    assert.ok(window.fetch.calledOnce);
  });

  test('it writes member submission to server and store', async function (assert) {
    const member = { first_name: 'Bob' };
    const memberResponse = [{ fields: member }];

    sinon
      .stub(window, 'fetch')
      .withArgs('/api/members', sinon.match({ method: 'PUT' }))
      .resolves({ ok: true, json: () => memberResponse });

    await memberService.add(member);

    const members = await memberService.fetch();

    assert.deepEqual(members, [member]);
  });
});
