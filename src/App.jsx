import { useEffect, useState } from "react";
import Cities from "./components/Cities";
import Districts from "./components/Districts";
import Table from "./components/Table";
import TodayTimes from "./components/TodayTimes";

function App() {
  const [selectedCity, setSelectedCity] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedCity")) || "";
  });

  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedDistrict")) || "";
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const [info, setInfo] = useState({});

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem("selectedCity", JSON.stringify(selectedCity));
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict) {
      localStorage.setItem(
        "selectedDistrict",
        JSON.stringify(selectedDistrict)
      );
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const savedCity = JSON.parse(localStorage.getItem("selectedCity"));
    const savedDistrict = JSON.parse(localStorage.getItem("selectedDistrict"));

    if (savedCity) setSelectedCity(savedCity);
    if (savedDistrict) setSelectedDistrict(savedDistrict);
  }, []);

  useEffect(() => {
    if (!selectedDistrict) return;

    const getDatas = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/timesFromPlace?country=Turkey&region=${selectedCity}&city=${selectedDistrict}&date=2025-03-01&days=29&timezoneOffset=180&calculationMethod=Turkey`
        );
        if (!res.ok) throw new Error("Veri çekme başarısız!");

        const data = await res.json();
        setInfo(data.times);
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    getDatas();
  }, [selectedDistrict]);

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-10">
      <h1 className="text-center text-5xl">2025 YILI İMSAKİYESİ</h1>
      <div className="flex justify-center items-center md:flex-row flex-col gap-3 mt-10">
        <Cities
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          setSelectedDistrict={setSelectedDistrict}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />
        <Districts
          selectedCity={selectedCity}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />
      </div>
      {Object.keys(info).length > 0 && (
        <>
          <TodayTimes info={info} selectedDistrict={selectedDistrict} />
          <Table info={info} />
        </>
      )}
    </div>
  );
}

export default App;
