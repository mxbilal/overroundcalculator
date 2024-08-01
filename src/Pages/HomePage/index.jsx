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
const validateData = (data) => {
  const lines = data.trim().split("\n");
  let results = {};

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (isNaN(line) && line !== "") {
      const name = line;
      const firstValue = lines[i + 1].split("\t")[0];
      results[name] = firstValue;
    }
  }
  return cleanData(results);
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
