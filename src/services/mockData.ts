import type { Patient, Doctor, Appointment, Medicine, MedicalRecord, Prescription, LabReport, Invoice, ClinicLocation } from '../types';

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
  { id:'M-5', name:'Pantoprazole 40mg', category:'Antacid', stock:28, price:95, supplier:'Zydus' },
  { id:'M-6', name:'Amlodipine 5mg', category:'Cardiac', stock:4, price:42, supplier:'Cipla' },
  { id:'M-7', name:'Azithromycin 500mg', category:'Antibiotic', stock:18, price:120, supplier:'Alkem' },
  { id:'M-8', name:'ORS Sachet', category:'Electrolyte', stock:64, price:20, supplier:'FDC' },
];

export const mockRecords: MedicalRecord[] = Array.from({length: 9}, (_,i)=>({
  id:`R-${3001+i}`,
  patient: mockPatients[i].name,
  doctor: mockDoctors[i%mockDoctors.length].name,
  date: new Date(Date.now() - (i*5+2)*86400000).toISOString().slice(0,10),
  diagnosis: ['Hypertension Stage 1','Type 2 Diabetes','Viral Fever','Lower Back Pain','Allergic Rhinitis','Migraine','Anemia','Gastritis','Bronchitis'][i],
  treatment: ['Medication + diet plan','Insulin adjustment','Rest + fluids','Physiotherapy','Antihistamines','Pain management','Iron supplements','PPI course','Inhaler therapy'][i],
  notes: i%3===0 ? 'Review after 2 weeks' : i%3===1 ? 'Lab work advised' : 'Stable — no follow-up needed',
}));

export const mockPrescriptions: Prescription[] = [
  { id:'RX-501', patient: mockPatients[0].name, doctor: mockDoctors[0].name, date:'2026-08-20', items:[
    { medicine:'Amlodipine 5mg', dose:'1 tablet', frequency:'Once daily (morning)', duration:'30 days' },
    { medicine:'Atorvastatin 10mg', dose:'1 tablet', frequency:'Once at night', duration:'30 days' },
  ], notes:'Avoid salty food. BP check weekly.' },
  { id:'RX-502', patient: mockPatients[1].name, doctor: mockDoctors[2].name, date:'2026-08-19', items:[
    { medicine:'Calcium + Vitamin D3', dose:'1 tablet', frequency:'Twice daily', duration:'60 days' },
  ], notes:'X-ray review in 3 weeks.' },
  { id:'RX-503', patient: mockPatients[2].name, doctor: mockDoctors[1].name, date:'2026-08-18', items:[
    { medicine:'Paracetamol 500mg', dose:'1 tablet', frequency:'Every 8 hours (as needed)', duration:'5 days' },
    { medicine:'Cetirizine 10mg', dose:'1 tablet', frequency:'Once at night', duration:'7 days' },
    { medicine:'ORS Sachet', dose:'1 sachet', frequency:'After each loose stool', duration:'3 days' },
  ] },
  { id:'RX-504', patient: mockPatients[3].name, doctor: mockDoctors[3].name, date:'2026-08-15', items:[
    { medicine:'Metformin 500mg', dose:'1 tablet', frequency:'Twice daily after meals', duration:'90 days' },
  ], notes:'HbA1c every 3 months.' },
];

export const mockLabReports: LabReport[] = Array.from({length: 8}, (_,i)=>({
  id:`LR-700${i+1}`,
  patient: mockPatients[(i*3)%mockPatients.length].name,
  test: ['Complete Blood Count','Lipid Profile','HbA1c','Thyroid Panel','Liver Function','Urine Routine','Vitamin D','ECG'][i],
  date: new Date(Date.now() - (i*2)*86400000).toISOString().slice(0,10),
  status: (['Ready','Ready','Pending','Ready','Pending','Ready','Pending','Ready'] as const)[i],
  summary: i%2===0 ? 'Within normal limits' : 'Slightly elevated — doctor review',
}));

export const mockInvoices: Invoice[] = Array.from({length: 8}, (_,i)=>{
  const consult = 600 + (i%4)*200;
  const lab = i%3===0 ? 800 : i%3===1 ? 450 : 0;
  return {
    id:`INV-${9001+i}`,
    patient: mockPatients[(i*2)%mockPatients.length].name,
    date: new Date(Date.now() - (i*3)*86400000).toISOString().slice(0,10),
    items:[{ label:'Consultation', amount:consult }, ...(lab?[{label:'Lab Charges', amount:lab}]:[]), {label:'Pharmacy', amount:(i+1)*40}],
    status: (['Paid','Paid','Pending','Overdue'] as const)[i%4],
  };
});

export const clinicLocations: ClinicLocation[] = [
  { id:'L-1', name:'MediCare Central Hospital', type:'Hospital', address:'12 MG Road, Bengaluru 560001', phone:'+91 80 4000 1000', hours:'24 × 7 Emergency', lat:12.9716, lng:77.5946 },
  { id:'L-2', name:'MediCare Indiranagar Clinic', type:'Clinic', address:'80 CMH Road, Indiranagar, Bengaluru 560038', phone:'+91 80 4000 1002', hours:'Mon–Sat 9am–8pm', lat:12.9784, lng:77.6408 },
  { id:'L-3', name:'MediCare Diagnostics — Jayanagar', type:'Lab', address:'9th Block, Jayanagar, Bengaluru 560069', phone:'+91 80 4000 1003', hours:'Mon–Sun 7am–9pm', lat:12.9250, lng:77.5938 },
  { id:'L-4', name:'MediCare Pharmacy — Koramangala', type:'Pharmacy', address:'5th Block, Koramangala, Bengaluru 560095', phone:'+91 80 4000 1004', hours:'24 × 7', lat:12.9352, lng:77.6245 },
  { id:'L-5', name:'MediCare Whitefield Clinic', type:'Clinic', address:'ITPL Main Road, Whitefield, Bengaluru 560066', phone:'+91 80 4000 1005', hours:'Mon–Sat 10am–7pm', lat:12.9698, lng:77.7500 },
];

export const dashboardStats = {
  patients: 1248, doctors: 42, appointmentsToday: 18, pendingBills: 7, pharmacyOrders: 23, labReports: 11, revenue: 342500
};
