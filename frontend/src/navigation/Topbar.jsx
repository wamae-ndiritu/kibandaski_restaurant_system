import React from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const TopBar = () => {
  return (
    <>
      <header className='bg-slate-50 sticky top-0 z-30 shadow-sm flex justify-between md:items-center p-4 big-screen-top'>
        <div className='flex flex-col md:flex-row items-center md:gap-8 '>
          <h1 className='text-xl md:text-2xl font-semibold my-auto'>
            KIBANDASKI
          </h1>
          <div className='w-full flex gap-1 topbar-search'>
            <input
              type='text'
              className='w-4/5 border focus:outline-none px-2 py-1 rounded text-md'
              placeholder='Search here...'
            />
            <button className='border rounded bg-amber-400 w-1/5'>
              <SearchOutlinedIcon />
            </button>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='relative md:w-8 md:h-8 rounded-full sm:bg-slate-200 flex items-center justify-center'>
            <ShoppingBasketIcon />
            <span className='w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white absolute top-0 right-0 text-sm badge'>
              0
            </span>
          </div>
          <div className='relative  md:w-8 md:h-8 rounded-full sm:bg-slate-200 flex items-center justify-center'>
            <NotificationsOutlinedIcon />
            <span className='w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white absolute top-0 right-0 text-sm badge'>
              1
            </span>
          </div>
          <div className='md:w-8 md:h-8 rounded-full sm:bg-slate-200 flex items-center justify-center settings-icon'>
            <SettingsOutlinedIcon />
          </div>
          <div>
            <img
              src='/assets/wamae.png'
              alt='logo'
              className='w-12 h-12 rounded-full img-cover border'
            />
          </div>
          <div className='profile-info'>
            <h4 className='my-0 font-semibold'>Wamae N</h4>
            <p className='py-0 text-gray-700'>Admin</p>
          </div>
        </div>
      </header>
    </>
  );
};

export default TopBar;
