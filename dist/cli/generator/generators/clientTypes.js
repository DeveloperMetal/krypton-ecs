export const generate = (_) => ({
    imports: [{ 'package': '@kryptonstuio/ecs',
            'imports': ['ECSBase', 'IEntitySchema', 'ECSEntity'] }
    ],
    src: `
export declare class Client extends ECSBase<IClientComponents, IClientComponentNames> {
  constructor()
}
`
});
//# sourceMappingURL=clientTypes.js.map