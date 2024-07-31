import { X, Tag, Calendar } from "lucide-react";

import { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { api } from "../../lib/axios";

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void
}

export function CreateActivityModal({
  closeCreateActivityModal
}: CreateActivityModalProps) {
  const { tripId } = useParams()

  async function createActivity (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const title = data.get('title')?.toString()
    const occurs_at = data.get('occurs_at')?.toString()

    console.log({ title, occurs_at })
    
    await api.post(`/trips/${tripId}/activities`, {
      title,
      occurs_at,
    })

    closeCreateActivityModal()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar atividade</h2>
            <button type="button" onClick={closeCreateActivityModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados poem ver as atividades.
          </p>
        </div>

        <form onSubmit={createActivity} className="space-y-3">
          <div className="px-4 h-14 bg-zinc-950 border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag className="size-5 text-zinc-400" />
            <input
              type="text"
              name="title"
              placeholder="Qual a atividade?"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 flex-1 h-14 bg-zinc-950 border-zinc-800 rounded-lg flex items-center gap-2">
              <Calendar className="size-5 text-zinc-400" />
              <input
                type="datetime-local"
                name="occurs_at"
                placeholder="Data e horario da atividade"
                className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
            </div>
          </div>

          <Button variant="primary" size="full">
            Salvar atividade
          </Button>
        </form>
      </div>
    </div>
  )
}
