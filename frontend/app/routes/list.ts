import Route from '@ember/routing/route';
import { readStore } from 'frontend/util/read-store';

type MemberModel = {
  fields: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
};

export default class ListRoute extends Route {
  model() {
    const rawModels = readStore(document);

    return rawModels.map((rawModel: MemberModel) => rawModel.fields);
  }
}
