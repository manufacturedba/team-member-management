import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked, cached } from '@glimmer/tracking';
import type MembersService from 'frontend/services/members';
import type RouterService from '@ember/routing/router-service';
import type { MemberModelFields } from 'frontend/types/member-model';
import { assert } from '@ember/debug';

export interface TeamMemberFormSignature {
  Args: {
    id: number | null;
    member: MemberModelFields | null;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

/**
 * Explicit tracking enabled against member object
 */
class TrackableMember {
  @tracked
  first_name: string;

  @tracked
  last_name: string;

  @tracked
  email: string;

  @tracked
  phone_number: string;

  @tracked
  role: string;

  id: number | null;

  constructor(member?: MemberModelFields) {
    this.first_name = member?.first_name || '';
    this.last_name = member?.last_name || '';
    this.email = member?.email || '';
    this.phone_number = member?.phone_number || '';
    this.role = member?.role || 'user';
  }

  asObject(): MemberModelFields {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_number: this.phone_number,
      role: this.role,
    };
  }
}

export default class TeamMemberForm extends Component<TeamMemberFormSignature> {
  @service('members') declare membersService: MembersService;

  @service('router') declare router: RouterService;

  not = (attribute: boolean) => !attribute;

  @action
  async submitForm() {
    try {
      if (this.isEditMode) {
        if (this.args.id === null) {
          assert('ID is required for edit mode');
        }

        await this.membersService.update(this.args.id, this.member.asObject());
      } else {
        await this.membersService.add(this.member.asObject());
      }

      this.router.transitionTo('list');
    } catch (error) {
      console.error('Failed to add team member', error);
    }
  }

  @action
  async deleteMember() {
    if (this.args.id) {
      await this.membersService.delete(this.args.id);
      this.router.transitionTo('list');
    }
  }

  /**
   * Create member object that can be overwritten from external write
   */
  @cached
  get member(): TrackableMember {
    if (!this.args.member) {
      return new TrackableMember();
    }

    return new TrackableMember(this.args.member);
  }

  /**
   * Implicit flag by checking member presence
   */
  get isEditMode() {
    return this.args.member;
  }

  get isAdmin() {
    return this.member.role === 'admin';
  }

  /**
   * Sets between user or admin
   */
  @action
  setRole(role: string) {
    this.member.role = role;
  }

  get fieldsMissing() {
    return (
      !this.member.first_name ||
      !this.member.last_name ||
      !this.member.email ||
      !this.member.role ||
      !this.member.phone_number
    );
  }
}
