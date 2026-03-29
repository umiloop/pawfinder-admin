import React, { useState, useEffect } from 'react';
import './AddEvent.css';

interface EventData {
  id?: number;
  month: string;
  day: string;
  title: string;
  location: string;
  description: string;
  link: string;
}

const AddEvent: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [newEvent, setNewEvent] = useState<EventData>({
    month: '',
    day: '',
    title: '',
    location: '',
    description: '',
    link: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');

  // Fetch all events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError('Error fetching events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
    
    // Clear any error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!newEvent.month || !newEvent.day || !newEvent.title || !newEvent.location || !newEvent.description) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!/^[A-Za-z]{3}$/.test(newEvent.month.toUpperCase())) {
      setError('Month must be 3 letters (e.g., JAN, FEB)');
      return false;
    }
    if (!/^(0?[1-9]|[12][0-9]|3[01])$/.test(newEvent.day)) {
      setError('Day must be between 1 and 31');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setNewEvent({
      month: '',
      day: '',
      title: '',
      location: '',
      description: '',
      link: ''
    });
    setIsEditing(false);
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = isEditing 
        ? `http://localhost:8080/api/admin/events/${editingId}`
        : 'http://localhost:8080/api/admin/events';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...newEvent,
          month: newEvent.month.toUpperCase(),
          day: newEvent.day.padStart(2, '0')
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${isEditing ? 'update' : 'create'} event`);
      }

      await response.json();
      setSuccess(`Event ${isEditing ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchEvents(); // Refresh the events list
      
      // Switch to events list tab after successful creation
      if (!isEditing) {
        setTimeout(() => setActiveTab('list'), 1500);
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : `An error occurred while ${isEditing ? 'updating' : 'creating'} the event`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: EventData) => {
    setNewEvent({
      ...event,
      day: event.day.toString().padStart(2, '0')
    });
    setIsEditing(true);
    setEditingId(event.id!);
    setActiveTab('add');
    
    // Smooth scroll to form
    document.querySelector('.add-event-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/admin/events/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setSuccess('Event deleted successfully!');
      fetchEvents(); // Refresh the events list
    } catch (err) {
      setError('Error deleting event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="events-management-container">
      <div className="page-header">
        <h2>Event Management</h2>
        <p className="subtitle">Create and manage upcoming adoption events</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`} 
          onClick={() => setActiveTab('add')}
          aria-label={isEditing ? 'Edit Event' : 'Add New Event'}
        >
          <i className="fas fa-plus-circle"></i>
          {isEditing ? 'Edit Event' : 'Add New Event'}
        </button>
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`} 
          onClick={() => setActiveTab('list')}
          aria-label="View All Events"
        >
          <i className="fas fa-calendar-alt"></i>
          View All Events
        </button>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="status-message error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Dismiss error">×</button>
        </div>
      )}
      
      {success && (
        <div className="status-message success-message">
          <i className="fas fa-check-circle"></i>
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} aria-label="Dismiss success message">×</button>
        </div>
      )}
      
      {/* Add/Edit Event Form */}
      {activeTab === 'add' && (
        <div className="card">
          <div className="card-header">
            <h3>
              <i className={isEditing ? "fas fa-edit" : "fas fa-plus-circle"}></i>
              {isEditing ? 'Edit Event Details' : 'Create New Event'}
            </h3>
          </div>
          <div className="card-body">
            <form className="add-event-form" onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="month">
                    Month<span className="required">*</span>
                  </label>
                  <input
                    id="month"
                    type="text"
                    name="month"
                    placeholder="JAN"
                    value={newEvent.month}
                    onChange={handleInputChange}
                    required
                    maxLength={3}
                    autoComplete="off"
                  />
                  <small className="form-helper">Three-letter month code (e.g., JAN, FEB)</small>
                </div>
                
                <div className="form-group half-width">
                  <label htmlFor="day">
                    Day<span className="required">*</span>
                  </label>
                  <input
                    id="day"
                    type="text"
                    name="day"
                    placeholder="15"
                    value={newEvent.day}
                    onChange={handleInputChange}
                    required
                    maxLength={2}
                    autoComplete="off"
                  />
                  <small className="form-helper">Day of the month (1-31)</small>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="title">
                  Event Title<span className="required">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Enter a descriptive title for the event"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">
                  Location<span className="required">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="Enter the event location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">
                  Description<span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Provide details about the event"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="link">Event Link (Optional)</label>
                <input
                  id="link"
                  type="text"
                  name="link"
                  placeholder="https://example.com/event-details"
                  value={newEvent.link}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <small className="form-helper">External link for more information about the event</small>
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <i className={isEditing ? 'fas fa-save' : 'fas fa-plus'}></i>
                      {isEditing ? 'Update Event' : 'Create Event'}
                    </>
                  )}
                </button>
                
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    <i className="fas fa-times"></i>
                    Cancel Edit
                  </button>
                )}
                
                <button type="button" onClick={resetForm} className="btn btn-outline">
                  <i className="fas fa-redo"></i>
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Events List */}
      {activeTab === 'list' && (
        <div className="events-list-container">
          <div className="card">
            <div className="card-header">
              <h3>
                <i className="fas fa-calendar-alt"></i>
                Upcoming Events
              </h3>
              <div className="card-actions">
                <button 
                  className="btn btn-outline" 
                  onClick={fetchEvents} 
                  disabled={loading}
                  aria-label="Refresh events list"
                >
                  <i className={loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'}></i>
                  Refresh
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setActiveTab('add');
                    resetForm();
                  }}
                  aria-label="Add new event"
                >
                  <i className="fas fa-plus"></i>
                  Add New
                </button>
              </div>
            </div>
            
            <div className="card-body">
              {events.length === 0 ? (
                <div className="empty-state">
                  <i className="far fa-calendar-times"></i>
                  <h4>No Events Found</h4>
                  <p>There are currently no events scheduled. Create your first event to get started.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setActiveTab('add')}
                    aria-label="Create first event"
                  >
                    <i className="fas fa-plus"></i>
                    Create First Event
                  </button>
                </div>
              ) : (
                <div className="events-grid">
                  {events.map((event) => (
                    <div key={event.id} className="event-card">
                      <div className="event-date">
                        <span className="month">{event.month}</span>
                        <span className="day">{event.day}</span>
                      </div>
                      <div className="event-content">
                        <h4 className="event-title">{event.title}</h4>
                        <p className="event-location">
                          <i className="fas fa-map-marker-alt"></i>
                          {event.location}
                        </p>
                        <p className="event-description">{event.description}</p>
                        
                        <div className="event-footer">
                          {event.link && (
                            <a 
                              href={event.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="event-link"
                              aria-label={`Visit website for ${event.title}`}
                            >
                              <i className="fas fa-external-link-alt"></i>
                              Visit Website
                            </a>
                          )}
                          
                          <div className="event-actions">
                            <button 
                              onClick={() => handleEdit(event)} 
                              className="btn btn-icon btn-edit"
                              aria-label={`Edit event: ${event.title}`}
                              title="Edit Event"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            
                            <button 
                              onClick={() => handleDelete(event.id!)} 
                              className="btn btn-icon btn-delete"
                              aria-label={`Delete event: ${event.title}`}
                              title="Delete Event"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEvent;