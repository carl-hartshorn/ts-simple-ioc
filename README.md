# ts-simple-ioc

A simple IoC container for TypeScript, strongly influenced by [Microsoft.Extensions.DependencyInjection](https://github.com/aspnet/Extensions/tree/master/src/DependencyInjection).

[![Build Status](https://dev.azure.com/carlhartshorn/ts-simple-ioc/_apis/build/status/carl-hartshorn.ts-simple-ioc?branchName=master)](https://dev.azure.com/carlhartshorn/ts-simple-ioc/_build/latest?definitionId=2&branchName=master)

## Features

- Simple service registration & resolution
- Type safe service resolution
- No package dependencies
- No requirement on services to know about the IoC framework, e.g. no decorators
- Singleton & transient lifetime support
- Constructor dependency injection
- Property dependency injection

## Getting started

### Installation

```bash
npm install --save ts-simple-ioc
```

### Registering and resolving services

```typescript
import { Container } from "ts-simple-ioc";

class ExampleService {
    constructor(public dependency: ExampleDependency) {}
}

class ExampleDependency {}

const container = new Container()
    .addTransient(ExampleService, (resolve) => new ExampleService(resolve(ExampleDependency)))
    .addSingleton(ExampleDependency, () => new ExampleDependency())
    .beginResolution();

const service = container.resolve(ExampleService);
```

## Roadmap

- v1.1.0
  - Scoped lifetime support
- v1.2.0
  - Circular dependency detection
