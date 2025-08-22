// src/components/journal/ToolRail.jsx
export default function ToolRail({ editor }) {
  if (!editor) return null;

  return (
    <div className="absolute right-0 top-0 p-3 flex flex-col gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("bold") ? "bg-indigo-500 text-white" : "bg-gray-100"
        }`}
      >
        B
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("italic") ? "bg-indigo-500 text-white" : "bg-gray-100"
        }`}
      >
        I
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-indigo-500 text-white"
            : "bg-gray-100"
        }`}
      >
        H1
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("heading", { level: 2 })
            ? "bg-indigo-500 text-white"
            : "bg-gray-100"
        }`}
      >
        H2
      </button>
    </div>
  );
}
