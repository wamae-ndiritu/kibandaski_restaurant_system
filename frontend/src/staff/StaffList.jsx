import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { listStaff } from "../redux/actions/staffActions";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "../redux/slices/staffSlices";

export default function StaffList() {
  const dispatch = useDispatch();
  const { staffList, deleted } = useSelector((state) => state.staff);

  const columns = [
    {
      field: "id",
      headerName: "S/NO",
      width: 30,
      renderCell: (params) => {
        return (
          <h6 className='text-gray-600 uppercase my-auto'>{params.row.id}</h6>
        );
      },
    },
    {
      field: "fullName",
      headerName: "Full Names",
      width: 150,
      renderCell: (params) => {
        return (
          <h6 className='text-gray-600 my-auto'>
            {params.row.first_name + " " + params.row.last_name}
          </h6>
        );
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
      field: "id_no",
      headerName: "ID No",
      width: 100,
      renderCell: (params) => {
        return (
          <h6 className='text-gray-600 my-auto'>{params.row.id_number}</h6>
        );
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
      field: "role",
      headerName: "Role",
      width: 130,
      renderCell: (params) => {
        return (
          <>
            {params.row.role === "Chef" ? (
              <h6 className='bg-green-500 w-2/3 px-2 py-1 rounded-md text-white flex justify-center items-center'>
                Chef/Cook
              </h6>
            ) : (
              <h6 className='bg-red-500 w-2/3 px-2 py-1 rounded-md text-white flex justify-center items-center'>
                Waiter
              </h6>
            )}
          </>
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
      width: 120,
      renderCell: (params) => {
        return (
          <div className='w-full flex gap-3'>
            <Link
              to={`/staff/${params.row.id}/edit`}
              className='border text-green-400 cursor-pointer p-2 rounded'
            >
              <EditIcon />
            </Link>
            <div
              className='border text-red-400 cursor-pointer p-2 rounded'
              onClick={() => handleDeleteStaff(params.row.user_id)}
            >
              <DeleteIcon />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(listStaff());
  }, [dispatch, deleted]);

  const handleDeleteStaff = (id) => {
    dispatch(showAlert(id));
  };

  return (
    <div className=''>
      <div className='bg-white'>
        <DataGrid
          rows={staffList}
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
