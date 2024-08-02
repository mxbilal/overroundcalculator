import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const calculatePercentage = (data) => {
  let results = [];

  for (let key in data) {
    let value = data[key];
    let percentage;

    if (value.includes("/")) {
      let [numerator, denominator] = value.split("/").map(Number);
      percentage = (denominator / (denominator + numerator)) * 100;
    } else {
      let numberValue = Number(value);
      percentage = (1 / numberValue) * 100;
    }

    results.push({
      name: key,
      odds: value,
      percentage: parseFloat(percentage.toFixed(2)),
    });
  }

  return results;
};

const CalculatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || { data: [] };
  const [oddsData, setOddsData] = useState([]);

  const handleOddsChange = (index, newOdds) => {
    const newData = [...oddsData];
    newData[index].odds = newOdds;

    // Recalculate percentage based on new odds
    if (newOdds.includes("/")) {
      let [numerator, denominator] = newOdds.split("/").map(Number);
      newData[index].percentage = parseFloat(
        ((denominator / (denominator + numerator)) * 100).toFixed(2)
      );
    } else {
      let numberValue = Number(newOdds);
      newData[index].percentage = parseFloat(
        ((1 / numberValue) * 100).toFixed(2)
      );
    }

    setOddsData(newData);
  };

  const calculateTotalPercentage = () => {
    return oddsData.reduce((total, item) => {
      return total + (item.percentage || 0);
    }, 0);
  };

  const addNewRow = () => {
    const newData = [...oddsData];
    newData.push({
      name: `Test ${oddsData.length + 1}`,
      odds: "",
      percentage: "",
    });
    setOddsData(newData);
  };

  useEffect(() => {
    if (data) {
      const result = calculatePercentage(data);
      setOddsData(result);
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Calculation Result</h1>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Odds</th>
              <th className="px-4 py-2">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {oddsData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    value={item.odds}
                    onChange={(e) => handleOddsChange(index, e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </td>
                <td className="border px-4 py-2">
                  {item.percentage !== "" ? `${item.percentage}%` : ""}
                </td>
              </tr>
            ))}
            <tr className="bg-green-100 font-bold">
              <td className="border px-4 py-2">Total</td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2">
                {calculateTotalPercentage().toFixed(2)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-4">
        <button
          onClick={addNewRow}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          + More Row
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-green-700 text-white py-2 px-4 rounded mt-4 ml-4 "
        >
          Calculate Another
        </button>
      </div>
    </div>
  );
};

export default CalculatePage;
