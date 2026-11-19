import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Mail, MapPin } from 'lucide-react';
import { CONTACT_TOPICS } from '../../content/catalog.js';

const WEB3FORMS_ACCESS_KEY = '10c8222d-4605-46f0-8559-c51926a666f9';

const CONSULTATION = 'Request a 15-Minute Introductory Consultation';

const PROFILES = [
  'Individual',
  'Business Owner / Entrepreneur',
  'Investor',
  'Institutional Investor',
  'Family Office',
  'Organization / Other',
];

const PURPOSES = [
  CONSULTATION,
  'Business Expansion / New Project',
  'Cash Flow & Financial Planning',
  'Financial Analysis & Scenario Planning',
  'Strategic Advisory',
  'General Inquiry',
  'Other',
];

const COMMON_TIME_ZONES = [
  ['America/New_York', 'Eastern Time (US & Canada)'],
  ['America/Chicago', 'Central Time (US & Canada)'],
  ['America/Denver', 'Mountain Time (US & Canada)'],
  ['America/Phoenix', 'Arizona'],
  ['America/Los_Angeles', 'Pacific Time (US & Canada)'],
  ['America/Anchorage', 'Alaska'],
  ['Pacific/Honolulu', 'Hawaii'],
  ['America/Mexico_City', 'Mexico City'],
  ['America/Sao_Paulo', 'São Paulo'],
  ['Europe/London', 'London'],
  ['Europe/Paris', 'Central Europe (Paris, Berlin)'],
  ['Europe/Istanbul', 'Istanbul'],
  ['Asia/Dubai', 'Dubai'],
  ['Asia/Kabul', 'Kabul'],
  ['Asia/Karachi', 'Karachi'],
  ['Asia/Kolkata', 'India'],
  ['Asia/Singapore', 'Singapore'],
  ['Asia/Shanghai', 'China'],
  ['Asia/Tokyo', 'Tokyo'],
  ['Australia/Sydney', 'Sydney'],
  ['Africa/Johannesburg', 'Johannesburg'],
  ['UTC', 'Coordinated Universal Time'],
];

const LIMITS = { name: 100, email: 254, message: 3000 };

const GENERAL_SUCCESS = 'Thank you. Your inquiry has been sent successfully.';
const CONSULTATION_SUCCESS =
  'Thank you for contacting NVeston. Your consultation request has been received. We will review your preferred timing and follow up by email to coordinate your 15-minute introductory conversation.';
const SUBMIT_ERROR =
  'We were unable to send your message. Your information has been kept. Please try again, or email contact@nveston.com directly.';

const EMPTY_FORM = {
  name: '',
  email: '',
  type: '',
  purpose: '',
  message: '',
  prefDate: '',
  prefTime: '',
  timeZone: '',
  altDate: '',
  altTime: '',
  altTimeZone: '',
  botcheck: false,
};

const pad = (n) => String(n).padStart(2, '0');
const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function detectTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}

function allTimeZones() {
  try {
    return typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : [];
  } catch {
    return [];
  }
}

function utcOffset(timeZone, date = new Date()) {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
      .formatToParts(date)
      .find((p) => p.type === 'timeZoneName');
    return part ? part.value.replace('GMT', 'UTC') || 'UTC' : '';
  } catch {
    return '';
  }
}

function zoneLabel(timeZone) {
  const common = COMMON_TIME_ZONES.find(([id]) => id === timeZone);
  return common ? `${common[1]} (${timeZone})` : timeZone;
}

function formatDateForEmail(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const readable = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return `${readable} (${iso})`;
}

function formatTimeForEmail(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${pad(m)} ${suffix} (${hhmm})`;
}

function formatZoneForEmail(timeZone, iso, hhmm) {
  // Offset is looked up for the requested date so DST is reflected; the time itself is never converted.
  const offset = iso && hhmm ? utcOffset(timeZone, new Date(`${iso}T${hhmm}:00Z`)) : utcOffset(timeZone);
  return offset ? `${zoneLabel(timeZone)} — ${offset} on that date` : zoneLabel(timeZone);
}

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isValidTime = (v) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);

function validate(form, isConsultation, minDate, maxDate) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const message = form.message.trim();

  if (!name) errors.name = 'Please enter your full name.';
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;

  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > LIMITS.email || !isValidEmail(email)) errors.email = 'Please enter a valid email address.';

  if (!form.type) errors.type = 'Please select your profile.';
  if (!form.purpose) errors.purpose = 'Please select what you would like to discuss.';

  if (!message) {
    errors.message = isConsultation
      ? 'Please briefly describe your project or question.'
      : 'Please enter a message.';
  } else if (message.length > LIMITS.message) {
    errors.message = `Please keep your message under ${LIMITS.message} characters.`;
  }

  if (isConsultation) {
    const checkDate = (value, key, missing) => {
      if (!value) {
        errors[key] = missing;
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < minDate) {
        errors[key] = 'Please choose a future date.';
      } else if (value > maxDate) {
        errors[key] = 'Please choose a date within the next 12 months.';
      }
    };
    const checkTime = (value, key, missing) => {
      if (!value) {
        errors[key] = missing;
      } else if (!isValidTime(value)) {
        errors[key] = 'Please enter a valid time.';
      }
    };

    checkDate(form.prefDate, 'prefDate', 'Please choose a preferred date.');
    checkTime(form.prefTime, 'prefTime', 'Please choose a preferred time.');
    if (!form.timeZone) errors.timeZone = 'Please select your time zone.';

    if (form.altDate || form.altTime) {
      checkDate(form.altDate, 'altDate', 'Please add a date for your alternative time.');
      checkTime(form.altTime, 'altTime', 'Please add a time for your alternative date.');
      if (!form.altTimeZone) errors.altTimeZone = 'Please select a time zone.';
    }
  }

  return errors;
}

const FIELD_ORDER = [
  'name', 'email', 'type', 'purpose',
  'prefDate', 'prefTime', 'timeZone', 'altDate', 'altTime', 'altTimeZone',
  'message',
];

const labelClass = 'font-inter text-xs text-muted-foreground uppercase tracking-wide mb-2 block';
const fieldClass = (hasError) =>
  `w-full bg-card/50 border ${hasError ? 'border-red-400/60' : 'border-border'} focus:border-primary/40 rounded-sm h-12 font-inter text-sm px-4 outline-none text-foreground`;
const nativePickerStyle = { colorScheme: 'dark' };

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="font-inter text-xs text-red-400 mt-2">
      {message}
    </p>
  );
}

export default function ContactSection() {
  const detectedZone = useMemo(detectTimeZone, []);
  const zones = useMemo(() => {
    const commonIds = new Set(COMMON_TIME_ZONES.map(([id]) => id));
    const common = COMMON_TIME_ZONES.map(([id, label]) => {
      const offset = utcOffset(id);
      return [id, offset ? `${label} (${offset})` : label];
    });
    if (detectedZone && !commonIds.has(detectedZone)) {
      const offset = utcOffset(detectedZone);
      common.unshift([detectedZone, `${detectedZone}${offset ? ` (${offset})` : ''}`]);
    }
    const others = allTimeZones().filter((id) => !commonIds.has(id) && id !== detectedZone);
    return { common, others };
  }, [detectedZone]);

  const initialForm = () => ({ ...EMPTY_FORM, timeZone: detectedZone, altTimeZone: detectedZone });

  const [form, setForm] = useState(initialForm);

  // Links such as /contact?topic=consultation preselect the matching topic.
  useEffect(() => {
    const purpose = CONTACT_TOPICS[new URLSearchParams(window.location.search).get('topic')];
    if (purpose && PURPOSES.includes(purpose)) setForm((prev) => (prev.purpose ? prev : { ...prev, purpose }));
  }, []);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ kind: '', text: '' });
  const submittingRef = useRef(false);
  const formRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const isConsultation = form.purpose === CONSULTATION;

  const today = new Date();
  const minDate = toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
  const maxDate = toISODate(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()));

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (status.kind === 'success') setStatus({ kind: '', text: '' });
  };

  const errorProps = (key) => ({
    id: `contact-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `contact-${key}-error` : undefined,
  });

  const buildPayload = () => {
    const name = form.name.trim();
    const base = {
      access_key: WEB3FORMS_ACCESS_KEY,
      from_name: 'NVeston Website',
      name,
      email: form.email.trim(),
      'Client Profile': form.type,
      'Inquiry Purpose': form.purpose,
    };
    if (form.botcheck) base.botcheck = true;

    const submittedAt = `${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC`;

    if (!isConsultation) {
      return {
        ...base,
        subject: `New NVeston Inquiry from ${name}`,
        message: form.message.trim(),
        'Submitted At': submittedAt,
      };
    }

    const payload = {
      ...base,
      subject: `NVeston | New Consultation Request — ${name}`,
      'Preferred Date': formatDateForEmail(form.prefDate),
      'Preferred Time': formatTimeForEmail(form.prefTime),
      'Time Zone': formatZoneForEmail(form.timeZone, form.prefDate, form.prefTime),
    };
    if (form.altDate && form.altTime) {
      payload['Alternative Availability'] =
        `${formatDateForEmail(form.altDate)} at ${formatTimeForEmail(form.altTime)} — ` +
        formatZoneForEmail(form.altTimeZone, form.altDate, form.altTime);
    } else {
      payload['Alternative Availability'] = 'Not provided';
    }
    payload['Project or Question'] = form.message.trim();
    payload['Submitted At'] = submittedAt;
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;

    const nextErrors = validate(form, isConsultation, minDate, maxDate);
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key]);
    if (firstInvalid) {
      setStatus({ kind: 'error', text: 'Please review the highlighted fields.' });
      formRef.current?.querySelector(`#contact-${firstInvalid}`)?.focus();
      return;
    }

    submittingRef.current = true;
    setSending(true);
    setStatus({ kind: '', text: '' });

    const wasConsultation = isConsultation;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(buildPayload()),
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (response.ok && result && result.success === true) {
        setStatus({ kind: 'success', text: wasConsultation ? CONSULTATION_SUCCESS : GENERAL_SUCCESS });
        setForm(initialForm());
        setErrors({});
      } else {
        setStatus({ kind: 'error', text: SUBMIT_ERROR });
      }
    } catch {
      setStatus({ kind: 'error', text: SUBMIT_ERROR });
    } finally {
      submittingRef.current = false;
      setSending(false);
    }
  };

  const zoneOptions = (
    <>
      <optgroup label="Common time zones">
        {zones.common.map(([id, label]) => (
          <option key={id} value={id}>{label}</option>
        ))}
      </optgroup>
      {zones.others.length > 0 && (
        <optgroup label="All time zones">
          {zones.others.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </optgroup>
      )}
    </>
  );

  return (
    <section id="contact" className="py-32 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <span className="text-xs font-inter font-medium tracking-[0.3em] uppercase text-primary/70 mb-4 block">
              Get in Touch
            </span>

            <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-6">
              Begin a <span className="text-primary italic">Conversation</span>
            </h2>

            <p className="font-inter text-sm font-light text-muted-foreground leading-relaxed mb-10">
              Every engagement begins with understanding. Whether you are an individual, investor, entrepreneur, or organization, NVeston provides disciplined analysis, strategic insight, and tailored advisory support designed around your objectives.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                  <Mail size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-inter text-xs text-muted-foreground uppercase tracking-wide">
                    Email
                  </p>
                  <p className="font-inter text-sm text-foreground">
                    contact@nveston.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-inter text-xs text-muted-foreground uppercase tracking-wide">
                    Location
                  </p>
                  <p className="font-inter text-sm text-foreground">
                    United States — Remote First
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Honeypot checked by Web3Forms; hidden from people and assistive tech. */}
              <input
                type="checkbox"
                name="botcheck"
                checked={form.botcheck}
                onChange={update('botcheck')}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: 'none' }}
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    {...errorProps('name')}
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Your name"
                    autoComplete="name"
                    maxLength={LIMITS.name}
                    required
                    className={fieldClass(errors.name)}
                  />
                  <FieldError id="contact-name-error" message={errors.name} />
                </div>

                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    {...errorProps('email')}
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="your@email.com"
                    autoComplete="email"
                    maxLength={LIMITS.email}
                    required
                    className={fieldClass(errors.email)}
                  />
                  <FieldError id="contact-email-error" message={errors.email} />
                </div>
              </div>

              <div>
                <div>
                  <label htmlFor="contact-type" className={labelClass}>
                    I am a...
                  </label>
                  <select
                    {...errorProps('type')}
                    value={form.type}
                    onChange={update('type')}
                    required
                    className={fieldClass(errors.type)}
                  >
                    <option value="">Select your profile</option>
                    {PROFILES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <FieldError id="contact-type-error" message={errors.type} />
                </div>

                <div className="mt-6">
                  <label htmlFor="contact-purpose" className={labelClass}>
                    What would you like to discuss?
                  </label>
                  <select
                    {...errorProps('purpose')}
                    value={form.purpose}
                    onChange={update('purpose')}
                    required
                    className={fieldClass(errors.purpose)}
                  >
                    <option value="">Select a topic</option>
                    {PURPOSES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <FieldError id="contact-purpose-error" message={errors.purpose} />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isConsultation && (
                  <motion.fieldset
                    key="consultation"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <legend className="sr-only">Consultation request details</legend>
                    <div className="border border-primary/20 bg-primary/[0.03] rounded-sm p-5 sm:p-6 space-y-6">
                      <p className="font-inter text-sm font-light text-muted-foreground leading-relaxed">
                        Share your preferred date and time for a 15-minute introductory conversation. NVeston will review your request and follow up by email to confirm a mutually convenient appointment.
                      </p>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="contact-prefDate" className={labelClass}>
                            Preferred Consultation Date
                          </label>
                          <input
                            {...errorProps('prefDate')}
                            type="date"
                            value={form.prefDate}
                            onChange={update('prefDate')}
                            min={minDate}
                            max={maxDate}
                            required
                            style={nativePickerStyle}
                            className={fieldClass(errors.prefDate)}
                          />
                          <FieldError id="contact-prefDate-error" message={errors.prefDate} />
                        </div>

                        <div>
                          <label htmlFor="contact-prefTime" className={labelClass}>
                            Preferred Consultation Time
                          </label>
                          <input
                            {...errorProps('prefTime')}
                            type="time"
                            value={form.prefTime}
                            onChange={update('prefTime')}
                            step={900}
                            required
                            style={nativePickerStyle}
                            className={fieldClass(errors.prefTime)}
                          />
                          <FieldError id="contact-prefTime-error" message={errors.prefTime} />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-timeZone" className={labelClass}>
                          Your Time Zone
                        </label>
                        <select
                          {...errorProps('timeZone')}
                          aria-describedby={errors.timeZone ? 'contact-timeZone-error' : 'contact-timeZone-hint'}
                          value={form.timeZone}
                          onChange={update('timeZone')}
                          required
                          style={nativePickerStyle}
                          className={fieldClass(errors.timeZone)}
                        >
                          <option value="">Select your time zone</option>
                          {zoneOptions}
                        </select>
                        {errors.timeZone ? (
                          <FieldError id="contact-timeZone-error" message={errors.timeZone} />
                        ) : (
                          <p id="contact-timeZone-hint" className="font-inter text-xs text-muted-foreground/80 mt-2">
                            {form.timeZone && form.timeZone === detectedZone
                              ? 'Detected from your device. Change it if needed.'
                              : 'Your preferred time will be recorded in this time zone.'}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-border/60">
                        <p className="font-inter text-xs text-muted-foreground uppercase tracking-wide mt-4 mb-4">
                          Alternative Availability <span className="normal-case tracking-normal text-muted-foreground/70">(optional)</span>
                        </p>
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="contact-altDate" className={labelClass}>
                              Date
                            </label>
                            <input
                              {...errorProps('altDate')}
                              type="date"
                              value={form.altDate}
                              onChange={update('altDate')}
                              min={minDate}
                              max={maxDate}
                              style={nativePickerStyle}
                              className={fieldClass(errors.altDate)}
                            />
                            <FieldError id="contact-altDate-error" message={errors.altDate} />
                          </div>
                          <div>
                            <label htmlFor="contact-altTime" className={labelClass}>
                              Time
                            </label>
                            <input
                              {...errorProps('altTime')}
                              type="time"
                              value={form.altTime}
                              onChange={update('altTime')}
                              step={900}
                              style={nativePickerStyle}
                              className={fieldClass(errors.altTime)}
                            />
                            <FieldError id="contact-altTime-error" message={errors.altTime} />
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="contact-altTimeZone" className={labelClass}>
                              Time Zone
                            </label>
                            <select
                              {...errorProps('altTimeZone')}
                              value={form.altTimeZone}
                              onChange={update('altTimeZone')}
                              style={nativePickerStyle}
                              className={fieldClass(errors.altTimeZone)}
                            >
                              <option value="">Select time zone</option>
                              {zoneOptions}
                            </select>
                            <FieldError id="contact-altTimeZone-error" message={errors.altTimeZone} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.fieldset>
                )}
              </AnimatePresence>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  {isConsultation ? 'Briefly Describe Your Project or Question' : 'Message'}
                </label>
                <textarea
                  {...errorProps('message')}
                  aria-describedby={
                    [errors.message && 'contact-message-error', isConsultation && 'contact-message-hint']
                      .filter(Boolean)
                      .join(' ') || undefined
                  }
                  value={form.message}
                  onChange={update('message')}
                  placeholder={
                    isConsultation
                      ? 'Briefly describe your business, project, financial question, or the decision you would like to discuss.'
                      : 'Briefly describe your objectives and how we may assist.'
                  }
                  rows={5}
                  maxLength={LIMITS.message}
                  required
                  className={`w-full bg-card/50 border ${errors.message ? 'border-red-400/60' : 'border-border'} focus:border-primary/40 rounded-sm font-inter text-sm px-4 py-3 outline-none resize-none`}
                />
                <FieldError id="contact-message-error" message={errors.message} />
                {isConsultation && (
                  <p id="contact-message-hint" className="font-inter text-xs text-muted-foreground/80 mt-2">
                    Please do not include account numbers, passwords, Social Security numbers, or confidential financial statements.
                  </p>
                )}
              </div>

              <div role="status" aria-live="polite">
                {status.text && (
                  <p className={`font-inter text-sm ${status.kind === 'error' ? 'text-red-400' : 'text-primary'}`}>
                    {status.text}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-inter font-medium text-sm tracking-wide rounded-sm hover:bg-primary/90 transition-all duration-300 inline-flex items-center justify-center disabled:opacity-60"
              >
                {sending ? 'Sending...' : isConsultation ? 'Request Consultation' : 'Send Inquiry'}
                {!sending && <ArrowRight size={16} className="ml-2" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
