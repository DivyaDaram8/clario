import React from "react";
import PlusBar from "./PlusBar";
import DateBar from "./DateBar";
import CategoryColumn from "./CategoryColumn";

function BigCard({ categories, tasks, onAddCategory }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl h-[80vh] w-full max-w-[1400px] mx-auto p-6 flex">

      {/* Left + Bar */}
      <PlusBar categories={categories} onAddCategory={onAddCategory} />

      {/* Right Side: Date bar + Category columns */}
      <div className="flex-1 flex flex-col ml-4 overflow-hidden">
        <DateBar />
        <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
          {categories.map(cat => (
            <CategoryColumn
              key={cat._id}
              category={cat}
              tasks={tasks.filter(t => t.category === cat._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BigCard;
