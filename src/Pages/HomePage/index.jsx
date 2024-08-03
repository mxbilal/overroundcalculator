import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cleanData = (data) => {
  let results = {};

  for (let key in data) {
    if (!key.includes("\t")) {
      results[key] = data[key];
    }
  }

  return results;
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
  // Regular expression to match a number (integer or decimal)
  const numberRegex = /^\d+(\.\d+)?$/;
  // Regular expression to match a fraction (e.g., 1/2, 3/4)
  const fractionRegex = /^\d+\/\d+$/;

  // Check if the value matches either regex
  if (numberRegex.test(value) || fractionRegex.test(value)) {
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
      const name = line;
      const firstValue = isNumber(lines[i + 1].split("\t")[0])
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

const HomePage = () => {
  let navigate = useNavigate();
  const [data, setData] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (data === "") {
      setError(true);
      return;
    }
    let result = validateData(data);
    if (Object.entries(result).length === 0) {
      setError(true);
      return;
    }
    setError(false);
    navigate("/calculate", { state: { data: result } });
  };
  return (
    <div className="flex flex-col justify-center gap-4 items-center h-3/4 bg-gray-100 p-2">
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
