import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';

export const CellTypeMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    active: true,
    cellCategory: ''
  });
  const [editId, setEditId] = useState('');

  const theme = useTheme();
  const anchorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({
    cellCategory: ''
  });
  const [listView, setListView] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const listViewColumns = [
    { accessorKey: 'cellType', header: 'Cell Category', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    console.log('LISTVIEW FIELD CURRENT VALUE IS', listView);
    getAllCellCategory();
  }, []);

  const getAllCellCategory = async () => {
    try {
      // const response = await axios.get(
      //   `${process.env.REACT_APP_API_URL}/api/warehousemastercontroller/getAllCellTypeByOrgId?orgId=${orgId}`
      // );
      const response = await apiCalls('get', `warehousemastercontroller/getAllCellTypeByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.cellTypeVO);
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getCellCategoryById = async (row) => {
    console.log('THE SELECTED cellCategory ID IS:', row.original.id);
    setListView(true);
    setEditId(row.original.id);
    try {
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/warehousemastercontroller/cellType/${row.original.id}`);

      const response = await apiCalls('get', `warehousemastercontroller/cellType/${row.original.id}`);

      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCellCategory = response.paramObjectsMap.cellTypeVO;

        setFormData({
          cellCategory: particularCellCategory.cellType,
          active: particularCellCategory.active === 'Active' ? true : false,
          id: particularCellCategory.id
        });
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
  //   const nameRegex = /^[A-Za-z ]*$/;

  //   if (name === 'cellCategory' && !codeRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else {
  //     setFormData({ ...formData, [name]: value.toUpperCase() });
  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    let errorMessage = '';

    if (name === 'cellCategory' && !codeRegex.test(value)) {
      errorMessage = 'Invalid Format';
    }

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      setFieldErrors({ ...fieldErrors, [name]: '' });
      const upperCaseValue = value.toUpperCase();
      setFormData({ ...formData, [name]: upperCaseValue });
      setTimeout(() => {
        if (e.target) {
          e.target.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  };

  const handleClear = () => {
    setFormData({
      cellCategory: '',
      active: true
    });
    setFieldErrors({
      cellCategory: ''
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.cellCategory) {
      errors.cellCategory = 'Cell Category is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        celltype: formData.cellCategory,
        orgId: orgId,
        createdby: loginUserName
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const result = await apiCalls('put', 'warehousemastercontroller/createUpdateCellType', saveFormData);

        if (result.status === true) {
          console.log('Response:', result);

          showToast('success', editId ? ' Cell Category Updated Successfully' : 'Cell Category created successfully');

          handleClear();
          getAllCellCategory();
        } else {
          showToast('error', result.paramObjectsMap.errorMessage || 'Cell Category creation failed');
        }
      } catch (err) {
        console.log('error', err);
        showToast('error', 'Cell Category creation failed');
      } finally {
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleClose = () => {
    setEditMode(false);
    setFormData({
      country: '',
      cellCategory: ''
    });
  };

  const handleCheckboxChange = (event) => {
    setFormData({
      ...formData,
      active: event.target.checked
    });
  };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton
              title="Save"
              icon={SaveIcon}
              isLoading={isLoading}
              onClick={() => handleSave()}
              margin="0 10px 0 10px"
            /> &nbsp;{' '}
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true} // DISAPLE THE MODAL IF TRUE
              toEdit={getCellCategoryById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Cell Category"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="cellCategory"
                  value={formData.cellCategory}
                  onChange={handleInputChange}
                  error={!!fieldErrors.cellCategory}
                  helperText={fieldErrors.cellCategory}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleCheckboxChange} />}
                  label="Active"
                  labelPlacement="end"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <div>
        <ToastComponent />
      </div>
    </>
  );
};
export default CellTypeMaster;
