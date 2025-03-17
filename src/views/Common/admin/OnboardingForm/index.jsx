import React, { useState } from 'react';
import axios from 'axios';
import FlicToaster from '../../../../utils/FlicToaster';
import { countries } from '../../../../data/countries';
import { getLocalStorageUserToken } from '../../../../utils/UserLocalStorageHelper';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EmpowerverseLogo from '../../../../images/empowerverse.png';
import './styles.scss';

const Tooltip = ({ text }) => (
  <div className="tooltip">
    <span className="tooltip-text">{text}</span>
  </div>
);

const OnboardingForm = () => {
  const [formData, setFormData] = useState({
    project_key: '',
    project_name: '',
    project_description: '',
    project_weburl: '',
    standalone_app_deeplink: '',
    country: '',
    selectedOptions: {
      needDeepLinks: false,
      wantToUseGoogleLogin: false,
      isCountrySpecific: false
    }
  });

  const [files, setFiles] = useState({
    image: null,
    google_auth_creds: null
  });

  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'project_name') {
      const regex = /^[a-zA-Z0-9\s]*$/;
      if (!regex.test(value)) {
        setError('Project name can only contain letters, numbers, and spaces.');
        return;
      } else {
        setError('');
      }

      const project_key = value.toLowerCase().replace(/\s+/g, '_').slice(0, 20);
      setFormData(prev => ({ ...prev, project_key }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: fileList[0]
    }));
  };

  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    const selectedCountry = countries.find(country => country.code === selectedCountryCode);
    
    setFormData(prev => ({
      ...prev,
      country: selectedCountry ? selectedCountry.name : ''
    }));
  };

  const handleOptionSelect = (option) => {
    setFormData(prev => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        [option]: !prev.selectedOptions[option]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error) {
      FlicToaster.error(error);
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      const apiFields = [
        'project_key',
        'project_name',
        'project_description',
        'project_weburl',
        'standalone_app_deeplink',
        'country',
        'enable_deep_linking',
        'enable_google_auth',
        'country_specific',
        'selected_country'
      ];

      apiFields.forEach(key => {
        if (formData[key] !== undefined) {
          formDataToSend.append(key, typeof formData[key] === 'boolean' ? formData[key].toString() : formData[key]);
        }
      });

      formDataToSend.append('enable_deep_linking', formData.selectedOptions.needDeepLinks.toString());
      formDataToSend.append('enable_google_auth', formData.selectedOptions.wantToUseGoogleLogin.toString());
      formDataToSend.append('country_specific', formData.selectedOptions.isCountrySpecific.toString());
      formDataToSend.append('selected_country', formData.country);

      if (files.image) {
        formDataToSend.append('project_logo', files.image);
      }
      if (files.google_auth_creds) {
        formDataToSend.append('google_auth_credentials', files.google_auth_creds);
      }

      const token = getLocalStorageUserToken();
      const response = await axios.post('/projects', formDataToSend, {
        headers: {
          'Flic-Token': token,
          'Content-Type': 'multipart/form-data'
        }
      });

      FlicToaster.success('Project created successfully!');
      resetForm();
      navigate('/profile');

    } catch (error) {
      console.error('Error response:', error.response);
      FlicToaster.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      project_key: '',
      project_name: '',
      project_description: '',
      project_weburl: '',
      standalone_app_deeplink: '',
      country: '',
      selectedOptions: {
        needDeepLinks: false,
        wantToUseGoogleLogin: false,
        isCountrySpecific: false
      }
    });
    setFiles({
      image: null,
      google_auth_creds: null
    });
  };

  return (
    <div className="onboarding-form-container">
      <h2>Project Onboarding</h2>
      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="form-group">
          <label>Project Name *</label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleInputChange}
            required
            placeholder="Enter project name"
          />
          {error && <small className="error-message">{error}</small>}
        </div>

        <div className="form-group">
          <label>Project Key</label>
          <input
            type="text"
            name="project_key"
            value={formData.project_key}
            readOnly
            className="readonly"
          />
          <small>Auto-generated from project name</small>
        </div>

        <div className="form-group">
          <label>Project Description</label>
          <textarea
            name="project_description"
            value={formData.project_description}
            onChange={handleInputChange}
            placeholder="Enter project description"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group file-group">
            <div className="file-upload-container">
              <label className="custom-file-upload">Project Logo
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="file-input" style={{ border: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="additionals-section">
          <label>Additionals
            <span className="info-icon" onMouseOver={() => setShowTooltip(true)} onMouseOut={() => setShowTooltip(false)}>
              ?
            </span>
            {showTooltip && <Tooltip text="Select options to enable additional features." />}
          </label>
          <div className="options-row">
            <button
              type="button"
              className={`option-button ${formData.selectedOptions.needDeepLinks ? 'selected' : ''}`}
              onClick={() => handleOptionSelect('needDeepLinks')}
            >
              Enable Deep Linking
            </button>
            <button
              type="button"
              className={`option-button ${formData.selectedOptions.wantToUseGoogleLogin ? 'selected' : ''}`}
              onClick={() => handleOptionSelect('wantToUseGoogleLogin')}
            >
              Enable Google Authentication
            </button>
            <button
              type="button"
              className={`option-button ${formData.selectedOptions.isCountrySpecific ? 'selected' : ''}`}
              onClick={() => handleOptionSelect('isCountrySpecific')}
            >
              Country Specific
            </button>
          </div>

          {(formData.selectedOptions.needDeepLinks || 
            formData.selectedOptions.wantToUseGoogleLogin || 
            formData.selectedOptions.isCountrySpecific) && (
            <div className="selected-options-fields">
              {formData.selectedOptions.needDeepLinks && (
                <div className="form-group">
                  <label>Project Web URL *</label>
                  <input
                    type="url"
                    name="project_weburl"
                    value={formData.project_weburl}
                    onChange={handleInputChange}
                    required
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {formData.selectedOptions.wantToUseGoogleLogin && (
                <div className="form-group">
                  <label>Google Auth Credentials *</label>
                  <input
                    type="file"
                    name="google_auth_creds"
                    onChange={handleFileChange}
                    required
                    className="file-input"
                  />
                </div>
              )}

              {formData.selectedOptions.isCountrySpecific && (
                <div className="form-group">
                  <label>Select Country *</label>
                  <select
                    name="country"
                    value={countries.find(c => c.name === formData.country)?.code || ''}
                    onChange={handleCountryChange}
                    required
                    className="country-select"
                  >
                    <option value="" disabled>
                      Choose select country
                    </option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="loader-container">
            <img
              src={EmpowerverseLogo}
              alt="Loading..."
              className="loader-image"
              height="80"
            />
          </div>
        ) : (
          <button type="submit" className="submit-button">
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default OnboardingForm; 