import Download from "@mui/icons-material/Download";
import Save from "@mui/icons-material/Save";

import Add from "@mui/icons-material/Add";
import Cancel from "@mui/icons-material/Cancel";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import ImportExport from "@mui/icons-material/ImportExport";
import { Box, Button, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridPreProcessEditCellProps,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import Papa from "papaparse";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

type ColumnType = {
  isValid?: (value: unknown) => boolean;
  name: string;
  width?: number;
  headerName: string;
  editable?: boolean;
};

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  columns: ColumnType[];
  data: any[];
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, columns, data } = props;

  const handleClick = () => {
    setRows((oldRows) => {
      let id = oldRows.length + 1;

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }));

      return [...oldRows, { id, isNew: true }];
    });
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImport = () => {
    inputRef.current?.click();
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    let fileReader = new FileReader();

    fileReader.onload = function (ev: ProgressEvent<FileReader>) {
      const text = ev.target?.result;

      if (typeof text === "string") {
        let csv = Papa.parse(text, { header: true });

        for (let column of columns) {
          if (!csv.meta.fields?.includes(column.name)) {
            enqueueSnackbar(
              <FormattedMessage
                id="invalid.file.column.column.is.missing"
                defaultMessage="Invalid file: column {column} is missing"
                values={{ column: column.name }}
              />,
              { variant: "error" }
            );
            return;
          }
        }

        let newRows = csv.data.map((line: any, index: number) => {
          return {
            id: index.toString(),
            ...line,
            isNew: false,
          };
        });

        setRows((old) => newRows);
      }
    };

    let file = e.target.files ? e.target.files[0] : null;

    if (file) {
      fileReader.readAsText(file);
    }
  };

  const handleExport = () => {
    let lines: string[] = [];

    lines.push(columns.map((c) => c.name).join(","));

    for (let line of data) {
      let csvLine = Object.values(line).join(",");

      lines.push(csvLine);
    }

    let csvStr = lines.join("\n");

    let csvContent = "data:text/csv;charset=utf-8," + csvStr;

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");

    document.body.appendChild(link); // Required for FF

    link.click();
  };

  return (
    <>
      <input
        style={{ display: "none" }}
        type="file"
        ref={inputRef}
        onChange={handleChangeFile}
        accept=".csv"
      />
      <GridToolbarContainer>
        <Button color="primary" startIcon={<Add />} onClick={handleClick}>
          <FormattedMessage id="add.record" defaultMessage="Add record" />
        </Button>
        <Button
          color="primary"
          startIcon={<ImportExport />}
          onClick={handleImport}
        >
          <FormattedMessage id="import" defaultMessage="Import" />
        </Button>
        <Button onClick={handleExport} startIcon={<Download />}>
          <FormattedMessage id="export" defaultMessage="Export" />
        </Button>
      </GridToolbarContainer>
    </>
  );
}

export interface AppDataTableProps<T extends { id?: string; isNew?: boolean }> {
  data: any[];
  dataColumns: ColumnType[];
  onChange: (value: any) => void;
  onEditRow?: (id: GridRowId, edit: boolean) => void;
}

export default function AppDataTable<
  Z extends { id?: string; isNew?: boolean },
>({ data, dataColumns, onChange, onEditRow }: AppDataTableProps<Z>) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [rows, setRows] = useState<Z[]>(
    data.map((item, index) => {
      return { ...item, isNew: false, id: index.toString() };
    })
  );

  useEffect(() => {
    onChange(
      rows.map((row: any) => {
        let newRow = { ...row };

        delete newRow.id;
        delete newRow.isNew;

        return newRow;
      })
    );
  }, [rows]);

  const handleEditClick = (id: GridRowId) => () => {
    if (onEditRow) {
      onEditRow(id, true);
    }
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    if (onEditRow) {
      onEditRow(id, false);
    }
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row: any) => row.id !== id));
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row: any) => row.id === id);

    if (editedRow!.isNew) {
      setRows(rows.filter((row: any) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel<Z>) => {
    const updatedRow: Z = { ...newRow, isNew: false };

    setRows(rows.map((row: Z) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  const columns: GridColDef[] = useMemo(() => {
    return [
      ...dataColumns.map((column): GridColDef => {
        return {
          field: column.name,
          headerName: column.headerName,
          editable: column.editable,
          width: column.width,
          preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
            if (column.isValid && params.props.value !== undefined) {
              const hasError = !column.isValid(params.props.value);

              return { ...params.props, error: hasError };
            }

            return { ...params.props };
          },
        };
      }),
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }: { id: GridRowId }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <Tooltip
                title={
                  <FormattedMessage
                    id={"save.column"}
                    defaultMessage={"Save column"}
                  ></FormattedMessage>
                }
              >
                <GridActionsCellItem
                  icon={<Save />}
                  label="Save"
                  sx={{
                    color: "primary.main",
                  }}
                  onClick={handleSaveClick(id)}
                />
              </Tooltip>,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <Tooltip
              title={
                <FormattedMessage
                  id={"edit.column"}
                  defaultMessage={"Edit column"}
                ></FormattedMessage>
              }
            >
              <GridActionsCellItem
                icon={<Edit />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />
            </Tooltip>,
            <Tooltip
              title={
                <FormattedMessage
                  id={"delete.column"}
                  defaultMessage={"Delete column"}
                ></FormattedMessage>
              }
            >
              <GridActionsCellItem
                icon={<Delete />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="error"
              />
            </Tooltip>,
          ];
        },
      },
    ];
  }, [
    dataColumns,
    handleSaveClick,
    handleDeleteClick,
    handleCancelClick,
    rowModesModel,
  ]);

  return (
    <Box sx={{ minHeight: 100, width: "100%" }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: {
            setRows,
            setRowModesModel,
            columns: dataColumns,
            data: rows.map((row: Z) => {
              let newRow = { ...row };

              delete newRow.id;
              delete newRow.isNew;

              return newRow;
            }),
          },
        }}
      />
    </Box>
  );
}
