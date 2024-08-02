import { createSignal } from 'solid-js';

const CreateEvent = () => {
  const [eventName, setEventName] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [date, setDate] = createSignal('');
  const [time, setTime] = createSignal('');
  const [location, setLocation] = createSignal('');
  const [template, setTemplate] = createSignal('');
  const [guests, setGuests] = createSignal([]);

  const handleCreateEvent = () => {
    // Placeholder for event creation logic
    console.log('Event Created', {
      eventName: eventName(),
      description: description(),
      date: date(),
      time: time(),
      location: location(),
      template: template(),
      guests: guests(),
    });
  };

  return (
    <div>
      <h1>Create Event</h1>
      <form onSubmit={handleCreateEvent}>
        <div>
          <label for="name">Event Name:</label>
          <input id="name" value={eventName()} onInput={(e) => setEventName(e.target.value)} />
        </div>
        <div>
          <label for="description">Description:</label>
          <textarea id="description" value={description()} onInput={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label for="date">Date:</label>
          <input id="date" type="date" value={date()} onInput={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label for="time">Time:</label>
          <input id="time" type="time" value={time()} onInput={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <label for="location">Location:</label>
          <input id="location" value={location()} onInput={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <label for="template">Template:</label>
          <select id="template" value={template()} onChange={(e) => setTemplate(e.target.value)}>
            <option value="template1">Template 1</option>
            <option value="template2">Template 2</option>
          </select>
        </div>
        <div>
          <label for="guests">Guests:</label>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-expect-error */}
          <input
            id="guests"
            value={guests()}
            onInput={(e) => setGuests(e?.target?.value?.split(','))}
            placeholder="Enter emails separated by commas"
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
