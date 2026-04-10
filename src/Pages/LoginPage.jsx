import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useAuth } from "../Context/AuthContext";
import full_logo_img from "../../src/Assets/dist/img/sb_logo_full.jpg";
import apiFetch from "../Utils/apiFetch";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../Config/api";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const redirectTo = params.get("redirectTo") || "/dashboard";
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(false);

    try {
      const data = await apiFetch(API_ENDPOINTS.API_LOGIN, {
        method: "POST",
        body: {
          username: email,
          password: password,
        },
        skipAuthRefresh: true,
      });

      if (data?.status === "success") {
        login();
        navigate(decodeURIComponent(redirectTo), { replace: true });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      const msg =  "Invalid credentials";

      setLoginError(true);
      Swal.close();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Invalid email or password",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#f8d7da",   // light red
        color: "#842029",        // dark red text
        iconColor: "#842029",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">

            {/* Logo */}
            <div className="text-center mb-4">
              <img
                src={full_logo_img}
                alt="ShopperBeats Logo"
                className="img-fluid mb-3"
                style={{ maxHeight: "60px" }}
              />
              <h4 className="fw-bold">Admin Portal</h4>
              <p className="text-muted small">
                Please enter your credentials to continue
              </p>
            </div>

            {/* Login Card */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleLogin}>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">
                      Email
                    </label>
                    <div className="input-group">
                      <span className={`input-group-text bg-white border-end-0 ${
                          loginError ? "input-error" : ""
                        }`}>
                        <i className="fas fa-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        value={email}
                        className={`form-control border-start-0 ps-0 ${
                          loginError ? "input-error" : ""
                        }`}
                        placeholder="Email address"
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (loginError) setLoginError(false);
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase">
                      Password
                    </label>
                    <div className="input-group">
                      <span className={`input-group-text bg-white border-end-0 ${
                          loginError ? "input-error" : ""
                        }`}>
                        <i className="fas fa-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        value={password}
                        className={`form-control border-start-0 ps-0 ${
                          loginError ? "input-error" : ""
                        }`}
                        placeholder="••••••••"
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (loginError) setLoginError(false);
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    className="btn btn-dark w-100 py-2 fw-bold rounded-3"
                    disabled={loading}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    )}
                    Login
                  </button>

                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-muted small">
                © {new Date().getFullYear()} ShopperBeats. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
