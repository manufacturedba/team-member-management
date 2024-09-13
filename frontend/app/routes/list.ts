import Route from '@ember/routing/route';
import { readStore } from 'frontend/util/read-store';

export default class ListRoute extends Route {
  model() {
    const rawModels = readStore(document);

    return rawModels.map((rawModel: any) => rawModel.fields);
  }
}
