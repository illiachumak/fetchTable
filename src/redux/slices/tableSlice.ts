import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type TableRow = {
    id?: number;
    name: string;
    email: string;
    birthday_date: string;
    phone_number: string;
    address?: string;
};

type TableState = {
    data: TableRow[];
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | undefined;
    currentPage: number;
    limit: number;
};

type RejectionValue = {
    message: string;
};

const initialState: TableState = {
    data: [],
    loading: "idle",
    error: undefined,
    currentPage: 1,
    limit: 10,
};

export const fetchTableData = createAsyncThunk<TableRow[], { currentPage: number }, { rejectValue: RejectionValue }>(
    "table/fetchData",
    async ({ currentPage }) => {
       const limit = 10;
       const offset = (currentPage - 1) * limit;
       const response = await axios.get(`https://technical-task-api.icapgroupgmbh.com/api/table/?limit=${limit}&offset=${offset}`);
       return response.data.results as TableRow[];
    }
 );

export const createTableRow = createAsyncThunk<TableRow, TableRow, { rejectValue: RejectionValue }>(
    "table/createRow",
    async (row: TableRow) => {
        const response = await axios.post("https://technical-task-api.icapgroupgmbh.com/api/table/", row);
        return response.data as TableRow;
    }
);

export const getTableRow = createAsyncThunk<TableRow, number, { rejectValue: RejectionValue }>(
    "table/getRow",
    async (id: number) => {
        const response = await axios.get(`https://technical-task-api.icapgroupgmbh.com/api/table/${id}/`);
        return response.data as TableRow;
    }
);

export const updateTableRow = createAsyncThunk<TableRow, TableRow, { rejectValue: RejectionValue }>(
    "table/updateRow",
    async ({ id, ...row }: TableRow) => {
        const response = await axios.put(`https://technical-task-api.icapgroupgmbh.com/api/table/${id}/`, row);
        return response.data as TableRow;
    }
);

export const partialUpdateTableRow = createAsyncThunk<TableRow, TableRow, { rejectValue: RejectionValue }>(
    "table/partialUpdateRow",
    async ({ id, ...row }: TableRow) => {
        const response = await axios.patch(`https://technical-task-api.icapgroupgmbh.com/api/table/${id}/`, row);
        return response.data as TableRow;
    }
);

export const deleteTableRow = createAsyncThunk<number, number, { rejectValue: RejectionValue }>(
    "table/deleteRow",
    async (id: number) => {
        await axios.delete(`https://technical-task-api.icapgroupgmbh.com/api/table/${id}/`);
        return id;
    }
);

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            if(action.payload < 1){
                state.currentPage = 1
            } else{
               state.currentPage = action.payload 
            }
            
    },
    },   

    extraReducers: (builder) => {
        builder.addCase(fetchTableData.pending, (state) => {
            state.loading = "pending";
            state.error = undefined;
        });
        builder.addCase(fetchTableData.fulfilled, (state, action: PayloadAction<TableRow[]>) => {
            state.loading = "succeeded";
            state.data = action.payload;

        });
        builder.addCase(fetchTableData.rejected, (state, action) => {
            state.loading = "failed";
            state.error = action.error.message;
        });
        builder.addCase(createTableRow.fulfilled, (state, action: PayloadAction<TableRow>) => {
            state.data.push(action.payload);
        });
        builder.addCase(getTableRow.fulfilled, (state, action: PayloadAction<TableRow>) => {
            const index = state.data.findIndex((row) => row.id === action.payload.id);
            if (index !== -1) {
                state.data[index] = action.payload;
            } else {
                state.data.push(action.payload);
            }
        });
        builder.addCase(updateTableRow.fulfilled, (state, action: PayloadAction<TableRow>) => {
            const index = state.data.findIndex((row) => row.id === action.payload.id);
            if (index !== -1) {
                state.data[index] = action.payload;
            }
        });
        builder.addCase(partialUpdateTableRow.fulfilled, (state, action: PayloadAction<TableRow>) => {
            const index = state.data.findIndex((row) => row.id === action.payload.id);
            if (index !== -1) {
                state.data[index] = { ...state.data[index], ...action.payload };
            }
        });
        builder.addCase(deleteTableRow.fulfilled, (state, action: PayloadAction<number>) => {
            const index = state.data.findIndex((row) => row.id === action.payload);
            if (index !== -1) {
                state.data.splice(index, 1);
            }
        });
    },
});
export const { setCurrentPage } = tableSlice.actions;

export default tableSlice.reducer;
