import {MonstersState, monstersReducer} from './monstersSlice';
import {combineReducers} from 'redux';
import {AuthState, authReducer} from './authSlice';
import {UserState, userReducer} from './userSlice';
import {LogsState, logsReducer} from './logsSlice';
import {SettingState, settingReducer} from './settingSlice';

export interface AppState {
  auth: AuthState;
  setting: SettingState;
  user: UserState;
  logs: LogsState;
  monsters: MonstersState;
}

const rootReducer = combineReducers<AppState>({
  auth: authReducer,
  setting: settingReducer,
  user: userReducer,
  logs: logsReducer,
  monsters: monstersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
