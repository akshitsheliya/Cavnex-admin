import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import projectService from '../../services/projectService'
import clientService from '../../services/clientService'

const ProjectForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const clientIdFromUrl = searchParams.get('clientId')
    const isEditMode = Boolean(id)

    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [clients, setClients] = useState([])
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        client: clientIdFromUrl || '',
        projectType: 'website',
        status: 'planning',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        deadline: '',
        budget: '',
        amountPaid: '0',
        progress: 0,
        technologies: [],
        features: [],
        repositoryUrl: '',
        liveUrl: '',
        stagingUrl: '',
        notes: ''
    })
    const [errors, setErrors] = useState({})
    const [newFeature, setNewFeature] = useState('')
    const [newTech, setNewTech] = useState('')

    useEffect(() => {
        fetchClients()
        if (isEditMode) {
            fetchProject()
        }
    }, [id])

    const fetchClients = async () => {
        try {
            const response = await clientService.getClients({ limit: 100 })
            setClients(response.data)
        } catch (err) {
            console.error('Failed to fetch clients:', err)
        }
    }

    const fetchProject = async () => {
        try {
            setLoading(true)
            const response = await projectService.getProject(id)
            const project = response.data
            setFormData({
                projectName: project.projectName || '',
                description: project.description || '',
                client: project.client?._id || '',
                projectType: project.projectType || 'website',
                status: project.status || 'planning',
                priority: project.priority || 'medium',
                startDate: project.startDate ? project.startDate.split('T')[0] : '',
                deadline: project.deadline ? project.deadline.split('T')[0] : '',
                budget: project.budget || '',
                amountPaid: project.amountPaid || '0',
                progress: project.progress || 0,
                technologies: project.technologies || [],
                features: project.features || [],
                repositoryUrl: project.repositoryUrl || '',
                liveUrl: project.liveUrl || '',
                stagingUrl: project.stagingUrl || '',
                notes: project.notes || ''
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch project')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleAddFeature = () => {
        if (newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, { name: newFeature.trim(), status: 'pending' }]
            }))
            setNewFeature('')
        }
    }

    const handleRemoveFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }))
    }

    const handleAddTech = () => {
        if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, newTech.trim()]
            }))
            setNewTech('')
        }
    }

    const handleRemoveTech = (index) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter((_, i) => i !== index)
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.projectName.trim()) {
            newErrors.projectName = 'Project name is required'
        }

        if (!formData.client) {
            newErrors.client = 'Client is required'
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required'
        }

        if (!formData.deadline) {
            newErrors.deadline = 'Deadline is required'
        } else if (new Date(formData.deadline) <= new Date(formData.startDate)) {
            newErrors.deadline = 'Deadline must be after start date'
        }

        if (!formData.budget) {
            newErrors.budget = 'Budget is required'
        } else if (isNaN(formData.budget) || Number(formData.budget) < 0) {
            newErrors.budget = 'Budget must be a positive number'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) {
            return
        }

        try {
            setSubmitting(true)
            const dataToSubmit = {
                ...formData,
                budget: Number(formData.budget),
                amountPaid: Number(formData.amountPaid) || 0,
                progress: Number(formData.progress) || 0
            }

            if (isEditMode) {
                await projectService.updateProject(id, dataToSubmit)
            } else {
                await projectService.createProject(dataToSubmit)
            }

            navigate('/projects')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save project')
        } finally {
            setSubmitting(false)
        }
    }

    const projectTypes = [
        { value: 'website', label: 'Website', icon: '🌐' },
        { value: 'webapp', label: 'Web Application', icon: '💻' },
        { value: 'mobileapp', label: 'Mobile App', icon: '📱' },
        { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
        { value: 'custom', label: 'Custom Project', icon: '⚙️' }
    ]

    const statusOptions = [
        { value: 'planning', label: 'Planning' },
        { value: 'design', label: 'Design' },
        { value: 'development', label: 'Development' },
        { value: 'testing', label: 'Testing' },
        { value: 'review', label: 'Review' },
        { value: 'completed', label: 'Completed' },
        { value: 'on_hold', label: 'On Hold' },
        { value: 'cancelled', label: 'Cancelled' }
    ]

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ]

    if (loading) {
        return <Loader />
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Projects
                </button>
                <h1 className="text-3xl font-bold text-white">
                    {isEditMode ? 'Edit Project' : 'Create New Project'}
                </h1>
                <p className="text-gray-400 mt-1">
                    {isEditMode ? 'Update project details' : 'Fill in the project details below'}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Card title="Basic Information" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                label="Project Name"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleChange}
                                placeholder="Enter project name"
                                error={errors.projectName}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Client <span className="text-neon-green">*</span>
                            </label>
                            <select
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:border-neon-green/50 ${errors.client ? 'border-red-500' : 'border-white/10'}`}
                            >
                                <option value="">Select Client</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>
                                        {client.businessName || client.clientName}
                                    </option>
                                ))}
                            </select>
                            {errors.client && <p className="mt-1 text-sm text-red-400">{errors.client}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Project Type <span className="text-neon-green">*</span>
                            </label>
                            <select
                                name="projectType"
                                value={formData.projectType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                            >
                                {projectTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.icon} {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Enter project description..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                            />
                        </div>
                    </div>
                </Card>

                <Card title="Timeline & Budget" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            error={errors.startDate}
                            required
                        />
                        <Input
                            label="Deadline"
                            name="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={handleChange}
                            error={errors.deadline}
                            required
                        />
                        <Input
                            label="Budget (₹)"
                            name="budget"
                            type="number"
                            value={formData.budget}
                            onChange={handleChange}
                            placeholder="Enter budget amount"
                            error={errors.budget}
                            required
                        />
                        <Input
                            label="Amount Paid (₹)"
                            name="amountPaid"
                            type="number"
                            value={formData.amountPaid}
                            onChange={handleChange}
                            placeholder="Enter amount paid"
                        />
                    </div>
                </Card>

                <Card title="Status & Priority" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                            >
                                {priorityOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Progress: {formData.progress}%
                            </label>
                            <input
                                type="range"
                                name="progress"
                                min="0"
                                max="100"
                                value={formData.progress}
                                onChange={handleChange}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-green"
                            />
                        </div>
                    </div>
                </Card>

                <Card title="Features" className="mb-6">
                    <div className="flex gap-2 mb-4">
                        <Input
                            placeholder="Add feature..."
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                            className="flex-1 mb-0"
                        />
                        <Button type="button" variant="outline" onClick={handleAddFeature}>
                            Add
                        </Button>
                    </div>
                    
                    {formData.features.length > 0 ? (
                        <div className="space-y-2">
                            {formData.features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
                                >
                                    <span className="text-white">{feature.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(index)}
                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No features added yet</p>
                    )}
                </Card>

                <Card title="Technologies" className="mb-6">
                    <div className="flex gap-2 mb-4">
                        <Input
                            placeholder="Add technology..."
                            value={newTech}
                            onChange={(e) => setNewTech(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                            className="flex-1 mb-0"
                        />
                        <Button type="button" variant="outline" onClick={handleAddTech}>
                            Add
                        </Button>
                    </div>
                    
                    {formData.technologies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {formData.technologies.map((tech, index) => (
                                <span 
                                    key={index}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                                >
                                    {tech}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTech(index)}
                                        className="hover:text-red-400 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No technologies added yet</p>
                    )}
                </Card>

                <Card title="URLs & Links" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Repository URL"
                            name="repositoryUrl"
                            value={formData.repositoryUrl}
                            onChange={handleChange}
                            placeholder="https://github.com/..."
                        />
                        <Input
                            label="Live URL"
                            name="liveUrl"
                            value={formData.liveUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                        <Input
                            label="Staging URL"
                            name="stagingUrl"
                            value={formData.stagingUrl}
                            onChange={handleChange}
                            placeholder="https://staging..."
                        />
                    </div>
                </Card>

                <Card title="Notes" className="mb-6">
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Add any additional notes..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                    />
                </Card>

                <div className="flex items-center justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => navigate('/projects')}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="neon" loading={submitting}>
                        {isEditMode ? 'Update Project' : 'Create Project'}
                                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ProjectForm