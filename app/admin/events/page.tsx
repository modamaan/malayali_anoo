'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const supabase = createClient()

  // Form State
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [ticketLink, setTicketLink] = useState('')
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [additionalImages, setAdditionalImages] = useState<FileList | null>(null)

  useEffect(() => {
    fetchEvents()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      alert("Error fetching events: " + error.message)
    } else if (data) {
      setEvents(data)
    }
    setLoading(false)
  }

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('events')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from('events').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !date || !location || !description) return

    setIsAdding(true)

    try {
      let finalImageUrl = null
      let finalImages = []

      if (mainImage) {
        finalImageUrl = await uploadImage(mainImage)
      }

      if (additionalImages && additionalImages.length > 0) {
        for (let i = 0; i < additionalImages.length; i++) {
          const url = await uploadImage(additionalImages[i])
          finalImages.push(url)
        }
      }

      const { error } = await supabase.from('events').insert([
        {
          title,
          date,
          time: time || null,
          location,
          description,
          price: price || null,
          ticket_link: ticketLink || null,
          image_url: finalImageUrl,
          images: finalImages.length > 0 ? finalImages : null
        }
      ])

      if (error) throw error

      setTitle('')
      setDate('')
      setTime('')
      setLocation('')
      setDescription('')
      setPrice('')
      setTicketLink('')
      setMainImage(null)
      setAdditionalImages(null)
      // Reset file inputs visually by resetting the form
      const form = e.target as HTMLFormElement;
      form.reset();
      
      fetchEvents()
    } catch (err: any) {
      alert("Error adding event: " + err.message)
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event? This cannot be undone.")) return

    setIsDeleting(id)
    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) {
      alert("Error deleting event: " + error.message)
    } else {
      setEvents(events.filter(e => e.id !== id))
    }
    setIsDeleting(null)
  }

  return (
    <div className="space-y-10">
      
      {/* ADD NEW EVENT FORM */}
      <section>
        <div className="glass p-6 md:p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Add New Event</h2>
          
          <form onSubmit={handleAddEvent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 [color-scheme:dark]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    placeholder="e.g. 6:00 PM"
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location *</label>
                <input
                  type="text"
                  value={location}
                  placeholder="e.g. Northampton"
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                <input
                  type="text"
                  value={price}
                  placeholder="e.g. £160 or Free"
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                <textarea
                  value={description}
                  rows={3}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Main Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Additional Images (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setAdditionalImages(e.target.files)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Ticket/Registration Link</label>
                <input
                  type="url"
                  value={ticketLink}
                  placeholder="https://..."
                  onChange={(e) => setTicketLink(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {isAdding ? 'Adding Event...' : 'Add Event'}
            </button>
          </form>
        </div>
      </section>

      {/* EVENTS LIST */}
      <section>
        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Current Events</h2>
            <p className="text-gray-400">
              Manage the events currently shown on the website.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400">No events found. Add one above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="glass rounded-xl overflow-hidden border border-white/10 flex flex-col">
                <div className="h-40 relative overflow-hidden bg-black/50">
                  {event.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{event.title}</h3>
                  <p className="text-sm text-gray-400 mb-3 flex items-center line-clamp-1">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {event.location}
                  </p>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-grow">{event.description}</p>
                  
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    disabled={isDeleting === event.id}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-lg transition-colors border border-red-500/20 disabled:opacity-50 mt-auto"
                  >
                    {isDeleting === event.id ? 'Deleting...' : 'Delete Event'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
