import React, { useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/userActions";
import { closeSidebar, toggleSidebar } from "../redux/slices/navSlices";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const Sidebar = ({ links }) => {
  const { isCollapsed } = useSelector((state) => state.nav);
  const dispatch = useDispatch();
  const ref = useRef(null);

  const pathname = useLocation().pathname;

  const handleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (window.innerWidth < 526) {
      dispatch(closeSidebar());
    }
  }, [dispatch, pathname]);

  function dropdown() {
    document.querySelector("#submenu").classList.toggle("hidden");
    document.querySelector("#arrow").classList.toggle("rotate-0");
  }

  // useEffect(() => {
  //   dropdown()
  // }, [])

  return (
    <aside
      className={`bg-amber-600 shadow ${
        isCollapsed ? "w-collapse" : "w-not-collapse"
      } ${
        isCollapsed ? "z-0" : "absolute z-40"
      } md:relative md:z-0 h-screen overflow-y-scroll scrollbar-hide left-0 top-0 transition-all duration-300 ease-in-out`}
      ref={ref}
    >
      <div className='sticky top-0 bg-slate-50 border-b-2 border-r-2 p-2 flex gap-4'>
        <div className='h-16 flex items-center justify-center text-xl'>
          {!isCollapsed && (
            <h6 className='text-yellow-400 font-semibold'>DASHBOARD</h6>
          )}
          <div
            className={`h-8 w-12 flex justify-center items-center cursor-pointer text-yellow-400 `}
            onClick={handleSidebar}
          >
            {isCollapsed ? <FaAngleRight /> : <FaAngleLeft />}
          </div>
        </div>
      </div>
      {/* Sidebar Content */}
      <div className='px-1 pb-4 mb-8 overflow-y-auto'>
        <ul className='mt-4'>
          {links.map((link) => {
            const { id, url, iconClass, title } = link;
            return (
              <li key={id}>
                <NavLink
                  to={`${url}`}
                  className={({ isActive }) =>
                    isActive
                      ? `w-full p-3 capitalize flex gap-2 items-center ${
                          isCollapsed ? "text-xl" : ""
                        } bg-slate-100 text-gray-700 rounded`
                      : `text-white w-full p-3 capitalize ${
                          !isCollapsed &&
                          "hover:bg-slate-100 hover:text-gray-700 hover:rounded"
                        } flex gap-2 items-center ${
                          isCollapsed ? "text-xl" : ""
                        }`
                  }
                  activeClassName='bg-slate-100 rounded'
                >
                  {/* <i
                    className={`${iconClass} mr-2 my-auto ${
                      isCollapsed ? "py-2" : "mr-2 text-base"
                    }`}
                  ></i>{" "} */}
                  {iconClass}
                  {!isCollapsed && <h6 className='my-auto'>{title}</h6>}
                </NavLink>
              </li>
            );
          })}
          <NavLink
            to='/orders'
            className={({ isActive, isPending }) =>
              isPending
                ? "pending"
                : isActive
                ? "bg-slate-100 text-green-700"
                : ""
            }
          >
            Home
          </NavLink>
        </ul>
        <div
          class='p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white'
          onClick={dropdown}
        >
          <i class='bi bi-chat-left-text-fill'></i>
          <div class='flex justify-between w-full items-center'>
            <span class='text-[15px] ml-4 text-gray-200 font-bold'>
              Inventory
            </span>
            <span class='text-sm rotate-180' id='arrow'>
              <IoIosArrowDropdownCircle />
            </span>
          </div>
        </div>
        <div
          class='text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold'
          id='submenu'
        >
          <h1 class='cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1'>
            Social
          </h1>
          <h1 class='cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1'>
            Personal
          </h1>
          <h1 class='cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1'>
            Friends
          </h1>
        </div>
      </div>
      {/* Collapse/Expand Button */}
      <div
        className={`fixed border-t-2 bottom-0 flex items-center justify-center cursor-pointer text-white bg-amber-600 py-2 transition-all duration-300 ease-in-out ${
          isCollapsed ? "text-xl w-collapse" : "hover:text-gray-800 w-48"
        }`}
        onClick={handleLogout}
      >
        <i
          className={`fas fa-sign-out-alt mr-2 ${
            isCollapsed ? "text-2xl" : "mr-2 text-base"
          }`}
        ></i>{" "}
        {/* Icon */}
        {!isCollapsed && "Logout"}
      </div>
    </aside>
  );
};

export default Sidebar;
