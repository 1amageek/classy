export interface getHandler {
    (self?: any): any;
}
export interface setHandler {
    (newValue: any, self?: any): void;
}
export interface willSetHandler {
    (newValue: any, self?: any): void;
}
export interface didSetHandler {
    (old: any, self?: any): void;
}
export declare type Decorator = {
    get?: getHandler;
    set?: setHandler;
    willSet?: willSetHandler;
    didSet?: didSetHandler;
};
export declare const property: (decorator?: Decorator) => (target: any, propertyKey: any) => void;
export declare const classy: <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {};
} & T;
