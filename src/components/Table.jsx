import React from "react";

const Table = ({ info }) => {
  const now = new Date();
  const todayDate = now.toISOString().split("T")[0];

  return (
    <div className="w-full mt-10">
      {/* MD ve üstü: Normal tablo görünümü */}
      <div className="hidden md:block">
        <table className="w-full border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">TARİH</th>
              <th className="px-4 py-2">İMSAK</th>
              <th className="px-4 py-2">GÜNEŞ</th>
              <th className="px-4 py-2">ÖĞLE</th>
              <th className="px-4 py-2">İKİNDİ</th>
              <th className="px-4 py-2">AKŞAM</th>
              <th className="px-4 py-2">YATSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {Object.entries(info).map(([date, times], index) => {
              const formattedDate = new Date(date).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                weekday: "long",
              });
              const isPast = date < todayDate ? "opacity-50" : "";

              return (
                Array.isArray(times) && (
                  <tr
                    key={index}
                    className={`${isPast} even:bg-gray-100 hover:bg-gray-200 transition duration-200`}
                  >
                    <td className="px-4 py-2 font-semibold">{formattedDate}</td>
                    {times.map((time, idx) => (
                      <td key={idx} className="px-4 py-2 text-center">
                        {time}
                      </td>
                    ))}
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SM ve MD altı: Kart görünümü */}
      <div className="md:hidden flex flex-col gap-4">
        {Object.entries(info).map(([date, times], index) => {
          const formattedDate = new Date(date).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            weekday: "long",
          });
          const isPast = date < todayDate ? "opacity-50" : "";
          return (
            Array.isArray(times) && (
              <div
                key={index}
                className={`bg-gray-200 rounded-lg shadow-md p-4 ${isPast}`}
              >
                <div className="border-b pb-2 border-gray-400">
                  <span className="text-gray-800 font-bold text-sm">
                    {formattedDate}
                  </span>
                </div>

                {/* Namaz Vakitleri */}
                <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                  <div>
                    <p className="text-gray-900 font-bold">İmsak</p>
                    <p className="text-lg font-bold text-orange-600">
                      {times[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">Güneş</p>
                    <p className="text-lg font-bold">{times[1]}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">Öğle</p>
                    <p className="text-lg font-bold">{times[2]}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">İkindi</p>
                    <p className="text-lg font-bold">{times[3]}</p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold">Akşam</p>
                    <p className="text-lg font-bold text-blue-800">
                      {times[4]}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">Yatsı</p>
                    <p className="text-lg font-bold">{times[5]}</p>
                  </div>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default Table;
