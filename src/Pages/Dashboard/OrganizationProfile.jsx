import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import OrganizationLocations from "./OrganizationLocations";
import { API_BASE } from "../../Config/api";
import { apiFetch } from "../../Utils/apiFetch";

const OrganizationProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    website_url: "",
    country_id: "",
    street_address: "",
    city: "",
    state_id: "",
    zip_code: "",
    phone: ""
  });

  const [metaData, setMetaData] = useState({
    countries: [],
    states: [],
    stats: { active_users: 0, total_roles: 0 },
    locations: [],
    logo_url: ""
  });

  const loadOrganizationData = async () => {
    try {
      const res = await apiFetch(`${API_BASE}api/organizations/view`);
      if (res.status) {
        const { organization, ...rest } = res.data;
        setFormData({
          company_name: organization.company_name || "",
          email: organization.email || "",
          website_url: organization.website_url || "",
          country_id: organization.country_id || "",
          street_address: organization.street_address || "",
          city: organization.city || "",
          state_id: organization.state_id || "",
          zip_code: organization.zip_code || "",
          phone: organization.phone || ""
        });
        setMetaData({
          countries: rest.countries || [],
          states: rest.states || [],
          stats: rest.stats || { active_users: 0, total_roles: 0 },
          locations: rest.locations || [],
          logo_url: organization.logo_url || ""
        });
      }
    } catch (err) {
      console.error("Failed to load organization data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizationData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --------------------------------------------------
  // SAVE DATA: multipart/form-data implementation
  // --------------------------------------------------
  const handleSave = async () => {
    if (!formData.company_name) {
      return Swal.fire("Required", "Company Name is mandatory.", "info");
    }

    setSaving(true);
    
    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      dataToSend.append(key, formData[key]);
    });

    const logoFileInput = document.getElementById("logoUpload");
    if (logoFileInput && logoFileInput.files[0]) {
      dataToSend.append("logo", logoFileInput.files[0]);
    }

    try {
      const res = await apiFetch(`${API_BASE}api/organizations/update`, {
        method: "PUT",
        body: dataToSend,
        isFormData: true 
      });

      if (res.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message || 'Profile updated successfully!',
          timer: 1500, // Reduced timer slightly for snappier feel
          showConfirmButton: false,
        }).then(() => {
          // --- PAGE REFRESH IMPLEMENTATION ---
         // window.location.reload(); 
        });
      } else {
        Swal.fire("Error", res.message || "Failed to update profile", "error");
      }
    } catch (err) {
      Swal.fire("Error", "A server error occurred.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-5 text-center">Loading Profile...</div>;

  return (
    <div className="">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-600">Organization Profile</h4>
        <button className="btn btn-sm btn-primary px-4" onClick={handleSave} disabled={saving}>
          <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'} me-1`}></i> 
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="row mb-2">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 d-flex flex-row align-items-center p-3 rounded-6">
            <div className="bg-primary text-white rounded-6 p-3 me-3"><i className="fas fa-users fa-lg"></i></div>
            <div>
              <small className="text-muted d-block fw-bold" style={{ fontSize: '10px' }}>ACTIVE USERS</small>
              <h5 className="mb-0 fw-bold">{metaData.stats.active_users}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 d-flex flex-row align-items-center p-3 rounded-6">
            <div className="bg-info text-white rounded-6 p-3 me-3"><i className="fas fa-user-shield fa-lg"></i></div>
            <div>
              <small className="text-muted d-block fw-bold" style={{ fontSize: '10px' }}>TOTAL ROLES</small>
              <h5 className="mb-0 fw-bold">{metaData.stats.total_roles}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-3 rounded-6">
            <div className="card-header bg-white border-bottom fw-bold">
               <i className="fas fa-pen me-2 text-primary"></i> General Details
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label className="form-label fw-bold">Company Name <span className="text-danger">*</span></label>
                <input type="text" name="company_name" className="form-control" value={formData.company_name} onChange={handleChange} />
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Contact Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Website URL</label>
                  <input type="text" name="website_url" className="form-control" value={formData.website_url} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4 rounded-6">
            <div className="card-header bg-white py-3 border-bottom fw-bold">
               <i className="fas fa-map-marker-alt me-2 text-primary"></i> Contact Address
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label className="form-label fw-bold">Country / Region</label>
                <select name="country_id" disabled className="form-select" value={formData.country_id} onChange={handleChange}>
                  <option value="">Select Country</option>
                  {metaData.countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Street Address</label>
                <textarea name="street_address" className="form-control" rows="2" value={formData.street_address} onChange={handleChange}></textarea>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">City</label>
                  <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">State</label>
                  <select name="state_id" className="form-select" value={formData.state_id} onChange={handleChange}>
                    <option value="">Select State</option>
                    {metaData.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">ZIP Code</label>
                  <input type="text" name="zip_code" className="form-control" value={formData.zip_code} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                  <label className="form-label fw-bold">Contact Phone</label>
                  <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-4 rounded-6">
             <div className="card-header bg-white py-2 border-bottom text-center fw-bold">Company Logo</div>
             <div className="card-body text-center py-4">
               <div className="mb-3 border rounded p-2 d-inline-block">
                 <img 
                    src={metaData.logo_url || "http://admin.hansona.com/static/sbadmin/dist/img/sb_logo.png"} 
                    alt="Logo" 
                    style={{ height: '80px', width: '100%', objectFit: 'contain' }} 
                 />
               </div>
               <div className="input-group input-group-sm">
                 <input type="file" className="form-control" id="logoUpload" accept="image/*" />
               </div>
             </div>
          </div>
        </div>
      </div>

      <OrganizationLocations locations={metaData.locations} />
    </div>
  );
};

export default OrganizationProfile;