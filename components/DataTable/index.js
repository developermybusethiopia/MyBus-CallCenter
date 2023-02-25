import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { usePassengerContext } from '../../utils/PassengerTripContext';

const columns = [
  { field: 'carrier',headerName: 'Carrier',width: 200 },
  { field: 'departure', headerName: 'Departure', width: 200 },
  { field: 'destination', headerName: 'Destination', width: 200 },
  { field: 'date', headerName: 'Date', width: 200 },
  { field: 'price', headerName: 'Price', width: 200 }
];

export default function DataTable({rowData}) {
  const {selectTrip} = usePassengerContext()
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rowData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onCellClick={selectTrip}
      />
    </div>
  );
}
