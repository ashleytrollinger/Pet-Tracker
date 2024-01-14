'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import DateForm from '../DateForm/page';

const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
    const remainingSeconds = ((seconds % 86400) % 3600) % 60;

    const formattedTime = `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`;

    return formattedTime;
};

const DatesTracker = ({ user }) => {
    const [dates, setDates] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient('https://kkygvnwmsjwqlwutbfhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreWd2bndtc2p3cWx3dXRiZmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MzkyNzMsImV4cCI6MjAyMDMxNTI3M30.0LtmbiiaI3EF_HicZbhPDsU_Scdu_h19N20coxH-M2M');

    const getDates = async () => {
        try {
            const response = await supabase.from('dates').select('*').eq('user_email', user.user.email);
            if (response.error) {
                throw response.error;
            }

            const dates = response.data || [];
            return dates;
        } catch (error) {
            return [];
        }
    };

    const addDate = async (date, appoi) => {
        try {
            if (!user.user || !user.user.email) {
                console.error('User or user email is undefined.');
                return null;
            }

            const userEmail = user.user.email;

            const response = await supabase
                .from('dates')
                .insert([{ ...date, user_email: userEmail, created_at: new Date() }]);

            console.log('Supabase response:', response);

            if (!response || response.error) {
                console.error('Error adding date:', response?.error);
                return null;
            }

            const [newDate] = response.data || [];
            console.log('New date added:', newDate);

            return newDate;
        } catch (error) {
            console.error('Error adding date:', error);
            return null;
        }
    };


    const deleteDate = async (dateId) => {
        try {
            await supabase
                .from('dates')
                .delete()
                .eq('id', dateId);

            setDates((prevDates) => prevDates.filter((date) => date.id !== dateId));
        } catch (error) {
            console.error('Error deleting date:', error);
        }
    };

    const fetchDates = async () => {
        const dates = await getDates();
        setDates(dates);
    };

    useEffect(() => {
        fetchDates();
    }, [user]);

    return (
        <div className="container mx-auto p-8">
            <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold mr-4">Dates Tracker Component</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    +
                </button>
            </div>
            <div className="mb-4 flex flex-wrap">
                <p className="w-full mb-4">Keep track of upcoming immunizations or vet visits.</p>
                {showAddForm && (
                    <DateForm onCancel={() => setShowAddForm(false)} onAddDate={addDate} loading={loading} />
                )}

                {dates.map((date, index) => (
                    <div key={index} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/3 p-2">
                        <div className="border p-4 shadow-md bg-white">
                            <h2 className="text-lg font-semibold">{date.name}</h2>
                            <h3>Date: {new Date(date.date).toLocaleDateString()}</h3>
                            <p>Time Remaining: {formatTime(Math.floor((new Date(date.date) - new Date()) / 1000))}</p>

                            <button
                                onClick={() => deleteDate(date.id)}
                                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                            >
                                Delete Date
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DatesTracker;
