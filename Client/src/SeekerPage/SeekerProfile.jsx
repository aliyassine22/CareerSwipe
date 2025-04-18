import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SeekerProfileForm from '../Components/SeekerComponents/SeekerProfileForm';

const SeekerProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        desiredJobTitle: '',
        experienceLevel: '',
        education: '',
        skills: []
    });
    const [newSkill, setNewSkill] = useState('');
    const [cvFileName, setCvFileName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Get user ID from localStorage (assuming it's stored during login)
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/seeker/profile/${userId}`);
            setProfile(response.data);
            if (response.data.cvFile?.originalName) {
                setCvFileName(response.data.cvFile.originalName);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load profile');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        if (newSkill && !profile.skills.includes(newSkill)) {
            setProfile(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:4000/seeker/profile/${userId}`, profile);
            setSuccessMessage('Profile updated successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to update profile');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCvUpload = async (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            const formData = new FormData();
            formData.append('cvFile', file);
            try {
                await axios.post(`http://localhost:4000/seeker/cv/${userId}`, formData);
                setCvFileName(file.name);
                setSuccessMessage('CV uploaded successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                setError('Failed to upload CV');
                setTimeout(() => setError(''), 3000);
            }
        } else {
            setError('Please upload a PDF file');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCvRemove = async () => {
        try {
            await axios.delete(`http://localhost:4000/seeker/cv/${userId}`);
            setCvFileName('');
            setSuccessMessage('CV removed successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to remove CV');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCvDownload = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/seeker/cv/${userId}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', cvFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Failed to download CV');
            setTimeout(() => setError(''), 3000);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
                        Your Profile
                    </h1>
                    <SeekerProfileForm
                        profile={profile}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                        onAddSkill={handleAddSkill}
                        onRemoveSkill={handleRemoveSkill}
                        newSkill={newSkill}
                        setNewSkill={setNewSkill}
                        cvFileName={cvFileName}
                        onCvUpload={handleCvUpload}
                        onCvDownload={handleCvDownload}
                        onCvDelete={handleCvRemove}
                        error={error}
                        successMessage={successMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default SeekerProfile;
