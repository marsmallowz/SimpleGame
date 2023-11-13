import {PayloadAction} from '@reduxjs/toolkit/src/createAction';
import {createSlice} from '@reduxjs/toolkit';

export enum LogTypes {
  JoinSubArea,
  AttackMonster,
  MonsterAttack,
  Gathering,
  System,
}

export interface LogData {
  time: string;
  message: string;
  type: LogTypes;
}

export interface LogsState {
  logs: LogData[];
}

const initialState: LogsState = {
  logs: [],
};

const logsSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    pushLog(state, action: PayloadAction<{message: string; type: LogTypes}>) {
      const currentTime = new Date();
      state.logs.push({
        time: `${currentTime.getHours()}:${currentTime.getMinutes()}`,
        message: action.payload.message,
        type: action.payload.type,
      });
    },
  },
});

export const {pushLog} = logsSlice.actions;
export const logsReducer = logsSlice.reducer;
