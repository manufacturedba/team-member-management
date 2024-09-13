import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';
import { readStore } from 'frontend/util/read-store';
import sinon from 'sinon';

module('Unit | Util | readStore', function (hooks) {
  setupTest(hooks);
  
  test('it should query DOM for meta tag of store and convert to object', function (assert) {
    sinon.stub(document, 'querySelector');  
    
    document.querySelector.returns({
      content: JSON.stringify({ foo: 'bar' }),
    })
    
    assert.deepEqual(readStore(document), { foo: 'bar' });
    assert.ok(document.querySelector.calledWith('meta[name="store"]'));
  });
});
