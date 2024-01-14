'use client';
import React, { useState } from 'react';

export default function TrackerForm({ onCancel, onAddTracker }) {
    const [habitName, setHabitName] = useState('');
    const [habitDescription, setHabitDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Perform validation if needed

        // Pass the habit name and description to the onAddTracker function
        onAddTracker({ name: habitName, description: habitDescription });

        // Clear the form fields after submission
        setHabitName('');
        setHabitDescription('');
    };

    return (
        <div className="mb-4">
            <form onSubmit={handleSubmit} className="flex items-center">
                <div className="flex flex-col mr-4">
                    <label className="text-lg">Habit Name:</label>
                    <input
                        type="text"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        className="w-full border border-gray-400 p-2 rounded-md focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="flex flex-col mr-4">
                    <label className="text-lg">Habit Description:</label>
                    <textarea
                        value={habitDescription}
                        onChange={(e) => setHabitDescription(e.target.value)}
                        className="w-full border border-gray-400 p-2 rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                >
                    Add Habit Tracker
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="ml-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}
