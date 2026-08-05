// ======================================================
// PulseCare Healthcare Management System
// doctors-data.js
//
// This file stores the details of all doctors available
// in the system.
//
// It is reused in:
// • Doctors Listing Page
// • Doctor Details Page
// • Appointment Booking Page
// • Admin Dashboard (Task 3)
// ======================================================

const doctors = Object.freeze([

    // ==================================================
    // Doctor 1
    // ==================================================
    {
        // Basic Information
        id: 1,
        name: "Dr. Sarah Johnson",
        department: "Cardiology",

        // Professional Information
        qualification: "MBBS, MD (Cardiology)",
        experience: "12 Years",

        // Consultation Details
        rating: 4.9,
        fee: 800,

        // Hospital Information
        hospital: "PulseCare Medical Center",
        location: "Vellore",
        consultationType: "Offline",
        status: "Available",

        // Profile Image
        image: "images/doctor1.jpg",

        // Available Appointment Slots
        availableSlots: [
            "09:00 AM",
            "10:30 AM",
            "02:00 PM"
        ],

        // About Doctor
        about: "Specialist in preventive and interventional cardiology with over 12 years of experience."
    },

    // ==================================================
    // Doctor 2
    // ==================================================
    {
        id: 2,
        name: "Dr. Michael Lee",
        department: "Neurology",

        qualification: "MBBS, DM (Neurology)",
        experience: "10 Years",

        rating: 4.8,
        fee: 900,

        hospital: "PulseCare Medical Center",
        location: "Vellore",
        consultationType: "Offline",
        status: "Available",

        image: "images/doctor2.jpg",

        availableSlots: [
            "11:00 AM",
            "01:00 PM",
            "04:00 PM"
        ],

        about: "Expert in neurological disorders, stroke management, and epilepsy treatment."
    },

    // ==================================================
    // Doctor 3
    // ==================================================
    {
        id: 3,
        name: "Dr. Emily Davis",
        department: "Dental",

        qualification: "BDS, MDS",
        experience: "8 Years",

        rating: 4.7,
        fee: 600,

        hospital: "PulseCare Medical Center",
        location: "Vellore",
        consultationType: "Offline",
        status: "Available",

        image: "images/doctor3.jpg",

        availableSlots: [
            "09:30 AM",
            "12:30 PM",
            "03:30 PM"
        ],

        about: "Experienced cosmetic and restorative dental surgeon."
    },

    // ==================================================
    // Doctor 4
    // ==================================================
    {
        id: 4,
        name: "Dr. David Wilson",
        department: "Orthopedics",

        qualification: "MBBS, MS (Orthopedics)",
        experience: "15 Years",

        rating: 4.9,
        fee: 1000,

        hospital: "PulseCare Medical Center",
        location: "Vellore",
        consultationType: "Offline",
        status: "Available",

        image: "images/doctor1.jpg",

        availableSlots: [
            "10:00 AM",
            "01:30 PM",
            "05:00 PM"
        ],

        about: "Specializes in bone, joint replacement, and sports injury treatment."
    },

    // ==================================================
    // Doctor 5
    // ==================================================
    {
        id: 5,
        name: "Dr. Sophia Martinez",
        department: "Pediatrics",

        qualification: "MBBS, MD (Pediatrics)",
        experience: "9 Years",

        rating: 4.8,
        fee: 700,

        hospital: "PulseCare Medical Center",
        location: "Vellore",
        consultationType: "Offline",
        status: "Available",

        image: "images/doctor2.jpg",

        availableSlots: [
            "09:00 AM",
            "11:30 AM",
            "02:30 PM"
        ],

        about: "Dedicated child specialist providing comprehensive pediatric care."
    },

    // ==================================================
    // Doctor 6
    // ==================================================
    {
        id: 6,
        name: "Dr. James Brown",
        department: "Cardiology",

        qualification: "MBBS, DM (Cardiology)",
        experience: "18 Years",

        rating: 5.0,
        fee: 1200,

        hospital: "PulseCare Medical Center",
        location: "Vellore",
        consultationType: "Offline",
        status: "Available",

        image: "images/doctor3.jpg",

        availableSlots: [
            "08:30 AM",
            "12:00 PM",
            "03:00 PM"
        ],

        about: "Senior consultant cardiologist with expertise in heart surgeries."
    },

    // ==================================================
    // Doctor 7
    // ==================================================
    {
        id: 7,
        name: "Dr. Olivia Taylor",
        department: "Neurology",

        qualification: "MBBS, DM",
        experience: "11 Years",

        rating: 4.8,
        fee: 950,

        hospital: "PulseCare Medical Center",
        location: "Vellore",
        consultationType: "Offline",
        status: "Available",

        image: "images/doctor1.jpg",

        availableSlots: [
            "10:00 AM",
            "01:00 PM",
            "04:30 PM"
        ],

        about: "Experienced neurologist specializing in migraine and nerve disorders."
    },

    // ==================================================
    // Doctor 8
    // ==================================================
    {
        id: 8,
        name: "Dr. Daniel White",
        department: "Dental",

        qualification: "BDS",
        experience: "7 Years",

        rating: 4.6,
        fee: 550,

        hospital: "PulseCare Medical Center",
        location: "Vellore",
        consultationType: "Offline",
        status: "Available",

        image: "images/doctor2.jpg",

        availableSlots: [
            "09:30 AM",
            "01:30 PM",
            "04:00 PM"
        ],

        about: "General dentist with expertise in root canal and smile correction."
    },

    // ==================================================
    // Doctor 9
    // ==================================================
    {
        id: 9,
        name: "Dr. Emma Green",
        department: "Orthopedics",

        qualification: "MBBS, MS",
        experience: "13 Years",

        rating: 4.9,
        fee: 1100,

        hospital: "PulseCare Medical Center",
        location: "Vellore",
        consultationType: "Offline",
        status: "Available",

        image: "images/doctor3.jpg",

        availableSlots: [
            "11:00 AM",
            "02:00 PM",
            "05:30 PM"
        ],

        about: "Orthopedic specialist focusing on fracture care and rehabilitation."
    },

    // ==================================================
    // Doctor 10
    // ==================================================
    {
        id: 10,
        name: "Dr. Liam Anderson",
        department: "Pediatrics",

        qualification: "MBBS, MD",
        experience: "10 Years",

        rating: 4.7,
        fee: 750,

        hospital: "PulseCare Medical Center",
        location: "Vellore",
        consultationType: "Offline",
        status: "Available",

        image: "images/doctor1.jpg",

        availableSlots: [
            "09:00 AM",
            "12:00 PM",
            "03:30 PM"
        ],

        about: "Pediatrician providing newborn care, vaccination, and child wellness."
    }

]);

// ======================================================
// End of Doctor Database
// ======================================================