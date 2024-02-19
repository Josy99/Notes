import "./index.css"
import  logo from "./assets/logo-nlw-expert.svg"
import {  NewNoteCard } from "./components/new-note-card"
import { NoteCard } from "./components/notes-cards"
import { ChangeEvent, useState } from "react"

interface Note {
id:  string,
date: Date,
content: string
}

export function App() {

  const [seach, setSeach] =  useState('')
  const  [notes, setNotes] =  useState<Note[]>(() => {
  
  const  notesOnStorege =  localStorage.getItem('notes')

  if (notesOnStorege) {
    return JSON.parse(notesOnStorege)
  }

  return []
})


  function onNoteCreateCard(content: string) {

    const  newNote = {
      id:  crypto.randomUUID(),
      date: new Date(),
      content,
    }
    
    const  notesArray  =  [newNote,  ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }
  
  function onNoteDeleted(id: string) {
    const  notesArray  =  notes.filter((note) => {
      return note.id !== id
    })

    setNotes(notesArray)
    
    localStorage.setItem('notes', JSON.stringify(notesArray))

  }

  function handleSeach (event: ChangeEvent<HTMLInputElement>) {
     const  query =  event.target.value

     setSeach(query)
  }

  const  filteredNotes = seach !== '' 
  ? notes.filter(note => note.content.toLocaleLowerCase().includes(seach.toLocaleLowerCase()))
  :  notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 p-5">
        <img src= {logo}/>
        
      <form className="w-full">
          <input 
          type="text"
          placeholder="Busque suas notas ..."
          className="w-full bg-transparent text-3xl  font-semibold tracking-tight placeholder: text-slate-500 outline-none"
          onChange={handleSeach}
          />
      </form>

      <div className="h-px bg-slate-700"/>

      <div className="grid gap-6 grid-cols-1  md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px]">

        <NewNoteCard onNoteCreateCard = {onNoteCreateCard} />

        {filteredNotes.map(note =>  {
            return  <NoteCard key={note.id} note={note} onNoteDeleted =  {onNoteDeleted} />
          })
        }
      </div>
    </div>
  )
}
