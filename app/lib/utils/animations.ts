import { Variants } from 'framer-motion'

export const floatingVariants: Variants = {
  initial: {
    y: 0,
    opacity: 0,
  },
  animate: {
    y: [-10, 10, -10],
    opacity: 1,
    transition: {
      y: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
      opacity: {
        duration: 0.5,
      },
    },
  },
}

export const fadeInUp: Variants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const scaleIn: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const parallaxVariants: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}


