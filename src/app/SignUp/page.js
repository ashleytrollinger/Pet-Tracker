'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const router = useRouter();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
    const handleNameChange = (e) => setName(e.target.value);

    const handleSignUp = async () => {

        // Validate input (e.g., check if passwords match)
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }



        // Initialize Supabase client
        const supabase = createClient('https://kkygvnwmsjwqlwutbfhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreWd2bndtc2p3cWx3dXRiZmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MzkyNzMsImV4cCI6MjAyMDMxNTI3M30.0LtmbiiaI3EF_HicZbhPDsU_Scdu_h19N20coxH-M2M');
        const usersTable = supabase.from('users');

        // Sign up the user
        const { user, error } = await supabase.auth.signUp({
            email,
            password, // Store the hashed password
        });

        // Handle sign-up success or error
        if (error) {
            alert(`Sign-up error: ${error.message}`);
        } else {
            // Add user details to the Supabase database
            const { data, error } = await usersTable
                .upsert([
                    {
                        email,
                        name,
                        password,
                    },
                ]);

            // Handle database update success or error
            if (error) {
                alert(`Database error: ${error.message}`);
            } else {
                router.push('/Dashboard');
                console.log('Sign-up successful!');
                // You can redirect the user to another page or perform any other actions here
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <label className="block mb-2 text-sm font-medium text-gray-600">Email:</label>
            <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />

            <label className="block mt-4 mb-2 text-sm font-medium text-gray-600">Password:</label>
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />

            <label className="block mt-4 mb-2 text-sm font-medium text-gray-600">Confirm Password:</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />

            <label className="block mt-4 mb-2 text-sm font-medium text-gray-600">Name:</label>
            <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />

            <button
                onClick={handleSignUp}
                className="w-full mt-6 p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
            >
                Sign Up
            </button>
            <Link href="/" className="text-center text-blue-500 hover:underline">
                Back
            </Link>
        </div>

    );
};

