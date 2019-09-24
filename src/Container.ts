import { ServiceFactory } from "./ServiceFactory";
import { ServiceLifetime } from "./ServiceLifetime";
import ServiceRegistration from "./ServiceRegistration";

export default class Container {
    private serviceRegistrations: Array<ServiceRegistration<any>> = [];
    private hasBegunResolution: boolean = false;

    public AddSingleton<TServiceToRegister>(
        type: { new(...args: any[]): TServiceToRegister },
        serviceFactory: ServiceFactory<TServiceToRegister>): Container {
        this.AddRegistration(type, serviceFactory, ServiceLifetime.Singleton);
        return this;
    }

    public AddTransient<TServiceToRegister>(
        type: { new(...args: any[]): TServiceToRegister },
        serviceFactory: ServiceFactory<TServiceToRegister>): Container {
        this.AddRegistration(type, serviceFactory, ServiceLifetime.Transient);
        return this;
    }

    public Resolve<TService>(resolutionType: { new(...args: any[]): TService }): TService {
        return this.ResolveInternal(resolutionType, false);
    }

    public BeginResolution(): Container {
        this.hasBegunResolution = true;
        return this;
    }

    private ResolveInternal<TService>(
        serviceType: { new(...args: any[]): TService },
        mustBeASingleton: boolean): TService {

        if (!this.hasBegunResolution) {
            throw new Error("Resolution has not yet begun - did you forget to call BeginResolution on the container?");
        }

        const services = this.serviceRegistrations.filter((registration) => registration.type === serviceType);
        if (!services.length) {
            throw new Error(`No registered ${(serviceType as any).name} was found.`);
        }

        try {
            const service = services[0];
            if (mustBeASingleton && service.lifetime !== ServiceLifetime.Singleton) {
                throw new Error(
                    `Cannot resolve a singleton ${(serviceType as any).name} ` +
                    `as it was registered as a ${service.lifetime}.`);
            }

            if (service.lifetime === ServiceLifetime.Singleton) {
                return this.ResolveSingleton(serviceType, service);
            }

            return service.Resolve(this.Resolve.bind(this));
        } catch (error) {
            throw new Error(
                `Could not resolve ${(serviceType as any).name}:` +
                `\r\n- ${(error.message as string).replace(/-/, "--")}`);
        }
    }

    private AddRegistration<TServiceToRegister>(
        type: { new(...args: any[]): TServiceToRegister },
        serviceFactory: ServiceFactory<TServiceToRegister>,
        serviceLifetime: ServiceLifetime): void {

        if (this.hasBegunResolution) {
            throw new Error(`Cannot add a ${serviceLifetime} ${(type as any).name} because resolution has begun.`);
        }

        const services = this.serviceRegistrations.filter((registration) => registration.type === type);
        if (services.length) {
            throw new Error(
                `Cannot add a ${serviceLifetime} ${(type as any).name} ` +
                `because a ${services[0].lifetime} service registration has already been added.`);
        }

        this.serviceRegistrations.push(
            new ServiceRegistration<TServiceToRegister>(
                type,
                serviceFactory,
                serviceLifetime,
            ));
    }

    private ResolveSingleton<TService>(
        resolutionType: { new(...args: any[]): TService },
        serviceRegistration: ServiceRegistration<TService> | null = null): TService {

        if (serviceRegistration) {
            return serviceRegistration.Resolve(this.ResolveSingleton.bind(this));
        }

        return this.ResolveInternal<TService>(resolutionType, true);
    }
}
