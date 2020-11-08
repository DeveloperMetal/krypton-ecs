import { Component, ComponentFields, ComponentInterface } from './component';

interface ITestComp1 extends ComponentInterface {
  fieldA: string;
  fieldB: number;
  fieldC: boolean;
  fieldD: string | null;
}

const testComp1: ComponentFields<ITestComp1> = {
  fieldA: { defaultValue: 'I am a string', type: 'string' },
  fieldB: { defaultValue: 123, type: 'number' },
  fieldC: { defaultValue: true, type: 'boolean' },
  fieldD: { type: 'string', nullable: true },
};

describe('Components', () => {
  it('Create Component', () => {
    const compRaw = new Component('comp1', testComp1);
    const comp = compRaw.as<ITestComp1>();
    expect(comp.fieldA).toEqual(testComp1.fieldA.defaultValue);
    expect(comp.fieldB).toEqual(testComp1.fieldB.defaultValue);
    expect(comp.fieldC).toEqual(testComp1.fieldC.defaultValue);
    expect(comp.fieldD).toEqual(null);
  });

  it('Invalid Component field type', () => {
    const compRaw = new Component('comp1', testComp1);
    const comp = compRaw.as<ITestComp1>();
    expect(() => {
      Reflect.set(comp, 'fieldA', 123);
    }).toThrowError('Invalid Type');

    expect(() => {
      Reflect.set(comp, 'fieldA', null);
    }).toThrowError('Invalid Type. Field is not nullable');
  });

  it('Set invalid field', () => {
    const compRaw = new Component('comp1', testComp1);
    const comp = compRaw.as<ITestComp1>();
    expect(() => {
      Reflect.set(comp, 'fieldX', 123);
    }).toThrowError('Field fieldX not found');
  });

  it('Missing nullable definition', () => {
    // Force an invalid default value
    const comp1Copy = Object.assign({}, testComp1);
    comp1Copy.fieldA = Object.assign({}, comp1Copy.fieldA);
    Reflect.deleteProperty(comp1Copy.fieldA, 'defaultValue');
    expect(() => {
      new Component('comp1', comp1Copy); // tslint:disable-line
    }).toThrowError('Default Value is required when field is not nullable');
  });

  it('List keys', () => {
    const compRaw = new Component('comp1', testComp1);
    expect(compRaw.keys()).toStrictEqual(['fieldA', 'fieldB', 'fieldC', 'fieldD']);
  });
});
