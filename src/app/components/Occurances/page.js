import React from 'react';

const Occurrences = () => {
    // Assuming occurrences data structure, replace this with your actual data
    const occurrences = [
        { id: 1, date: '2022-01-01', description: 'Occurred on January 1, 2022' },
        { id: 2, date: '2022-02-15', description: 'Occurred on February 15, 2022' },
        // Add more occurrences as needed
    ];

    return (
        <div className="mt-2 p-2 bg-gray-100 border">
            <h4 className="text-lg font-semibold mb-2">Occurrences</h4>
            {occurrences.map((occurrence) => (
                <div key={occurrence.id} className="mb-2">
                    <p className="text-gray-700">{occurrence.date}</p>
                    <p>{occurrence.description}</p>
                </div>
            ))}
        </div>
    );
};

export default Occurrences;
