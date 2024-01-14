// PetForm.js
'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://kkygvnwmsjwqlwutbfhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreWd2bndtc2p3cWx3dXRiZmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MzkyNzMsImV4cCI6MjAyMDMxNTI3M30.0LtmbiiaI3EF_HicZbhPDsU_Scdu_h19N20coxH-M2M');

const PetForm = ({ userEmail, onPetInfoSubmit }) => {
    const [user, setUser] = useState(null);
    const [pet, setPet] = useState({
        name: '',
        birthday: '',
        breed: '',
        owner: userEmail,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Retrieve the user information
                const { data: user, error } = await supabase.auth.getUser();

                // Handle the case when the user is not authenticated
                if (error || !user) {
                    console.error('Error fetching user data:', error);
                    // Redirect to login or handle the scenario appropriately
                    return;
                }

                setUser(user);
                console.log('User:', user);
            } catch (error) {
                console.error('Unhandled error during user data fetch:', error);
            }
        };

        fetchUserData();
    }, [supabase.auth]);


    const handlePetInfoSubmit = async () => {
        try {

            // 2. Save pet information to the 'pets' table
            const { data, error: upsertError } = await supabase
                .from('pets')
                .upsert([
                    {
                        // Assuming you have state variables like petName, petBirthday, petBreed, etc.
                        name: pet.name,
                        birthday: pet.birthday,
                        breed: pet.breed,
                        // Link the pet to the user using the userId
                        user_email: user.user.email,
                    },
                ]);

            // Check for errors during the upsert operation
            if (upsertError) {
                console.error('Pet information upsert error:', upsertError.message);
                // Handle error appropriately (e.g., show an error message to the user)
            } else {
                console.log('Pet information saved successfully!');
                // Notify the parent component to move to the next step
                onPetInfoSubmit();
            }
        } catch (error) {
            console.error('Unhandled error during pet info submission:', error);
            // Handle other errors if needed
        }
    };

    return (
        <div className="fixed inset-0 overflow-y-auto p-4 flex justify-center items-center rounded-lg shadow-md">
            <div className="bg-white rounded-md p-8 max-w-md w-full">
                <h2 className="text-2xl text-center font-bold mb-4">Add Pet</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Pet Name:</label>
                    <input
                        type="text"
                        value={pet.name}
                        onChange={(e) => setPet({ ...pet, name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Birthday:</label>
                    <input
                        type="date"
                        value={pet.birthday}
                        onChange={(e) => setPet({ ...pet, birthday: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Breed:</label>
                    <input
                        type="text"
                        value={pet.breed}
                        onChange={(e) => setPet({ ...pet, breed: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <button
                    onClick={handlePetInfoSubmit}
                    className="w-full mt-4 p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                >
                    Add This Pet
                </button>
            </div>
        </div>
    );
};

export default PetForm;
