import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Magnetic } from './UI';
/* ═══ CONTACT ═══ */
function Contact() {
  const ref = useRef(null);
  const [form, setForm] = useState({ botField: '', name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useGSAP(() => {
    const el = ref.current;

    gsap.fromTo(el.querySelector('.contact-heading'),
      { opacity: 0, y: 30 },
      { scrollTrigger: { trigger: el, start: 'top 80%' }, opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(el.querySelectorAll('.reveal'),
      { y: 30, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 75%' }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, { scope: ref });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const formData = new URLSearchParams();
      formData.append('form-name', 'contact');
      formData.append('bot-field', form.botField);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('message', form.message);
      
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      setSent(true);
      setForm({ botField: '', name: '', email: '', message: '' });
    } catch (err) { console.error(err); }
    setSending(false);
  };

  return (
    <section className="sect sect-contact" id="contact" ref={ref}>
      <div className="contact-split">
        <div className="reveal">
          <h2 className="contact-heading gradient-text-1">
            Let's build<br />something <em className="serif">together.</em>
          </h2>
          <p className="contact-info">
            Open to research collaborations, interesting projects,
            or conversations about ML architecture and systems design.
          </p>
          <div className="contact-links">
            <a href="mailto:aadiykhan@gmail.com">→ aadiykhan@gmail.com</a>
            <a href="https://github.com/AadiyKhan" target="_blank" rel="noopener noreferrer">→ github.com/AadiyKhan</a>
            <a href="https://linkedin.com/in/aadiykhan" target="_blank" rel="noopener noreferrer">→ linkedin.com/in/aadiykhan</a>
          </div>
        </div>
        <form className="form-stack reveal" name="contact" method="POST" data-netlify="true" onSubmit={submit}>
          <input type="hidden" name="form-name" value="contact" />
          <p style={{ display: 'none' }}>
            <label>
              Don't fill this out if you're human: 
              <input name="bot-field" value={form.botField} onChange={(e) => setForm({ ...form, botField: e.target.value })} />
            </label>
          </p>
          {sent ? (
            <div style={{ padding: '40px 0', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--cyan)' }}>
              Message sent. I'll be in touch. ✓
            </div>
          ) : (
            <>
              <div className="form-field">
                <label>Name</label>
                <input type="text" name="name" placeholder="Your name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" name="email" placeholder="your@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Message</label>
                <textarea name="message" placeholder="What's on your mind?" value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <Magnetic>
                <button type="submit" className="submit-btn" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message →'}
                </button>
              </Magnetic>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
export default Contact;