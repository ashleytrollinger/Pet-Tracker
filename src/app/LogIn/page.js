// pages/LogIn.js
'use client'
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleLogIn = async () => {
        // Initialize Supabase client
        const supabase = createClient('https://kkygvnwmsjwqlwutbfhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreWd2bndtc2p3cWx3dXRiZmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MzkyNzMsImV4cCI6MjAyMDMxNTI3M30.0LtmbiiaI3EF_HicZbhPDsU_Scdu_h19N20coxH-M2M');

        try {
            
            const { user, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                alert(`Login error: ${error.message}` + error);
            } else {
                console.log('Login successful!', user);
                router.push('/Dashboard'); // Redirect to the dashboard after successful login
            }
        } catch (error) {
            console.error('Unhandled error:', error);
            // Handle other errors if needed
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
            <label className="block mb-2 text-sm font-medium text-gray-600">Password:</label>
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />

            <button
                onClick={handleLogIn}
                className="w-full mt-6 p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
            >
                Log In
            </button>
            <Link href="/" className="text-center text-blue-500 hover:underline">
                Back
            </Link>
        </div>
    );
};

export default LogIn;
