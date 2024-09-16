import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type MembersService from 'frontend/services/members';

interface EditRouteParams {
  member_id: string;
}

export default class EditRoute extends Route {
  @service('members') declare membersService: MembersService;

  async model(params: EditRouteParams) {
    const id = Number(params.member_id);
    const member = await this.membersService.get(id);
    return {
      id,
      member,
    };
  }
}
