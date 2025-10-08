"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { useState } from 'react';

const mockData = [
    { id: 1, name: 'John Doe', regNo: '123', status: 'Pending' },
    { id: 2, name: 'Jane Smith', regNo: '456', status: 'Verified' },
    { id: 3, name: 'Alice Johnson', regNo: '789', status: 'Pending' },
];

const VerificationQueue = () => {
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredData = mockData.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase()) &&
        (statusFilter ? item.status === statusFilter : true)
    );

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <h2 className="text-xl font-semibold">Verification Queue</h2>
                <div className="flex space-x-2 mt-4">
                    <Input
                        placeholder="Filter by name or reg no"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    <div className="grid grid-cols-5 gap-2 p-2 font-semibold">
                        <div>ID</div>
                        <div>Name</div>
                        <div>Reg No</div>
                        <div>Status</div>
                        <div>Actions</div>
                    </div>
                    {filteredData.map((item) => (
                        <div key={item.id} className="grid grid-cols-5 gap-2 p-2 border-t">
                            <div>{item.id}</div>
                            <div>{item.name}</div>
                            <div>{item.regNo}</div>
                            <div>{item.status}</div>
                            <div className="flex space-x-2">
                                <Button variant="default" size="sm">Verify</Button>
                                <Button variant="default" size="sm">View</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="secondary">Load More</Button>
            </CardFooter>
        </Card>
    );
};

export default VerificationQueue;