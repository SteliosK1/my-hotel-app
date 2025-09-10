import React, { useEffect, useState } from "react";
import type { RoomType } from "../domain/types";

// Εσωτερικό state (επιτρέπει κενά)
export type FormValues = {
  hotelId?: string;
  roomNumber: string;
  type: RoomType | "";
  pricePerNight: number;
  isAvailable: boolean;
};

// Τι παραδίδουμε στον γονιό (πάντα έγκυρο)
export type SubmitValues = {
  hotelId?: string;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  isAvailable: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SubmitValues) => void; // <-- αλλάζει εδώ
  initialValues?: Partial<FormValues>;
  title?: string;
};

export default function RoomForm({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title = "Add Room",
}: Props) {
  const [values, setValues] = useState<FormValues>({
    roomNumber: "",
    type: "",
    pricePerNight: 0,
    isAvailable: true,
    ...initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      setValues((v) => ({ ...v, ...initialValues }));
    }
  }, [initialValues]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // απλή validation
    if (!values.roomNumber || !values.type) {
      alert("Room number & Type are required");
      return;
    }
    // Μετατροπή σε SubmitValues (type σίγουρα RoomType)
    const out: SubmitValues = {
      hotelId: values.hotelId,
      roomNumber: String(values.roomNumber).trim(),
      type: values.type as RoomType,
      pricePerNight: Number(values.pricePerNight || 0),
      isAvailable: Boolean(values.isAvailable),
    };
    onSubmit(out);
  };


  // Inline panel με native στοιχεία για πλήρη συμβατότητα
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button
          type="button"
          onClick={onClose}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc" }}
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        {/* Room Number */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Room Number *</span>
          <input
            value={values.roomNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValues({ ...values, roomNumber: e.target.value })
            }
            placeholder="e.g. 101"
            required
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
            }}
          />
        </label>

        {/* Type */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Type *</span>
          <select
            value={values.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setValues({ ...values, type: e.target.value as RoomType })
            }
            required
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              background: "#fff",
            }}
          >
            <option value="">Select type</option>
            <option value="SINGLE">Single</option>
            <option value="DOUBLE">Double</option>
            <option value="SUITE">Suite</option>
            <option value="FAMILY">Family</option>
          </select>
        </label>

        {/* Price */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Price per night (€) *</span>
          <input
            type="number"
            min={0}
            value={values.pricePerNight}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValues({ ...values, pricePerNight: Number(e.target.value || 0) })
            }
            required
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
            }}
          />
        </label>

        {/* Availability */}
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={!!values.isAvailable}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValues({ ...values, isAvailable: e.target.checked })
            }
          />
          <span>Available</span>
        </label>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ padding: "8px 12px", borderRadius: 6, background: "#1a202c", color: "#fff", border: "none" }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
