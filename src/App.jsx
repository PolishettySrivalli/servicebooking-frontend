import { useEffect, useState } from "react";
import { getServices, getBookings, createBooking, cancelBooking } from "./api";

const emptyForm = {
  customerName: "",
  customerEmail: "",
  phone: "",
  serviceId: "",
  bookingDate: "",
  bookingTime: "",
  address: ""
};

function App() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesResponse, bookingsResponse] = await Promise.all([
        getServices(),
        getBookings()
      ]);
      setServices(servicesResponse.data);
      setBookings(bookingsResponse.data);
    } catch (err) {
      setError("Unable to connect to the backend. Start Spring Boot on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.serviceId) {
      setError("Please select a service.");
      return;
    }

    try {
      await createBooking({
        ...form,
        serviceId: Number(form.serviceId)
      });
      setMessage("Booking created successfully!");
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create booking.");
    }
  };

  const cancel = async (id) => {
    try {
      await cancelBooking(id);
      setMessage("Booking cancelled.");
      await loadData();
    } catch {
      setError("Could not cancel the booking.");
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <nav className="navbar">
          <div className="brand">QuickServe</div>
          <a href="#book">Book a Service</a>
          <a href="#bookings">My Bookings</a>
        </nav>
        <div className="hero-content">
          <div>
            <p className="eyebrow">SERVICE BOOKING SYSTEM</p>
            <h1>Book trusted services<br />in a few simple steps.</h1>
            <p className="hero-text">
              Choose a service, select a convenient time, and manage your bookings
              from one simple dashboard.
            </p>
            <a className="primary-btn" href="#book">Book Now</a>
          </div>
          <div className="hero-card">
            <span>Available Services</span>
            <strong>{services.length || "—"}</strong>
            <small>Easy online booking</small>
          </div>
        </div>
      </header>

      <main>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <section className="section" id="services">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR SERVICES</p>
              <h2>What do you need?</h2>
            </div>
            <p>Professional services at your preferred date and time.</p>
          </div>

          {loading ? (
            <div className="empty">Loading services...</div>
          ) : (
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.id}>
                  <div className="service-icon">{service.icon || "★"}</div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-bottom">
                    <strong>₹{Number(service.price).toLocaleString("en-IN")}</strong>
                    <span>{service.durationMinutes} mins</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section booking-layout" id="book">
          <div>
            <p className="eyebrow">NEW BOOKING</p>
            <h2>Schedule your service</h2>
            <p className="muted">
              Fill in your details and we will create your service booking.
            </p>
          </div>

          <form className="booking-form" onSubmit={submitBooking}>
            <div className="form-row">
              <label>
                Full Name
                <input name="customerName" value={form.customerName}
                  onChange={updateField} required placeholder="Your name" />
              </label>
              <label>
                Email
                <input type="email" name="customerEmail" value={form.customerEmail}
                  onChange={updateField} required placeholder="you@example.com" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Phone
                <input name="phone" value={form.phone}
                  onChange={updateField} required placeholder="10-digit number" />
              </label>
              <label>
                Service
                <select name="serviceId" value={form.serviceId} onChange={updateField} required>
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option value={service.id} key={service.id}>
                      {service.name} — ₹{service.price}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Date
                <input type="date" name="bookingDate" value={form.bookingDate}
                  onChange={updateField} required />
              </label>
              <label>
                Time
                <input type="time" name="bookingTime" value={form.bookingTime}
                  onChange={updateField} required />
              </label>
            </div>

            <label>
              Service Address
              <textarea name="address" value={form.address}
                onChange={updateField} required placeholder="Enter the service address" />
            </label>

            <button className="primary-btn submit-btn" type="submit">Confirm Booking</button>
          </form>
        </section>

        <section className="section" id="bookings">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BOOKING HISTORY</p>
              <h2>Recent bookings</h2>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="empty">No bookings yet. Create your first booking above.</div>
          ) : (
            <div className="booking-list">
              {bookings.map((booking) => (
                <article className="booking-card" key={booking.id}>
                  <div>
                    <span className="status">{booking.status}</span>
                    <h3>{booking.service?.name || "Service"}</h3>
                    <p>{booking.customerName} · {booking.customerEmail}</p>
                  </div>
                  <div className="booking-meta">
                    <strong>{booking.bookingDate} at {booking.bookingTime}</strong>
                    <span>{booking.address}</span>
                  </div>
                  {booking.status !== "CANCELLED" && (
                    <button className="cancel-btn" onClick={() => cancel(booking.id)}>
                      Cancel
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <strong>QuickServe</strong>
        <span>Full-Stack Java Service Booking System</span>
      </footer>
    </div>
  );
}

export default App;
