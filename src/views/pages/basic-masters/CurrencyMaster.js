import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip, TextField, Checkbox, FormControlLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import axios from 'axios';
import { useRef, useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import { getAllActiveCountries, getAllActiveStatesByCountry } from 'utils/CommonFunctions';

export const CurrencyMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [countryList, setCountryList] = useState([]);

  const [formData, setFormData] = useState({
    currency: '',
    currencySymbol: '',
    subCurrency: '',
    country: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    currency: '',
    currencySymbol: '',
    subCurrency: '',
    country: ''
  });
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  useEffect(() => {
    getAllCurrencies();
    getAllCountries();
  }, []);

  const getAllCountries = async () => {
    try {
      const countryData = await getAllActiveCountries(orgId);
      setCountryList(countryData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value, checked } = e.target;
  //   const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
  //   const symbolRegex = /^[a-zA-Z₹$€]*$/;
  //   const nameRegex = /^[A-Za-z ]*$/;
  //   let errorMessage = '';

  //   switch (name) {
  //     case 'currency':
  //     case 'subCurrency':
  //       if (!nameRegex.test(value)) {
  //         errorMessage = 'Only alphabetic characters are allowed';
  //       }
  //       break;
  //     case 'currencySymbol':
  //       if (value.length > 1) {
  //         errorMessage = 'Invalid Format';
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   if (errorMessage) {
  //     setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  //   } else {
  //     if (name === 'active') {
  //       setFormData({ ...formData, [name]: checked });
  //     } else {
  //       setFormData({ ...formData, [name]: value.toUpperCase() });
  //     }

  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const symbolRegex = /^[a-zA-Z₹$€]*$/;
    const nameRegex = /^[A-Za-z ]*$/;
    let errorMessage = '';

    switch (name) {
      case 'currency':
      case 'subCurrency':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only alphabetic characters are allowed';
        }
        break;
      case 'currencySymbol':
        if (!symbolRegex.test(value) || value.length > 1) {
          errorMessage = 'Invalid Format';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: name === 'active' ? checked : value.toUpperCase()
      }));

      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Preserve the cursor position for text-based inputs
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  const handleClear = () => {
    setFormData({
      currency: '',
      currencySymbol: '',
      subCurrency: '',
      country: '',
      active: true
    });
    setFieldErrors({
      currency: '',
      currencySymbol: '',
      subCurrency: '',
      country: ''
    });
    setEditId('');
  };

  const getAllCurrencies = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/currency?orgid=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.currencyVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCurrencyById = async (row) => {
    console.log('THE SELECTED CURRENCY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `commonmaster/currency/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCurrency = response.paramObjectsMap.currencyVO;

        setFormData({
          currency: particularCurrency.currency,
          currencySymbol: particularCurrency.currencySymbol,
          country: particularCurrency.country,
          subCurrency: particularCurrency.subCurrency,
          active: particularCurrency.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.currencySymbol) {
      errors.currencySymbol = 'Currency Symbol is required';
    }
    if (!formData.country) {
      errors.country = 'Country is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        currency: formData.currency,
        currencySymbol: formData.currencySymbol,
        subCurrency: formData.subCurrency,
        country: formData.country,
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE', saveData);

      try {
        const response = await apiCalls('put', `commonmaster/createUpdateCurrency`, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' Currency Updated Successfully' : 'Currency created successfully');
          handleClear();
          getAllCurrencies();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Currency creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Currency creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const listViewColumns = [
    { accessorKey: 'currency', header: 'Currency', size: 140 },
    { accessorKey: 'currencySymbol', header: 'Currency Symbol', size: 140 },
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getCurrencyById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Currency"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  error={!!fieldErrors.currency}
                  helperText={fieldErrors.currency}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Currency Symbol"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="currencySymbol"
                  value={formData.currencySymbol}
                  onChange={handleInputChange}
                  error={!!fieldErrors.currencySymbol}
                  helperText={fieldErrors.currencySymbol}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Sub Currency"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="subCurrency"
                  value={formData.subCurrency}
                  onChange={handleInputChange}
                  error={!!fieldErrors.subCurrency}
                  helperText={fieldErrors.subCurrency}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.country}>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select labelId="country-label" label="Country" value={formData.country} onChange={handleInputChange} name="country">
                    {Array.isArray(countryList) &&
                      countryList?.map((row) => (
                        <MenuItem key={row.id} value={row.countryName}>
                          {row.countryName}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.country && <FormHelperText>{fieldErrors.country}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                  label="Active"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default CurrencyMaster;
