import React, { useState } from "react";

function GameModeSelection({ onModeSelected }) {
  const modes = ["PO1", "PO3", "PO5"];
  const [selectedMode, setSelectedMode] = useState("");

  const handleConfirm = () => {
    if (!selectedMode) {
      alert("Vui lòng chọn chế độ (PO1, PO3, PO5)!");
      return;
    }
    onModeSelected(selectedMode);
  };

  return (
    <div className="text-center my-4">
      <h2>Chọn Chế Độ Thi Đấu</h2>
      <div className="mb-3">
        {modes.map((mode) => (
          <button
            key={mode}
            className={`btn m-2 ${
              selectedMode === mode ? "btn-warning" : "btn-secondary"
            }`}
            onClick={() => setSelectedMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>
      <button className="btn btn-primary" onClick={handleConfirm}>
        Xác Nhận
      </button>
    </div>
  );
}

export default GameModeSelection;