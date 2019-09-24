import { ServiceResolver } from "./ServiceResolver";

export type ServiceFactory<TRegistration> = (resolve: ServiceResolver) => TRegistration;
