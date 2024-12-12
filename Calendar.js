import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, getDocs, doc, setDoc, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import './Calendar.css';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEventId, setEditEventId] = useState(null);  // Track which event is being edited
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'CalendarEvents'));
        const eventData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const addOrUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      if (editEventId) {  // If we're editing an event
        const eventRef = doc(db, 'CalendarEvents', editEventId);
        await updateDoc(eventRef, newEvent);
        setEvents(events.map(event => event.id === editEventId ? { ...event, ...newEvent } : event));
      } else {  // If we're adding a new event
        const eventRef = doc(collection(db, 'CalendarEvents'));
        await setDoc(eventRef, {
          ...newEvent,
          id: eventRef.id,
        });
        setEvents([...events, { ...newEvent, id: eventRef.id }]);
      }
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        endDate: ''
      });
      setShowForm(false);
      setEditEventId(null);  // Reset editing state after submitting
    } catch (error) {
      console.error('Error adding or updating event:', error);
    }
  };

  const editEvent = (event) => {
    setNewEvent(event);
    setEditEventId(event.id);  // Set the event ID to identify which event to edit
    setShowForm(true);
  };

  const clearEventsForDay = async () => {
    if (!selectedDate) return;

    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === selectedDate;
    });

    for (let event of dayEvents) {
      await deleteDoc(doc(db, 'CalendarEvents', event.id));
    }

    setEvents(events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() !== selectedDate;
    }));
  };

  const renderDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.getDate() === i;
      });

      days.push(
        <div
          key={i}
          className={`day ${selectedDate === i ? 'selected' : ''} ${dayEvents.length > 0 ? 'event-day' : ''}`}
          onClick={() => setSelectedDate(i)}
        >
          {i}
          {dayEvents.map(event => (
            <div key={event.id} className="event">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              <p>{new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}</p>
              <button onClick={() => editEvent(event)}>Edit Event</button>
            </div>
          ))}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <h2>December 2024</h2>
      <div className="days-container">{renderDays()}</div>
      {selectedDate && <p>You selected: {selectedDate}</p>}

      <button onClick={clearEventsForDay}>
        Clear Events for Selected Day
      </button>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Event'}
      </button>

      {showForm && (
        <form onSubmit={addOrUpdateEvent}>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="startDate"
            value={newEvent.startDate}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="endDate"
            value={newEvent.endDate}
            onChange={handleChange}
            required
          />
          <button type="submit">{editEventId ? 'Update Event' : 'Add Event'}</button>
        </form>
      )}
    </div>
  );
}

export default Calendar;
