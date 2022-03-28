import { applyMiddleware, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { IDataReciept, IUser } from "../InterfaceGlobals/globalsInterface";
import moment from "moment";

export interface IInitialState {
  receipt: IDataReciept;
  currentUser: IUser;
}

export const initialState: IInitialState = {
  receipt: {
    title: "",
    address: "",
    consecutive: 0,
    createDate: moment().fromNow(),
    idPublic: "",
    isModifiedReceipt: false,
    dateModified: "",
    person: { username: "" },
    personModified: { username: "" },
    price: 0,
    peso: 0,
    unitPrice: 0,
  },
  currentUser: { username: "" },
};

type ActionType = { type: "ADD_RECEIPT"; payload: any };

export const reducer: any = (state = initialState, action: ActionType) => {
  if (action.type === "ADD_RECEIPT") {
    return { ...state, receipt: action.payload };
  }
  return state;
};

const middlewareEnhancer = applyMiddleware(thunkMiddleware);
const composedEnhancers = compose(middlewareEnhancer);

export const store = createStore(reducer, composedEnhancers);
