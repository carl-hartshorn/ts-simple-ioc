import Container from "../../src/Container";
import TestService from "../TestService";
import TestServiceWithConstructorDependency from "../TestServiceWithConstructorDependency";
import TestServiceWithPropertyDependency from "../TestServiceWithPropertyDependency";

describe("Container", () => {
    describe("Resolve", () => {
        it("should throw when resolution has not yet begun.", () => {
            const container = new Container();
            container.AddSingleton(TestService, () => new TestService());

            expect(() => container.Resolve(TestService))
                .toThrowError(
                    "Resolution has not yet begun - " +
                    "did you forget to call BeginResolution on the container?");
        });

        it("should throw when no registration exists for the requested service.", () => {
            const container = new Container().BeginResolution();

            expect(() => container.Resolve(TestService)).toThrowError("No registered TestService was found.");
        });

        it("should return a registered singleton service.", () => {
            const container = new Container()
                .AddSingleton<TestService>(TestService, () => new TestService())
                .BeginResolution();

            const resolved = container.Resolve(TestService);
            expect(resolved).not.toBeNull();
            expect(resolved).not.toBeUndefined();
            expect(resolved instanceof TestService).toBeTruthy();
        });

        it("should return a registered singleton service instance.", () => {
            const testService = new TestService();
            const container = new Container()
                .AddSingleton<TestService>(TestService, () => testService)
                .BeginResolution();

            const resolved = container.Resolve(TestService);
            expect(resolved).not.toBeNull();
            expect(resolved).not.toBeUndefined();
            expect(resolved instanceof TestService).toBeTruthy();
            expect(resolved).toBe(testService);
        });

        it("should return the same instance when requesting a registered singleton service multiple times.", () => {
            const container = new Container()
                .AddSingleton(TestService, () => new TestService())
                .BeginResolution();

            const firstInstance = container.Resolve(TestService);
            const secondInstance = container.Resolve(TestService);
            expect(firstInstance).toBe(secondInstance);
        });

        it(
            "should throw when attempting to resolve a registered singleton " +
            "service which has a dependency that has not been registered.",
            () => {
                const container = new Container()
                    .AddSingleton(
                        TestServiceWithConstructorDependency,
                        (resolve) => new TestServiceWithConstructorDependency(resolve(TestService)))
                    .BeginResolution();

                expect(() => container.Resolve(TestServiceWithConstructorDependency))
                    .toThrowError(
                        "Could not resolve TestServiceWithConstructorDependency:" +
                        "\r\n- No registered TestService was found.");
            });

        it(
            "should throw when attempting to resolve a registered singleton " +
            "service which has a dependency that has been registered but not as a singleton.",
            () => {
                const container = new Container()
                    .AddTransient(TestService, () => new TestService())
                    .AddSingleton(
                        TestServiceWithConstructorDependency,
                        (resolve) => new TestServiceWithConstructorDependency(resolve(TestService)))
                    .BeginResolution();

                expect(() => container.Resolve(TestServiceWithConstructorDependency))
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
                    .AddSingleton(TestService, () => new TestService())
                    .AddSingleton(
                        TestServiceWithConstructorDependency,
                        (resolve) => new TestServiceWithConstructorDependency(resolve(TestService)))
                    .BeginResolution();

                const resolved = container.Resolve(TestServiceWithConstructorDependency);
                expect(resolved).not.toBeNull();
                expect(resolved).not.toBeUndefined();
                expect(resolved instanceof TestServiceWithConstructorDependency).toBeTruthy();
                expect(resolved.testService).not.toBeNull();
                expect(resolved.testService).not.toBeUndefined();
                expect(resolved.testService instanceof TestService).toBeTruthy();
            });

        it("should return a registered transient service.", () => {
            const container = new Container()
                .AddTransient(TestService, () => new TestService())
                .BeginResolution();

            const resolved = container.Resolve(TestService);
            expect(resolved).not.toBeNull();
            expect(resolved).not.toBeUndefined();
            expect(resolved instanceof TestService).toBeTruthy();
        });

        it("should not return the same instance when requesting a registered transient service multiple times.", () => {
            const container = new Container()
                .AddTransient(TestService, () => new TestService())
                .BeginResolution();

            const firstInstance = container.Resolve(TestService);
            const secondInstance = container.Resolve(TestService);
            expect(firstInstance).not.toBe(secondInstance);
        });

        it(
            "should return a registered transient service " +
            "which has a dependency that has been registered as a singleton.",
            () => {
                const container = new Container()
                    .AddSingleton(TestService, () => new TestService())
                    .AddTransient(
                        TestServiceWithConstructorDependency,
                        (resolve) => new TestServiceWithConstructorDependency(resolve(TestService)))
                    .BeginResolution();

                const resolved = container.Resolve(TestServiceWithConstructorDependency);
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
                    .AddTransient(TestService, () => new TestService())
                    .AddTransient(
                        TestServiceWithConstructorDependency,
                        (resolve) => new TestServiceWithConstructorDependency(resolve(TestService)))
                    .BeginResolution();

                const resolved = container.Resolve(TestServiceWithConstructorDependency);
                expect(resolved).not.toBeNull();
                expect(resolved).not.toBeUndefined();
                expect(resolved instanceof TestServiceWithConstructorDependency).toBeTruthy();
                expect(resolved.testService).not.toBeNull();
                expect(resolved.testService).not.toBeUndefined();
                expect(resolved.testService instanceof TestService).toBeTruthy();
            });

        it("should return a registered singleton service which has a transient property dependency.", () => {
            const container = new Container()
                .AddSingleton(TestService, () => new TestService())
                .AddTransient(
                    TestServiceWithPropertyDependency,
                    (resolve) => {
                        const service = new TestServiceWithPropertyDependency();
                        service.testService = resolve(TestService);
                        return service;
                    })
                .BeginResolution();

            const resolved = container.Resolve(TestServiceWithPropertyDependency);
            expect(resolved).not.toBeNull();
            expect(resolved).not.toBeUndefined();
            expect(resolved instanceof TestServiceWithPropertyDependency).toBeTruthy();
            expect(resolved.testService).not.toBeNull();
            expect(resolved.testService).not.toBeUndefined();
            expect(resolved.testService instanceof TestService).toBeTruthy();
        });
    });
});
