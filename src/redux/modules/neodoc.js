/* @flow */

import stringArgv from 'string-argv';
import * as neodoc from 'neodoc';

export const NEODOC_SET_SOURCE = 'NEODOC_SET_SOURCE';
export const NEODOC_SET_ARGV = 'NEODOC_SET_ARGV';
export const NEODOC_SET_OPTS_FIRST = 'NEODOC_SET_OPTS_FIRST';
export const NEODOC_SET_SMART_OPTS = 'NEODOC_SET_SMART_OPTS';
export const NEODOC_SET_REQUIRE_FLAGS = 'NEODOC_SET_REQUIRE_FLAGS';
export const NEODOC_SET_STOP_AT = 'NEODOC_SET_STOP_AT';
export const NEODOC_SET_LAX_PLACEMENT = 'NEODOC_SET_LAX_PLACEMENT';

type State = {
  source: string,
  output: Object,
  error: Object,
  argv: Array,
  optionsFirst: boolean,
  smartOptions: boolean,
  laxPlacement: boolean,
  spec: Object,
  parseTime: Number,
  runTime: Number
};

export function setSource (value: string): Action {
  return {
    type: NEODOC_SET_SOURCE,
    payload: value
  };
}

export function setArgv (value: string): Action {
  return {
    type: NEODOC_SET_ARGV,
    payload: value
  };
}

export function setOptionsFirst (value: boolean): Action {
  return {
    type: NEODOC_SET_OPTS_FIRST,
    payload: value
  };
}

export function setSmartOptions (value: boolean): Action {
  return {
    type: NEODOC_SET_SMART_OPTS,
    payload: value
  };
}

export function setRequireFlags (value: boolean): Action {
  return {
    type: NEODOC_SET_REQUIRE_FLAGS,
    payload: value
  };
}

export function setLaxPlacement (value: boolean): Action {
  return {
    type: NEODOC_SET_LAX_PLACEMENT,
    payload: value
  };
}

export function setStopAt (value: boolean): Action {
  return {
    type: NEODOC_SET_STOP_AT,
    payload: value
  };
}

export const actions = {
  setSource,
  setArgv,
  setOptionsFirst,
  setSmartOptions,
  setRequireFlags,
  setLaxPlacement,
  setStopAt
};

function run (state, opts) {
  let spec = null;
  let output = null;
  let specError = null;
  let userError = null;
  let parseTime = null;
  let runTime = null;

  opts = opts || {};

  let source = or(opts.source, state.source);

  if (source && (!state.source || source !== state.source)) {
    const now = Date.now();
    try {
      spec = neodoc.parse(source);
    } catch (e) {
      specError = e;
    }
    parseTime = Date.now() - now;
  } else {
    spec = state.spec;
    parseTime = state.parseTime;
  }

  if (spec) {
    const now = Date.now();
    try {
      output = neodoc.run(
        spec,
        {
          dontExit: true,

          argv: stringArgv(or(opts.argv, state.argv)),
          optionsFirst: or(opts.optionsFirst, state.optionsFirst),
          smartOptions: or(opts.smartOptions, state.smartOptions),
          requireFlags: or(opts.requireFlags, state.requireFlags),
          laxPlacement: or(opts.laxPlacement, state.laxPlacement),
          stopAt: or(opts.stopAt, state.stopAt)
        }
      );
    } catch (e) {
      userError = e;
    }
    runTime = Date.now() - now;
  } else {
    runTime = state.runTime;
  }

  return {
    source: source,

    spec: spec,
    specError: specError,

    output: output,
    userError: userError,

    argv: or(opts.argv, state.argv),
    optionsFirst: or(opts.optionsFirst, state.optionsFirst),
    smartOptions: or(opts.smartOptions, state.smartOptions),
    laxPlacement: or(opts.laxPlacement, state.laxPlacement),
    stopAt: or(opts.stopAt, state.stopAt),

    parseTime: parseTime,
    runTime: runTime
  };

  function or (a, b) {
    if (a === undefined || a === null) {
      return b;
    } else {
      return a;
    }
  }
}

const ACTION_HANDLERS = {
  [NEODOC_SET_SOURCE]:
    (state: State, action: {payload: string}): string => {
      return run(state, { source: action.payload });
    },
  [NEODOC_SET_ARGV]:
    (state: State, action: {payload: string}): string => {
      return run(state, { argv: action.payload });
    },
  [NEODOC_SET_OPTS_FIRST]:
    (state: State, action: {payload: boolean}): boolean => {
      return run(state, { optionsFirst: action.payload });
    },
  [NEODOC_SET_SMART_OPTS]:
    (state: State, action: {payload: boolean}): boolean => {
      return run(state, { smartOptions: action.payload });
    },
  [NEODOC_SET_STOP_AT]:
    (state: State, action: {payload: any}) => {
      return run(state, { stopAt: action.payload });
    },
  [NEODOC_SET_REQUIRE_FLAGS]:
    (state: State, action: {payload: boolean}) => {
      return run(state, { requireFlags: action.payload });
    },
  [NEODOC_SET_LAX_PLACEMENT]:
    (state: State, action: {payload: boolean}) => {
      return run(state, { laxPlacement: action.payload });
    }
};

const initialState = run({}, {
  source:
`\
Naval Fate.

Usage:
  naval_fate ship new <name>...
  naval_fate ship <name> move <x> <y> [--speed=<kn>]
  naval_fate ship shoot <x> <y>
  naval_fate mine (set|remove) <x> <y> [--moored|--drifting]
  naval_fate -h | --help
  naval_fate --version

Options:
  -h --help     Show this screen.
  --version     Show version.
  --speed=<kn>  Speed in knots [default: 10].
  --moored      Moored (anchored) mine.
  --drifting    Drifting mine.
`,
  argv: '',
  output: null,
  spec: null,
  userError: null,
  specError: null,
  parseTime: null,
  runTime: null,
  optionsFirst: false,
  smartOptions: true,
  requireFlags: false,
  laxPlacement: false,
  stopAt: []
});

export default function counterReducer (
  state: State = initialState,
  action: Action
): number {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
