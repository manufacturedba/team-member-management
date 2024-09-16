import Service from '@ember/service';
import { readStore } from 'frontend/util/read-store';
import { service } from '@ember/service';
import type { MemberModel } from 'frontend/types/member-model';
import type CsrfService from 'frontend/services/csrf';

function transform(rawModels: MemberModel[]) {
  return rawModels.map((rawModel: MemberModel) => rawModel.fields);
}

type MemberModelFields = MemberModel['fields'];

export default class MembersService extends Service {
  @service('csrf') declare csrf: CsrfService;

  #members: MemberModel[] | null = null;

  /**
   * On page requiring member data, it will be available by meta tag.
   * If we're already within the application lifecycle, make server trip
   */
  async #readMemberStores(): Promise<MemberModel[]> {
    const rawModels = readStore(document);

    if (rawModels) {
      return rawModels;
    }

    const response = await fetch('/api/members');

    // Critical page data
    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }

    return await response.json();
  }

  async fetch(): Promise<MemberModelFields[]> {
    if (this.#members) {
      return transform(this.#members);
    }

    const storedMembers = await this.#readMemberStores();

    if (storedMembers) {
      this.#members = storedMembers;
    }

    return transform(storedMembers);
  }

  async add(member: MemberModelFields) {
    const response = await fetch('/api/members', {
      method: 'PUT',
      headers: {
        'X-CSRFToken': this.csrf.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });

    const deserialized = await response.json();

    if (response.ok) {
      const [newMember] = deserialized;

      if (!this.#members) {
        this.#members = [];
      }

      this.#members.push(newMember);
    }
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:members')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('members') declare altName: MembersService;`.
declare module '@ember/service' {
  interface Registry {
    members: MembersService;
  }
}
