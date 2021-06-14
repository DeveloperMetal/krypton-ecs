export const generate = (_data) => {
    return {
        imports: [{
                package: "@kryptonstudio/ecs",
                imports: ["kecs"]
            }],
        exports: [{
                exportName: "Client",
                localName: "Client"
            }],
        src: `
// Client Class /////////////////////////////////////////////////////////////////
class Client extends kecs.ECSBase {
  constructor() {
    super({ schema: componentSchema });
  }
}
`
    };
};
//# sourceMappingURL=client.js.map