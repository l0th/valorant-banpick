import React, { useState } from "react";
import RoomCreate from "./components/RoomCreate";
import GameModeSelection from "./components/GameModeSelection";
import MapDraft from "./components/MapDraft";
import AgentDraft from "./components/AgentDraft";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [step, setStep] = useState("room"); // Các bước: room, mode, map, agent, result
  const [gameMode, setGameMode] = useState("");
  const [roomKey, setRoomKey] = useState("");
  const [userTeam, setUserTeam] = useState("");

  const handleRoomJoined = (key, team) => {
    setRoomKey(key);
    setUserTeam(team);
    setStep("mode");
  };

  const handleModeSelected = (mode) => {
    setGameMode(mode);
    setStep("map");
  };

  const handleFinalMapSelected = (finalMap) => {
    // Lưu lại map cuối nếu cần
    setStep("agent");
  };

  const handleAgentDraftCompleted = (result) => {
    // result chứa kết quả draft của agent
    setStep("result");
  };

  return (
    <div className="container">
      {step === "room" && (
        <RoomCreate
          onRoomJoined={handleRoomJoined}
          setRoomKeyGlobal={setRoomKey}
          setUserTeamGlobal={setUserTeam}
        />
      )}
      {step === "mode" && (
        <GameModeSelection onModeSelected={handleModeSelected} />
      )}
      {step === "map" && (
        <MapDraft
          roomKey={roomKey}
          userTeam={userTeam}
          gameMode={gameMode}
          onFinalMapSelected={handleFinalMapSelected}
        />
      )}
      {step === "agent" && (
        <AgentDraft
          roomKey={roomKey}
          userTeam={userTeam}
          onDraftCompleted={handleAgentDraftCompleted}
        />
      )}
      {step === "result" && (
        <div className="text-center my-4">
          <h1>Draft Completed!</h1>
          {/* Đưa ra phần hiển thị kết quả nếu cần */}
        </div>
      )}
    </div>
  );
}

export default App;