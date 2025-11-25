// src/data/mysteryData.js
// Only data (categories + content) — no logic, no helpers.

export const MYSTERY_CATEGORIES = {
  0: { name: "Tech Puzzle", bg: "from-zinc-950 to-black" },
  1: { name: "Mindfulness", bg: "from-zinc-950 to-black" },
  2: { name: "AI Spotlight", bg: "from-zinc-950 to-black" },
  3: { name: "Hack Tip", bg: "from-zinc-950 to-black" },
  4: { name: "Tech Fact", bg: "from-zinc-950 to-black" },
  5: { name: "Productivity", bg: "from-zinc-950 to-black" },
  6: { name: "Fun Puzzle", bg: "from-zinc-950 to-black" },
};

export const MYSTERY_CONTENT = [
  // Week 1
  {
    day: 0,
    cat: 0,
    title: "Logic Gate Challenge",
    content:
      "What does XOR gate output when both inputs are 1? Answer: 0 (XOR outputs 1 only when inputs differ)",
  },
  {
    day: 1,
    cat: 1,
    title: "Breath Awareness",
    content:
      "Take 3 deep breaths. Inhale for 4 counts, hold for 4, exhale for 6. Reset your mind.",
  },
  {
    day: 2,
    cat: 2,
    title: "Transformer Models",
    content:
      "GPT models use attention mechanisms to weigh the importance of different words in context.",
  },
  {
    day: 3,
    cat: 3,
    title: "Terminal Shortcut",
    content:
      "Use Ctrl+R to search your command history. Type keywords to find previous commands instantly.",
  },
  {
    day: 4,
    cat: 4,
    title: "Moore's Law",
    content:
      "The number of transistors on microchips doubles approximately every two years since 1965.",
  },
  {
    day: 5,
    cat: 5,
    title: "Time Blocking",
    content:
      "Schedule specific blocks for deep work. Protect these like important meetings.",
  },
  {
    day: 6,
    cat: 6,
    title: "Number Sequence",
    content:
      "What comes next? 1, 1, 2, 3, 5, 8, 13... Answer: 21 (Fibonacci sequence)",
  },
  // Week 2
  {
    day: 7,
    cat: 0,
    title: "Binary Math",
    content: "In binary, what is 1010 + 0110? Answer: 10000 (16 in decimal)",
  },
  {
    day: 8,
    cat: 1,
    title: "Posture Check",
    content:
      "Sit up straight. Roll your shoulders back. Relax your jaw. Feel the difference.",
  },
  {
    day: 9,
    cat: 2,
    title: "Neural Networks",
    content:
      "Deep learning models learn by adjusting millions of weighted connections between artificial neurons.",
  },
  {
    day: 10,
    cat: 3,
    title: "Git Alias Power",
    content:
      "Create aliases: git config --global alias.co checkout. Now use 'git co' instead.",
  },
  {
    day: 11,
    cat: 4,
    title: "First Computer Bug",
    content:
      "The first 'computer bug' was an actual moth found in Harvard's Mark II computer in 1947.",
  },
  {
    day: 12,
    cat: 5,
    title: "Two-Minute Rule",
    content:
      "If a task takes less than 2 minutes, do it immediately. Don't add it to your list.",
  },
  {
    day: 13,
    cat: 6,
    title: "Riddle Time",
    content:
      "I speak without a mouth and hear without ears. What am I? Answer: An echo",
  },
  // Week 3
  {
    day: 14,
    cat: 0,
    title: "Algorithm Complexity",
    content:
      "What's faster for searching: O(log n) or O(n)? Answer: O(log n) - logarithmic beats linear",
  },
  {
    day: 15,
    cat: 1,
    title: "Digital Detox",
    content:
      "Put your phone in another room for 30 minutes. Notice how your mind settles.",
  },
  {
    day: 16,
    cat: 2,
    title: "Reinforcement Learning",
    content:
      "AI learns by trial and error, receiving rewards for good actions - like training a virtual pet.",
  },
  {
    day: 17,
    cat: 3,
    title: "VSCode Zen Mode",
    content:
      "Press Ctrl+K Z (Cmd+K Z on Mac) for distraction-free coding. Focus purely on your code.",
  },
  {
    day: 18,
    cat: 4,
    title: "Internet Speed",
    content:
      "The internet can transfer data at up to 1 petabit per second through fiber optic cables.",
  },
  {
    day: 19,
    cat: 5,
    title: "Eat the Frog",
    content:
      "Tackle your hardest task first thing in the morning when your willpower is strongest.",
  },
  {
    day: 20,
    cat: 6,
    title: "Cipher Challenge",
    content:
      "Decode: KHOOR ZRUOG. Answer: HELLO WORLD (Caesar cipher, shift 3)",
  },
  // Week 4
  {
    day: 21,
    cat: 0,
    title: "Recursion Puzzle",
    content:
      "A function calls itself. What's the base case needed? Answer: A condition to stop recursion",
  },
  {
    day: 22,
    cat: 1,
    title: "Gratitude Moment",
    content:
      "List 3 things you're grateful for today. Studies show this boosts mood by 25%.",
  },
  {
    day: 23,
    cat: 2,
    title: "Computer Vision",
    content:
      "CNNs detect patterns in images by learning filters - edges, textures, then complex objects.",
  },
  {
    day: 24,
    cat: 3,
    title: "SSH Jump Hosts",
    content:
      "Use ProxyJump in SSH config to bounce through bastion hosts securely: ssh -J jump.host destination",
  },
  {
    day: 25,
    cat: 4,
    title: "First Email",
    content:
      "Ray Tomlinson sent the first email in 1971. He chose the @ symbol to separate username from host.",
  },
  {
    day: 26,
    cat: 5,
    title: "Pomodoro Power",
    content:
      "Work 25 min, break 5 min. After 4 cycles, take 15-30 min break. Maintains peak focus.",
  },
  {
    day: 27,
    cat: 6,
    title: "Logic Puzzle",
    content:
      "If 5 machines make 5 widgets in 5 minutes, how long for 100 machines to make 100 widgets? Answer: 5 min",
  },

  
  {
    day: 28,
    cat: 28 % 7,
    title: "Parity Trick",
    content:
      "An even number plus an odd number is always odd. Quick parity check for bugs.",
  },
  {
    day: 29,
    cat: 29 % 7,
    title: "Micro-Break",
    content:
      "Look away from the screen for 20 seconds and focus on something 20 feet away — 20-20-20 rule.",
  },
  {
    day: 30,
    cat: 30 % 7,
    title: "Embedding Note",
    content:
      "Word embeddings map words to vectors so machines can reason about similarity.",
  },
  {
    day: 31,
    cat: 31 % 7,
    title: "CLI Power",
    content:
      "Use `npx` to run project-specific binaries without global installs.",
  },
  {
    day: 32,
    cat: 32 % 7,
    title: "Moore Context",
    content:
      "Moore's Law described transistor doubling roughly every two years — it's a trend, not a law.",
  },
  {
    day: 33,
    cat: 33 % 7,
    title: "Tiny Habit",
    content:
      "Commit to 5 minutes of a hard task. Often 5 minutes turns into 30.",
  },
  {
    day: 34,
    cat: 34 % 7,
    title: "Logic Riddle",
    content:
      "You see a boat filled with people — yet there isn't a single person on board. How? Answer: All are married.",
  },
  {
    day: 35,
    cat: 35 % 7,
    title: "Binary Byte",
    content: "1 byte = 8 bits. A nibble = 4 bits. Old-school but useful trivia.",
  },
  {
    day: 36,
    cat: 36 % 7,
    title: "Mindful Pause",
    content:
      "Take one slow inhale and exhale, focusing only on breath. Two rounds clears the head.",
  },
  {
    day: 37,
    cat: 37 % 7,
    title: "Transformer Tidbit",
    content:
      "Self-attention lets every token see every other token — that’s why transformers scale well.",
  },
  {
    day: 38,
    cat: 38 % 7,
    title: "Alias Win",
    content:
      "Alias long git commands: `git config --global alias.lg 'log --oneline --graph'`",
  },
  {
    day: 39,
    cat: 39 % 7,
    title: "History Byte",
    content:
      "Ada Lovelace wrote the first algorithm intended for a machine — often called the first programmer.",
  },
  {
    day: 40,
    cat: 40 % 7,
    title: "Focus Sprint",
    content:
      "Work 25 minutes, then 5 min break — Pomodoro keeps momentum high.",
  },
  {
    day: 41,
    cat: 41 % 7,
    title: "Fibonacci Fun",
    content:
      "Fibonacci numbers appear in nature — pinecones, shells, and sunflower seeds.",
  },
  {
    day: 42,
    cat: 42 % 7,
    title: "Binary Sum",
    content: "Binary: 111 + 1 = 1000. Handy to mentally check small bit math.",
  },
  {
    day: 43,
    cat: 43 % 7,
    title: "Posture Tip",
    content:
      "Lift your chest, lower your shoulders — take one breath to reset your posture.",
  },
  {
    day: 44,
    cat: 44 % 7,
    title: "Neural Nugget",
    content:
      "Activation functions introduce non-linearity — without them networks are linear.",
  },
  {
    day: 45,
    cat: 45 % 7,
    title: "Terminal Trick",
    content:
      "Use `tree -L 2` (if available) to view directory structure at glance.",
  },
  {
    day: 46,
    cat: 46 % 7,
    title: "Computer Fact",
    content:
      "The first stored-program computer, ENIAC (modified later), marked a shift in computing.",
  },
  {
    day: 47,
    cat: 47 % 7,
    title: "Two-Min Rule 2.0",
    content:
      "If it takes less than 2 minutes, do it now — reduces backlog friction.",
  },
  {
    day: 48,
    cat: 48 % 7,
    title: "Riddle — Echo",
    content:
      "I speak without a mouth and hear without ears. What am I? Answer: An echo.",
  },
  {
    day: 49,
    cat: 49 % 7,
    title: "Algorithm Note",
    content: "Binary search is O(log n) but requires a sorted list.",
  },
  {
    day: 50,
    cat: 50 % 7,
    title: "Digital Detox Mini",
    content:
      "Mute notifications for 30 minutes — you’ll get back more time than you think.",
  },
  {
    day: 51,
    cat: 51 % 7,
    title: "RL Snapshot",
    content:
      "Reinforcement learning uses rewards to shape agent behavior — think trial and reward.",
  },
  {
    day: 52,
    cat: 52 % 7,
    title: "Editor Zen",
    content: "Zen mode hides distractions — VSCode: `Ctrl+K Z`.",
  },
  {
    day: 53,
    cat: 53 % 7,
    title: "Fiber Fact",
    content:
      "Fiber optic cables transmit data via light pulses — extremely high bandwidth.",
  },
  {
    day: 54,
    cat: 54 % 7,
    title: "Morning Hack",
    content: "Do your hardest task first — willpower follows completion.",
  },
  {
    day: 55,
    cat: 55 % 7,
    title: "Cipher Byte",
    content:
      "KHOOR -> HELLO with Caesar shift -3. Classic starter cipher.",
  },
  {
    day: 56,
    cat: 56 % 7,
    title: "Recursion Reminder",
    content:
      "Always define a base case — otherwise your recursion runs forever (or crashes).",
  },
  {
    day: 57,
    cat: 57 % 7,
    title: "Gratitude Prompt",
    content: "List 3 small wins today — builds momentum and perspective.",
  },
  {
    day: 58,
    cat: 58 % 7,
    title: "Vision Tech",
    content:
      "CNN layers learn edges first, then textures, then objects — hierarchical feature learning.",
  },
  {
    day: 59,
    cat: 59 % 7,
    title: "SSH Tip",
    content:
      "Use `ProxyJump` for hopping through bastion hosts: `ssh -J jump target`.",
  },
  {
    day: 60,
    cat: 60 % 7,
    title: "Email History",
    content:
      "Ray Tomlinson sent the first networked email in 1971 — and used @ to separate user and host.",
  },
  {
    day: 61,
    cat: 61 % 7,
    title: "Pomodoro Reminder",
    content:
      "Four cycles then a longer break resets focus — keep a simple timer.",
  },
  {
    day: 62,
    cat: 62 % 7,
    title: "Widget Logic",
    content:
      "If 5 machines make 5 widgets in 5 minutes, 100 machines still make 100 widgets in 5 minutes — linear scaling.",
  },
  {
    day: 63,
    cat: 63 % 7,
    title: "Bitwise Note",
    content:
      "Bitwise operators are fast — `&` tests bits, `|` sets bits, `^` toggles bits.",
  },
  {
    day: 64,
    cat: 64 % 7,
    title: "Mindful Counting",
    content:
      "Count your breaths to 10, then repeat — anchors attention quickly.",
  },
  {
    day: 65,
    cat: 65 % 7,
    title: "Embedding Tip",
    content:
      "Context matters — embeddings represent words relative to other words in training data.",
  },
  {
    day: 66,
    cat: 66 % 7,
    title: "Git Stash Trick",
    content:
      "Use `git stash -k` to stash changes but keep staged files when switching tasks.",
  },
  {
    day: 67,
    cat: 67 % 7,
    title: "History Bite",
    content:
      "The first 'bug' was literally a moth stuck in a relay — the term stuck.",
  },
  {
    day: 68,
    cat: 68 % 7,
    title: "Two-Minute Upgrade",
    content:
      "If a task is annoying, do the part that takes <2 minutes — friction drops.",
  },
  {
    day: 69,
    cat: 69 % 7,
    title: "Riddle — Mirror",
    content: "I have a face but no mouth. What am I? Answer: A clock.",
  },
  {
    day: 70,
    cat: 70 % 7,
    title: "Search Note",
    content:
      "O(log n) algorithms beat O(n) for large n — prefer logarithmic where possible.",
  },
  {
    day: 71,
    cat: 71 % 7,
    title: "Detox Mini",
    content:
      "Put your phone on Do Not Disturb for 45 minutes — celebrate the calm.",
  },
  {
    day: 72,
    cat: 72 % 7,
    title: "RL Example",
    content:
      "Games are common RL testbeds — reward shaping is the art of aligning incentives.",
  },
  {
    day: 73,
    cat: 73 % 7,
    title: "Editor Hack",
    content:
      "Split your window vertically when comparing two files for quick diffing.",
  },
  {
    day: 74,
    cat: 74 % 7,
    title: "Bandwidth Fact",
    content:
      "Undersea cables carry global internet traffic — a backbone often overlooked.",
  },
  {
    day: 75,
    cat: 75 % 7,
    title: "Eat the Frog Tip",
    content: "Start with the task you dread — everything else feels lighter.",
  },
  {
    day: 76,
    cat: 76 % 7,
    title: "Caesar Cipher",
    content:
      "ROT13 is a Caesar shift of 13 — useful for obfuscating spoilers.",
  },
  {
    day: 77,
    cat: 77 % 7,
    title: "Stack Overflow Insight",
    content:
      "Read an accepted answer top-to-bottom — context helps avoid mis-applying snippets.",
  },
  {
    day: 78,
    cat: 78 % 7,
    title: "Gratitude Habit",
    content:
      "Write one line of gratitude before bed — consistency matters more than volume.",
  },
  {
    day: 79,
    cat: 79 % 7,
    title: "CNN Snapshot",
    content:
      "Convolutions slide filters across images — they’re parameter-efficient detectors.",
  },
  {
    day: 80,
    cat: 80 % 7,
    title: "SSH Config",
    content:
      "Put hosts in `~/.ssh/config` for shorter commands and saved options.",
  },
  {
    day: 81,
    cat: 81 % 7,
    title: "First Email Trivia",
    content:
      "Early ARPANET messages laid the groundwork for the email we use today.",
  },
  {
    day: 82,
    cat: 82 % 7,
    title: "Pomodoro Pro",
    content:
      "Try 45/15 for deeper flow when 25 min isn't enough for complex tasks.",
  },
  {
    day: 83,
    cat: 83 % 7,
    title: "Logic Puzzle 2",
    content:
      "If five cats catch five mice in five minutes, five cats still catch five mice in five minutes — scaling hint.",
  },
  {
    day: 84,
    cat: 84 % 7,
    title: "Security Small",
    content:
      "Use a password manager — you’ll thank yourself when accounts pile up.",
  },
  {
    day: 85,
    cat: 85 % 7,
    title: "CSS Tip",
    content:
      "Use `gap` in flex/grid instead of margins for consistent spacing.",
  },
  {
    day: 86,
    cat: 86 % 7,
    title: "Micro-Journal",
    content:
      "Spend 2 minutes writing one insight from today — builds clarity over time.",
  },
  {
    day: 87,
    cat: 87 % 7,
    title: "Version Control Note",
    content:
      "Small commits with clear messages make bisecting and reviewing easier.",
  },
  {
    day: 88,
    cat: 88 % 7,
    title: "Math Curio",
    content:
      "Prime numbers are the building blocks of integers — basic but beautiful.",
  },
  {
    day: 89,
    cat: 89 % 7,
    title: "Final Day Prompt",
    content:
      "Celebrate progress: review 3 wins from this cycle and plan one small next step.",
  },
];
