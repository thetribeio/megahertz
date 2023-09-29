export default class UnitOfWorkMemento {
    readonly state: number;

    constructor(state: number) {
        this.state = state;
    }
}