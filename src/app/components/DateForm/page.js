'use client';
import React, { useState, useEffect } from 'react';

const DateForm = ({ onCancel, onAddDate }) => {
    const [appointmentType, setAppointmentType] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddDate = async () => {
        // Check if all fields are provided
        if (!appointmentType || !date) {
            alert('Please provide all the details.');
            return;
        }

        try {
            setLoading(true);
            // Convert the date string to a JavaScript Date object
            const formattedDate = new Date(date);

            // Call the onAddDate function passed as a prop
            const newDate = await onAddDate({ name: appointmentType, date: formattedDate });
            console.log('New date added:', newDate);

            // Clear the form fields on successful addition
            if (newDate) {
                setAppointmentType('');
                setDate('');
                onCancel(); // Close the form
            }
        } catch (error) {
            console.error('Error adding date:', error);
        } finally {
            setLoading(false);
        }
    };






    return (
        <div className="border p-4 mb-4">
            <h3 className="text-lg font-semibold">Add New Date</h3>
            <label className="block my-2">
                Appointment Type:
                <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="border rounded-md p-1 w-full"
                >
                    <option value="" disabled>Select Appointment Type</option>
                    <option value="rabies_shot">Rabies Shot</option>
                    <option value="DA2PP">DA2PP</option>
                    <option value="Bordetella">Bordetella</option>
                    <option value="Canine_Influenza">Canine Influenza</option>
                    <option value="Check_Up">Check Up</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Dentist">Dentist</option>
                </select>
            </label>
            <label className="block my-2">
                Date:
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded-md p-1"
                />
            </label>
            <div className="flex justify-between mt-4">
                <button
                    onClick={handleAddDate}
                    className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                >
                    {loading ? 'Adding...' : 'Add Date'}
                </button>
                <button
                    onClick={onCancel}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    );

};
export default DateForm;
