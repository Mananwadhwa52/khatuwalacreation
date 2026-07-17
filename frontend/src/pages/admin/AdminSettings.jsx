import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    codEnabled: true,
    collections: []
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings')
      if (data) {
        setSettings(data)
      }
    } catch (e) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/settings', settings)
      toast.success('Settings saved successfully')
    } catch (e) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleCollectionChange = (index, field, value) => {
    const newCollections = [...settings.collections]
    newCollections[index][field] = value
    setSettings({ ...settings, collections: newCollections })
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold text-primary">Global Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-6">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="font-display text-lg font-bold text-primary mb-4">Payment Settings</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={settings.codEnabled} 
            onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
            className="w-5 h-5 accent-primary"
          />
          <span className="font-body text-sm font-semibold">Enable Cash on Delivery (COD)</span>
        </label>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="font-display text-lg font-bold text-primary mb-4">Our Collections Layout (Home Page)</h2>
        <div className="space-y-6">
          {settings.collections.map((cat, index) => (
            <div key={index} className="p-4 border border-gray-100 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={cat.title} 
                  onChange={(e) => handleCollectionChange(index, 'title', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                <input 
                  type="text" 
                  value={cat.desc} 
                  onChange={(e) => handleCollectionChange(index, 'desc', e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={cat.imageurl} 
                  onChange={(e) => handleCollectionChange(index, 'imageurl', e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
