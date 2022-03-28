export interface IResponse {
  status: boolean;
  message: string;
  error: boolean;
}

export interface IResponseToken {
  username: string;
  token: string;
  status: boolean;
}
export interface IUser {
  username: string;
}

export interface IDataReciept {
  idPublic: string;
  person: IUser;
  title: string;
  peso?: number;
  consecutive: number;
  price: number;
  unitPrice?: number;
  address: string;
  isModifiedReceipt: boolean;
  personModified: IUser;
  dateModified: any;
  createDate: any;
}
