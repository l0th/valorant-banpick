import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Danh sách map mẫu (đảm bảo các file hình ảnh tồn tại trong src/assets/maps)
const maps = [
  { name: "Ascent", image: require("../assets/maps/ascent.png") },
  { name: "Bind", image: require("../assets/maps/bind.png") },
  { name: "Haven", image: require("../assets/maps/haven.png") },
  { name: "Split", image: require("../assets/maps/split.png") },
  { name: "Icebox", image: require("../assets/maps/icebox.png") },
  { name: "Abyss", image: require("../assets/maps/abyss.png") },
  { name: "Breeze", image: require("../assets/maps/breeze.png") },
  { name: "Sunset", image: require("../assets/maps/sunset.png") },
  { name: "Lotus", image: require("../assets/maps/lotus.png") },
  { name: "Pearl", image: require("../assets/maps/pearl.png") },
  { name: "Fracture", image: require("../assets/maps/fracture.png") },

];

function MapDraft({ roomKey, userTeam, gameMode, onFinalMapSelected }) {
  const [mapPhase, setMapPhase] = useState(1); // Phase hiện hành
  const [mapPhaseCount, setMapPhaseCount] = useState(0); // Số lượt đã chọn trong phase hiện tại
  const [selectedMap, setSelectedMap] = useState(null);
  const [team1Maps, setTeam1Maps] = useState([]);
  const [team2Maps, setTeam2Maps] = useState([]);
  const [bannedMaps, setBannedMaps] = useState([]);
  const [finalMap, setFinalMap] = useState(null);

  // Xác định chuỗi phase cho map draft dựa trên chế độ được chọn
  // Nếu là PO1, ta bỏ qua bước ban và chuyển ngay vào phần pick.
  let mapDraftPhases = [];
  if (gameMode === "PO1") {
    mapDraftPhases = [
      { action: "pick", team: "Team1", count: 1 }
    ];
  } else if (gameMode === "PO3") {
    mapDraftPhases = [
      { action: "pick", team: "Team1", count: 1 },
      { action: "pick", team: "Team2", count: 2 },
      { action: "pick", team: "Team1", count: 1 }
    ];
  } else if (gameMode === "PO5") {
    mapDraftPhases = [
      { action: "pick", team: "Team1", count: 1 },
      { action: "pick", team: "Team2", count: 2 },
      { action: "pick", team: "Team1", count: 2 },
      { action: "pick", team: "Team2", count: 2 },
      { action: "pick", team: "Team1", count: 1 }
    ];
  }

  // Tính danh sách map khả dụng (những map chưa bị ban hay pick)
  const availableMaps = maps.filter(
    (m) =>
      !team1Maps.includes(m.name) &&
      !team2Maps.includes(m.name) &&
      !bannedMaps.includes(m.name)
  );

  const handleConfirmMap = () => {
    if (!selectedMap) return;
    const currentPhase = mapDraftPhases[mapPhase - 1];
    const currentPick = selectedMap.name;
    // Với PO1, phase chỉ có pick nên hành động ban sẽ không xảy ra
    if (currentPhase.action === "ban") {
      setBannedMaps([...bannedMaps, currentPick]);
    } else if (currentPhase.action === "pick") {
      if (currentPhase.team === "Team1") {
        setTeam1Maps([...team1Maps, currentPick]);
      } else {
        setTeam2Maps([...team2Maps, currentPick]);
      }
    }
    setSelectedMap(null);
    const newCount = mapPhaseCount + 1;
    if (newCount >= currentPhase.count) {
      if (mapPhase === mapDraftPhases.length) {
        // Phase cuối cùng → map chơi được chọn
        setFinalMap(currentPick);
        onFinalMapSelected(currentPick);
      } else {
        setMapPhase(mapPhase + 1);
        setMapPhaseCount(0);
      }
    } else {
      setMapPhase(newCount);
    }
  };

  if (finalMap) {
    return (
      <div className="text-center">
        <h2>Map Draft Completed</h2>
        <h3>Map Được Chọn: {finalMap}</h3>
        {maps
          .filter((m) => m.name === finalMap)
          .map((m) => (
            <img
              key={m.name}
              src={m.image}
              alt={m.name}
              style={{ width: "300px", height: "300px", objectFit: "cover" }}
            />
          ))}
      </div>
    );
  }

  const currentPhase = mapDraftPhases[mapPhase - 1];

  return (
    <div className="container">
      <h1 className="text-center my-4">Map Draft</h1>
      <div className="text-center mb-3">
        <h5>Room Key: {roomKey}</h5>
        <h5>
          Đang ở lượt: {currentPhase.team} – {currentPhase.action.toUpperCase()} (Cần chọn{" "}
          {currentPhase.count} map; đã chọn: {mapPhaseCount})
        </h5>
        <h5>Bạn thuộc: {userTeam}</h5>
        <h5>Chế độ: {gameMode}</h5>
      </div>
      <div className="row">
        {/* Panel Team1 */}
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-header text-center">Team1 Maps</div>
            <ul className="list-group list-group-flush">
              {team1Maps.map((m, index) => (
                <li key={index} className="list-group-item">{m}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* Panel Central: Available Maps */}
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-header text-center">Chọn Map</div>
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-center">
                {availableMaps.map((m) => (
                  <button
                    key={m.name}
                    className={`btn m-1 ${selectedMap && selectedMap.name === m.name ? "btn-warning" : "btn-outline-primary"}`}
                    onClick={() => setSelectedMap(m)}
                    disabled={userTeam !== currentPhase.team}
                  >
                    <img
                      src={m.image}
                      alt={m.name}
                      style={{ width: "70px", height: "70px", objectFit: "cover" }}
                    />
                    <div style={{ fontSize: "0.8rem" }}>{m.name}</div>
                  </button>
                ))}
              </div>
              <div className="text-center mt-3">
                {userTeam === currentPhase.team ? (
                  currentPhase.action === "ban" ? (
                    <button
                      className="btn btn-danger"
                      onClick={handleConfirmMap}
                      disabled={!selectedMap}
                    >
                      BAN
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={handleConfirmMap}
                      disabled={!selectedMap}
                    >
                      PICK
                    </button>
                  )
                ) : (
                  <span className="text-muted">Chờ lượt đối phương...</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Panel Team2 */}
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-header text-center">Team2 Maps</div>
            <ul className="list-group list-group-flush">
              {team2Maps.map((m, index) => (
                <li key={index} className="list-group-item">{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <h5>Maps Banned:</h5>
        {bannedMaps.length > 0 ? (
          <div className="d-flex flex-wrap justify-content-center">
            {bannedMaps.map((m, index) => (
              <span key={index} className="badge bg-secondary m-1">{m}</span>
            ))}
          </div>
        ) : (
          <p className="text-muted">Chưa có map nào bị ban</p>
        )}
      </div>
    </div>
  );
}

export default MapDraft