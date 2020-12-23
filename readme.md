![](https://github.com/DeveloperMetal/krypton-ecs/workflows/tests/badge.svg?branch=develop)

# Krypton ECS System

An experimental type safe ECS system that supports an application loop and delayed bulk events.

## ECS Introduction

An Entity-Component-System is an software architectural pattern which follows the composition over inheritance principle.

This pattern generalizes a highly flexible and extensible systems that achieve polyphormic behaviour via interfaces over inheritance. This removes many ambiguity issues caused by deep inheritance hierarches as an application grows over time.

ECS systems are most useful on large systems where adding or removing behaviours without interfeering with existing behaviours is desired. To achieve this the ECS pattern separates data and implementation into separate systems.

## Usage

Using Krypton-ECS you must first define the components a system supports. Then you must define the systems and their filters which act on changes in the application state.

Example of the smallest ECS bootstrap:

```typescript
import {
  ECS,
  FilterType,
  ComponentInterface,
  ComponentFields,
  ECSDefine
} from "@kryptonstudio/ecs";

// Component interface to enforce type signatures
interface Component1 extends ComponentInterface {
  field: string
}

// Component meta data
const component1Definition: ComponentFields<Component1> = {
  field: { defaultValue: 'I am a string', type: 'string' }
}

// Our ECS System Definition. Here we list our components by interface name and meta
interface AppECSDefine extends ECSDefine {
  components: {
    Component1: Component1
  }
}

// The final application ECS
const appECS = new ECS({
  Component1: component1Definition
});

// A system that adds a component on every entity added to the sytem.
appECS.addSystem(
  // Watch entites added to the application state
  FilterType.Added,
  // We want to add our component on all entities, so we just return all entities on the event.
  (ecs: ECS, entities: Entity[]) => entities,
  // The actuall system implementation. Adds Component1 to all added entities.
  (ecs: ECS, entities: Entity[]) => {
    entities.forEach(e => e.add<AppECSDefine>("Component1"));
  }
)

// Adding our first entity
appECS.addEntity("entity-1");

// Somewhere in your application loop
appECS.update()

```

### Entities

An entity can be through of as a specific grouping of one or many components.
At no point an entity contains its own data, this is due to internal components's job is to encapsulate data and state for any specific feature or behaviour.

This distiction between an entity holding components and the components holding data allows behaviour changes during runtime by a system that mutates components.

Defining an entity with Krypton-ECS is very easy, all you need is an entity id:

```typescript
app.addEntity('my-entity');
```

or if you want to seed the entity with existing components:

```typescript
app.addEntity<AppECSDefine>('my-entity', 'Component1');
```

### Components

Components hold all data related to a feature and should always hold the minimum amount of data to implement a feature. In fact it is highly desired to split features into multiple components that contain very specific data about the different behaviours a feature might require.

To specify a component for Krypton-ECS you need an interface and metadata about the component fields:

```typescript
// Component interface to enforce type signatures
interface Component1 extends ComponentInterface {
  field: string
}

// Component meta data
const component1Definition: ComponentFields<Component1> = {
  field: { defaultValue: 'I am a string', type: 'string' }
}
```

The interface is used internally to enfoce types throughout the ECS api which facilitates code completion on your components and in editor documentation.

The metadata as of writing only uses the defaultValue and nullable fields actively to seed component instantiation.

Once your component's interface and metadata is ready you must define it on your application ECS's interface:

```typescript
// Our ECS System Definition. Here we list our components by interface name and meta
interface AppECSDefine extends ECSDefine {
  components: {
    Component1: Component1
  }
}

// The final application ECS
const appECS = new ECS({
  Component1: component1Definition
});
```

The `APPECSDefine` enforces the relationship between the `Component1` type name and its interface.

Once your are ready to instantiate the ECS system, you must pass the metadata definition into the ECSInstance. Because we have our own custom `AppECSDefine` the first argument of `ECS` expects to take the metadata object for your components.

### Systems, events and their filters

Systems marry the relationship between entities, components and the mutation of their data. When an application's behaviour is desired, a system is called to mutate the state of the application.

Usually, systems limit themselves to mutate the components they control. But nothing prevents them from touching other components if they support and know other component interfaces.

You can think of a system as an event handler when something happens in your application's state. Krypton-ECS forexample triggers systems which monitor entity additions or removals.  This allows a snowfall effect where multiple systems will trigger as data changes during the application loop or lifetime of the application.

All systems in Krypton-ECS MUST be tied to an event and a filter to reduce the number of entities your system must perform work on.

The following example adds a system which injects a component on every entity added on the system. Notice the second parameter(the filter) which returns the entites being added at some point. The filter could return a smaller set of entities if we don't want to modify every entity on this event.

The system itself is called with the reduced entity list. This separation on reducing the data set a system acts on allows reusing systems with multiple filters on multiple events.

```typescript
// A system that adds a component on every entity added to the sytem.
appECS.addSystem(
  // Watch entites added to the application state
  FilterType.Added,
  // We want to add our component on all entities, so we just return all entities on the event.
  (ecs: ECS, entities: Entity[]) => entities,
  // The actuall system implementation. Adds Component1 to all added entities.
  (ecs: ECS, entities: Entity[]) => {
    entities.forEach(e => e.add("Component1"));
  }
)
```