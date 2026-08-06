/* ============================================
   Footer — minimal footer
   ============================================ */

const Footer = () => (
  <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] py-4 px-6 mt-auto">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-tertiary)]">
      <p>&copy; {new Date().getFullYear()} ABES Engineering College. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-primary-600 transition-colors">Help & Support</a>
      </div>
    </div>
  </footer>
);

export default Footer;
