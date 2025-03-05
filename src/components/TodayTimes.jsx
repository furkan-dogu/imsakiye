import { useEffect, useState } from "react";

const TodayTimes = ({ info, selectedDistrict }) => {
  const [remainingTimeText, setRemainingTimeText] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Her saniye güncellenecek

    return () => clearInterval(interval);
  }, []);

  const todayDate = currentTime.toISOString().split("T")[0]; // YYYY-MM-DD formatı
  const tomorrowDate = new Date(currentTime);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowDateStr = tomorrowDate.toISOString().split("T")[0]; // YYYY-MM-DD formatı (yarın)

  // 🔥 Bugünün tarihini "4 Mart 2025 Salı" formatına çevir
  const formattedDate = currentTime.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  // Bugünün vakitlerini bul
  const todayEntry = Object.entries(info).find(([date]) => date === todayDate);
  const tomorrowEntry = Object.entries(info).find(([date]) => date === tomorrowDateStr);

  useEffect(() => {
    if (!todayEntry && !tomorrowEntry) return;

    const updateRemainingTime = () => {
      let title = "";
      let message = "";
      let targetTime = null;

      const [date, times] = todayEntry || [];
      const iftarTime = date ? new Date(`${date}T${times[4]}:00`) : null; // Bugünün iftarı
      const imsakTimeTomorrow = tomorrowEntry ? new Date(`${tomorrowEntry[0]}T${tomorrowEntry[1][0]}:00`) : null; // Yarınki imsak

      if (currentTime < iftarTime) {
        targetTime = iftarTime;
        title = "İftara kalan süre:";
      } else if (imsakTimeTomorrow) {
        targetTime = imsakTimeTomorrow;
        title = "İmsaka kalan süre:";
      }

      if (targetTime) {
        const diff = Math.floor((targetTime - currentTime) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        // 🔥 Saat ve dakika 0 ise gösterme
        let timeParts = [];
        if (hours > 0) timeParts.push(`${hours} saat`);
        if (minutes > 0) timeParts.push(`${minutes} dakika`);
        if (seconds > 0) timeParts.push(`${seconds} saniye`);

        message = timeParts.join(" ");
      }

      setRemainingTimeText({ title, message });
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [info, currentTime]);

  return (
    todayEntry && (
      <div className="bg-teal-100 text-center rounded-lg shadow-md p-6 my-6">
        {/* 🔥 Güncellenmiş Tarih Formatı */}
        <h3 className="text-3xl font-semibold">{formattedDate}</h3>
        <h2 className="text-5xl font-bold  mt-5">{selectedDistrict}</h2>

        {/* 🔥 Kalan Süre */}
        {remainingTimeText && (
          <div className="font-bold text-lg my-10">
            <p>{remainingTimeText.title}</p>
            <p className="text-red-600 ">{remainingTimeText.message}</p>
          </div>
        )}

        {/* 🔥 Namaz Vakitleri */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <p className="text-gray-900 font-bold">İmsak</p>
            <p className="text-lg font-bold text-orange-600">{todayEntry[1][0]}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Güneş</p>
            <p className="text-lg font-bold">{todayEntry[1][1]}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Öğle</p>
            <p className="text-lg font-bold">{todayEntry[1][2]}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">İkindi</p>
            <p className="text-lg font-bold">{todayEntry[1][3]}</p>
          </div>
          <div>
            <p className="text-gray-900 font-bold">Akşam</p>
            <p className="text-lg font-bold text-blue-800">{todayEntry[1][4]}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Yatsı</p>
            <p className="text-lg font-bold">{todayEntry[1][5]}</p>
          </div>
        </div>
      </div>
    )
  );
};

export default TodayTimes;
