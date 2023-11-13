import {PayloadAction} from '@reduxjs/toolkit/src/createAction';
import {createSlice} from '@reduxjs/toolkit';

export interface UserState {
  email: string | null;
  attack: number | null;
  defense: number | null;
  hp: number | null;
  mp: number | null;
  currentHp: number | null;
  currentMp: number | null;
  experience: number | null;
  int: number;
  str: number;
  vit: number;
  dex: number;
  luck: number;
  pointLeft: number;
  position: {id: string | null; coordinate: number | null} | null;
  inventoryId?: string | null;
}

const initialState: UserState = {
  email: null,
  position: null,
  attack: null,
  defense: null,
  hp: null,
  mp: null,
  currentHp: null,
  currentMp: null,
  experience: null,
  int: 0,
  dex: 0,
  str: 0,
  vit: 0,
  luck: 0,
  pointLeft: 0,
  inventoryId: null,
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    assignUser(state, action: PayloadAction<UserState>) {
      state.email = action.payload.email;
      state.position = action.payload.position;
      state.attack = action.payload.attack;
      state.defense = action.payload.defense;
      state.hp = action.payload.hp;
      state.mp = action.payload.mp;
      state.currentHp = action.payload.currentHp;
      state.currentMp = action.payload.currentMp;
      state.experience = action.payload.experience;
      state.int = action.payload.int;
      state.vit = action.payload.vit;
      state.dex = action.payload.dex;
      state.str = action.payload.str;
      state.luck = action.payload.luck;
      state.pointLeft = action.payload.pointLeft;
      state.inventoryId = action.payload.inventoryId;
      state.position = {
        id:
          action.payload.position?.id !== undefined
            ? action.payload.position.id
            : null,
        coordinate:
          action.payload.position?.coordinate !== undefined
            ? action.payload.position.coordinate
            : null,
      };
    },
    updateCurrentHpUser(state, action: PayloadAction<number>) {
      let newCurrentHp = state.currentHp! - action.payload;
      if (newCurrentHp < 0) {
        newCurrentHp = 0;
      }
      state.currentHp = newCurrentHp;
    },
    updateUserPosition(
      state,
      action: PayloadAction<{id: string; coordinate: number}>,
    ) {
      state.position = {
        id: action.payload.id,
        coordinate: action.payload.coordinate,
      };
    },
    updateUserStatus(
      state,
      action: PayloadAction<{
        hp: number;
        mp: number;
        currentHp: number;
        currentMp: number;
        attack: number;
        defense: number;
        str: number;
        int: number;
        vit: number;
        dex: number;
        luck: number;
        pointLeft: number;
      }>,
    ) {
      state.attack = action.payload.attack;
      state.defense = action.payload.defense;
      state.hp = action.payload.hp;
      state.mp = action.payload.mp;
      state.currentHp = action.payload.currentHp;
      state.currentMp = action.payload.currentMp;
      state.str = action.payload.str;
      state.int = action.payload.int;
      state.vit = action.payload.vit;
      state.dex = action.payload.dex;
      state.luck = action.payload.luck;
      state.pointLeft = action.payload.pointLeft;
    },
    userLevelUp(
      state,
      action: PayloadAction<{level: number; pointLeft: number}>,
    ) {
      state.pointLeft = action.payload.pointLeft;
    },
  },
});

export const {
  assignUser,
  updateCurrentHpUser,
  updateUserPosition,
  updateUserStatus,
  userLevelUp,
} = userSlice.actions;
export const userReducer = userSlice.reducer;
