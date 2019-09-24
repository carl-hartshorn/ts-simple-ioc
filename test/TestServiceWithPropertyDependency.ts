import TestService from "./TestService";

export default class TestServiceWithPropertyDependency {
    public testService: TestService | null = null;
}
