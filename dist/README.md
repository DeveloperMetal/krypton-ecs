![](https://github.com/DeveloperMetal/krypton-ecs/workflows/tests/badge.svg?branch=develop)

# Krypton ECS System

An experimental type safe ECS system that supports an application loop and delayed bulk events.

## ECS Introduction

An Entity-Component-System is an software architectural pattern which follows the composition over inheritance principle.

This pattern generalizes a highly flexible and extensible systems that achieve polyphormic behaviour via interfaces over inheritance. This removes many ambiguity issues caused by deep inheritance hierarches as an application grows over time.

ECS systems are most useful on large systems where adding or removing behaviours without interfeering with existing ones is desired. To achieve this the ECS pattern separates data and implementation into separate systems.

## Usage

Krypton ECS uses a configurable pipeline approach to managing processing of entities and their components.

...

### Entities

An entity can be through of as a specific grouping of components.
At no point should an entity contains its own data. It is the components's job to encapsulate data and state for any specific feature or behaviour.

This distiction between an entity holding components and the components holding data allows behaviour changes during runtime by a system that mutates components.

Defining an entity with Krypton-ECS is very easy, all you need is to define a schema that defines its name and the components to use.

Via the schema file:

```yml
entities:
  - entity: "my-entity"
    components:
      - "Component1"
components:
  - component: "Component1"
    fields:
      fieldA:
        type: string
```

then to generate the ecs client:
```bash
kecs generate
```

At runtime:
```typescript
app.entities.add({
  entity: "my-entity",
  components: ["Component1"]
})
```

### Components

Components hold all data related to a feature and should always hold the minimum amount of data to implement a feature. In fact it is highly desired to split features into multiple components that contain very specific data about the different behaviours a feature might require.

...

### Systems, events and their filters

Systems marry the relationship between entities, components and the mutation of their data. When an application's behaviour is desired, a system is called to mutate the state of the application.

Usually, systems limit themselves to mutate the components they control. But nothing prevents them from touching other components if they support and know other component interfaces.

...