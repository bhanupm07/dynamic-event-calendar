import React, { useState, useEffect } from "react";
import EventModal from "@/components/EventModal";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks/use-toast";

export interface Event {
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  type: string;
}

type Events = Record<string, Event[]>;

const CalendarGrid: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Events>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    // console.log("Loaded events from localStorage:", savedEvents);
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    // console.log("Saving events to localStorage:", events);
    if (Object.keys(events).length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  const getMonthYear = (date: Date) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days = Array(startDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleAddEvent = (newEvent: Event) => {
    if (!selectedDate) return;

    const dayKey = selectedDate.toDateString();
    const dayEvents = events[dayKey] || [];
    const isOverlapping = dayEvents.some(
      (event) =>
        (newEvent.startTime >= event.startTime &&
          newEvent.startTime < event.endTime) ||
        (newEvent.endTime > event.startTime &&
          newEvent.endTime <= event.endTime)
    );

    if (isOverlapping) {
      alert("This event overlaps with an existing event!");
      return;
    }

    setEvents({
      ...events,
      [dayKey]: [...dayEvents, newEvent],
    });
    setModalOpen(false);
    toast({
      description: "Event added successfully!",
    });
  };

  const exportEvents = (format: "json" | "csv") => {
    const monthEvents = Object.entries(events).filter(([key]) => {
      const date = new Date(key);
      return (
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    });

    if (format === "json") {
      const blob = new Blob([JSON.stringify(monthEvents, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, "events.json");
    } else if (format === "csv") {
      let csv = "Date,Name,Start Time,End Time,Description,Type\n";
      monthEvents.forEach(([date, dayEvents]) => {
        dayEvents.forEach((event) => {
          csv += `${date},${event.name},${event.startTime},${event.endTime},"${
            event.description || ""
          }",${event.type}\n`;
        });
      });
      const blob = new Blob([csv], { type: "text/csv" });
      saveAs(blob, "events.csv");
    }
    toast({
      description: "Exported successfully!",
    });
  };

  const renderDays = () => {
    const days = getDaysInMonth(currentDate);

    return days.map((day, index) => {
      const hasEvents = day && events[day.toDateString()];
      return (
        <div
          key={index}
          className={`p-4 border rounded-lg text-center cursor-pointer transition ${
            day && day.toDateString() === new Date().toDateString()
              ? "bg-green-200 font-bold"
              : ""
          } ${
            selectedDate && day?.toDateString() === selectedDate?.toDateString()
              ? "bg-blue-500 text-white font-bold"
              : ""
          } ${hasEvents ? "bg-red-500 font-bold text-white" : ""}`} // Highlight dates with events
          onClick={() => {
            if (day) {
              setSelectedDate(day);
              setModalOpen(true);
            }
          }}
        >
          {day ? day.getDate() : ""}
        </div>
      );
    });
  };

  const handleEditEvent = (updatedEvent: Event, index: number) => {
    if (!selectedDate) return;

    const dayKey = selectedDate.toDateString();
    const dayEvents = events[dayKey] || [];

    // Prevent overlapping with other events
    const isOverlapping = dayEvents.some(
      (event, i) =>
        i !== index &&
        ((updatedEvent.startTime >= event.startTime &&
          updatedEvent.startTime < event.endTime) ||
          (updatedEvent.endTime > event.startTime &&
            updatedEvent.endTime <= event.endTime))
    );

    if (isOverlapping) {
      // alert("This event overlaps with an existing event!");
      toast({
        variant: "destructive",
        description: "This event overlaps with an existing event!",
      });
      return;
    }

    const updatedEvents = [...dayEvents];
    updatedEvents[index] = updatedEvent;

    setEvents({
      ...events,
      [dayKey]: updatedEvents,
    });

    toast({
      variant: "destructive",
      description: "Event edited successfully!",
    });
  };

  const handleDeleteEvent = (index: number) => {
    if (!selectedDate) return;

    const dayKey = selectedDate.toDateString();
    const updatedEvents = (events[dayKey] || []).filter((_, i) => i !== index);

    const newEvents = { ...events };

    if (updatedEvents.length === 0) {
      // If no events remain, remove the date key
      delete newEvents[dayKey];
    } else {
      // Otherwise, update the events for that date
      newEvents[dayKey] = updatedEvents;
    }

    setEvents(newEvents);
    localStorage.setItem("events", JSON.stringify(newEvents));

    toast({
      description: "Event deleted successfully",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Previous
        </button>
        <h2 className="text-2xl font-semibold">{getMonthYear(currentDate)}</h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => exportEvents("json")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Export JSON
        </button>
        <button
          onClick={() => exportEvents("csv")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Export CSV
        </button>
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        events={events}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default CalendarGrid;
