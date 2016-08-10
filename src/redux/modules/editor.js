import _ from 'lodash';
export const EDITOR_SET_KEYBINDINGS = 'EDITOR_SET_KEYBINDINGS';

export function setKeybindings (value: string): Action {
  return {
    type: EDITOR_SET_KEYBINDINGS,
    payload: value
  };
}

const ACTION_HANDLERS = {
  [EDITOR_SET_KEYBINDINGS]:
    (state, { payload }) => {
      return {
        keybindings: payload
      };
    }
};

const initialState = {
  keybindings: 'default'
};

export default function editorReducer (
  state = initialState,
  action
) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
