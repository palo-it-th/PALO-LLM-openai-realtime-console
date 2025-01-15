import { useState } from "react";
import { CloudLightning, CloudOff, Voicemail, MessageSquare } from "react-feather";
import Button from "./Button";

function SessionStopped({ startSession }) {
  const [isActivating, setIsActivating] = useState(false);

  function handleStartSession() {
    if (isActivating) return;

    setIsActivating(true);
    startSession();
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Button
        onClick={handleStartSession}
        className={isActivating ? "bg-gray-600" : "bg-red-600"}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "start session"}
      </Button>
    </div>
  );
}

function SessionActive({ stopSession, sendTextMessage, pushToTalk, pushToTalkRelease }) {
  const [message, setMessage] = useState("");
  const [pushToTalkActive, setPushToTalkActive] = useState(false);

  function handleSendClientEvent() {
    sendTextMessage(message);
    setMessage("");
  }

  return (
    <div className="flex items-center justify-center w-full h-full gap-4">
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter" && message.trim()) {
            handleSendClientEvent();
          }
        }}
        type="text"
        placeholder="send a text message..."
        className="border border-gray-200 rounded-full p-4 flex-1"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        onClick={() => {
          if (message.trim()) {
            handleSendClientEvent();
          }
        }}
        icon={<MessageSquare height={16} />}
        className="bg-blue-400"
      >
        send text
      </Button>
      <Button onClick={stopSession} icon={<CloudOff height={16} />}>
        disconnect
      </Button>
      <Button onClick={() => {
        setPushToTalkActive(!pushToTalkActive);
        if (pushToTalkActive) {
          pushToTalkRelease();
        } else {
          pushToTalk();
        }
      }}
        className={pushToTalkActive ? "bg-red-600" : "bg-gray-600"}
        onRelease={pushToTalkRelease}
        icon={<Voicemail height={16} />}>
        {pushToTalkActive ? "release" : "push to talk"}
      </Button>
    </div>
  );
}

export default function SessionControls({
  startSession,
  stopSession,
  sendClientEvent,
  sendTextMessage,
  pushToTalk, pushToTalkRelease,
  serverEvents,
  isSessionActive,
}) {
  return (
    <div className="flex gap-4 border-t-2 border-gray-200 h-full rounded-md">
      {isSessionActive ? (
        <SessionActive
          stopSession={stopSession}
          sendClientEvent={sendClientEvent}
          sendTextMessage={sendTextMessage}
          pushToTalk={pushToTalk}
          pushToTalkRelease={pushToTalkRelease}
          serverEvents={serverEvents}
        />
      ) : (
        <SessionStopped startSession={startSession} />
      )}
    </div>
  );
}
