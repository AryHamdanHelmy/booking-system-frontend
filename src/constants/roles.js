export const ROLE = {
  ADMIN:    'admin',
  THERAPIST: 'therapist',
  CUSTOMER: 'customer',
};

export const ROLE_LABEL = {
  admin:     'Admin',
  therapist: 'Terapis',
  customer:  'Pelanggan',
};

/** Boleh masuk panel admin. */
export const isStaff = (role) => role === ROLE.ADMIN || role === ROLE.THERAPIST;