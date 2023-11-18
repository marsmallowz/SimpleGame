import {MonstersState, monstersReducer} from './monstersSlice';
import {combineReducers} from 'redux';
import {AuthState, authReducer} from './authSlice';
import {UserState, userReducer} from './userSlice';
import {LogsState, logsReducer} from './logsSlice';

export interface AppState {
  auth: AuthState;
  user: UserState;
  logs: LogsState;
  monsters: MonstersState;
}

const rootReducer = combineReducers<AppState>({
  auth: authReducer,
  user: userReducer,
  logs: logsReducer,
  monsters: monstersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
