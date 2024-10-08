import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { listCustomers } from "../redux/actions/staffActions";
import { showCustomerDeleteAlert } from "../redux/slices/userSlices";

export default function CustomersList() {
  const dispatch = useDispatch();
  const { customersList, deleted } = useSelector((state) => state.user);
  const handleDelete = (id) => {
    dispatch(showCustomerDeleteAlert(id));
  };
  const columns = [
    {
      field: "id",
      headerName: "S/NO",
      width: 100,
      renderCell: (params) => {
        return (
          <h6 className='text-gray-600 uppercase my-auto'>{params.row.id}</h6>
        );
      },
    },
    {
      field: "username",
      headerName: "Customer",
      width: 150,
      renderCell: (params) => {
        return <h6 className='text-gray-600 my-auto'>{params.row.username}</h6>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      renderCell: (params) => {
        return <h6 className='text-gray-600 my-auto'>{params.row.email}</h6>;
      },
    },
    {
      field: "phone_no",
      headerName: "Phone No",
      width: 150,
      renderCell: (params) => {
        return <h6 className='text-gray-600 my-auto'>{params.row.contact}</h6>;
      },
    },
    {
      field: "orders",
      headerName: "Orders",
      width: 80,
      renderCell: (params) => {
        return (
          <h6 className='bg-red-500 px-2 py-1 rounded-md text-white flex justify-center items-center mx-auto'>
            11
          </h6>
        );
      },
    },
    {
      field: "points",
      headerName: "Points",
      width: 100,
      renderCell: (params) => {
        return (
          <h6 className='bg-green-400 px-2 py-1 rounded-md text-white my-auto mx-auto'>
            1000
          </h6>
        );
      },
    },
    {
      field: "created_at",
      headerName: "Date Joined",
      width: 150,
      renderCell: (params) => {
        const formattedDate = new Date(
          params.row.date_joined
        ).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        return (
          <h6 className='bg-slate-100 px-2 py-1 rounded-md text-blue-300 my-auto'>
            {formattedDate}
          </h6>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 80,
      renderCell: (params) => {
        return (
          <div className='w-full flex justify-center'>
            <div
              className='border text-red-400 cursor-pointer p-2 rounded'
              onClick={() => handleDelete(params.row.user_id)}
            >
              <DeleteIcon />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(listCustomers());
  }, [dispatch, deleted]);

  return (
    <div className=''>
      <div className='bg-white'>
        <DataGrid
          rows={customersList}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
          // checkboxSelection
          showColumnVerticalBorder
          showCellVerticalBorder
        />
      </div>
    </div>
  );
}
