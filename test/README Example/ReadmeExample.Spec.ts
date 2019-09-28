import { Container } from "../../src/index";
import ExampleDependency from "./ExampleDependency";
import ExampleService from "./ExampleService";

describe("README example", () => {
    it("should be valid.", () => {
        const container = new Container()
            .addTransient(ExampleService, (resolve) => new ExampleService(resolve(ExampleDependency)))
            .addSingleton(ExampleDependency, () => new ExampleDependency())
            .beginResolution();

        const service = container.resolve(ExampleService);

        expect(service).not.toBeNull();
        expect(service).not.toBeUndefined();
        expect(service instanceof ExampleService).toBeTruthy();
        expect(service.dependency).not.toBeNull();
        expect(service.dependency).not.toBeUndefined();
        expect(service.dependency instanceof ExampleDependency).toBeTruthy();
    });
});
