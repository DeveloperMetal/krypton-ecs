export const generate = (_data) => `
/**
 * ECS Client
 **/
export interface ECSClient extends ECSBase<IComponents> {
  constructor(opts) {
    super(schema, opts);
  }
}`;
//# sourceMappingURL=customECS.js.map