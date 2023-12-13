import {PayloadAction} from '@reduxjs/toolkit/src/createAction';
import {createSlice} from '@reduxjs/toolkit';
import {EquipmentType} from '../../enums/equipment-type';

interface UserQuest {
  _id: string;
  complete: boolean;
  progress: any[];
  questId: string;
}

export interface Equipment {
  _id: string;
  name: string;
  description: string;
  rarity: string;
  type: string;
  attack: number;
  magicAttack: number;
  defense: string;
  magicDefense: number;
}

export interface UserState {
  email: string | null;
  username: string | null;
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
  quests: UserQuest[];
  head: Equipment | null;
  body: Equipment | null;
  lowerBody: Equipment | null;
  rightHand: Equipment | null;
  leftHand: Equipment | null;
  rightArm: Equipment | null;
  leftArm: Equipment | null;
  rightLeg: Equipment | null;
  leftLeg: Equipment | null;
}

const initialState: UserState = {
  email: null,
  username: null,
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
  quests: [],
  head: null,
  body: null,
  lowerBody: null,
  rightHand: null,
  leftHand: null,
  rightArm: null,
  leftArm: null,
  rightLeg: null,
  leftLeg: null,
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    assignUser(state, action: PayloadAction<UserState>) {
      state.email = action.payload.email;
      state.username = action.payload.username;
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
      state.quests = action.payload.quests;
      state.rightHand = action.payload.rightHand;
      state.leftHand = action.payload.leftHand;
      state.head = action.payload.head;
    },
    updateCurrentHpUser(state, action: PayloadAction<number>) {
      let newCurrentHp = state.currentHp! - action.payload;
      if (newCurrentHp < 0) {
        newCurrentHp = 0;
      }
      state.currentHp = newCurrentHp;
    },
    setCurrentHpUser(state, action: PayloadAction<number>) {
      state.currentHp = action.payload;
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
    userTakeQuest(state, action: PayloadAction<UserQuest>) {
      state.quests.push(action.payload);
    },
    userReportQuest(state, action: PayloadAction<UserQuest>) {
      const indexQuest = state.quests.findIndex(quest => {
        return quest._id === action.payload._id;
      });
      state.quests[indexQuest].complete = true;
    },
    removeUser(state) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = initialState;
    },
    updateBasicStatus(
      state,
      action: PayloadAction<{
        attack: number;
        defense: number;
      }>,
    ) {
      state.attack = action.payload.attack;
      state.defense = action.payload.defense;
    },
    addUserEquipment(
      state,
      action: PayloadAction<{equipment: Equipment; equipmentPosition?: string}>,
    ) {
      if (action.payload.equipment.type === EquipmentType.Head) {
        state.head = action.payload.equipment;
      } else if (action.payload.equipment.type === EquipmentType.UpperBody) {
        state.body = action.payload.equipment;
      } else if (action.payload.equipment.type === EquipmentType.LowerBody) {
        state.lowerBody = action.payload.equipment;
      } else if (
        action.payload.equipment.type === EquipmentType.OneHanded ||
        action.payload.equipment.type === EquipmentType.DualHanded
      ) {
        if (action.payload.equipmentPosition === 'Right') {
          state.rightHand = action.payload.equipment;
        } else if (action.payload.equipmentPosition === 'Left') {
          state.leftHand = action.payload.equipment;
        }
      } else if (action.payload.equipment.type === EquipmentType.Arm) {
        if (action.payload.equipmentPosition === 'Right') {
          state.rightHand = action.payload.equipment;
        } else if (action.payload.equipmentPosition === 'Left') {
          state.leftHand = action.payload.equipment;
        }
      } else if (action.payload.equipment.type === EquipmentType.Leg) {
        if (action.payload.equipmentPosition === 'Right') {
          state.rightLeg = action.payload.equipment;
        } else if (action.payload.equipmentPosition === 'Left') {
          state.leftLeg = action.payload.equipment;
        }
      }
    },
    removeUserEquipment(
      state,
      action: PayloadAction<{equipment: Equipment; equipmentPosition?: string}>,
    ) {
      if (action.payload.equipment.type === EquipmentType.Head) {
        state.head = null;
      } else if (action.payload.equipment.type === EquipmentType.UpperBody) {
        state.body = null;
      } else if (action.payload.equipment.type === EquipmentType.LowerBody) {
        state.lowerBody = null;
      } else if (
        action.payload.equipment.type === EquipmentType.OneHanded ||
        action.payload.equipment.type === EquipmentType.DualHanded
      ) {
        if (action.payload.equipmentPosition === 'Right') {
          state.rightHand = null;
        } else if (action.payload.equipmentPosition === 'Left') {
          state.leftHand = null;
        }
      } else if (action.payload.equipment.type === EquipmentType.Arm) {
        if (action.payload.equipmentPosition === 'Right') {
          state.rightHand = null;
        } else if (action.payload.equipmentPosition === 'Left') {
          state.leftHand = null;
        }
      } else if (action.payload.equipment.type === EquipmentType.Leg) {
        if (action.payload.equipmentPosition === 'Right') {
          state.rightLeg = null;
        } else if (action.payload.equipmentPosition === 'Left') {
          state.leftLeg = null;
        }
      }
    },
  },
});

export const {
  assignUser,
  updateCurrentHpUser,
  updateUserPosition,
  updateUserStatus,
  userLevelUp,
  setCurrentHpUser,
  userTakeQuest,
  userReportQuest,
  removeUser,
  updateBasicStatus,
  addUserEquipment,
  removeUserEquipment,
} = userSlice.actions;
export const userReducer = userSlice.reducer;
