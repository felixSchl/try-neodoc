/* @flow */

import stringArgv from 'string-argv';
import * as neodoc from 'neodoc';

export const NEODOC_SET_SOURCE = 'NEODOC_SET_SOURCE';
export const NEODOC_SET_ARGV = 'NEODOC_SET_ARGV';
export const NEODOC_SET_OPTS_FIRST = 'NEODOC_SET_OPTS_FIRST';
export const NEODOC_SET_SMART_OPTS = 'NEODOC_SET_SMART_OPTS';

type State = {
  source: string,
  output: Object,
  error: Object,
  argv: Array,
  optionsFirst: boolean,
  smartOptions: boolean,
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

export const actions = {
  setSource,
  setArgv,
  setOptionsFirst,
  setSmartOptions
};

function run (text, argv, optionsFirst, smartOptions) {
  let output = null;
  let error = null;
  console.log(text, argv, optionsFirst, smartOptions);
  try {
    output = neodoc.run(
      text,
      {
        argv: stringArgv(argv),
        dontExit: true,
        optionsFirst: optionsFirst,
        smartOptions: smartOptions
      }
    );
  } catch (e) {
    error = e;
  }

  return {
    source: text,
    output: output,
    argv: argv,
    error: error,
    optionsFirst: optionsFirst,
    smartOptions: smartOptions
  };
}

const ACTION_HANDLERS = {
  [NEODOC_SET_SOURCE]:
    (state: State, action: {payload: string}): string => {
      return run(
        action.payload,
        state.argv,
        state.optionsFirst,
        state.smartOptions
      );
    },
  [NEODOC_SET_ARGV]:
    (state: State, action: {payload: string}): string => {
      return run(
        state.source,
        action.payload,
        state.optionsFirst,
        state.smartOptions
      );
    },
  [NEODOC_SET_OPTS_FIRST]:
    (state: State, action: {payload: boolean}): boolean => {
      return run(
        state.source,
        state.argv,
        action.payload,
        state.smartOptions
      );
    },
  [NEODOC_SET_SMART_OPTS]:
    (state: State, action: {payload: boolean}): boolean => {
      return run(
        state.source,
        state.argv,
        state.optionsFirst,
        action.payload
      );
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
  error: null,
  optionsFirst: true,
  smartOptions: true
};

export default function counterReducer (
  state: State = initialState,
  action: Action
): number {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
