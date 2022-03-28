import { IDataReciept, IUser } from "../InterfaceGlobals/globalsInterface";

const addReceipt = (payload: IDataReciept) => {
  return {
    type: "ADD_RECEIPT",
    payload: payload,
  };
};

export { addReceipt };
