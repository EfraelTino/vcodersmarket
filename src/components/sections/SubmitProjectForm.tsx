import type { ModelPricing, ProjectCategory } from '@/lib/interfaces';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

// Definimos la estructura de datos que vamos a guardar
interface ProjectFormData {
  name: string;
  tagline: string;
  website: string;
  pricing: string;
  isOpenSource: string;
  description: string;
  category: string;
  projectType: string;
  isVibeCoded: boolean;
  videoUrl: string;
  // Para archivos reales usaremos File | null más adelante
}

export function SubmitProjectForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Estado único para todo el formulario
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    tagline: '',
    website: '',
    pricing: 'Free',
    isOpenSource: 'No',
    description: '',
    category: 'Developer Tool',
    projectType: '',
    isVibeCoded: false,
    videoUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const [modelPrice, setModelPrice] = useState<ModelPricing[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchInitialData = async () => {
    setLoading(true);

    // Disparamos ambas peticiones AL MISMO TIEMPO
    const [pricingResponse, categoriesResponse, projectTypesResponse] = await Promise.all([
      supabase.from('pricing_models').select('*').order('id'),
      supabase.from('categories').select('*').order('name'),
      supabase.from('project_type').select('*').order('name')
    ]);

    // 1. Manejar Pricing
    if (pricingResponse.error) {
      console.error('Error fetching pricing:', pricingResponse.error);
    } else if (pricingResponse.data) {
      setModelPrice(pricingResponse.data);
    }

    // 2. Manejar Categories
    if (categoriesResponse.error) {
      console.error('Error fetching categories:', categoriesResponse.error);
    } else if (categoriesResponse.data) {
      setCategories(categoriesResponse.data);
    }
    // 3. Manejar Project Types
    if (projectTypesResponse.error) {
      console.error('Error fetching project types:', projectTypesResponse.error);
    } else if (projectTypesResponse.data) {
      setProjectTypes(projectTypesResponse.data);
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando a Supabase:", formData);
    alert("¡Proyecto listo para enviar! Mira la consola.");
  };

  // Helper para renderizar la barra de progreso
  const renderProgressBar = (stepIndex: number) => {
    // Si el paso actual es mayor que el índice de la barra, está completa
    const isCompleted = currentStep > stepIndex;
    return (
      <div className="h-0.5 w-full bg-gray-200 mx-4 relative">
        <div
          className={`absolute inset-0 bg-gray-900 transition-all duration-300 ${isCompleted ? 'w-full' : 'w-0'}`}
        />
      </div>
    );
  };
  console.log("Rendering form with data:", modelPrice);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* --- HEADER CON PASOS --- */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-sm font-medium text-gray-500">

          {/* Paso 1 */}
          <StepIndicator step={1} currentStep={currentStep} label="Info" />
          {renderProgressBar(1)}

          {/* Paso 2 */}
          <StepIndicator step={2} currentStep={currentStep} label="Details" />
          {renderProgressBar(2)}

          {/* Paso 3 */}
          <StepIndicator step={3} currentStep={currentStep} label="Media" />
          {renderProgressBar(3)}

          {/* Paso 4 */}
          <StepIndicator step={4} currentStep={currentStep} label="Review" />
        </div>
      </div>

      {/* --- FORM BODY --- */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8">

        {/* STEP 1: INFO */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900">Project Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="e.g. Super Saas Starter" className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-gray-900 focus:ring-gray-900 outline-none" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline (60 chars)</label>
                <input name="tagline" value={formData.tagline} onChange={handleChange} type="text" maxLength={60} placeholder="A concise one-liner" className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-gray-900 focus:ring-gray-900 outline-none" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input name="website" value={formData.website} onChange={handleChange} type="url" placeholder="https://myproduct.com" className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-gray-900 focus:ring-gray-900 outline-none bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Model</label>
                <select name="pricing" value={formData.pricing} onChange={handleChange} className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-gray-900 outline-none">
                  {
                    modelPrice.map((model) => (
                      <option key={model.id}>{model.name}</option>
                    ))
                  }

                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Is it Open Source?</label>
                <select name="isOpenSource" value={formData.isOpenSource} onChange={handleChange} className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-gray-900 outline-none">
                  <option>No</option>
                  <option>Yes (MIT, Apache, etc.)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900">Details & Tech</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Markdown)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={6} placeholder="Explain what your product does..." className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-gray-900 focus:ring-gray-900 outline-none"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-gray-900 outline-none">
                  {
                    categories.map((cat) => (
                      <option key={cat.id}>{cat.name}</option>
                    ))
                  }
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                <select name="projecttype" value={formData.projectType} onChange={handleChange} className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-gray-900 outline-none">
                  {
                    projectTypes.map((type) => (
                      <option key={type.id}>{type.name}</option>
                    ))
                  }
                </select> 
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input name="isVibeCoded" checked={formData.isVibeCoded} onChange={handleCheckboxChange} type="checkbox" className="mt-1 w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                <div>
                  <span className="text-sm font-bold text-gray-900">Is this project "Vibe Coded"?</span>
                  <p className="text-xs text-gray-600">Check this if you focused heavily on aesthetics and UX.</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: MEDIA */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900">Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo (Square)</label>
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors">
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-xs text-gray-500">Upload</span>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Screenshots</label>
                <div className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors">
                  <span className="text-sm font-medium text-gray-600">Drag & drop image</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Demo Video URL</label>
              <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} type="url" placeholder="https://youtube.com..." className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-gray-900 outline-none" />
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {currentStep === 4 && (
          <div className="space-y-6 text-center py-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Ready to Submit?</h2>
            <p className="text-gray-500 max-w-md mx-auto">Please review all information carefully.</p>

            <div className="bg-gray-50 rounded-lg p-4 text-left max-w-lg mx-auto mt-6 text-sm border border-gray-200">
              <p className="font-medium mb-2">Project Summary:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Name: <strong>{formData.name || 'Untitled'}</strong></li>
                <li>Category: <strong>{formData.category}</strong></li>
                <li>Vibe Coded: <strong>{formData.isVibeCoded ? 'Yes' : 'No'}</strong></li>
              </ul>
            </div>
          </div>
        )}

        {/* --- ACTIONS --- */}
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={prevStep}
            className={`px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
          >
            Previous
          </button>

          <div className="flex-1"></div>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-sm"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-200"
            >
              Submit Project
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Subcomponente para el círculo del indicador
function StepIndicator({ step, currentStep, label }: { step: number, currentStep: number, label: string }) {
  const isActiveOrPassed = currentStep >= step;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isActiveOrPassed
        ? 'bg-gray-900 text-white'
        : 'bg-white border-2 border-gray-200 text-gray-500'
        }`}>
        {step}
      </span>
      <span>{label}</span>
    </div>
  );
}