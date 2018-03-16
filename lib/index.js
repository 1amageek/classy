"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const propertyMetadataKey = Symbol("property");
const getMetadataKey = Symbol("get");
const setMetadataKey = Symbol("set");
const willSetMetadataKey = Symbol("willSet");
const didSetMetadataKey = Symbol("didSet");
exports.property = (decorator) => {
    return (target, propertyKey) => {
        if (decorator) {
            if (decorator.get) {
                Reflect.defineMetadata(getMetadataKey, decorator.get, target, propertyKey);
            }
            if (decorator.set) {
                Reflect.defineMetadata(setMetadataKey, decorator.set, target, propertyKey);
            }
            if (decorator.willSet) {
                Reflect.defineMetadata(willSetMetadataKey, decorator.willSet, target, propertyKey);
            }
            if (decorator.didSet) {
                Reflect.defineMetadata(didSetMetadataKey, decorator.didSet, target, propertyKey);
            }
        }
        const properties = Reflect.getMetadata(propertyMetadataKey, target) || [];
        properties.push(propertyKey);
        Reflect.defineMetadata(propertyMetadataKey, properties, target);
    };
};
exports.classy = (constructor) => {
    const _getProperties = () => {
        return Reflect.getMetadata(propertyMetadataKey, constructor.prototype) || [];
    };
    const _definePropertyDescriptor = (key, value) => {
        let _value = value || undefined;
        const self = constructor.prototype;
        const descriptor = {
            enumerable: true,
            configurable: true,
            get: () => {
                const get = Reflect.getMetadata(getMetadataKey, constructor.prototype, key);
                if (get) {
                    return get(self);
                }
                else {
                    return _value;
                }
            },
            set: (newValue) => {
                const willSet = Reflect.getMetadata(willSetMetadataKey, constructor.prototype, key);
                if (willSet) {
                    willSet(newValue, self);
                }
                const oldValue = _value;
                const set = Reflect.getMetadata(setMetadataKey, constructor.prototype, key);
                if (set) {
                    set(newValue, self);
                }
                else {
                    _value = newValue;
                }
                const didSet = Reflect.getMetadata(didSetMetadataKey, constructor.prototype, key);
                if (didSet) {
                    didSet(oldValue, self);
                }
            }
        };
        Object.defineProperty(constructor.prototype, key, descriptor);
    };
    const properties = _getProperties();
    for (const propertyKey of properties) {
        _definePropertyDescriptor(propertyKey);
    }
    return class extends constructor {
    };
};
//# sourceMappingURL=index.js.map