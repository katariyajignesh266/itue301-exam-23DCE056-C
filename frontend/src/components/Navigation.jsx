import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        MedCare<span>Plus</span>
      </div>
      <div className="navbar-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Home
        </NavLink>
        <NavLink 
          to="/doctors" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Doctors
        </NavLink>
        <NavLink 
          to="/booking" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Book Appointment
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
