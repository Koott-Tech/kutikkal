"use client";
import { useState, useEffect } from "react";
import { X, Calendar, Clock } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// Time options: 8 AM to 10 PM (hourly) – used for both range and slot grid
const TIME_OPTIONS = Array.from({ length: 15 }, (_, i) => {
  const h = i + 8;
  return `${String(h).padStart(2, '0')}:00`;
});

function formatTimeLabel(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const hour = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${hour}:${String(m || 0).padStart(2, '0')} ${ampm}`;
}

export default function RecurringBlockModal({ isOpen, onClose, onSave }) {
  const { showError, showSuccess } = useNotification();
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [blockEntireDay, setBlockEntireDay] = useState(true);
  const [useTimeRange, setUseTimeRange] = useState(true); // true = range, false = pick slots
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('15:00');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDayOfWeek(0);
      setBlockEntireDay(true);
      setUseTimeRange(true);
      setStartTime('11:00');
      setEndTime('15:00');
      setSelectedSlots([]);
    }
  }, [isOpen]);

  // Derive time_slots from start/end range (e.g. 11:00–15:00 → 11:00, 12:00, 13:00, 14:00)
  const getTimeSlotsFromRange = () => {
    const startIdx = TIME_OPTIONS.indexOf(startTime);
    const endIdx = TIME_OPTIONS.indexOf(endTime);
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return [];
    return TIME_OPTIONS.slice(startIdx, endIdx);
  };

  const getTimeSlotsToSave = () => {
    if (blockEntireDay) return null;
    if (useTimeRange) return getTimeSlotsFromRange();
    return selectedSlots.length > 0 ? [...selectedSlots].sort() : null;
  };

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot].sort()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blockEntireDay) {
      const slots = getTimeSlotsToSave();
      if (!slots || slots.length === 0) {
        showError(
          useTimeRange
            ? 'End time must be after start time (e.g. 11 AM to 3 PM).'
            : 'Select at least one time slot or choose "Block full day".'
        );
        return;
      }
    }
    setIsLoading(true);
    try {
      const time_slots = getTimeSlotsToSave();
      await onSave({
        day_of_week: dayOfWeek,
        block_entire_day: blockEntireDay,
        time_slots
      });
      showSuccess('Recurring block saved. It will apply to all future weeks.');
      onClose();
    } catch (err) {
      showError(err.message || 'Failed to save recurring block');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(0,0,0,0.4)'
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 360,
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 600,
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Calendar size={16} style={{ color: '#3f2e73', flexShrink: 0 }} />
            Recurring block
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '14px 14px 16px' }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
              Day
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: 13,
                border: '1px solid #d1d5db',
                borderRadius: 8,
                color: '#111827',
                background: '#fff'
              }}
            >
              {DAYS.map((name, i) => (
                <option key={i} value={i}>Every {name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                color: '#374151'
              }}
            >
              <input
                type="checkbox"
                checked={blockEntireDay}
                onChange={(e) => setBlockEntireDay(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#3f2e73' }}
              />
              Block full day
            </label>
            <p style={{ margin: '4px 0 0 24px', fontSize: 12, color: '#6b7280' }}>
              All slots on this day blocked every week.
            </p>
          </div>

          {!blockEntireDay && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Clock size={14} style={{ color: '#6b7280' }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Time slots</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  padding: 2,
                  background: '#f9fafb',
                  marginBottom: 10
                }}
              >
                <button
                  type="button"
                  onClick={() => setUseTimeRange(true)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    fontSize: 12,
                    fontWeight: 500,
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: useTimeRange ? '#fff' : 'transparent',
                    color: useTimeRange ? '#3f2e73' : '#6b7280',
                    boxShadow: useTimeRange ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Range
                </button>
                <button
                  type="button"
                  onClick={() => setUseTimeRange(false)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    fontSize: 12,
                    fontWeight: 500,
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: !useTimeRange ? '#fff' : 'transparent',
                    color: !useTimeRange ? '#3f2e73' : '#6b7280',
                    boxShadow: !useTimeRange ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Pick slots
                </button>
              </div>

              {useTimeRange ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <div style={{ flex: '1 1 100px', minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Start</label>
                      <select
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          fontSize: 12,
                          border: '1px solid #d1d5db',
                          borderRadius: 6,
                          background: '#fff'
                        }}
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>{formatTimeLabel(t)}</option>
                        ))}
                      </select>
                    </div>
                    <span style={{ fontSize: 12, color: '#6b7280', marginTop: 18 }}>to</span>
                    <div style={{ flex: '1 1 100px', minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 4 }}>End</label>
                      <select
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          fontSize: 12,
                          border: '1px solid #d1d5db',
                          borderRadius: 6,
                          background: '#fff'
                        }}
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t} disabled={TIME_OPTIONS.indexOf(t) <= TIME_OPTIONS.indexOf(startTime)}>
                            {formatTimeLabel(t)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {getTimeSlotsFromRange().length > 0 && (
                    <p style={{ margin: 0, fontSize: 11, color: '#4b5563' }}>
                      Blocking: {getTimeSlotsFromRange().map((t) => formatTimeLabel(t)).join(', ')}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p style={{ margin: '0 0 8px', fontSize: 11, color: '#6b7280' }}>
                    Click slots to block.
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: 6
                    }}
                  >
                    {TIME_OPTIONS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleSlot(slot)}
                        style={{
                          padding: '6px 4px',
                          fontSize: 11,
                          borderRadius: 6,
                          border: '1px solid ' + (selectedSlots.includes(slot) ? '#d97706' : '#e5e7eb'),
                          cursor: 'pointer',
                          background: selectedSlots.includes(slot) ? '#fef3c7' : '#fff',
                          color: selectedSlots.includes(slot) ? '#92400e' : '#374151'
                        }}
                      >
                        {formatTimeLabel(slot)}
                      </button>
                    ))}
                  </div>
                  {selectedSlots.length > 0 && (
                    <p style={{ margin: '6px 0 0', fontSize: 11, color: '#4b5563' }}>
                      {selectedSlots.map((t) => formatTimeLabel(t)).join(', ')}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 13,
                border: '1px solid #d1d5db',
                borderRadius: 8,
                background: '#fff',
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!blockEntireDay && (getTimeSlotsToSave() || []).length === 0)}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 13,
                border: 'none',
                borderRadius: 8,
                background: (isLoading || (!blockEntireDay && (getTimeSlotsToSave() || []).length === 0)) ? '#9ca3af' : '#3f2e73',
                color: '#fff',
                cursor: (isLoading || (!blockEntireDay && (getTimeSlotsToSave() || []).length === 0)) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
