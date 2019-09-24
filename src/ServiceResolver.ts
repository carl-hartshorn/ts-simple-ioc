export type ServiceResolver = <TServiceToResolve>(
    serviceType: { new(...args: any[]): TServiceToResolve })
    => TServiceToResolve;
