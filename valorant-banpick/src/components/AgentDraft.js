import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Danh sách agent (đảm bảo rằng ảnh đặt đúng trong src/assets/agents)
const agents = [
  { name: "Jett", image: require("../assets/agents/jett.png") },//1
  { name: "Sova", image: require("../assets/agents/sova.png") },//2
  { name: "Phoenix", image: require("../assets/agents/phoenix.png") },//3
  { name: "Reyna", image: require("../assets/agents/reyna.png") },//4
  { name: "Omen", image: require("../assets/agents/omen.png") },//5
  { name: "tejo", image: require("../assets/agents/tejo.png") },
  { name: "skye", image: require("../assets/agents/skye.png") },
  { name: "vyse", image: require("../assets/agents/vyse.png") },
  { name: "waylay", image: require("../assets/agents/waylay.png") },
  { name: "yoru", image: require("../assets/agents/yoru.png") },
  { name: "gekko", image: require("../assets/agents/gekko.png") },
  { name: "harbor", image: require("../assets/agents/harbor.png") },
  { name: "iso", image: require("../assets/agents/iso.png") },
  { name: "kayo", image: require("../assets/agents/kayo.png") },
  { name: "killjoy", image: require("../assets/agents/killjoy.png") },
  { name: "neon", image: require("../assets/agents/neon.png") },
  { name: "sage", image: require("../assets/agents/sage.png") },
  { name: "astra", image: require("../assets/agents/astra.png") },
  { name: "breach", image: require("../assets/agents/breach.png") },
  { name: "brimstone", image: require("../assets/agents/brimstone.png") },
  { name: "chamber", image: require("../assets/agents/chamber.png") },
  { name: "clove", image: require("../assets/agents/clove.png") },
  { name: "cypher", image: require("../assets/agents/cypher.png") },
  { name: "deadlock", image: require("../assets/agents/deadlock.png") },
  { name: "fade", image: require("../assets/agents/fade.png") }
];

function AgentDraft({ roomKey, userTeam, onDraftCompleted }) {
  const [phase, setPhase] = useState(1);
  const [phaseCount, setPhaseCount] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [team1Agents, setTeam1Agents] = useState([]);
  const [team2Agents, setTeam2Agents] = useState([]);
  const [bannedAgents, setBannedAgents] = useState([]);

  const draftPhases = [
    { action: "ban", team: "Team1", count: 1 },
    { action: "ban", team: "Team2", count: 1 },
    { action: "pick", team: "Team1", count: 2 },
    { action: "pick", team: "Team2", count: 2 },
    { action: "ban", team: "Team1", count: 2 },
    { action: "pick", team: "Team2", count: 2 },
    { action: "ban", team: "Team2", count: 2 },
    { action: "pick", team: "Team1", count: 2 },
    { action: "pick", team: "Team2", count: 1 },
    { action: "pick", team: "Team1", count: 1 }
  ];

  const availableAgents = agents.filter(
    (a) =>
      !team1Agents.includes(a.name) &&
      !team2Agents.includes(a.name) &&
      !bannedAgents.includes(a.name)
  );

  const handleConfirm = () => {
    if (!selectedAgent) return;
    const currentPhase = draftPhases[phase - 1];
    const currentPick = selectedAgent.name;
    if (currentPhase.action === "ban") {
      setBannedAgents([...bannedAgents, currentPick]);
    } else if (currentPhase.action === "pick") {
      if (currentPhase.team === "Team1") {
        setTeam1Agents([...team1Agents, currentPick]);
      } else {
        setTeam2Agents([...team2Agents, currentPick]);
      }
    }
    setSelectedAgent(null);
    const newCount = phaseCount + 1;
    if (newCount >= currentPhase.count) {
      if (phase === draftPhases.length) {
        onDraftCompleted({ team1Agents, team2Agents, bannedAgents });
      } else {
        setPhase(phase + 1);
        setPhaseCount(0);
      }
    } else {
      setPhaseCount(newCount);
    }
  };

  const currentPhase = draftPhases[phase - 1];

  return (
    <div className="container">
      <h1 className="text-center my-4">Agent Draft</h1>
      <div className="text-center mb-3">
        <h5>Room Key: {roomKey}</h5>
        <h5>
          Đang ở lượt: {currentPhase.team} – {currentPhase.action.toUpperCase()} (Cần chọn{" "}
          {currentPhase.count} tướng; đã chọn: {phaseCount})
        </h5>
        <h5>Bạn thuộc: {userTeam}</h5>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-header text-center">Team1</div>
            <ul className="list-group list-group-flush">
              {team1Agents.map((agent, index) => (
                <li key={index} className="list-group-item">{agent}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-header text-center">Chọn Agent</div>
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-center">
                {availableAgents.map((a) => (
                  <button
                    key={a.name}
                    className={`btn m-1 ${
                      selectedAgent && selectedAgent.name === a.name
                        ? "btn-warning"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedAgent(a)}
                    disabled={userTeam !== currentPhase.team}
                  >
                    <img
                      src={a.image}
                      alt={a.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                    <div style={{ fontSize: "0.8rem" }}>{a.name}</div>
                  </button>
                ))}
              </div>
              <div className="text-center mt-3">
                {userTeam === currentPhase.team ? (
                  currentPhase.action === "ban" ? (
                    <button className="btn btn-danger" onClick={handleConfirm} disabled={!selectedAgent}>
                      BAN
                    </button>
                  ) : (
                    <button className="btn btn-success" onClick={handleConfirm} disabled={!selectedAgent}>
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
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-header text-center">Team2</div>
            <ul className="list-group list-group-flush">
              {team2Agents.map((agent, index) => (
                <li key={index} className="list-group-item">{agent}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <h5>Banned Agents:</h5>
        {bannedAgents.length > 0 ? (
          <div className="d-flex flex-wrap justify-content-center">
            {bannedAgents.map((agent, index) => (
              <span key={index} className="badge bg-secondary m-1">{agent}</span>
            ))}
          </div>
        ) : (
          <p className="text-muted">Chưa có tướng nào bị ban</p>
        )}
      </div>
    </div>
  );
}

export default AgentDraft;