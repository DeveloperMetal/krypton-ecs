import { IComponents } from "schemas";
import { IDefinitions } from "types";
import { IFilter, ISystem } from "../types";
export declare function makeECSSystem<D extends IDefinitions, C extends IComponents>(system: ISystem<D, C>, filter: IFilter<D, C>, ecsName?: string, executionGroup?: string): void;
//# sourceMappingURL=system.d.ts.map