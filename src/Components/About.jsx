import React from 'react';
import '../Css/About.css';
import { FaLinkedin, FaEnvelope, FaFilePdf, FaSearch, FaShareAlt, FaUserPlus, FaSignInAlt, FaFileInvoiceDollar, FaThList} from 'react-icons/fa';

export default function About() {
  return (
    <div className="about-page">
      <section className="about-section">
  <h2>Developed By</h2>
  <p><strong>Athang Surve</strong></p>
  <p>
    I’m an Electronics and Computer Science student passionate about building practical web applications
    that solve real-world problems. This project was developed to simplify bill management
    for cycle installation services.
  </p>
  <p>
    The application is built using <strong>React</strong> for the frontend and <strong>Firebase</strong> for user authentication and data handling.
    It reflects my interest in full-stack development and user-focused design.
  </p>
  <p>
    I’m constantly learning and improving — feel free to connect with me for collaboration or feedback.
  </p>
</section>


      <section className="about-section">
        <h2>Features</h2>
        <ul>
  <li>
    <FaUserPlus style={{ marginRight: '8px', fill: '#007bff' }} /> {/* Blue */}
    Create an account using your email — Quickly register with your email to get started.
  </li>
  <li>
    <FaSignInAlt style={{ marginRight: '8px', fill: '#28a745' }} /> {/* Green */}
    Login securely into the website — Access your dashboard safely anytime.
  </li>
  <li>
    <FaFileInvoiceDollar style={{ marginRight: '8px', fill: '#fd7e14' }} /> {/* Orange */}
    Create bills for cycle installations easily — Fill item details and generate bills in seconds.
  </li>
  <li>
    <FaThList style={{ marginRight: '8px', fill: '#6c757d' }} /> {/* Slate Gray */}
    View and manage all your bills — Check or review bills in your dashboard.
  </li>
</ul>
      </section>

      <section className="about-section">
        <h2>Future Scope</h2>
        <ul className="future-list">
          <li>
            <FaFilePdf className="feature-icon"  style={{ fill: '#D32F2F' }}/>
            Convert bills into downloadable PDF files — Easily download well-formatted PDF versions of your bills for sharing, printing, or record-keeping.
          </li>
          <li>
            <FaSearch className="feature-icon" style={{ fill: '#1E88E5' }} />
            Search and filter bills — Find bills quickly by name or date using an intuitive filter and search system.
          </li>
          <li>
            <FaShareAlt className="feature-icon"  style={{ fill: '#9C27B0' }}/>
            Share bills via link — Generate secure links to share bills directly with clients, no downloads or login required.
          </li>
        </ul>
      </section>

      <footer className="about-footer">
        <h3>Connect with me</h3>
        <div className="contact-icons">
          <a
            href="https://linkedin.com/in/athang-surve-091b8b258"
            target="_blank"
            rel="noopener noreferrer"
          >
           <FaLinkedin size={28}  style={{ fill: '#0A66C2' }}  />

          </a>
          <a href="mailto:athangvsurve2005@gmail.com">
            <FaEnvelope size={28}  style={{

    fill: '#6e6e6e',
    
    }} />
          </a>
        </div>
      </footer>
    </div>
  );
}
