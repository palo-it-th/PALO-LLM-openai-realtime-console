import { ArrowUp, ArrowDown } from "react-feather";
import { useState } from "react";

function Event({ index, event, timestamp, transcript }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isClient = event.event_id && !event.event_id.startsWith("event_");

  return (
    <div className="flex flex-col gap-2 p-2 rounded-md bg-gray-50">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isClient ? (
          <ArrowDown className="text-blue-400" />
        ) : (
          <ArrowUp className="text-green-400" />
        )}
        <div className="text-sm text-gray-500">
          {index + 1}|{isClient ? "client:" : "server:"}
          &nbsp;{event.type} | {timestamp}
        </div>
        {transcript?.length > 0 && (
          <div className="font-extrabold text-black-500">{transcript}</div>
        )}
      </div>
      <div
        className={`text-gray-500 bg-gray-200 p-2 rounded-md overflow-x-auto ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        <pre className="text-xs">{JSON.stringify(event, null, 2)}</pre>
      </div>
    </div>
  );
}

export default function EventLog({ events, filterEventLog }) {
  const eventsToDisplay = [];
  let deltaEvents = {};
  //filterEventLog is an array of keywords to filter the event log
  filterEventLog = filterEventLog || [];

  //filter the events by keywords
  if (filterEventLog.length > 0) {
    events = events.filter((event) => {
      const eventString = JSON.stringify(event.type);
      return filterEventLog.some((keyword) =>
        eventString.toLowerCase().includes(keyword.toLowerCase()),
      );
    });
  }

  events.forEach((event, index) => {
    if (event.type.endsWith("delta")) {
      if (deltaEvents[event.type]) {
        // for now just log a single event per render pass
        return;
      } else {
        deltaEvents[event.type] = event;
      }
    }

    eventsToDisplay.push(
      <Event
        index={index}
        key={event.event_id}
        event={event}
        timestamp={new Date().toLocaleTimeString()}
        transcript={
          event?.response?.output?.[0]?.content?.[0]?.transcript ||
          event?.item?.content?.[0]?.transcript
        }
      />,
    );
  });

  return (
    <div className="flex flex-col gap-2 overflow-x-auto">
      {events.length === 0 ? (
        <div className="text-gray-500">Awaiting events...</div>
      ) : (
        eventsToDisplay
      )}
    </div>
  );
}
