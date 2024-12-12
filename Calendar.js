import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to show/hide the form
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

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      const eventRef = doc(collection(db, 'CalendarEvents'));
      await setDoc(eventRef, {
        ...newEvent,
        id: eventRef.id,
      });
      setEvents([...events, { ...newEvent, id: eventRef.id }]);
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        endDate: ''
      });
      setShowForm(false); // Hide the form after adding the event
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const renderDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.getDate() === i;
      });

      days.push(
        <button
          key={i}
          className={`day ${selectedDate === i ? 'selected' : ''} ${dayEvents.length > 0 ? 'event-day' : ''}`}
          onClick={() => setSelectedDate(i)}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <h2>Calendar</h2>
      <div className="days-container">{renderDays()}</div>
      {selectedDate && <p>You selected: {selectedDate}</p>}
      {selectedDate && events.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.getDate() === selectedDate;
      }).map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </div>
      ))}

      {/* Button to show/hide the event form */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Event'}
      </button>

      {/* Conditionally render the form based on showForm state */}
      {showForm && (
        <form onSubmit={addEvent}>
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
          <button type="submit">Add Event</button>
        </form>
      )}
    </div>
  );
}

export default Calendar;
