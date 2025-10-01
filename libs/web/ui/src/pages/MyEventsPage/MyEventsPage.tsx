import { createSignal } from 'solid-js';

type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
};

const MyEvents = () => {
  const [upcomingEvents] = createSignal<Event[]>([]);
  const [pastEvents] = createSignal<Event[]>([]);

  return (
    <div>
      <h1>My Events</h1>

      <section>
        <h2>Upcoming Events</h2>
        <ul>
          {upcomingEvents().map(() => (
            <li>
              <button>Edit</button>
              <button>Manage Guests</button>
              <button>Send Reminders</button>
              <button>Cancel Event</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Past Events</h2>
        <ul>
          {pastEvents().map((event) => (
            <li>
              <h3>{event.name}</h3>
              <p>
                {event.date} - {event.time}
              </p>
              <p>{event.location}</p>
              <button>View Summary</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MyEvents;
