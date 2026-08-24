import type { Patient, Doctor, Appointment, Medicine } from '../types';

export const mockPatients: Patient[] = Array.from({length: 28}, (_,i)=>({
  id: `P-${1001+i}`,
  name: ['Aarav Mehta','Sana Patel','Rohan Desai','Priya Singh','Kabir Rao','Ananya Gupta','Vikram Joshi','Neha Sharma'][i%8] + ` ${i+1}`,
  gender: (['Male','Female'] as const)[i%2],
  age: 22+(i%40),
  mobile: `98${String(10000000+i).padStart(8,'0')}`,
  email: `patient${i+1}@medicare.test`,
  bloodGroup: ['A+','B+','O+','AB+'][i%4],
  address: `${i+10} MG Road, Bengaluru`,
  emergencyContact: `98${String(20000000+i).padStart(8,'0')}`,
  insurance: i%3===0 ? 'Star Health' : 'N/A',
  medicalHistory: i%2===0 ? 'Hypertension' : 'No history',
  status: (['Active','Admitted','Discharged'] as const)[i%3],
}));

export const mockDoctors: Doctor[] = [
  { id:'D-101', name:'Dr. Aditi Sharma', department:'Cardiology', qualification:'MD Cardiology', experience:12, fee:1200, mobile:'9811111111', email:'aditi@medicare.test', availability:'Mon-Fri 9am-4pm', status:'Available' },
  { id:'D-102', name:'Dr. Raj Malhotra', department:'Neurology', qualification:'DM Neurology', experience:15, fee:1500, mobile:'9822222222', email:'raj@medicare.test', availability:'Tue-Sat 10am-5pm', status:'Available' },
  { id:'D-103', name:'Dr. Sneha Rao', department:'Orthopedics', qualification:'MS Ortho', experience:8, fee:900, mobile:'9833333333', email:'sneha@medicare.test', availability:'Mon-Thu 9am-2pm', status:'On Leave' },
  { id:'D-104', name:'Dr. Vikram Patil', department:'Pediatrics', qualification:'MD Pediatrics', experience:10, fee:800, mobile:'9844444444', email:'vikram@medicare.test', availability:'Mon-Fri 8am-1pm', status:'Busy' },
  { id:'D-105', name:'Dr. Nidhi Gupta', department:'Dermatology', qualification:'MD Dermatology', experience:7, fee:1000, mobile:'9855555555', email:'nidhi@medicare.test', availability:'Wed-Sun 11am-6pm', status:'Available' },
  { id:'D-106', name:'Dr. Arjun Singh', department:'General', qualification:'MBBS', experience:5, fee:600, mobile:'9866666666', email:'arjun@medicare.test', availability:'Mon-Sat 9am-3pm', status:'Available' },
];

export const mockAppointments: Appointment[] = Array.from({length: 16}, (_,i)=>({
  id:`A-${2001+i}`,
  patient: mockPatients[i].name,
  doctor: mockDoctors[i%mockDoctors.length].name,
  date: new Date(Date.now() + (i-8)*86400000).toISOString().slice(0,10),
  time: `${9+(i%8)}:00 ${i%2===0?'AM':'PM'}`,
  status: (['Upcoming','Completed','Cancelled'] as const)[i%3],
  type: ['Consultation','Follow-up','Emergency'][i%3],
}));

export const mockMedicines: Medicine[] = [
  { id:'M-1', name:'Paracetamol 500mg', category:'Analgesic', stock:12, price:25, supplier:'Cipla' },
  { id:'M-2', name:'Amoxicillin 250mg', category:'Antibiotic', stock:3, price:80, supplier:'Sun Pharma' },
  { id:'M-3', name:'Cetirizine 10mg', category:'Antihistamine', stock:45, price:30, supplier:'Dr Reddys' },
  { id:'M-4', name:'Metformin 500mg', category:'Antidiabetic', stock:2, price:55, supplier:'Lupin' },
];
export const dashboardStats = {
  patients: 1248, doctors: 42, appointmentsToday: 18, pendingBills: 7, pharmacyOrders: 23, labReports: 11, revenue: 342500
};
