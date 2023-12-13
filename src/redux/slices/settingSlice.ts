import {PayloadAction} from '@reduxjs/toolkit/src/createAction';
import {createSlice} from '@reduxjs/toolkit';
import {storage} from '../../storage/localStorage';

export interface SettingState {
  areaIntro: boolean;
}

const initialState: SettingState = {
  areaIntro:
    storage.getBoolean('areaIntro') !== undefined
      ? storage.getBoolean('areaIntro')!
      : true,
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    updateSetting(state, action: PayloadAction<SettingState>) {
      state.areaIntro = action.payload.areaIntro;
      storage.set('areaIntro', action.payload.areaIntro);
    },
  },
});

export const {updateSetting} = settingSlice.actions;
export const settingReducer = settingSlice.reducer;
