import { Container } from "../../src/index";
import ExampleDependency from "./ExampleDependency";
import ExampleService from "./ExampleService";

describe("README example", () => {
    it("should be valid.", () => {
        const container = new Container()
            .AddTransient(ExampleService, (resolve) => new ExampleService(resolve(ExampleDependency)))
            .AddSingleton(ExampleDependency, () => new ExampleDependency())
            .BeginResolution();

        const service = container.Resolve(ExampleService);

        expect(service).not.toBeNull();
        expect(service).not.toBeUndefined();
        expect(service instanceof ExampleService).toBeTruthy();
        expect(service.dependency).not.toBeNull();
        expect(service.dependency).not.toBeUndefined();
        expect(service.dependency instanceof ExampleDependency).toBeTruthy();
    });
});
