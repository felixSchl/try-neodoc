/* @flow */

import stringArgv from 'string-argv';
import * as neodoc from 'neodoc';

export const NEODOC_SET_SOURCE     = 'NEODOC_SET_SOURCE';
export const NEODOC_SET_ARGV       = 'NEODOC_SET_ARGV';
export const NEODOC_SET_OPTS_FIRST = 'NEODOC_SET_OPTS_FIRST';

type State = {
  source:       string,
  output:       Object,
  error:        Object,
  argv:         Array,
  optionsFirst: boolean
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

export const actions = {
  setSource,
  setArgv
};


function run(text, argv, optionsFirst) {
  let output = null, error = null;
  try {
    output = neodoc.run(
      text,
      {
        argv: stringArgv(argv),
        dontExit: true,
        optionsFirst: optionsFirst
      }
    );
  } catch(e) {
    error = e;
  }

  return {
    source:       text,
    output:       output,
    argv:         argv,
    error:        error,
    optionsFirst: optionsFirst
  };
}

const ACTION_HANDLERS = {
  [NEODOC_SET_SOURCE]:
    (state: State, action: {payload: string}): string => {
      return run(
        action.payload,
        state.argv,
        state.optionsFirst
      )
    },
  [NEODOC_SET_ARGV]:
    (state: State, action: {payload: string}): string => {
      return run(
        state.source,
        action.payload,
        state.optionsFirst
      )
    },
  [NEODOC_SET_OPTS_FIRST]:
    (state: State, action: {payload: boolean}): boolean => {
      return run(
        state.source,
        state.argv,
        action.payload
      )
    }
};

const initialState = {
  source:
`\
Usage:
  git -f x <y>...
`,
  argv: '',
  output: null,
  error: null,
  optionsFirst: false
}

export default function counterReducer (
  state: State = initialState,
  action: Action
): number {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
