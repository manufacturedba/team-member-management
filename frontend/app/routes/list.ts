import Route from '@ember/routing/route';
import { readStore } from 'frontend/util/read-store';
import type { MemberModel } from 'frontend/types/member-model';

export default class ListRoute extends Route {
  model() {
    const rawModels = readStore(document);

    return rawModels.map((rawModel: MemberModel) => rawModel.fields);
  }
}
