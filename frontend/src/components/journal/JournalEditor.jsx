// src/components/journal/JournalEditor.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function JournalEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return <p>Loading editor...</p>;

  return (
    <div className="border rounded p-2 min-h-[200px]">
      <EditorContent editor={editor} />
    </div>
  );
}
