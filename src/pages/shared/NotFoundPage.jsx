/* ============================================
   NotFoundPage — animated 404 page
   ============================================ */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-md"
    >
      {/* Animated 404 */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-8"
      >
        <h1 className="text-[120px] sm:text-[160px] font-black leading-none text-gradient select-none">
          404
        </h1>
      </motion.div>

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
        Page Not Found
      </h2>
      <p className="text-[var(--text-secondary)] mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <Link to="/">
        <Button icon={HomeIcon} size="lg">
          Back to Home
        </Button>
      </Link>
    </motion.div>
  </div>
);

export default NotFoundPage;
