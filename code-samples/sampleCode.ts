class Omg { 
    constructor(private concrete: Concrete, private inter: ToBeImplemented) {}

    doStuff(concrete: Concrete) {}
}

class Concrete {}

/**
 * @retain
 */
interface ToBeImplemented {
    id: number;
    name: string;
}

/** @retain */
export interface AnotherInterface {
    PIN: number;
    pass: string;
}

interface NotRetained {
    blah: number;
}

function Injectable() {
    return (constructor: Function) => {
        Object.seal(constructor);
        Object.seal(constructor.prototype);
    }
}

console.log("success!");