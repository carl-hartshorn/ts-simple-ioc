import Container from "../../src/Container";
import TestService from "../TestService";

describe("Container", () => {
    describe("AddSingleton", () => {
        it("should throw when attempting to add a second service registration with the same name.", () => {
            const container = new Container();
            container.AddSingleton(TestService, () => new TestService());

            expect(() => container.AddSingleton(TestService, () => new TestService()))
                .toThrowError(
                    "Cannot add a singleton TestService because " +
                    "a singleton service registration has already been added.");
        });

        it("should throw when attempting to add a service registration after resolution has begun.", () => {
            const container = new Container().BeginResolution();

            expect(() => container.AddSingleton(TestService, () => new TestService()))
                .toThrowError("Cannot add a singleton TestService because resolution has begun.");
        });
    });
});
