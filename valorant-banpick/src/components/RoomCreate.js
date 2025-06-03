import React, { useState } from "react";

function RoomCreate({ onRoomJoined, setRoomKeyGlobal, setUserTeamGlobal }) {
  const [localRoomKey, setLocalRoomKey] = useState("");

  const handleCreateRoom = () => {
    const key = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomKeyGlobal(key);
    setUserTeamGlobal("Team1");
    // Có thể emit socket tại đây nếu cần
    onRoomJoined(key, "Team1");
  };

  const handleJoinRoom = () => {
    if (localRoomKey) {
      setRoomKeyGlobal(localRoomKey);
      setUserTeamGlobal("Team2");
      onRoomJoined(localRoomKey, "Team2");
    }
  };

  return (
    <div className="text-center">
      <h1 className="my-4">Tạo/Tham gia Phòng</h1>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleCreateRoom}>
          Tạo Phòng (Team1)
        </button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <input
          type="text"
          className="form-control w-25 me-2"
          placeholder="Nhập mã key"
          value={localRoomKey}
          onChange={(e) => setLocalRoomKey(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleJoinRoom}>
          Tham gia Phòng (Team2)
        </button>
      </div>
    </div>
  );
}

export default RoomCreate;