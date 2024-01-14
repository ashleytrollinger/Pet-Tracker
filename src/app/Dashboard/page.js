'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PetForm from '../PetForm/page';
import Tracker from '../components/Tracker/page';
import Dates from '../components/Dates/page';

import { createClient } from '@supabase/supabase-js';

const Dashboard = () => {
    const [showPetForm, setShowPetForm] = useState(false);
    const [user, setUser] = useState(null);
    const [userPets, setUserPets] = useState([]);
    const [petFormStep, setPetFormStep] = useState(1);
    const router = useRouter();

    const supabase = createClient('https://kkygvnwmsjwqlwutbfhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreWd2bndtc2p3cWx3dXRiZmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MzkyNzMsImV4cCI6MjAyMDMxNTI3M30.0LtmbiiaI3EF_HicZbhPDsU_Scdu_h19N20coxH-M2M');

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

                // Fetch and set user's pets
                const { data: pets, error: petsError } = await supabase
                    .from('pets')
                    .select('*')
                    .eq('user_email', user.user.email);

                if (petsError) {
                    console.error('Error fetching user pets:', petsError);
                } else {
                    setUserPets(pets || []);
                }
            } catch (error) {
                console.error('Unhandled error during user data fetch:', error);
            }
        };

        fetchUserData();
    }, [supabase.auth]);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Error during logout:', error);
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error('Unhandled error during logout:', error);
        }
    };

    const handleAddPetClick = () => {
        setShowPetForm(true);
    };

    const handlePetInfoSubmit = async () => {
        // Update the user's pets after pet info submission
        const { data: updatedPets, error } = await supabase
            .from('pets')
            .select('*')
            .eq('user_email', user.user.email);

        if (error) {
            console.error('Error fetching updated user pets:', error);
        } else {
            setUserPets(updatedPets || []);
        }

        // Handle any other logic you need after pet info submission
        setPetFormStep(2); // For example, moving to the next step
    };

    const calculateAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);

        const yearsDiff = today.getFullYear() - birthDate.getFullYear();
        const monthsDiff = today.getMonth() - birthDate.getMonth();
        const daysDiff = today.getDate() - birthDate.getDate();

        let ageInMonths = yearsDiff * 12 + monthsDiff;

        if (daysDiff < 0) {
            // If the birth date is later in the month, subtract a month
            ageInMonths -= 1;
        }

        const years = Math.floor(ageInMonths / 12);
        const months = ageInMonths % 12;

        return `${years} years ${months} months`;
    };
    return (
        <div className="container mx-auto p-8 border rounded-md mb-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-5xl mt-6 mb-8">Dashboard</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {showPetForm && <PetForm onPetInfoSubmit={handlePetInfoSubmit} onClose={() => setShowPetForm(false)} />}
            {user && <p className="text-lg mb-4">Welcome back, {user.user.email}!</p>}

            {/* Display user's pets */}
            <div className="mb-8 ">
                <h2 className="text-2xl font-bold mb-4">Your Pets</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={handleAddPetClick}
                        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                    >
                        + Add Pet
                    </button>
                </div>
                {userPets.map((pet) => (
                    <div key={pet.id} className="border border-gray-500 p-6 rounded-md mb-4 bg-slate-100">
                        <p className="text-2xl font-semibold mb-4">{pet.name}</p>
                        <ul className="list-none ml-6">
                            <li className="text-gray-600">
                                <span className="font-semibold">Birthday:</span> {pet.birthday}
                            </li>
                            <li className="text-gray-600">
                                <span className="font-semibold">Age:</span> {calculateAge(pet.birthday)}
                            </li>
                            <li className="text-gray-600">
                                <span className="font-semibold">Breed:</span> {pet.breed}
                            </li>
                            {/* Add more details if needed */}
                        </ul>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mb-4">Tracker and Dates</h2>
            <div className="mb-8 p-6 border border-gray-500 rounded-md bg-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className='mb-4 md:mb-0 rounded-md border border-gray-500'>
                        <Tracker user={user} />
                    </div>
                    <div className='rounded-md border border-gray-500'>
                        <Dates user={user} />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
