import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type MembersService from 'frontend/services/members';

export default class ListRoute extends Route {
  @service('members') declare membersService: MembersService;

  model() {
    return this.membersService.fetch();
  }
}
