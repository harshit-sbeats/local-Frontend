import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function DiaryInput({ value = "", onChange }) {
  const [initialNotes, setInitialNotes] = useState(value);
  const [notes, setNotes] = useState(value);
  const [isDirty, setIsDirty] = useState(false);

  // Sync when parent value changes (API load case)
  useEffect(() => {
    setNotes(value);
    setInitialNotes(value);
  }, [value]);

  // Detect changes
  useEffect(() => {
    setIsDirty(notes !== initialNotes);
  }, [notes, initialNotes]);

  // Browser refresh protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleChange = (e) => {
    setNotes(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const confirmLeave = async () => {
    if (!isDirty) return true;

    const result = await Swal.fire({
      title: "Unsaved Changes",
      text: "You have unsaved changes. Do you want to leave without saving?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Leave",
      cancelButtonText: "Stay",
    });

    return result.isConfirmed;
  };

  return (
    <div className="diary-container">
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Write your notes here..."
        className="diary-textarea"
        maxLength={255}
      />
      <style>{`
        .diary-container {
          max-width: 700px;font-family: "Courier New", monospace;
          font-size:9px;padding:0px;
        }

         .diary-textarea {
    width: 100%;
    height: 320px;

    font-size: 16px;
    line-height: 28px;
    font-family: "Courier New", monospace;

    padding: 14px 16px;
    border: 2px solid #dee2e6;
    border-radius: 10px;
    resize: vertical;
    box-sizing: border-box;

    background-color: #fff;

    /* PERFECT ALIGNMENT */
    background-image: linear-gradient(
      to bottom,
      transparent 27px,
      #d9d9d9 28px
    );

    background-size: 100% 28px;
    background-attachment: local;
  }

        .button-group {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }

        .save-btn {
          padding: 8px 15px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .leave-btn {
          padding: 8px 15px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .save-btn:hover {
          background-color: #218838;
        }

        .leave-btn:hover {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
}

export default DiaryInput;