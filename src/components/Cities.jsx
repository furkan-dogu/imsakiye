import React, { useEffect, useState, useRef } from "react";

const Cities = ({ selectedCity, setSelectedCity, setSelectedDistrict, openDropdown, setOpenDropdown }) => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dropdownRef = useRef(null); // Dropdown'u referans ile takip et

  useEffect(() => {
    const getCities = async () => {
      try {
        const res = await fetch(`${BASE_URL}/regions?country=Turkey`);
        if (!res.ok) throw new Error("Veri çekme başarısız!");
        
        const data = await res.json();
        setCities(data);
        setFilteredCities(data);
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    getCities();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    setSelectedDistrict(""); // Şehir değişince ilçeyi sıfırla
    if (value === "") {
      setFilteredCities(cities);
    } else {
      setFilteredCities(cities.filter(city => city.toLocaleLowerCase("tr").includes(value.toLocaleLowerCase("tr"))));
    }
  };

  const handleSelect = (city) => {
    setSelectedCity(city);
    setSelectedDistrict(""); // Şehir seçildiğinde ilçe seçimini sıfırla
    setOpenDropdown(null); // Dropdown'u kapat
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
    <div className="relative dropdown-container w-full lg:w-auto" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Şehir Seçiniz"
        value={selectedCity}
        onChange={handleSearch}
        onFocus={() => setOpenDropdown("cities")} // Diğer dropdown'ı kapat
        className="border border-gray-300 px-4 py-2 rounded lg:w-72 w-full"
      />

      {openDropdown === "cities" && (
        <ul className="absolute top-12 lg:w-72 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto z-50">
          {filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <li
  key={index}
  onMouseDown={(e) => e.stopPropagation()} // 🔥 Tıklama olayını dışarı yayılmasını engelle
  onClick={() => handleSelect(city)}
  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
>
  {city}
</li>

            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">Şehir bulunamadı</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Cities;
