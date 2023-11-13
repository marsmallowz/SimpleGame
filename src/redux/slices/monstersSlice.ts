import {PayloadAction} from '@reduxjs/toolkit/src/createAction';
import {createSlice} from '@reduxjs/toolkit';

export interface MonsterState {
  monsters: any[];
}

const initialState: MonsterState = {
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
    fetchMonsters(state, action: PayloadAction<any>) {
      state.monsters = action.payload.monsters;
    },
  },
});

export const {attackMonster, fetchMonsters} = monstersSlice.actions;
export const monstersReducer = monstersSlice.reducer;
