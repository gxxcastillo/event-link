import { createSignal } from 'solid-js';

type Event = {
  id: string;
  name: string;
  message: string;
};

const Home = () => {
  const [featuredEvents] = createSignal<Event[]>([]);
  const [testimonials] = createSignal<Event[]>([]);

  return (
    <div>
      <header>
        <h1>Welcome to Event Management</h1>
        <button>Create Event</button>
        <button>Join Event</button>
      </header>

      <section>
        <h2>Featured Events</h2>
        <ul>
          {featuredEvents().map((event) => (
            <li>{event.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>What Our Users Say</h2>
        <ul>
          {testimonials().map((testimonial) => (
            <li>{testimonial.message}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Home;
