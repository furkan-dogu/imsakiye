import React, { useEffect, useState, useRef } from "react";

const Districts = ({
  selectedCity,
  selectedDistrict,
  setSelectedDistrict,
  openDropdown,
  setOpenDropdown,
}) => {
  const [districts, setDistricts] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!selectedCity) return;

    const getDistricts = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/cities?country=Turkey&region=${selectedCity}`
        );
        if (!res.ok) throw new Error("Veri çekme başarısız!");

        const data = await res.json();
        setDistricts(data);
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    getDistricts();
  }, [selectedCity]);

  const handleSelect = (district) => {
    setSelectedDistrict(district);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative dropdown-container w-full lg:w-auto"
      ref={dropdownRef}
    >
      <input
        type="text"
        placeholder="İlçe Seçiniz"
        value={selectedDistrict}
        onFocus={() => selectedCity && setOpenDropdown("districts")}
        disabled={!selectedCity}
        className={`border border-gray-300 px-4 py-2 rounded lg:w-72 w-full ${
          !selectedCity ? "bg-gray-200 cursor-not-allowed" : ""
        }`}
        readOnly
      />

      {openDropdown === "districts" && selectedCity && (
        <ul className="absolute top-12 z-50 lg:w-72 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {districts.length > 0 ? (
            districts.map((district, index) => (
              <li
                key={index}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => handleSelect(district)}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {district}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">İlçe bulunamadı</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Districts;
