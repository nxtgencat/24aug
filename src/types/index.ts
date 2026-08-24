export type Role = 'admin' | 'doctor' | 'receptionist' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  mobile: string;
  email: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  insurance: string;
  medicalHistory: string;
  status: 'Active' | 'Admitted' | 'Discharged';
  avatar?: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  qualification: string;
  experience: number;
  fee: number;
  mobile: string;
  email: string;
  availability: string;
  status: 'Available' | 'On Leave' | 'Busy';
  avatar?: string;
}

export interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  type: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'appointment' | 'billing' | 'lab' | 'prescription';
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier: string;
}

export interface MedicalRecord {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
}

export interface RxItem {
  medicine: string;
  dose: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  items: RxItem[];
  notes?: string;
}

export interface LabReport {
  id: string;
  patient: string;
  test: string;
  date: string;
  status: 'Pending' | 'Ready';
  fileName?: string;
  fileUrl?: string;
  summary?: string;
}

export interface InvoiceItem {
  label: string;
  amount: number;
}

export interface Invoice {
  id: string;
  patient: string;
  date: string;
  items: InvoiceItem[];
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface ClinicLocation {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Lab' | 'Pharmacy';
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}
