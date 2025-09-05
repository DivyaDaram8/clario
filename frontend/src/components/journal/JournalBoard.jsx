import React, { useState } from "react";
import {
  FaPlus,
  FaCalendarAlt,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaFont,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Tiptap imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { FontFamily } from "../../extensions/FontFamily";

export default function JournalBoard() {
  const [showColors, setShowColors] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBullets, setShowBullets] = useState(false);
  const [showFonts, setShowFonts] = useState(false);

  // Palette
  const presetColors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9D4EDD", "#FF8E72"];

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDay = (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      BulletList,
      OrderedList,
      ListItem,
      FontFamily,
    ],
    content: "<p>Start writing your journal...</p>",
  });

  return (
    <div className="flex gap-6 h-full w-full">
      {/* Floating + Rail */}
      <div style={{ position: "relative" }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowColors((s) => !s)}
          title="Add Journal Color"
          className="w-14 h-14 rounded-full bg-white grid place-items-center shadow-md cursor-pointer"
        >
          <FaPlus />
        </motion.div>

        {/* Dropdown Colors */}
        <AnimatePresence>
          {showColors && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex flex-col gap-2"
            >
              {presetColors.map((c) => (
                <motion.button
                  key={c}
                  onClick={() => console.log("Selected color:", c)}
                  style={{ background: c }}
                  className="w-10 h-10 rounded-full shadow cursor-pointer"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side content */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Slim Date Bar */}
        <div className="bg-white rounded-xl shadow p-3 flex justify-between items-center">
          <button className="px-3 py-1 rounded-lg hover:bg-gray-100">
            {formatDay(yesterday)}
          </button>
          <button className="px-3 py-1 font-bold text-blue-600 rounded-lg hover:bg-gray-100">
            {formatDay(today)}
          </button>
          <button className="px-3 py-1 rounded-lg hover:bg-gray-100">
            {formatDay(tomorrow)}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowCalendar((s) => !s)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FaCalendarAlt size={18} />
            </button>
            {showCalendar && (
              <div className="absolute right-0 mt-2 z-50 bg-white shadow-lg rounded-xl p-3">
                <Calendar
                  onChange={(date) => setSelectedDate(date)}
                  value={selectedDate}
                  className="rounded-lg border-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Journal Card (Editor + Tools only) */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex gap-4">
          {/* Journal Writing Area */}
          <div className="flex-1 p-4 border rounded-xl bg-gray-50">
            <EditorContent editor={editor} className="prose max-w-none" />
          </div>

          {/* Utility Bar */}
          <div className="w-16 flex flex-col gap-3 p-3 bg-gray-50 rounded-xl shadow">
            {/* Bold */}
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaBold />
            </button>

            {/* Italic */}
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaItalic />
            </button>

            {/* Underline */}
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaUnderline />
            </button>

            {/* Strikethrough */}
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaStrikethrough />
            </button>

            {/* Bullets */}
            <div className="relative">
              <button
                onClick={() => setShowBullets((s) => !s)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <FaListUl />
              </button>
              {showBullets && (
                <div className="absolute left-12 top-0 flex flex-col gap-2 bg-white shadow rounded-lg p-2">
                  <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    • Bullet
                  </button>
                  <button className="px-3 py-1 hover:bg-gray-100">◦ Hollow</button>
                  <button className="px-3 py-1 hover:bg-gray-100">▪ Square</button>
                </div>
              )}
            </div>

            {/* Font family */}
            <div className="relative">
              <button
                onClick={() => setShowFonts((s) => !s)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <FaFont />
              </button>
              {showFonts && (
                <div className="absolute left-12 top-0 flex flex-col gap-2 bg-white shadow rounded-lg p-2">
                  <button
                    onClick={() => editor.chain().focus().setFontFamily("serif").run()}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    Serif
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setFontFamily("sans-serif").run()}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    Sans
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setFontFamily("monospace").run()}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    Mono
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
