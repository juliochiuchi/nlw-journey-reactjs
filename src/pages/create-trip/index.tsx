import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestsStep } from './steps/invite-guests-step'
import { DateRange } from 'react-day-picker'
import { api } from '../../lib/axios'

export function CreateTripPage() {
  const navigate = useNavigate()
  const [emailsToInvite, setEmailsToInvite] = useState([
    'julio@codelabs.com',
    't@codelabs.com',
    'j@codelabs.com',
  ])
  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)
  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()

  const handleOpenGuestsInput = () => {
    setIsGuestsInputOpen(true)
  }

  const handlCloseGuestsInput = () => {
    setIsGuestsInputOpen(false)
  }

  const handleOpenModalGuests = () => {
    setIsGuestsModalOpen(true)
  }

  const handleCloseModalGuests = () => {
    setIsGuestsModalOpen(false)
  }

  const handleOpenConfirmTripModal = () => {
    setIsConfirmTripModalOpen(true)
  }

  const handleCloseConfirmTripModal = () => {
    setIsConfirmTripModalOpen(false)
  }

  const addNewEmailToInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const newEmail = data.get('email')?.toString()

    if (newEmail) {
      if (emailsToInvite.includes(newEmail))
        return
      else
        setEmailsToInvite([...emailsToInvite, newEmail])
    }

    event.currentTarget.reset()
  }

  const removeEmailsFromInvites = (emailToRemove: string) => {
    const newEmailsList = emailsToInvite.filter(email => email !== emailToRemove)

    setEmailsToInvite(newEmailsList)
  }

  const createTrip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // console.table([destination, ownerName, ownerEmail, emailsToInvite, eventStartAndEndDates])

    if (!destination 
      || !eventStartAndEndDates?.from 
      || !eventStartAndEndDates?.to 
      || emailsToInvite.length === 0 
      || !ownerEmail 
      || !ownerName) return

    const response = await api.post('/trips', {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
    })

    const { tripId } = response.data
    
    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="./../src/assets/logo.svg" alt="logo plenn.er" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua primeira viagem!</p>
        </div>

        <div className='space-y-4'>
          <DestinationAndDateStep
            isGuestsInputOpen={isGuestsInputOpen}
            handleOpenGuestsInput={handleOpenGuestsInput}
            handlCloseGuestsInput={handlCloseGuestsInput}
            setDestination={setDestination}
            eventStartAndEndDates={eventStartAndEndDates}
            setEventStartAndEndDates={setEventStartAndEndDates}
          />

          {
            isGuestsInputOpen && (
              <InviteGuestsStep
                emailsToInvite={emailsToInvite}
                handleOpenModalGuests={handleOpenModalGuests}
                handleOpenConfirmTripModal={handleOpenConfirmTripModal}
              />
            )
          }
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plenn.er voce automaticamente concorda <br />
          com os nossos <a href="#" className="text-zinc-300 underline">termos de uso</a> e <a href="#" className="text-zinc-300 underline">politicas de privacidade</a>.
        </p>
      </div>

      {isGuestsModalOpen && (
        <InviteGuestsModal
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          handleCloseModalGuests={handleCloseModalGuests}
          removeEmailsFromInvites={removeEmailsFromInvites}
        />
      )}

      {
        isConfirmTripModalOpen && (
          <ConfirmTripModal
            handleCloseConfirmTripModal={handleCloseConfirmTripModal}
            createTrip={createTrip}
            setOwnerName={setOwnerName}
            setOwnerEmail={setOwnerEmail}
          />
        )
      }
    </div>
  )
}
