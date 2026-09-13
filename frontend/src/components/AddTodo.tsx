import { useState } from "react";

function AddTodo() {
  const [title, setTitle] = useState(""); 
  //Why useState is the right call here, in one sentence: 
  // nobody outside this component needs to know what's currently typed into the input
  // it exists only while you're typing, and disappears the moment you submit or navigate away. 
  // There's no reason to pay the cost of a global store (Redux) 
  // or a server round-trip (React Query) for something with that short a lifetime.

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    console.log("Would create todo:", title);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodo;
