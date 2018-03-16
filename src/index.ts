import {} from "reflect-metadata"

const propertyMetadataKey: Symbol = Symbol("property")
const getMetadataKey: Symbol = Symbol("get")
const setMetadataKey: Symbol = Symbol("set")
const willSetMetadataKey: Symbol = Symbol("willSet")
const didSetMetadataKey: Symbol = Symbol("didSet")

export interface getHandler { (self?: any): any }
export interface setHandler { (newValue: any, self?: any): void }
export interface willSetHandler { (newValue: any, self?: any): void }
export interface didSetHandler { (old: any, self?: any): void }
export type Decorator = {
    get?: getHandler,
    set?: setHandler,
    willSet?: willSetHandler,
    didSet?: didSetHandler
}

export const property = (decorator?: Decorator) => {
    return (target: any, propertyKey) => {
        if (decorator) {
            if (decorator.get) {
                Reflect.defineMetadata(getMetadataKey, decorator.get, target, propertyKey)
            }
            if (decorator.set) {
                Reflect.defineMetadata(setMetadataKey, decorator.set, target, propertyKey)
            }
            if (decorator.willSet) {
                Reflect.defineMetadata(willSetMetadataKey, decorator.willSet, target, propertyKey)
            }
            if (decorator.didSet) {
                Reflect.defineMetadata(didSetMetadataKey, decorator.didSet, target, propertyKey)
            }
        }
        const properties = Reflect.getMetadata(propertyMetadataKey, target) || []
        properties.push(propertyKey)
        Reflect.defineMetadata(propertyMetadataKey, properties, target)
    }
}

export const classy = <T extends { new(...args: any[]): {} }>(constructor: T) => {

    const _getProperties = (): string[] => {
        return Reflect.getMetadata(propertyMetadataKey, constructor.prototype) || []
    }

    const _definePropertyDescriptor = (key: string, value?: any) => {
        let _value: any = value || undefined
        const self = constructor.prototype
        const descriptor: PropertyDescriptor = {
            enumerable: true,
            configurable: true,
            get: () => {
                const get = Reflect.getMetadata(getMetadataKey, constructor.prototype, key)
                if (get) {
                    return get(self)
                } else {
                    return _value
                }                
            },
            set: (newValue) => {
                const willSet = Reflect.getMetadata(willSetMetadataKey, constructor.prototype, key)
                if (willSet) {
                    willSet(newValue, self)
                }
                const oldValue = _value                
                const set = Reflect.getMetadata(setMetadataKey, constructor.prototype, key)
                if (set) {
                    set(newValue, self)
                } else {
                    _value = newValue
                }
                const didSet = Reflect.getMetadata(didSetMetadataKey, constructor.prototype, key)
                if (didSet) {
                    didSet(oldValue, self)
                }
            }
        }
        Object.defineProperty(constructor.prototype, key, descriptor)
    }

    const properties = _getProperties()

    for (const propertyKey of properties) {
        _definePropertyDescriptor(propertyKey)
    }

    return class extends constructor { }
}