class Omg { 
    constructor(private concrete: Concrete, private inter: ToBeImplemented) {}

    doStuff(concrete: Concrete) {}
}

class Concrete {}

@Injectable()
interface ToBeImplemented {
    id: number;
    name: string;
}

@Injectable()
export interface AnotherInterface {
    PIN: number;
    pass: string;
}

function Injectable() {
    return (constructor: Function) => {
        Object.seal(constructor);
        Object.seal(constructor.prototype);
    }
}

console.log("success!");