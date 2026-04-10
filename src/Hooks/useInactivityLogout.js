import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const INACTIVITY_TIME = 3 * 60 * 1000; // 3 minutes

export default function useInactivityLogout(logout) {
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      logout();          // clear auth + cookies
      navigate("/login");
    }, INACTIVITY_TIME);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer(); // start timer on mount

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, []);
}
