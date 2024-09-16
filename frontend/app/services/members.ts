import Service from '@ember/service';
import { readStore } from 'frontend/util/read-store';
import { service } from '@ember/service';
import type {
  MemberModel,
  MemberModelFields,
} from 'frontend/types/member-model';
import type CsrfService from 'frontend/services/csrf';

function transform(rawModels: MemberModel[]) {
  return rawModels.map((rawModel: MemberModel) => ({
    id: rawModel.pk,
    ...rawModel.fields,
  }));
}

export default class MembersService extends Service {
  @service('csrf') declare csrf: CsrfService;

  #members: MemberModel[] | null = null;

  get members() {
    if (!this.#members) {
      return null;
    }

    return transform(this.#members);
  }

  /**
   * On page requiring member data, it will be available by meta tag.
   * If we're already within the application lifecycle, make server trip
   */
  async #readMemberStores(): Promise<MemberModel[]> {
    const rawModels = readStore(document);

    if (rawModels) {
      return rawModels;
    }

    const response = await fetch('/api/members/');

    // Critical page data
    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }

    return await response.json();
  }

  /**
   * Conditionally fetches members from store
   */
  async fetch(): Promise<MemberModelFields[]> {
    if (this.members) {
      return this.members;
    }

    const storedMembers = await this.#readMemberStores();

    if (storedMembers) {
      this.#members = storedMembers;
    }

    return this.members;
  }

  /**
   * Writes member data to the server and store
   */
  async add(member: MemberModelFields) {
    const response = await fetch('/api/members/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': this.csrf.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });

    const deserialized = await response.json();

    if (response.ok) {
      const [newMember] = deserialized;

      if (this.#members) {
        this.#members.push(newMember);
      }
    }
  }

  /**
   * Writes member data to the server and store
   */
  async update(id: number, updatedFields: MemberModelFields) {
    const response = await fetch(`/api/members/${id}/`, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': this.csrf.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      throw new Error('Failed to update member');
    }

    // Update local store only when members exist
    if (this.#members) {
      const deserialized = await response.json();

      const memberIndex = this.#members?.findIndex((member) => {
        return member.pk === id;
      });

      if (memberIndex !== null) {
        const priorToInsertion = this.#members?.slice(0, memberIndex);
        const afterInsertion = this.#members?.slice(memberIndex + 1);
        this.#members = [
          ...priorToInsertion,
          ...deserialized,
          ...afterInsertion,
        ];
      }
    }
  }

  /**
   * Read member from local property, DOM store, or server
   */
  async get(id: number): Promise<MemberModelFields | null> {
    if (this.members?.length) {
      const member = this.members.find((member) => {
        return member.id === id;
      });

      if (member) {
        return member;
      }
    }

    // Try DOM store but leave list unpopulated
    // TODO: Separate store into keyed locations
    const maybeStoredMembers = readStore(document);

    if (maybeStoredMembers) {
      const transformed = transform(maybeStoredMembers);

      const member = transformed.find((member) => {
        return member.id === id;
      });

      if (member) {
        return member;
      }
    }

    const response = await fetch(`/api/members/${id}/`);
    const deserialized = await response.json();

    if (response.ok) {
      const members = transform(deserialized);

      const member = members?.find((member) => {
        return member.id === id;
      });

      if (member) {
        return member;
      } else {
        throw new Error('Member returned does not match requested ID');
      }
    }

    return null;
  }

  /**
   * Delete member from server and local store
   */
  async delete(id: number) {
    const response = await fetch(`/api/members/${id}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': this.csrf.token,
      },
    });

    if (response.ok) {
      if (this.#members) {
        const memberIndex = this.#members?.findIndex((member) => {
          return member.pk === id;
        });

        if (memberIndex !== null) {
          const priorToInsertion = this.#members?.slice(0, memberIndex);
          const afterInsertion = this.#members?.slice(memberIndex + 1);
          this.#members = [...priorToInsertion, ...afterInsertion];
        }
      }
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
