export const ROLES = ['admin','doctor','receptionist','patient'] as const;

export const PERMISSIONS: Record<string, string[]> = {
  admin: ['*'],
  doctor: ['view_patients','prescriptions','medical_records','appointments'],
  receptionist: ['patients','appointments','billing','checkin'],
  patient: ['view_profile','book_appointment','view_prescriptions','view_bills'],
};

export const DEPARTMENTS = ['Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology','General'];

export const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
