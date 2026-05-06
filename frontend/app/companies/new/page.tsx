'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '../../lib/api'

export default function NewCompanyPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    vatNumber: '',
    commercialRegistration: '',
    address: '',
    streetName: '',
    buildingNumber: '',
    plotIdentification: '',
    citySubdivisionName: '',
    city: '',
    postalCode: '',
    country: 'Saudi Arabia',
    phone: '',
    email: '',
    website: '',
    logo: null as File | null,
    isActive: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo file size must be less than 5MB')
        return
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file')
        return
      }
      setFormData({
        ...formData,
        logo: file,
      })
      setError('')
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        const base64String = result.split(',')[1]
        resolve(base64String)
      }
      reader.onerror = reject
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // Validation
    if (!formData.name.trim()) {
      setError('Company name is required')
      setSubmitting(false)
      return
    }

    if (!formData.vatNumber.trim()) {
      setError('VAT Number is required')
      setSubmitting(false)
      return
    }

    if (!formData.logo) {
      setError('Company logo is required')
      setSubmitting(false)
      return
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      setSubmitting(false)
      return
    }

    try {
      const base64Logo = await fileToBase64(formData.logo)

      const payload = {
        name: formData.name.trim(),
        vatNumber: formData.vatNumber.trim(),
        commercialRegistration: formData.commercialRegistration.trim() || undefined,
        address: formData.address.trim() || undefined,
        streetName: formData.streetName.trim() || undefined,
        buildingNumber: formData.buildingNumber.trim() || undefined,
        plotIdentification: formData.plotIdentification.trim() || undefined,
        citySubdivisionName: formData.citySubdivisionName.trim() || undefined,
        city: formData.city.trim() || undefined,
        postalCode: formData.postalCode.trim() || undefined,
        country: formData.country.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        website: formData.website.trim() || undefined,
        logo: base64Logo,
        isActive: formData.isActive,
      }

      await api.post('/companies', payload)

      router.push(`/companies`)
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'Failed to create company. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/companies" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Companies</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Company</h1>
          <p className="text-gray-600">Add seller company information for ZATCA compliance</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Required Fields */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Required Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Number (Tax ID) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="vatNumber"
                  name="vatNumber"
                  required
                  value={formData.vatNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter VAT registration number"
                />
                <p className="mt-1 text-sm text-gray-500">ZATCA VAT registration number</p>
              </div>

              <div>
                <label htmlFor="commercialRegistration" className="block text-sm font-medium text-gray-700 mb-2">
                  Commercial Registration (CR)
                </label>
                <input
                  type="text"
                  id="commercialRegistration"
                  name="commercialRegistration"
                  value={formData.commercialRegistration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 1010123456"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="company@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+966 XX XXX XXXX"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="logo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 5.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.068 5 5 5a4 4 0 0 0 0 8h2.167M10 19V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      {formData.logo && (
                        <p className="text-xs text-green-600 font-semibold mt-2">{formData.logo.name}</p>
                      )}
                    </div>
                    <input 
                      id="logo" 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      required
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Address Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Name (ZATCA)
                </label>
                <input
                  type="text"
                  id="streetName"
                  name="streetName"
                  value={formData.streetName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Prince Sultan Road"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="buildingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Building Number (ZATCA)
                  </label>
                  <input
                    type="text"
                    id="buildingNumber"
                    name="buildingNumber"
                    value={formData.buildingNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 2322"
                  />
                </div>
                <div>
                  <label htmlFor="plotIdentification" className="block text-sm font-medium text-gray-700 mb-2">
                    Plot / Parcel ID (ZATCA)
                  </label>
                  <input
                    type="text"
                    id="plotIdentification"
                    name="plotIdentification"
                    value={formData.plotIdentification}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 3XYZ4433"
                  />
                </div>
                <div>
                  <label htmlFor="citySubdivisionName" className="block text-sm font-medium text-gray-700 mb-2">
                    City Subdivision / District
                  </label>
                  <input
                    type="text"
                    id="citySubdivisionName"
                    name="citySubdivisionName"
                    value={formData.citySubdivisionName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Al-Murabba"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Riyadh"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12345"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Saudi Arabia"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active (Company is currently active)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/companies"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Company'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
