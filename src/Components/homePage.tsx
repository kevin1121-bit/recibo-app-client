import {
  DataGrid,
  GridColDef,
  GridOverlay,
  GridSelectionModel,
} from "@mui/x-data-grid";
import { Button, Container, Grid } from "@mui/material";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { addReceipt } from "../Redux/actions";
import { GridRowId } from "@material-ui/data-grid";

const GET_RECEIPT = gql`
  query GetReceipt {
    getReceipt {
      idPublic
      title
      consecutive
      peso
      createDate
      price
      unitPrice
      address
      isModifiedReceipt
      person {
        username
      }
      personModified {
        username
      }
      dateModified
    }
  }
`;

const columns: GridColDef[] = [
  { field: "idPublic", hide: true },
  {
    field: "title",
    headerName: "Title",
    width: 140,
    editable: true,
  },
  {
    field: "peso",
    headerName: "Peso",
    width: 80,
    type: "number",
  },
  {
    field: "createDate",
    headerName: "Date created",
    type: "date",
    width: 130,
  },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    width: 80,
  },
  {
    field: "unitPrice",
    headerName: "Unit Price(kg)",
    type: "number",
    width: 120,
  },
  {
    field: "person",
    headerName: "Created by",
    width: 130,
  },
  {
    field: "address",
    headerName: "Address",
    width: 130,
  },
  {
    field: "isModifiedReceipt",
    headerName: "Modified",
    width: 80,
  },
  {
    field: "personModified",
    headerName: "Modified by",
    width: 140,
  },
  {
    field: "dateModified",
    headerName: "Modified date",
    width: 140,
  },
];

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}
interface IUser {
  username: string;
}

type IDataReceipt = {
  idPublic: string;
  title: string;
  peso?: number;
  consecutive: number;
  price: number;
  unitPrice?: number;
  address: string;
  person: IUser;
  isModifiedReceipt: boolean;
  personModified: IUser;
  dateModified: Date;
  createDate: any;
};

interface IDataRowsReceipt {
  idPublic: string;
  person: string;
  title: string;
  peso?: number | string;
  consecutive: number;
  price: number;
  unitPrice?: number | string;
  address: string;
  isModifiedReceipt: string;
  personModified: string;
  dateModified: any;
  createDate: any;
}

interface IGetDataReceipt {
  getReceipt: IDataReceipt[];
}

function HomePage() {
  const { data, loading, refetch } = useQuery<IGetDataReceipt>(GET_RECEIPT);
  const [dataRowReceipt, setDataRowReceipt] = useState<IDataRowsReceipt[]>([]);
  const [dataReceipt, setDataReceipt] = useState<IDataReceipt[]>([]);
  const dispatch = useDispatch();
  const onAddReceipt = useCallback(
    (payload: IDataReceipt) => dispatch(addReceipt(payload)),
    [dispatch]
  );

  useEffect(() => {
    if (!loading) {
      if (data?.getReceipt) {
        setDataReceipt(data.getReceipt);
      }
    }
  }, [data, loading]);

  useEffect(() => {
    if (dataReceipt.length !== 0) {
      let objRow: IDataRowsReceipt;
      const arrayRow: IDataRowsReceipt[] = [];
      dataReceipt.forEach((element: IDataReceipt) => {
        objRow = {
          ...element,
          createDate: moment(element.createDate).format("ll"),
          person: element.person.username,
          personModified: element?.personModified?.username || "",
          dateModified: moment(element.dateModified).format("ll") || "",
          isModifiedReceipt: element.isModifiedReceipt ? "Si" : "No",
          peso: element?.peso && element?.peso > 0 ? element?.peso : "",
          unitPrice:
            element?.unitPrice && element?.unitPrice > 0
              ? element.unitPrice
              : "",
        };
        arrayRow.push(objRow);
      });
      setDataRowReceipt(arrayRow);
    }
  }, [dataReceipt]);

  const handleChangeIdReceipt = (receiptId: GridRowId) => {
    if (receiptId) {
      const dataArray = dataReceipt.filter(
        (value: IDataReceipt) => value.idPublic === receiptId.toString()
      );
      onAddReceipt(dataArray[0]);
    }
  };

  return (
    <Container maxWidth={"xl"}>
      <Grid item xs={12} sx={{ textAlign: "center", my: 2 }}>
        <Button onClick={() => refetch()} variant='outlined'>
          Update
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ height: "65.9vh", my: 1 }}>
        <DataGrid
          rows={dataRowReceipt}
          columns={columns}
          autoPageSize={true}
          getRowId={(row) => row.idPublic}
          onSelectionModelChange={(selectionModel: GridSelectionModel) =>
            selectionModel && handleChangeIdReceipt(selectionModel[0])
          }
          components={{
            LoadingOverlay: CustomLoadingOverlay,
          }}
          loading={loading}
        />
      </Grid>
    </Container>
  );
}

export default HomePage;
