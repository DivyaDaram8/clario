import { useEffect, useState } from "react";
import { getJournalByDate, saveJournal } from "../../api";
import JournalEditor from "./JournalEditor";
import DateBar from "./DateBar";
import ToolRail from "./ToolRail";
import LeftRail from "./LeftRail";

export default function JournalBoard({ selectedDate }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch journal when date changes
  useEffect(() => {
    async function fetchJournal() {
      setLoading(true);
      try {
        const res = await getJournalByDate(selectedDate);
        setContent(res.content || ""); // load existing or empty
      } catch (err) {
        console.error("Failed to load journal:", err);
      } finally {
        setLoading(false);
      }
    }
    if (selectedDate) fetchJournal();
  }, [selectedDate]);

  // Save handler
  const handleSave = async () => {
    try {
      await saveJournal(selectedDate, content);
      alert("Journal saved ✅");
    } catch (err) {
      alert("Failed to save ❌");
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/5 border-r bg-gray-100">
        <LeftRail />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Date selector at the top */}
        <DateBar />

        {/* ToolRail just under DateBar */}
        <ToolRail />

        {/* Editor and Save button */}
        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-xl font-semibold mb-2">
            Journal for {selectedDate}
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <JournalEditor
              value={content}
              onChange={(html) => setContent(html)}
            />
          )}

          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
