import Container from "../../src/Container";
import TestService from "../TestService";
import TestServiceWithConstructorDependency from "../TestServiceWithConstructorDependency";
import TestServiceWithPropertyDependency from "../TestServiceWithPropertyDependency";

describe("Container", () => {
    describe("resolve", () => {
        it("should throw when resolution has not yet begun.", () => {
            const container = new Container();
            container.addSingleton(TestService, () => new TestService());

            expect(() => container.resolve(TestService))
                .toThrowError(
                    "Resolution has not yet begun - " +
                    "did you forget to call beginResolution on the container?");
        });

        it("should throw when no registration exists for the requested service.", () => {
            const container = new Container().beginResolution();

            expect(() => container.resolve(TestService)).toThrowError("No registered TestService was found.");
        });

        it("should return a registered singleton service.", () => {
            const container = new Container()
                .addSingleton<TestService>(TestService, () => new TestService())
                .beginResolution();

            const resolved = container.resolve(TestService);
            expect(resolved).not.toBeNull();
            expect(resolved).not.toBeUndefined();
            expect(resolved instanceof TestService).toBeTruthy();
        });

        it("should return a registered singleton service instance.", () => {
            const testService = new TestService();
            const container = new Container()
                .addSingleton<TestService>(TestService, () => testService)
                .beginResolution();

            const resolved = container.resolve(TestService);
            expect(resolved).not.toBeNull();
            expect(resolved).not.toBeUndefined();
            expect(resolved instanceof TestService).toBeTruthy();
            expect(resolved).toBe(testService);
        });

        it("should return the same instance when requesting a registered singleton service multiple times.", () => {
            const container = new Container()
                .addSingleton(TestService, () => new TestService())
                .beginResolution();

            const firstInstance = container.resolve(TestService);
            const secondInstance = container.resolve(TestService);
            expect(firstInstance).toBe(secondInstance);
        });

        it(
            "should throw when attempting to resolve a registered singleton " +
            "service which has a dependency that has not been registered.",
            () => {
                const container = new Container()
                    .addSingleton(
                        TestServiceWithConstructorDependency,
                        (resolve) => new TestServiceWithConstructorDependency(resolve(TestService)))
                    .beginResolution();

                expect(() => container.resolve(TestServiceWithConstructorDependency))
                    .toThrowError(
                        "Could not resolve TestServiceWithConstructorDependency:" +
                        "\r\n- No registered TestService was found.");
            });

        it(
            "should throw when attempting to resolve a registered singleton " +
            "service which has a dependency that has been registered but not as a singleton.",
            () => {
                const container = new Container()
                    .addTransient(TestService, () => new TestService())
                    .addSingleton(
                        TestServiceWithConstructorDependency,
                        (resolve) => new TestServiceWithConstructorDependency(resolve(TestService)))
                    .beginResolution();

                expect(() => container.resolve(TestServiceWithConstructorDependency))
                    .toThrowError(
                        "Could not resolve TestServiceWithConstructorDependency:" +
                        "\r\n- Could not resolve TestService:" +
                        "\r\n-- Cannot resolve a singleton TestService as it was registered as a transient.");
            });

        it(
            "should return a registered singleton service " +
            "which has a dependency that has been registered as a singleton.",
            () => {
                const container = new Container()
                    .addSingleton(TestService, () => new TestService())
                    .addSingleton(
                        TestServiceWithConstructorDependency,
                        (resolve) => new TestServiceWithConstructorDependency(resolve(TestService)))
                    .beginResolution();

                const resolved = container.resolve(TestServiceWithConstructorDependency);
                expect(resolved).not.toBeNull();
                expect(resolved).not.toBeUndefined();
                expect(resolved instanceof TestServiceWithConstructorDependency).toBeTruthy();
                expect(resolved.testService).not.toBeNull();
                expect(resolved.testService).not.toBeUndefined();
                expect(resolved.testService instanceof TestService).toBeTruthy();
            });

        it("should return a registered transient service.", () => {
            const container = new Container()
                .addTransient(TestService, () => new TestService())
                .beginResolution();

            const resolved = container.resolve(TestService);
            expect(resolved).not.toBeNull();
            expect(resolved).not.toBeUndefined();
            expect(resolved instanceof TestService).toBeTruthy();
        });

        it("should not return the same instance when requesting a registered transient service multiple times.", () => {
            const container = new Container()
                .addTransient(TestService, () => new TestService())
                .beginResolution();

            const firstInstance = container.resolve(TestService);
            const secondInstance = container.resolve(TestService);
            expect(firstInstance).not.toBe(secondInstance);
        });

        it(
            "should return a registered transient service " +
            "which has a dependency that has been registered as a singleton.",
            () => {
                const container = new Container()
                    .addSingleton(TestService, () => new TestService())
                    .addTransient(
                        TestServiceWithConstructorDependency,
                        (resolve) => new TestServiceWithConstructorDependency(resolve(TestService)))
                    .beginResolution();

                const resolved = container.resolve(TestServiceWithConstructorDependency);
                expect(resolved).not.toBeNull();
                expect(resolved).not.toBeUndefined();
                expect(resolved instanceof TestServiceWithConstructorDependency).toBeTruthy();
                expect(resolved.testService).not.toBeNull();
                expect(resolved.testService).not.toBeUndefined();
                expect(resolved.testService instanceof TestService).toBeTruthy();
            });

        it(
            "should return a registered transient service " +
            "which has a dependency that has been registered as a transient.",
            () => {
                const container = new Container()
                    .addTransient(TestService, () => new TestService())
                    .addTransient(
                        TestServiceWithConstructorDependency,
                        (resolve) => new TestServiceWithConstructorDependency(resolve(TestService)))
                    .beginResolution();

                const resolved = container.resolve(TestServiceWithConstructorDependency);
                expect(resolved).not.toBeNull();
                expect(resolved).not.toBeUndefined();
                expect(resolved instanceof TestServiceWithConstructorDependency).toBeTruthy();
                expect(resolved.testService).not.toBeNull();
                expect(resolved.testService).not.toBeUndefined();
                expect(resolved.testService instanceof TestService).toBeTruthy();
            });

        it("should return a registered singleton service which has a transient property dependency.", () => {
            const container = new Container()
                .addSingleton(TestService, () => new TestService())
                .addTransient(
                    TestServiceWithPropertyDependency,
                    (resolve) => {
                        const service = new TestServiceWithPropertyDependency();
                        service.testService = resolve(TestService);
                        return service;
                    })
                .beginResolution();

            const resolved = container.resolve(TestServiceWithPropertyDependency);
            expect(resolved).not.toBeNull();
            expect(resolved).not.toBeUndefined();
            expect(resolved instanceof TestServiceWithPropertyDependency).toBeTruthy();
            expect(resolved.testService).not.toBeNull();
            expect(resolved.testService).not.toBeUndefined();
            expect(resolved.testService instanceof TestService).toBeTruthy();
        });
    });
});
