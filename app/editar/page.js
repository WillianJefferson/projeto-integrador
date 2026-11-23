"use client";
import { useState } from "react";
import "./editar.css";

export default function EditProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classCode, setClassCode] = useState("");
  const [editing, setEditing] = useState(true);
  const [saved, setSaved] = useState(false);

  function save() { setSaved(true); setEditing(false); }
  function edit() { setEditing(true); setSaved(false); }
  function remove() {
    setTitle(""); setDescription(""); setClassCode("");
    setSaved(false); setEditing(true);
  }

  return (
    <main className="page">
      <h1>Edite seu projeto</h1>
      <section className="editCard">
        <div className="landscape" aria-label="Paisagem verde ilustrativa">
          <div className="hills" /><div className="trees" />
          <div className="field fieldA" /><div className="field fieldB" />
          <div className="tree"><i /><b /></div>
        </div>
        <label className="inputRow"><span>Título:</span>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título do projeto..." disabled={!editing}/>
        </label>
        <label className="descriptionRow"><span>Descrição:</span>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descrição do projeto..." disabled={!editing}/>
        </label>
        <label className="inputRow"><span>Turma:</span>
          <input value={classCode} onChange={e=>setClassCode(e.target.value)} placeholder="12345-678..." disabled={!editing}/>
        </label>
        {saved && <p className="saved">Alterações salvas!</p>}
        <div className="actions">
          <button className="delete" onClick={remove}>Excluir ▤</button>
          <div className="right">
            <button className="save" onClick={save} disabled={!editing}>Salvar ✓</button>
            <button className="edit" onClick={edit} disabled={editing}>Editar ✎</button>
          </div>
        </div>
      </section>
    </main>
  );
}
