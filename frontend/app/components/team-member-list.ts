import Component from '@glimmer/component';
import type { MemberModel } from 'frontend/types/member-model';

export interface TeamMemberListSignature {
  // The arguments accepted by the component
  Args: {
    members: MemberModel[];
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class TeamMemberList extends Component<TeamMemberListSignature> {}
