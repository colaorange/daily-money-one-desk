

enum CacheScope {
    MEMORY = 'memory',
    SESSION = 'session',
    LOCAL = 'local',
}


export class CacheStore {

    memoryStorage: Map<string, number | string | object | null>



    constructor() {
        this.memoryStorage = new Map()
        //it is cahce , don't observer it
    }

    get(key: string, scopes: CacheScope | CacheScope[] = CacheScope.MEMORY): number | string | object | null {
        if (!Array.isArray(scopes)) {
            scopes = [scopes]
        }
        for (const scope of scopes) {
            switch (scope) {
                case CacheScope.MEMORY:
                    if (this.memoryStorage.has(key)) {
                        return this.memoryStorage.get(key)!
                    }
                    break;
                case CacheScope.SESSION:
                    if (sessionStorage.has(key)) {
                        return JSON.parse(sessionStorage.getItem(key) || 'null')
                    }
                    break;
                case CacheScope.LOCAL:
                    if (localStorage.has(key)) {
                        return JSON.parse(localStorage.getItem(key) || 'null')
                    }
                    break;
            }
        }
        return null
    }

    set(key: string, value: number | string | object | null, scope: CacheScope = CacheScope.MEMORY) {
        switch (scope) {
            case CacheScope.MEMORY:
                this.memoryStorage.set(key, value === undefined ? null : value)
                break;
            case CacheScope.SESSION:
                sessionStorage.setItem(key, JSON.stringify(value === undefined ? null : value))
                break;
            case CacheScope.LOCAL:
                localStorage.setItem(key, JSON.stringify(value === undefined ? null : value))
                break;
        }
    }

    clear(key: string, scopes: CacheScope | CacheScope[] = [CacheScope.MEMORY, CacheScope.SESSION, CacheScope.LOCAL]) {
        if (!Array.isArray(scopes)) {
            scopes = [scopes]
        }
        for (const scope of scopes) {
            switch (scope) {
                case CacheScope.MEMORY:
                    this.memoryStorage.delete(key)
                    break;
                case CacheScope.SESSION:
                    sessionStorage.removeItem(key)
                    break;
                case CacheScope.LOCAL:
                    localStorage.removeItem(key)
                    break;
            }
        }
    }

}