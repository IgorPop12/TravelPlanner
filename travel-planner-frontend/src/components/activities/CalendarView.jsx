import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'sr': require('date-fns/locale/sr') };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function CalendarView({ activities }) {
  const events = activities.map(a => ({
    id: a.id,
    title: a.name,
    start: new Date(a.date),
    end: new Date(a.date),
    resource: a
  }));

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        tooltipAccessor={e => `${e.title} - ${e.resource.location || ''}`}
      />
    </div>
  );
}