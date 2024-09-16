import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';
import sinon from 'sinon';
import type MembersService from 'frontend/services/members';

module('Unit | Service | members', function (hooks) {
  setupTest(hooks);

  let memberService: MembersService | null = null;

  hooks.beforeEach(function () {
    memberService = this.owner.lookup('service:members');
  });

  test('it fetches members once', async function (assert) {
    const member = { first_name: 'John', id: 1 };
    const memberResponse = [{ fields: member, pk: 1 }];
    sinon
      .stub(window, 'fetch')
      .resolves({ ok: true, json: () => memberResponse });

    const fetchedMembers = await memberService.fetch();

    assert.deepEqual(fetchedMembers, [member]);
    assert.ok(window.fetch.calledOnce);
  });

  test('it writes member submission to server and store', async function (assert) {
    const member = { first_name: 'Bob', id: 2 };
    const memberResponse = [{ fields: member, pk: 2 }];

    sinon.stub(window, 'fetch');

    window.fetch
      .withArgs('/api/members/', sinon.match({ method: 'GET' }))
      .resolves({ ok: true, json: () => memberResponse });

    window.fetch
      .withArgs('/api/members/')
      .resolves({ ok: true, json: () => memberResponse });

    await memberService.add(member);

    const members = await memberService.fetch();

    assert.deepEqual(members, [member]);
  });

  test('it fetches single records by id', async function (assert) {
    const id = 1;
    const member = { first_name: 'Bob', id };
    const memberResponse = [{ fields: member, pk: id }];

    sinon
      .stub(window, 'fetch')
      .withArgs(`/api/members/${id}/`)
      .resolves({ ok: true, json: () => memberResponse });

    const fetchedMember = await memberService.get(id);

    assert.deepEqual(fetchedMember, member);
  });

  test('it writes member updates by id to server and store', async function (assert) {
    const id = 1;
    const member = { first_name: 'Bob' };
    const memberResponse = [{ fields: member, pk: id }];
    const updateResponse = [{ fields: { first_name: 'Alice' }, pk: id }];

    sinon.stub(window, 'fetch');

    window.fetch
      .withArgs(`/api/members/`)
      .resolves({ ok: true, json: () => memberResponse });

    window.fetch
      .withArgs(`/api/members/${id}/`, sinon.match({ method: 'PUT' }))
      .resolves({ ok: true, json: () => updateResponse });

    await memberService.fetch();

    await memberService.update(id, { first_name: 'Alice' });

    const updatedMember = await memberService.get(id);

    assert.ok(window.fetch.calledTwice);
    assert.deepEqual(updatedMember, { first_name: 'Alice', id });
  });
});
