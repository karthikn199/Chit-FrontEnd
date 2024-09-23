import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import company from './company';
import basicMasters from './basicMasters';
import warehouseMasters from './warehouseMasters';
import RolesAndResponsibilities from './RolesAndResponsibilities';

const loginUserName = (localStorage.getItem('userName') || '').toLowerCase();
const loginUserType = localStorage.getItem('userType');
const storedScreens = JSON.parse(localStorage.getItem('screens')) || [];

// Valid screens that control the visibility of the 'inbound' menu
const validScreensForWarehouseMasters = ['customer', 'warehouse', 'bin type'];
const validScreensForInbound = ['pick request', 'grn', 'putaway'];
const validScreensForOutbound = ['buyer order', 'pick request', 'reverse pick', 'sales return', 'delivery challen'];

// Check if any valid screen exists in storedScreens
// const shouldDisplayInbound = storedScreens.some((screen) => validScreensForInbound.includes(screen.toLowerCase()));
// const shouldDisplayOutbound = storedScreens.some((screen) => validScreensForOutbound.includes(screen.toLowerCase()));

const menuItems = {
  items: [
    dashboard,
    ...(loginUserType === 'admin' ? [company, basicMasters, warehouseMasters, RolesAndResponsibilities] : [])
    // ...(loginUserType === 'admin' || shouldDisplayInbound ? [inbound] : []),
    // ...(loginUserType === 'admin' || shouldDisplayOutbound ? [outbound] : [])
  ]
};

export default menuItems;
