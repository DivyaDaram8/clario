// export default function NoteCard({ note, onEdit, onDelete }) {
//   return (
//     <div
//       style={{
//         backgroundColor: note.color,
//         padding: "1rem",
//         borderRadius: "8px",
//         marginBottom: "1rem",
//       }}
//     >
//       <h3>{note.title}</h3>
//       <p>{note.content}</p>
//       <small>{new Date(note.createdAt).toLocaleString()}</small>
//       <div>
//         <button onClick={() => onEdit(note)}>Edit</button>
//         <button onClick={() => onDelete(note._id)}>Delete</button>
//       </div>
//     </div>
//   );
// }
