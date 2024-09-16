import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type MembersService from 'frontend/services/members';
import type RouterService from '@ember/routing/router-service';

export interface TeamMemberCreationFormSignature {
  // The arguments accepted by the component
  Args: {};
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class TeamMemberCreationForm extends Component<TeamMemberCreationFormSignature> {
  @tracked
  first_name = '';

  @tracked
  last_name = '';

  @tracked
  email = '';

  @tracked
  phone_number = '';

  @tracked
  desiredRole = '';

  @service('members') declare membersService: MembersService;

  @service('router') declare router: RouterService;

  @action
  async submitForm() {
    try {
      await this.membersService.add({
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        phone_number: this.phone_number,
        role: this.desiredRole,
      });
      this.router.transitionTo('list');
    } catch (error) {
      console.error('Failed to add team member', error);
    }
  }

  @action
  setRole(role: string) {
    this.desiredRole = role;
  }

  get adminDesired() {
    return this.desiredRole === 'admin';
  }
}
