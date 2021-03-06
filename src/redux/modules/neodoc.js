/* @flow */

import stringArgv from 'string-argv';
import * as neodoc from 'neodoc';

export const NEODOC_SET_SOURCE = 'NEODOC_SET_SOURCE';
export const NEODOC_SET_ARGV = 'NEODOC_SET_ARGV';
export const NEODOC_SET_ENV = 'NEODOC_SET_ENV';
export const NEODOC_SET_OPTS_FIRST = 'NEODOC_SET_OPTS_FIRST';
export const NEODOC_SET_SMART_OPTS = 'NEODOC_SET_SMART_OPTS';
export const NEODOC_SET_REQUIRE_FLAGS = 'NEODOC_SET_REQUIRE_FLAGS';
export const NEODOC_SET_STOP_AT = 'NEODOC_SET_STOP_AT';
export const NEODOC_SET_LAX_PLACEMENT = 'NEODOC_SET_LAX_PLACEMENT';
export const NEODOC_SET_REPEATABLE_OPTIONS = 'NEODOC_SET_REPEATABLE_OPTIONS';
export const NEODOC_SET_ALLOW_UNKNOWN = 'NEODOC_SET_ALLOW_UNKNOWN';

type State = {
  source: string,
  output: Object,
  error: Object,
  argv: Array,
  optionsFirst: boolean,
  smartOptions: boolean,
  laxPlacement: boolean,
  allowUnknown: boolean,
  repeatableOptions: boolean,
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

export function setEnv (value: string): Action {
  return {
    type: NEODOC_SET_ENV,
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

export function setRepeatableOptions (value: string): Action {
  return {
    type: NEODOC_SET_REPEATABLE_OPTIONS,
    payload: value
  };
}

export function setAllowUnknown (value: string): Action {
  return {
    type: NEODOC_SET_ALLOW_UNKNOWN,
    payload: value
  };
}

export const actions = {
  setSource,
  setArgv,
  setEnv,
  setOptionsFirst,
  setSmartOptions,
  setRequireFlags,
  setLaxPlacement,
  setRepeatableOptions,
  setAllowUnknown,
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

  let env;
  try {
    env = toEnv(or(opts.env, state.env));
  } catch (e) {
    userError = `Bad environment variables:\n${e.message}`;
  }

  if (!userError && source && (!state.source || source !== state.source)) {
    const now = Date.now();

    try {
      spec = neodoc.parse(source);
    } catch (e) {
      specError = e.message;
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
          env: env,
          optionsFirst: or(opts.optionsFirst, state.optionsFirst),
          requireFlags: or(opts.requireFlags, state.requireFlags),
          laxPlacement: or(opts.laxPlacement, state.laxPlacement),
          smartOptions: or(opts.smartOptions, state.smartOptions),
          repeatableOptions: or(opts.repeatableOptions, state.repeatableOptions),
          allowUnknown: or(opts.allowUnknown, state.allowUnknown),
          stopAt: or(opts.stopAt, state.stopAt),
          version: '0.5'
        }
      );
    } catch (e) {
      console.log(e);
      userError = e.message;
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
    env: or(opts.env, state.env),
    optionsFirst: or(opts.optionsFirst, state.optionsFirst),
    smartOptions: or(opts.smartOptions, state.smartOptions),
    laxPlacement: or(opts.laxPlacement, state.laxPlacement),
    repeatableOptions: or(opts.repeatableOptions, state.repeatableOptions),
    allowUnknown: or(opts.allowUnknown, state.allowUnknown),
    requireFlags: or(opts.requireFlags, state.requireFlags),
    stopAt: or(opts.stopAt, state.stopAt),

    parseTime: parseTime,
    runTime: runTime
  };

  function toEnv (s) {
    if (s.trim().length === 0) { return {}; }
    let env = {};
    for (let x of s.split(' ')) {
      const xs = x.split('=');
      if (xs.length === 1) {
        throw new Error(`Missing value for '${xs[0]}'`);
      }
      const k = xs[0];
      xs.shift();
      const v = xs.join('=');
      env[k] = v;
    }
    return env;
  }

  function or (a, b) {
    if (a == null) {
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
  [NEODOC_SET_ENV]:
    (state: State, action: {payload: string}): string => {
      return run(state, { env: action.payload });
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
    },
  [NEODOC_SET_REPEATABLE_OPTIONS]:
    (state: State, action: {payload: boolean}) => {
      return run(state, { repeatableOptions: action.payload });
    },
  [NEODOC_SET_ALLOW_UNKNOWN]:
    (state: State, action: {payload: boolean}) => {
      return run(state, { allowUnknown: action.payload });
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
  env: '',
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
  repeatableOptions: false,
  allowUnknown: false,
  stopAt: []
});

export default function neodocReducer (
  state: State = initialState,
  action: Action
) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
