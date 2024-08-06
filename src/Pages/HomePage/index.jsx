import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cleanData = (data) => {
  return data.filter((item) => {
    // Check if any property value in the item is undefined
    return (
      Object.values(item).every((value) => value !== undefined) &&
      isNumber(item.odds)
    );
  });
};
function cleanupData(data) {
  // Regular expression to match numbers, fractions, and non-alphabetic characters
  const numberRegex = /^\d+(\.\d+)?$/;
  const fractionRegex = /^\d+\/\d+$/;
  const keyCleanupRegex = /\s*\d+(\.\d+)?|\d+\/\d+|\W+\s*/g;

  const cleanedData = {};

  for (let key in data) {
    // Remove keys that are purely numbers, fractions, or consist only of non-alphabetic characters
    if (numberRegex.test(key) || fractionRegex.test(key) || /^\W+$/.test(key)) {
      continue;
    }

    // Clean up keys that contain numbers or non-alphabetic characters
    let newKey = key.replace(keyCleanupRegex, "").trim();

    // If the cleaned key is non-empty, add it to the cleaned data
    const value = data[key];
    if (newKey !== "" && value !== null && isNumber(value)) {
      cleanedData[newKey] = data[key];
    }
  }

  return cleanedData;
}
function isNumber(value) {
  // Regular expression to match an integer or decimal number (e.g., 4, 3.14)
  const numberRegex = /^\d+(\.\d+)?$/;

  // Regular expression to match a fraction (e.g., 1/2, 3/4)
  const fractionRegex = /^\d+\/\d+$/;

  // Regular expression to match a percentage (e.g., 5%)
  const percentageRegex = /^\d+(\.\d+)?%$/;

  // Check if the value matches any of the regular expressions
  if (
    numberRegex.test(value) ||
    fractionRegex.test(value) ||
    percentageRegex.test(value)
  ) {
    return true;
  }

  return false;
}

const validateData = (data) => {
  const lines = data.trim().split("\n");
  let results = {};

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (isNaN(line) && line !== "") {
      let pr = i > 0 ? lines[i - 1] : null;
      let prev =
        i < 1
          ? false
          : !isNumber(
              lines[i - 1] === ""
                ? 0
                : lines[i - 1]
                    .split("\t")
                    .join("")
                    .split("/")
                    .join("")
                    .split(" ")
                    .join("")
            );
      console.log(
        JSON.stringify(line),
        "--",
        prev,
        "--",
        JSON.stringify(lines[i - 1])
      );
      const name = line;
      const firstValue = prev
        ? null
        : isNumber(lines[i + 1].split("\t")[0])
        ? lines[i + 1]
          ? lines[i + 1].split("\t")[0]
          : null
        : lines[i + 2]
        ? lines[i + 2].split("\t")[0]
        : null;

      results[name] = firstValue;
    }
  }
  return cleanupData(results);
};
function validateSpeedData(data) {
  const rows = data.trim().split("\n");
  const result = [];

  rows.forEach((row) => {
    const [id, name, speed, best1, best2, , odds] = row
      .split("\t")
      .map((item) => item.trim());
    result.push({
      id: id || "-",
      name,
      speed: speed === "-" ? "-" : parseFloat(speed),
      best1: best1 === "-" ? "-" : parseFloat(best1),
      best2: best2 === "-" ? "-" : parseFloat(best2),
      odds,
    });
  });

  return cleanData(result);
}

const HomePage = () => {
  let navigate = useNavigate();
  const [data, setData] = useState("");
  const [error, setError] = useState(false);
  const [selectedOption, setSelectedOption] = useState(2);

  const handleOptionChange = (e) => {
    setSelectedOption(Number(e.target.value));
  };
  const handleSubmit = () => {
    if (data === "") {
      setError(true);
      return;
    }
    let result =
      selectedOption === 1 ? validateSpeedData(data) : validateData(data);
    if (Object.entries(result).length === 0) {
      setError(true);
      return;
    }
    setError(false);
    navigate("/calculate", { state: { data: result, option: selectedOption } });
    console.log(result);
  };
  return (
    <div className="flex flex-col justify-center gap-4 items-center h-3/4 bg-gray-100 p-2">
      <div className="flex items-center space-x-4">
        <label className="flex items-center text-gray-700">
          <input
            type="radio"
            value={2}
            checked={selectedOption === 2}
            onChange={handleOptionChange}
            className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
          />
          <span className="ml-2">Simple Odds Data</span>
        </label>
        <label className="flex items-center text-gray-700">
          <input
            type="radio"
            value={1}
            checked={selectedOption === 1}
            onChange={handleOptionChange}
            className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
          />
          <span className="ml-2">Speed Data</span>
        </label>
      </div>

      <textarea
        className="w-full sm:w-1/2 h-1/2 p-2 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
        placeholder="Paste your data here..."
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      {error && <p className="text-red-700 -mt-3">Please add valid data</p>}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default HomePage;
