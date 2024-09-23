import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import RolesandResponsibilitySetup from 'views/pages/rolesandResponsibility/RolesandResponsibilitySetup';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const CreateCompany = Loadable(lazy(() => import('views/pages/companySetup/CreateCompany')));
const CompanySetup = Loadable(lazy(() => import('views/pages/companySetup/CompanySetup')));
const CountryMaster = Loadable(lazy(() => import('views/pages/basic-masters/CountryMaster')));
const StateMaster = Loadable(lazy(() => import('views/pages/basic-masters/StateMaster')));
const CityMaster = Loadable(lazy(() => import('views/pages/basic-masters/CityMaster')));

const EmployeeMaster = Loadable(lazy(() => import('views/pages/warehouse-masters/EmployeeMaster')));
const UserCreationMaster = Loadable(lazy(() => import('views/pages/warehouse-masters/UserCreationMaster')));
const DepartmentMaster = Loadable(lazy(() => import('views/pages/warehouse-masters/DepartmentMaster')));
const DesignationMaster = Loadable(lazy(() => import('views/pages/warehouse-masters/DesignationMaster')));
const CurrencyMaster = Loadable(lazy(() => import('views/pages/basic-masters/CurrencyMaster')));
const RegionMaster = Loadable(lazy(() => import('views/pages/basic-masters/RegionMaster')));

const FinYearMaster = Loadable(lazy(() => import('views/pages/warehouse-masters/FinYearMaster')));
const Roles = Loadable(lazy(() => import('views/pages/rolesandResponsibility/Roles')));
const ScreenNames = Loadable(lazy(() => import('views/pages/rolesandResponsibility/ScreenNames')));

const WMSRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/companysetup/createcompany',
      element: <CreateCompany />
    },
    {
      path: '/companysetup/companysetup',
      element: <CompanySetup />
    },
    {
      path: '/basicmasters/countrymaster',
      element: <CountryMaster />
    },
    {
      path: '/basicmasters/statemaster',
      element: <StateMaster />
    },
    {
      path: '/basicmasters/citymaster',
      element: <CityMaster />
    },

    {
      path: '/warehousemasters/employeemaster',
      element: <EmployeeMaster />
    },
    {
      path: '/warehousemasters/usercreationmaster',
      element: <UserCreationMaster />
    },

    {
      path: '/rolesresponsibility/rolesandresponse',
      element: <RolesandResponsibilitySetup />
    },
    {
      path: '/rolesresponsibility/screennames',
      element: <ScreenNames />
    },
    {
      path: '/warehousemasters/departmentmaster',
      element: <DepartmentMaster />
    },
    {
      path: '/warehousemasters/designationmaster',
      element: <DesignationMaster />
    },

    {
      path: '/basicmasters/currencymaster',
      element: <CurrencyMaster />
    },
    {
      path: '/basicmasters/regionmaster',
      element: <RegionMaster />
    },
    {
      path: '/warehousemasters/finyearmaster',
      element: <FinYearMaster />
    }
  ]
};

export default WMSRoutes;
