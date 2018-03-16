import { classy, property } from '../src/index'


let testValues = { }

@classy
export class Document {

    @property({
        willSet: (newValue) => {
            testValues["willSet"] = true
        },
        didSet: (oldValue) => {
            testValues["didSet"] = true
        } 
    }) public test0: string

    _privateValue: string

    @property({
        set: (newValue, self) => {
            self._privateValue = newValue
        },
        get: (self) => {
            return self._privateValue
        }
    }) public test1: string

    constructor() {

    }
}

describe("classy", () => {

    const document: Document = new Document()

    test("willSet / didSet", () => {
        document.test0 = "value0"
        expect(document.test0).toEqual("value0")
        expect(testValues["willSet"]).toEqual(true)
        expect(testValues["didSet"]).toEqual(true)
    })

    test("setter / getter", () => {
        document.test1 = "value1"
        expect(document.test1).toEqual("value1")
        expect(document._privateValue).toEqual("value1")
    })
})