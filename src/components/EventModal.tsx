import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Adjust the import path
import { useToast } from "@/hooks/use-toast";

interface Event {
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  type: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  events: Record<string, Event[]>;
  onAddEvent: (newEvent: Event) => void;
  onEditEvent: (updatedEvent: Event, index: number) => void;
  onDeleteEvent: (index: number) => void;
};

const EventModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedDate,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  const [form, setForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    description: "",
    type: "Work",
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { toast } = useToast();

  const resetForm = () => {
    setForm({
      name: "",
      startTime: "",
      endTime: "",
      description: "",
      type: "Work",
    });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = () => {
    if (!form.name || !form.startTime || !form.endTime) {
      // alert("Please fill in all required fields.");
      toast({
        description: "Please fill in all required fields!",
      });
      return;
    }

    if (form.startTime >= form.endTime) {
      // alert("End time must be after start time.");
      toast({
        description: "End time must be after start time!",
      });
      return;
    }

    onAddEvent({ ...form });
    resetForm();
    toast({
      description: "Event added successfully!",
    });
  };

  const handleSaveEvent = () => {
    if (editingIndex === null) return;

    if (!form.name || !form.startTime || !form.endTime) {
      toast({
        description: "Please fill in all required fields!",
      });
      return;
    }

    if (form.startTime >= form.endTime) {
      toast({
        description: "End time must be after start time!",
      });
      return;
    }

    onEditEvent({ ...form }, editingIndex);
    resetForm();
    toast({
      description: "Event edited successfully!",
    });
  };

  const filteredEvents =
    (selectedDate &&
      events[selectedDate.toDateString()]?.filter((event) =>
        event.name.toLowerCase().includes(searchKeyword.toLowerCase())
      )) ||
    [];

  const eventTypeColors: Record<string, string> = {
    Work: "bg-blue-300",
    Personal: "bg-green-300",
    Holiday: "bg-red-300",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen w-full max-w-md overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>
            {selectedDate ? selectedDate.toDateString() : "Add Event"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Scrollable Form and Events */}
          <div className="space-y-4 overflow-y-auto max-h-[70vh] px-5 py-1">
            {/* Event Form */}
            <div>
              <label className="block mb-1">Event Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Event Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>

            {/* Event List */}
            <div>
              <h3 className="text-lg font-bold mb-2">
                Events on {selectedDate?.toDateString()}
              </h3>
              <input
                type="text"
                placeholder="Filter events by keyword"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
              {/* <ul className="space-y-2 mt-4">
                {filteredEvents.length ? (
                  filteredEvents.map((event, index) => (
                    <li
                      key={index}
                      className={`p-3 rounded ${
                        eventTypeColors[event.type] || "bg-gray-200"
                      }`}
                    >
                      <p className="font-bold">{event.name}</p>
                      <p>
                        {event.startTime} - {event.endTime}
                      </p>
                      <p>{event.description}</p>
                      <p className="text-sm italic">Type: {event.type}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No events found.</p>
                )}
              </ul> */}
              <ul className="space-y-2 mt-4">
                {filteredEvents.length ? (
                  filteredEvents.map((event, index) => (
                    <li
                      key={index}
                      className={`p-3 rounded ${
                        eventTypeColors[event.type] || "bg-gray-200"
                      }`}
                    >
                      <p className="font-bold">{event.name}</p>
                      <p>
                        {event.startTime} - {event.endTime}
                      </p>
                      <p>{event.description}</p>
                      <p className="text-sm italic">Type: {event.type}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setForm({
                              ...event,
                              description: event.description || "",
                            });
                            setIsEditing(true);
                            setEditingIndex(index);
                          }}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteEvent(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No events found.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
        <DialogFooter>
          {isEditing ? (
            <button
              onClick={handleSaveEvent}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleAddEvent}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Event
            </button>
          )}
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
