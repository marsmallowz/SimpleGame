import {PayloadAction} from '@reduxjs/toolkit/src/createAction';
import {createSlice} from '@reduxjs/toolkit';
import {storage} from '../../storage/localStorage';

export interface AuthState {
  userId: string | undefined | null;
  token: string | undefined | null;
  refreshToken: string | undefined | null;
}

const initialState: AuthState = {
  userId: storage.getString('userId'),
  token: storage.getString('token'),
  refreshToken: storage.getString('refreshToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    removeAuth(state) {
      state.userId = undefined;
      state.token = undefined;
      state.refreshToken = undefined;
      storage.delete('userId');
      storage.delete('token');
      storage.delete('refreshToken');
    },
    assignAuth(state, action: PayloadAction<AuthState>) {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      storage.set('userId', action.payload.userId!);
      storage.set('token', action.payload.token!);
      storage.set('refreshToken', action.payload.refreshToken!);
    },
    updateToken(
      state,
      action: PayloadAction<{accessToken: string; refreshToken: string}>,
    ) {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      storage.set('token', action.payload.accessToken!);
      storage.set('refreshToken', action.payload.refreshToken!);
    },
  },
});

export const {removeAuth, assignAuth, updateToken} = authSlice.actions;
export const authReducer = authSlice.reducer;
