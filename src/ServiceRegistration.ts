import { ServiceFactory } from "./ServiceFactory";
import { ServiceLifetime } from "./ServiceLifetime";
import { ServiceResolver } from "./ServiceResolver";

export default class ServiceRegistration<TService> {
    private singletonInstance: TService | null = null;

    constructor(
        public type: { new(...args: any[]): TService },
        private factory: ServiceFactory<TService>,
        public lifetime: ServiceLifetime) {}

    public resolve(serviceResolver: ServiceResolver): TService {
        if (!serviceResolver) {
            throw new Error("serviceResolver is required.");
        }

        if (this.lifetime === ServiceLifetime.Singleton) {
            if (!this.singletonInstance) {
                this.singletonInstance = this.factory(serviceResolver);
            }

            return this.singletonInstance;
        }

        return this.factory(serviceResolver);
    }
}
