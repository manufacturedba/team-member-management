import Route from '@ember/routing/route';

function readStore() : Array | null {
    const metaElement = document.querySelector('meta[name="store"]') as HTMLMetaElement
    
    if (!metaElement) {
        return null
    }
    
    try {
        return JSON.parse(metaElement.content)
    } catch (e) {
        console.error('Unable to parse found store', e);
    }
    
    return null
}
export default class ListRoute extends Route {
    model() {
        const rawModels = readStore();
        
        return rawModels.map((rawModel: any) => rawModel.fields);
    }
}
