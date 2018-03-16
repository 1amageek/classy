# classy

classy provides getter / setter to typescript.

## Install

```
npm add @1amageek/classy
```

## Usage
```typescript

import { classy, property } from '@1amageek/classy'

@classy
export class Document {

    // willSet / didSet
    @property({
        willSet: (newValue) => {
            console.log(newValue)
        },
        didSet: (oldValue) => {
            console.log(oldValue)
        } 
    }) public test0: string

    _privateValue: string

    // getter / setter
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
```
