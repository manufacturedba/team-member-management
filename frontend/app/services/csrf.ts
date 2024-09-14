import Service from '@ember/service';

export default class CsrfService extends Service {
  get token() : string | null {
    const entries = document.cookie.split(';');
    
    for (const entry of entries) {
      const [name, value] = entry.split('=');
      if (name?.trim() === 'csrftoken') {
        return value || null;
      }
    }
    
    return null;
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:csrf')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('csrf') declare altName: CsrfService;`.
declare module '@ember/service' {
  interface Registry {
    csrf: CsrfService;
  }
}
