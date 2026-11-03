import {
  DEFAULT_GUIDE_MASK,
  GUIDE_MASK,
  toGuideMask,
} from '../components/KeyboardFocusGuide/guideMask';

describe('toGuideMask', () => {
  it('maps a single mode', () => {
    expect(toGuideMask('arrows')).toBe(GUIDE_MASK.ARROWS);
    expect(toGuideMask('keyboard')).toBe(3); // ARROWS + TAB
    expect(toGuideMask('screen-reader')).toBe(GUIDE_MASK.SCREEN_READER);
  });

  it('merges a list of modes', () => {
    expect(toGuideMask(['keyboard', 'screen-reader'])).toBe(7);
    expect(toGuideMask(['arrows', 'screen-reader'])).toBe(5);
  });

  it('skips unknown values and gives 0 for an empty list', () => {
    // @ts-expect-error -- an unknown mode must never reach native
    expect(toGuideMask(['arrows', 'unknown'])).toBe(GUIDE_MASK.ARROWS);
    expect(toGuideMask([])).toBe(0);
  });

  it('defaults to keyboard (arrows + Tab)', () => {
    expect(DEFAULT_GUIDE_MASK).toBe(3);
  });
});

describe('unique group identifier resolution', () => {
  // The scope `useContext` returns; mocked so the hook runs outside a renderer.
  let scope: object = {};

  // Required lazily so each test gets a fresh module-level config.
  const load = () => {
    jest.resetModules();
    jest.doMock('react', () => ({
      ...jest.requireActual('react'),
      useContext: () => scope,
    }));
    const config = require('../config');
    const context = require('../context/GroupIdentifierContext');
    return { config, resolve: context.useResolvedGroupIdentifier };
  };

  beforeEach(() => {
    scope = {};
  });
  afterEach(() => jest.dontMock('react'));

  it('defaults to false and is set by configure', () => {
    const { config } = load();
    expect(config.getUniqueGroupIdentifier()).toBe(false);
    config.configure({ uniqueGroupIdentifier: true });
    expect(config.getUniqueGroupIdentifier()).toBe(true);
    config.configure({});
    expect(config.getUniqueGroupIdentifier()).toBe(true);
  });

  it('resolves view > scope > configure > false', () => {
    const { config, resolve } = load();

    expect(resolve({})).toEqual({
      groupIdentifier: undefined,
      uniqueGroupIdentifierEnabled: false,
    });

    config.configure({ uniqueGroupIdentifier: true });
    expect(resolve({}).uniqueGroupIdentifierEnabled).toBe(true);

    scope = { uniqueGroupIdentifier: false };
    expect(resolve({}).uniqueGroupIdentifierEnabled).toBe(false);
    expect(
      resolve({ uniqueGroupIdentifier: true }).uniqueGroupIdentifierEnabled
    ).toBe(true);
  });

  it('takes the view groupIdentifier, else the scope one', () => {
    const { resolve } = load();

    scope = { groupIdentifier: 'toolbar' };
    expect(resolve({}).groupIdentifier).toBe('toolbar');
    expect(resolve({ groupIdentifier: 'own' }).groupIdentifier).toBe('own');
  });
});
