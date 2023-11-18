import {PayloadAction} from '@reduxjs/toolkit/src/createAction';
import {createSlice} from '@reduxjs/toolkit';

export interface MonsterState {
  _id: string;
  name: string;
  currentHp: number;
  currentMp: number;
  totalHp: number;
  totalMp: number;
}

export interface MonstersState {
  monsters: MonsterState[];
}

const initialState: MonstersState = {
  monsters: [],
};

const monstersSlice = createSlice({
  name: 'monster',
  initialState,
  reducers: {
    attackMonster(
      state,
      action: PayloadAction<{monsterId: string; damage: number}>,
    ) {
      for (const monster of state.monsters) {
        if (monster._id === action.payload.monsterId) {
          monster.currentHp -= action.payload.damage;
          break;
        }
      }
    },
    addMonsters(state, action: PayloadAction<MonstersState>) {
      state.monsters = action.payload.monsters;
    },
  },
});

export const {attackMonster, addMonsters} = monstersSlice.actions;
export const monstersReducer = monstersSlice.reducer;
