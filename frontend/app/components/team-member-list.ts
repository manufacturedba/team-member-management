import Component from '@glimmer/component';
import type { MemberModelFields } from 'frontend/types/member-model';

export interface TeamMemberListSignature {
  // The arguments accepted by the component
  Args: {
    members: MemberModelFields[];
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class TeamMemberList extends Component<TeamMemberListSignature> {
  isAdmin = (member: MemberModelFields) => {
    return member.role === 'admin';
  };
}
