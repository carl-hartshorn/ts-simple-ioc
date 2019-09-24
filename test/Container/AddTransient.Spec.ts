import Container from "../../src/Container";
import TestService from "../TestService";

describe("Container", () => {
    describe("AddTransient", () => {
        it("should throw when attempting to add a second service registration with the same name.", () => {
            const container = new Container();
            container.AddTransient(TestService, () => new TestService());

            expect(() => container.AddTransient(TestService, () => new TestService()))
                .toThrowError(
                    "Cannot add a transient TestService because " +
                    "a transient service registration has already been added.");
        });

        it("should throw when attempting to add a service registration after resolution has begun.", () => {
            const container = new Container().BeginResolution();

            expect(() => container.AddTransient(TestService, () => new TestService()))
                .toThrowError("Cannot add a transient TestService because resolution has begun.");
        });
    });
});
