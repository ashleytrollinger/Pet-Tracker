'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TrackerForm from '../TrackerForm/page';
import Occurrences from '../Occurances/page';

const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
    const remainingSeconds = ((seconds % 86400) % 3600) % 60;

    const formattedTime = `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`;

    return formattedTime;
};

const Tracker = ({ user }) => {
    const [trackers, setTrackers] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showOccurrences, setShowOccurrences] = useState([]);

    const supabase = createClient('https://kkygvnwmsjwqlwutbfhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreWd2bndtc2p3cWx3dXRiZmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MzkyNzMsImV4cCI6MjAyMDMxNTI3M30.0LtmbiiaI3EF_HicZbhPDsU_Scdu_h19N20coxH-M2M');

    const getHabits = async () => {
        try {
            const response = await supabase.from('habits').select('*').eq('user_email', user.user.email);
            if (response.error) {
                throw response.error;
            }

            const habits = response.data || [];

            return habits;
        } catch (error) {

            return [];
        }
    };

    const addHabit = async (habitName) => {
        try {
            if (!user.user || !user.user.email) {
                console.error('User or user email is undefined.');
                return null;
            }

            const userEmail = user.user.email;

            const { data: [newHabit] } = await supabase
                .from('habits')
                .insert([{ name: habitName, user_email: userEmail, created_at: new Date() }]);

            return newHabit;
        } catch (error) {
            console.error('Error adding habit:', error);
            return null;
        }
    };

    const handlePressButton = async (index) => {
        try {
            await updateHabitStartTime(trackers[index].id);

            setTrackers((prevTrackers) => {
                const updatedTrackers = [...prevTrackers];
                updatedTrackers[index].created_at = new Date(); // Update the created_at column
                return updatedTrackers;
            });
        } catch (error) {
            console.error('Error updating habit start time:', error);
        }
    };

    const updateHabitStartTime = async (habitId) => {
        try {
            await supabase
                .from('habits')
                .update({ created_at: new Date() })
                .eq('id', habitId);
        } catch (error) {
            console.error('Error updating habit start time:', error);
        }
    };

    useEffect(() => {
        const fetchHabits = async () => {
            const habits = await getHabits();
            setTrackers(habits);
            // Initialize showOccurrences array with false for each tracker
            setShowOccurrences(Array(habits.length).fill(false));
        };

        fetchHabits();
    }, [user]);

    const deleteHabit = async (habitId) => {
        try {
            await supabase
                .from('habits')
                .delete()
                .eq('id', habitId);

            setTrackers((prevTrackers) => prevTrackers.filter((tracker) => tracker.id !== habitId));
            setShowOccurrences((prev) => prev.filter((_, i) => i !== habitId));
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const toggleOccurrences = (index) => {
        setShowOccurrences(() => Array(trackers.length).fill(false));  // Reset all occurrences to false
        setShowOccurrences((prev) => {
            const updatedOccurrences = [...prev];
            updatedOccurrences[index] = true;
            return updatedOccurrences;
        });
    };



    useEffect(() => {
        const fetchHabits = async () => {
            const habits = await getHabits();
            setTrackers(habits);
        };

        fetchHabits();
    }, [user]);

    return (
        <div className="container mx-auto p-8">
            <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold mr-4">Trackers Component</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    +
                </button>
            </div>
            <div className="mb-4">
                <p className="text-lg mb-4">Keep a note of your dogs' habits.</p>
                {showAddForm && (
                    <TrackerForm
                        onCancel={() => setShowAddForm(false)}
                        onAddTracker={addHabit}
                    />
                )}

                {trackers.map((tracker, index) => (
                    <div key={index} className="border p-4 mb-4 rounded-md shadow-md bg-white">
                        <h3 className="text-lg font-semibold">{tracker.name}</h3>
                        <p>Last Occurrence: {formatTime(Math.floor((new Date() - new Date(tracker.created_at)) / 1000))}</p>

                        <div className="flex mt-4">
                            <button
                                onClick={() => handlePressButton(index)}
                                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600 mr-2"
                            >
                                Restart Time
                            </button>

                            <button
                                onClick={() => deleteHabit(tracker.id)}
                                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                            >
                                Delete Tracker
                            </button>
                        </div>

                        {/* 
                    <button
                        onClick={() => toggleOccurrences(index)}
                        className="mt-2 bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                    >
                        {showOccurrences[index] ? 'Hide Occurrences' : 'See Occurrences'}
                    </button>

                    {showOccurrences[index] && <Occurrences />} 
                    */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracker;
