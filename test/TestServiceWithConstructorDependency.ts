import TestService from "./TestService";

export default class TestServiceWithConstructorDependency {
    constructor(public testService: TestService) {}
}
