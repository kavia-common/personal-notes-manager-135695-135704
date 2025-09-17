export const Colors = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  success: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  shadow: 'rgba(0,0,0,0.08)',
};

export const Shadows = {
  soft: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const Spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const Typography = {
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.muted,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
  },
  small: {
    fontSize: 12,
    color: Colors.muted,
  },
};

export const Gradients = {
  header: ['#EBF2FF', '#FFFFFF'],
};
