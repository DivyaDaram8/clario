const mongoose = require("mongoose");

// Function to recursively extract emojis from Tiptap JSON
function extractEmojisFromTiptap(content) {
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
  let emojis = [];

  function traverse(node) {
    if (!node) return;

    // If it's a text node, run regex
    if (node.type === "text" && node.text) {
      const matches = node.text.match(emojiRegex);
      if (matches) emojis.push(...matches);
    }

    // If it has children, recurse
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }

  traverse(content);
  return [...new Set(emojis)]; // remove duplicates
}

// Journal Schema
const JournalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "", // empty by default
      trim: true,
    },

    content: {
      type: Object, // Tiptap JSON
      default: {}, // empty content initially
    },

    pageColor: {
      type: String,
      default: "#ffffff",
    },

    mood: {
      type: String,
      enum: [
        "happy 🙂",
        "sad 😢",
        "angry 😡",
        "excited 🤩",
        "anxious 😟",
        "neutral 😐",
        "tired 😴",
        "love ❤️",
        "grateful 🙏",
        "confident 😎",
        "lonely 🥺",
        "confused 🤔",
        "motivated 💪",
        "stressed 😫",
      ],
      default: "neutral 😐",
    },

    emojisUsed: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

// Pre-save hook to extract emojis from Tiptap JSON
JournalSchema.pre("save", function (next) {
  if (this.content) {
    this.emojisUsed = extractEmojisFromTiptap(this.content);
  }
  next();
});

module.exports = mongoose.model("Journal", JournalSchema);
