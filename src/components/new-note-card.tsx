import * as  Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import {  ChangeEvent,  FormEvent, useState } from "react"
import { toast } from "sonner"

interface  NewNoteCardeProps {
    onNoteCreateCard:  (content: string) => void
}

let speechRecognition: SpeechRecognition | null

export function NewNoteCard({onNoteCreateCard}: NewNoteCardeProps ) {

    const  [shouldShowOnboarding, setShouldShowOnboarding] =  useState(true)
    const [content,  setContent] =  useState('')
    const [isRecording, setIsRecording] =  useState(false)

    function handleStartEditor() {
        setShouldShowOnboarding(false)
    }

    
    function handleContentChange(event:ChangeEvent<HTMLTextAreaElement>) {

        setContent(event.target.value)

        if (event.target.value ===  '') {
            setShouldShowOnboarding(true)
        }
    }

    function handleSaveNote(event:FormEvent) {
        event.preventDefault();

        if(content === "") {
            return
        }

        onNoteCreateCard(content);

        setContent('')
        setShouldShowOnboarding(true)

        
        toast.success("Nota criada com sucesso !")
    }

    function handleStartRecording() {

        const isSpeechRecognittionAPIvailable =  'SpeechRecognition' in  window

        || 'webkitSpeechRecognition' in  window

        if(!isSpeechRecognittionAPIvailable) {
            alert("Infelizmente seu navegador não suporta o API  de gravação !")
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)


        const SpeechRecognitionAPI =  window.SpeechRecognition || window.webkitSpeechRecognition 
        
        speechRecognition =  new  SpeechRecognitionAPI

        speechRecognition.lang =  'pt-BR'
        speechRecognition.continuous =  true
        speechRecognition.maxAlternatives =  1
        speechRecognition.interimResults =  true

        speechRecognition.onresult =  (event) => {
            const transcript =  Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            },  '')

            setContent(transcript)
        }  

        speechRecognition.onerror = (event) => {
            console.error(event)
        }  
        
        speechRecognition.start()

    }

    function handleTopRecording() {
        setIsRecording(false)
       
        if(speechRecognition !== null) {
            speechRecognition.stop()
        }
    }


    return (
        <Dialog.Root>
                <Dialog.Trigger  className="bg-slate-700 p-5 flex  flex-col text-left md:rounded-md space-y-3 outline-none hover:ring-2 hover:ring-lime-400  focus-visible:ring-2 focus-visible:ring-lime-400">
                    <span className="text-sm font-medium text-slate-200">
                        Adicionar
                    </span>
                    <p className="text  leading-6 text-slate-400">
                        Grave uma nota em áudio que será convertida para texto automaticamente
                    </p>
                </Dialog.Trigger>

                <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/60"/>

                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:top-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 rounded-md flex flex-col">
                    <Dialog.Close className=" absolute right-0 top-0 bg-slate-800  p-1.5  text-slate-400 hover:text-slate-100">
                        <X className="size-5"/>
                    </Dialog.Close>

                    <form className="flex-1 flex flex-col ">
                        <div className="flex  flex-1 flex-col gap-3 p-5">
                            <span className="text-sm font-medium text-slate-300">
                            Adicionar nota
                            </span>
                        
                            {shouldShowOnboarding ?
                                (<p className="text  leading-6 text-slate-400">
                                Começa <button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">gravando uma nota</button>  em áudio  ou se preferir <button type="button" onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">utilize apenas texto.</button> 
                            </p>) :

                            <textarea 
                            autoFocus 
                            className=" text-sm leading-6 text-slete-400 bg-transparent flex-1 resize-none outline-none"
                            onChange={handleContentChange}
                            value={content}
                            >
                            
                            </textarea>

                            }
                            </div>
                            {isRecording ? 
                            (
                            <button type="button"
                            onClick={handleTopRecording}
                            className="bg-slate-900 w-full flex items-center justify-center gap-2 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100" 
                            >

                            <div className="size-3 rounded-full bg-red-500 animate-pulse"/>

                            Gravando ! (Clica p/ interromper)
                            </button>)
                            :  
                            (
                            <button type="button"
                            onClick={handleSaveNote}
                            className="bg-lime-400 w-full py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500" 
                            >
                            Salvar nota
                            </button>
                            )
                            }
                    </form>
                    </Dialog.Content>
                </Dialog.Portal>
        </Dialog.Root>
    )
} 