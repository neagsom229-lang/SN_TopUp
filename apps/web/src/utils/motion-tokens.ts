export const motionTokens = {
  durations: {
    fast: 0.2,
    normal: 0.35,
    slow: 0.6,
  },
  easings: {
    smooth: [0.25, 1, 0.5, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    snappy: [0.4, 0, 0.2, 1],
  },
  springs: {
    gentle: { type: 'spring', stiffness: 120, damping: 14 },
    snappy: { type: 'spring', stiffness: 300, damping: 20 },
    bouncy: { type: 'spring', stiffness: 400, damping: 10 },
  },
};
