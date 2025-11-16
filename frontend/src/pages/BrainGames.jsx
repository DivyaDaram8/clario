import React from "react";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";


// Brain Games data
const games = [
   {
       name: "Who Is?",
       link: "https://poki.com/en/g/who-is",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/373740bfb89dd3e6c1fb96674148e806/who-is.png",
   },
   {
       name: "Level Devil",
       link: "https://poki.com/en/g/level-devil",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/0c3d1446c6992c2b88a9498de054688b/level-devil.png",
   },
   {
       name: "Love Balls",
       link: "https://poki.com/en/g/love-balls",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/79f73bf4a7d39c5a1814e9ea37d5985c/love-balls.jfif",
   },
   {
       name: "Happy Glass",
       link: "https://poki.com/en/g/happy-glass",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/649f916152c6defac7c09dbaf29f74e9/happy-glass.jfif",
   },
   {
       name: "Master Chess",
       link: "https://poki.com/en/g/master-chess",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/505695b9-1b21-47fd-a8e1-93345afb57de/master-chess.png",
   },
   {
       name: "Infinity Loop",
       link: "https://poki.com/en/g/infinity-loop",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/866858bc3f68d2bb0739b2ef598d9f2d/infinity-loop.png",
   },
   {
       name: "Rescue the Fish",
       link: "https://poki.com/en/g/rescue-the-fish",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/f99a4b047b60358b3ed234e3d0fac330/rescue-the-fish.png",
   },
   {
       name: "Logic Master 1",
       link: "https://poki.com/en/g/logic-master-1",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/680bea5afa10268bc8268f42dab18e27/logic-master-1.png",
   },
   {
       name: "2048",
       link: "https://poki.com/en/g/2048",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/cb8c967c-4a78-4ffa-8506-cbac69746f4f/2048.png",
   },
   {
       name: "Free The Key",
       link: "https://poki.com/en/g/free-the-key",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/7cf2d05b25dcb57ae219b879e275976c/free-the-key.png",
   },
   {
       name: "Ultimate Sudoku",
       link: "https://poki.com/en/g/ultimate-sudoku",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/bc07d0e7d1b5b448e0a932537b4ebf80/ultimate-sudoku.png",
   },
   {
       name: "One Line Draw",
       link: "https://poki.com/en/g/one-line-draw",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/317810ef2300e72a3bec82b8c5faee32/one-line-draw.png",
   },
   {
       name: "Brain Test: Tricky Puzzles",
       link: "https://poki.com/en/g/brain-test-tricky-puzzles",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/f262d83ee394fcf98b378674e1430bfd/brain-test-tricky-puzzles.png",
   },
   {
       name: "Red Ball 4",
       link: "https://poki.com/en/g/red-ball-4",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/9b739087f9938fb143a2519252addbb8/red-ball-4.png",
   },
   {
       name: "Mekorama",
       link: "https://poki.com/en/g/mekorama",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/56cba7ef0668cad515855b98be92ac16/mekorama.png",
   },
   {
       name: "ArithmeticA",
       link: "https://poki.com/en/g/arithmetica",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/8b3408d50ffebc7659fa5307a19c6175/arithmetica.png",
   },
   {
       name: "Nuts and Bolts: Screwing Puzzle",
       link: "https://poki.com/en/g/nuts-and-bolts-screwing-puzzle",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/c2d96a7d5b31a4fc74db460b1c0def53/nuts-and-bolts-screwing-puzzle.png",
   },
   {
       name: "Jigsaw Surprise",
       link: "https://poki.com/en/g/jigsaw-surprise",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/b2068cacadb0c98595210cc250477682/jigsaw-surprise.png",
   },
   {
       name: "Word City Crossed",
       link: "https://poki.com/en/g/word-city-crossed",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/d89159e07e5eb9c4a66edf4854b7a678/word-city-crossed.png",
   },
   {
       name: "Maze: Path of Light",
       link: "https://poki.com/en/g/maze-path-of-light",
       image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,width=300,height=200,fit=cover,f=auto/6a3ee5115f03ce0dd7e0bf1954fe1b80/maze-path-of-light.png",
   },
];


function BrainGames() {
   return (
       <>
           {/* <NavbarLeft />
           <NavbarTop /> */}
           <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-neutral-900 py-8 px-8 md:px-16 lg:px-24">
               <div className="max-w-7xl mx-auto">
                   {/* Heading at top left */}
                   <h1 className="text-5xl font-bold mb-10 text-white drop-shadow-2xl">
                       {" "}
                       Brain Games
                   </h1>


                   {/* Desktop grid 5x4 */}
                   <div className="hidden md:grid grid-cols-5 gap-6 mb-12">
                       {games.map((game, idx) => (
                           <a
                               key={idx}
                               href={game.link}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="group relative rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                               style={{
                                   background:
                                       "linear-gradient(to bottom right, #18181b, #000000)",
                                   border: "1px solid rgba(255, 255, 255, 0.1)",
                                   backdropFilter: "blur(12px)",
                               }}
                           >
                               <div className="overflow-hidden">
                                   <img
                                       src={game.image}
                                       alt={game.name}
                                       className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110 opacity-90"
                                   />
                               </div>
                               {/* Overlay */}
                               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                   <span className="text-white font-bold text-lg px-6 py-2 bg-white/90 text-black rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                       Play Now
                                   </span>
                               </div>
                               <div className="p-3 bg-black/40 backdrop-blur-sm border-t border-white/10">
                                   <h2 className="text-center text-sm font-semibold text-white/90 truncate">
                                       {game.name}
                                   </h2>
                               </div>
                           </a>
                       ))}
                   </div>


                   {/* Mobile grid 2 columns */}
                   <div className="md:hidden grid grid-cols-2 gap-4 mb-12">
                       {games.map((game, idx) => (
                           <a
                               key={idx}
                               href={game.link}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="group relative rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105"
                               style={{
                                   background:
                                       "linear-gradient(to bottom right, #18181b, #000000)",
                                   border: "1px solid rgba(255, 255, 255, 0.1)",
                                   backdropFilter: "blur(12px)",
                               }}
                           >
                               <div className="overflow-hidden">
                                   <img
                                       src={game.image}
                                       alt={game.name}
                                       className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110 opacity-90"
                                   />
                               </div>
                               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                   <span className="text-white font-bold text-sm px-4 py-2 bg-white/90 text-black rounded-full shadow-lg">
                                       Play Now
                                   </span>
                               </div>
                               <div className="p-2 bg-black/40 backdrop-blur-sm border-t border-white/10">
                                   <h2 className="text-center text-xs font-semibold text-white/90 truncate">
                                       {game.name}
                                   </h2>
                               </div>
                           </a>
                       ))}
                   </div>


                   {/* Big wide card at bottom with more space */}
                   <a
                       href="https://poki.com/en/brain"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="group relative block w-full rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02]"
                       style={{
                           background:
                               "linear-gradient(to bottom right, #18181b, #000000)",
                           border: "1px solid rgba(255, 255, 255, 0.2)",
                           backdropFilter: "blur(12px)",
                           boxShadow: "0 25px 80px rgba(0, 0, 0, 0.9)",
                       }}
                   >
                       <div className="overflow-hidden">
                           <img
                               src="https://i.pinimg.com/1200x/1e/fb/e5/1efbe530f7eedbf4907c8cfc0a02f8b3.jpg"
                               alt="Play More Brain Games"
                               className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                           />
                       </div>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                           <span className="text-black text-3xl font-bold px-8 py-4 bg-white/90 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                               Explore More Games
                           </span>
                       </div>
                   </a>
               </div>
           </div>
       </>
   );
}


export default BrainGames;

