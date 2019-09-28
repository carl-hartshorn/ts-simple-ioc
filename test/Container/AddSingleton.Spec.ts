import Container from "../../src/Container";
import TestService from "../TestService";

describe("Container", () => {
    describe("addSingleton", () => {
        it("should throw when attempting to add a second service registration with the same name.", () => {
            const container = new Container();
            container.addSingleton(TestService, () => new TestService());

            expect(() => container.addSingleton(TestService, () => new TestService()))
                .toThrowError(
                    "Cannot add a singleton TestService because " +
                    "a singleton service registration has already been added.");
        });

        it("should throw when attempting to add a service registration after resolution has begun.", () => {
            const container = new Container().beginResolution();

            expect(() => container.addSingleton(TestService, () => new TestService()))
                .toThrowError("Cannot add a singleton TestService because resolution has begun.");
        });
    });
});
