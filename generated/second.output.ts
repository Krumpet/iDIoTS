class Omg {
    constructor(private concrete: Concrete, 
    @inject("ToBeImplemented")
    private inter: ToBeImplemented) { }
    doStuff(concrete: Concrete) { }
}
class Concrete {
}
interface ToBeImplemented {
    id: number;
    name: string;
}
export interface AnotherInterface {
    PIN: number;
    pass: string;
}
function Injectable() {
    return (constructor: Function) => {
        Object.seal(constructor);
        Object.seal(constructor.prototype);
    };
}
console.log("success!");
