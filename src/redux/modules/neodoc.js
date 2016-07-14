/* @flow */

import stringArgv from 'string-argv';
import * as neodoc from 'neodoc';

export const NEODOC_SET_SOURCE = 'NEODOC_SET_SOURCE';
export const NEODOC_SET_ARGV = 'NEODOC_SET_ARGV';
export const NEODOC_SET_OPTS_FIRST = 'NEODOC_SET_OPTS_FIRST';
export const NEODOC_SET_SMART_OPTS = 'NEODOC_SET_SMART_OPTS';
export const NEODOC_SET_REQUIRE_FLAGS = 'NEODOC_SET_REQUIRE_FLAGS';
export const NEODOC_SET_STOP_AT = 'NEODOC_SET_STOP_AT';

type State = {
  source: string,
  output: Object,
  error: Object,
  argv: Array,
  optionsFirst: boolean,
  smartOptions: boolean,
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
    requireFlags: or(opts.requireFlags, state.requireFlags),
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
    }
};

const initialState = {
  source:
`\
usage: git [--version] [--help] [-C <path>] [-c <name=value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p|--paginate|--no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           [<command> [<args>...]]

The most commonly used git commands are:
   add        Add file contents to the index
   bisect     Find by binary search the change that introduced a bug
   branch     List, create, or delete branches
   checkout   Checkout a branch or paths to the working tree
   clone      Clone a repository into a new directory
   commit     Record changes to the repository
   diff       Show changes between commits, commit and working tree, etc
   fetch      Download objects and refs from another repository
   grep       Print lines matching a pattern
   init       Create an empty Git repository or reinitialize an existing one
   log        Show commit logs
   merge      Join two or more development histories together
   mv         Move or rename a file, a directory, or a symlink
   pull       Fetch from and integrate with another repository or a local branch
   push       Update remote refs along with associated objects
   rebase     Forward-port local commits to the updated upstream head
   reset      Reset current HEAD to the specified state
   rm         Remove files from the working tree and from the index
   show       Show various types of objects
   status     Show the working tree status
   tag        Create, list, delete or verify a tag object signed with GPG

'git help -a' and 'git help -g' lists available subcommands and some
concept guides. See 'git help <command>' or 'git help <concept>'
to read about a specific subcommand or concept.
`,
  argv: '',
  output: null,
  spec: null,
  userError: null,
  specError: null,
  parseTime: null,
  runTime: null,
  optionsFirst: true,
  smartOptions: true,
  requireFlags: true,
  stopAt: []
};

export default function counterReducer (
  state: State = initialState,
  action: Action
): number {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
