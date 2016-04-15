/* @flow */

import stringArgv from 'string-argv';
import * as neodoc from 'neodoc';

export const NEODOC_SET_SOURCE = 'NEODOC_SET_SOURCE';
export const NEODOC_SET_ARGV   = 'NEODOC_SET_ARGV';

type State = {
  source: string,
  output: Object,
  error:  Object,
  argv:   Array
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

export const actions = {
  setSource,
  setArgv
};


function run(text, argv) {
  let output = null, error = null;
  try {
    output = neodoc.run(
      text,
      {
        argv: stringArgv(argv),
        dontExit: true
      }
    );
  } catch(e) {
    error = e;
  }

  return {
    source: text,
    output: output,
    argv:   argv,
    error:  error
  };
}

const ACTION_HANDLERS = {
  [NEODOC_SET_SOURCE]:
    (state: State, action: {payload: string}): string => {
      console.log('state', state);
      return run(action.payload, state.argv)
    },
  [NEODOC_SET_ARGV]:
    (state: State, action: {payload: string}): string => {
      console.log('state', state);
      return run(state.source, action.payload)
    }
};

const initialState = {
  source:
`\
Usage:
  git [-h|--help]
`,
  argv: '',
  output: null,
  error: null
}

export default function counterReducer (
  state: State = initialState,
  action: Action
): number {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
