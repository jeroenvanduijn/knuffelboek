'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Button, SheepMascot } from '@/components';
import * as api from '@/lib/api';
import type { ToyAnalysis, Book } from '@/lib/api';

// Types
interface BookData {
  toyPhoto: File | null;
  toyPhotoPreview: string | null;
  toyPhotoBase64: string | null;
  toyAnalysis: ToyAnalysis | null;
  childName: string;
  childAge: string;
  toyName: string;
  siblings: { name: string; age: string }[];
  petName: string;
  parent1Name: string;
  parent2Name: string;
  theme: string;
  coverType: 'softcover' | 'hardcover';
  quantity: number;
  generatedBook: Book | null;
}

const initialBookData: BookData = {
  toyPhoto: null,
  toyPhotoPreview: null,
  toyPhotoBase64: null,
  toyAnalysis: null,
  childName: '',
  childAge: '',
  toyName: '',
  siblings: [],
  petName: '',
  parent1Name: '',
  parent2Name: '',
  theme: '',
  coverType: 'softcover',
  quantity: 1,
  generatedBook: null,
};

const themes = [
  { id: 'bedtijd', name: 'Bedtijd Avontuur', icon: '🌙', description: 'Een rustig verhaaltje voor het slapengaan', ages: ['2-3', '4-5'] },
  { id: 'dapper', name: 'Dapper Zijn', icon: '🦁', description: 'Over moed en angsten overwinnen', ages: ['3-4', '4-5', '6-8'] },
  { id: 'verjaardag', name: 'Verjaardag', icon: '🎂', description: 'Een feestelijk verjaardagsverhaal', ages: ['2-3', '4-5', '6-8'] },
  { id: 'vriendschap', name: 'Vriendschap', icon: '💕', description: 'Over echte vriendschap', ages: ['4-5', '6-8'] },
  { id: 'natuur', name: 'Natuur Ontdekken', icon: '🌿', description: 'Op avontuur in de natuur', ages: ['3-4', '4-5', '6-8'] },
  { id: 'fantasie', name: 'Fantasie Wereld', icon: '🏰', description: 'Een magisch avontuur', ages: ['5-6', '6-8'] },
];

const ages = ['2 jaar', '3 jaar', '4 jaar', '5 jaar', '6 jaar', '7 jaar', '8 jaar'];

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ['Foto', 'Personaliseren', 'Thema', 'Preview', 'Bestellen'];

  return (
    <div className="flex items-center justify-center mb-8 lg:mb-12">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                index + 1 < currentStep
                  ? 'bg-saliegroen text-nachtblauw'
                  : index + 1 === currentStep
                  ? 'bg-abrikoos text-nachtblauw ring-4 ring-abrikoos/20'
                  : 'bg-zand text-nachtblauw/50'
              }`}
            >
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            <span className={`text-xs mt-2 hidden sm:block ${index + 1 === currentStep ? 'text-abrikoos font-medium' : 'text-nachtblauw/50'}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-8 lg:w-16 h-1 mx-1 lg:mx-2 ${index + 1 < currentStep ? 'bg-saliegroen' : 'bg-zand'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// Step 1: Photo Upload with AI Analysis
function Step1Photo({
  data,
  updateData,
  onNext,
}: {
  data: BookData;
  updateData: (updates: Partial<BookData>) => void;
  onNext: () => void;
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        updateData({
          toyPhoto: file,
          toyPhotoPreview: base64,
          toyPhotoBase64: base64.split(',')[1], // Remove data:image/...;base64, prefix
        });

        // Analyze the toy with AI
        setIsAnalyzing(true);
        setAnalyzeError(null);
        try {
          const analysis = await api.analyzeToy(base64.split(',')[1]);
          updateData({
            toyAnalysis: analysis,
            toyName: analysis.suggestedName || '',
          });
        } catch (err) {
          // Analysis is optional, continue without it
          console.error('Toy analysis failed:', err);
          setAnalyzeError('Kon knuffel niet automatisch herkennen. Je kunt handmatig doorgaan.');
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [updateData]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  }, [handleFileChange]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-nachtblauw mb-3">
          Stap 1: Maak een foto van de knuffel
        </h2>
        <p className="text-nachtblauw/70">
          Upload een duidelijke foto van de lievelingsknuffel van je kind.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center transition-all cursor-pointer ${
          data.toyPhotoPreview ? 'border-saliegroen bg-saliegroen/10' : 'border-nachtblauw/20 hover:border-abrikoos hover:bg-zand/50'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          type="file"
          id="file-input"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {data.toyPhotoPreview ? (
          <div className="space-y-4">
            <div className="w-48 h-48 mx-auto rounded-xl overflow-hidden shadow-lg">
              <img
                src={data.toyPhotoPreview}
                alt="Knuffel preview"
                className="w-full h-full object-cover"
              />
            </div>

            {isAnalyzing ? (
              <div className="flex items-center justify-center gap-2 text-abrikoos">
                <SheepMascot variant="cloud" size="sm" className="animate-pulse" />
                <span className="font-medium">AI analyseert de knuffel...</span>
              </div>
            ) : data.toyAnalysis ? (
              <div className="bg-wolwit rounded-xl p-4 text-left max-w-sm mx-auto">
                <p className="text-sm font-medium text-nachtblauw mb-2">
                  AI herkenning:
                </p>
                <p className="text-nachtblauw/70 text-sm">
                  Type: <span className="font-medium">{data.toyAnalysis.toyType}</span>
                </p>
                {data.toyAnalysis.colors.length > 0 && (
                  <p className="text-nachtblauw/70 text-sm">
                    Kleuren: {data.toyAnalysis.colors.join(', ')}
                  </p>
                )}
                <p className="text-xs text-nachtblauw/50 mt-2">
                  Betrouwbaarheid: {Math.round(data.toyAnalysis.confidence * 100)}%
                </p>
              </div>
            ) : analyzeError ? (
              <p className="text-abrikoos text-sm">{analyzeError}</p>
            ) : (
              <div className="flex items-center justify-center gap-2 text-saliegroen">
                <span>✓</span>
                <span className="font-medium">Foto geüpload - achtergrond wordt automatisch verwijderd</span>
              </div>
            )}

            <button
              type="button"
              className="text-sm text-nachtblauw/60 hover:text-abrikoos underline"
              onClick={(e) => {
                e.stopPropagation();
                updateData({ toyPhoto: null, toyPhotoPreview: null, toyPhotoBase64: null, toyAnalysis: null });
              }}
            >
              Andere foto kiezen
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <SheepMascot variant="camera" size="lg" className="mx-auto" />
            <div>
              <p className="font-semibold text-nachtblauw mb-1">Maak een foto van de knuffel om te beginnen</p>
              <p className="text-nachtblauw/60 text-sm">Sleep je foto hierheen of klik om een bestand te kiezen</p>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-zand rounded-xl p-6">
        <h3 className="font-semibold text-nachtblauw mb-3">Tips voor de beste foto:</h3>
        <ul className="space-y-2 text-sm text-nachtblauw/70">
          <li className="flex items-start gap-2">
            <span className="text-abrikoos">•</span>
            Kies een neutrale, lichte achtergrond (wit of lichtgrijs)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-abrikoos">•</span>
            Zorg voor goede belichting – daglicht werkt het beste
          </li>
          <li className="flex items-start gap-2">
            <span className="text-abrikoos">•</span>
            Fotografeer de knuffel van voren, met het gezicht goed zichtbaar
          </li>
          <li className="flex items-start gap-2">
            <span className="text-abrikoos">•</span>
            De achtergrond wordt automatisch verwijderd door AI
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!data.toyPhotoPreview || isAnalyzing} size="lg">
          Volgende stap →
        </Button>
      </div>
    </div>
  );
}

// Step 2: Personalization
function Step2Personalize({
  data,
  updateData,
  onNext,
  onBack,
}: {
  data: BookData;
  updateData: (updates: Partial<BookData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const addSibling = () => {
    updateData({ siblings: [...data.siblings, { name: '', age: '' }] });
  };

  const updateSibling = (index: number, field: 'name' | 'age', value: string) => {
    const newSiblings = [...data.siblings];
    newSiblings[index] = { ...newSiblings[index], [field]: value };
    updateData({ siblings: newSiblings });
  };

  const removeSibling = (index: number) => {
    updateData({ siblings: data.siblings.filter((_, i) => i !== index) });
  };

  const isValid = data.childName && data.childAge && data.toyName;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-nachtblauw mb-3">
          Stap 2: Personaliseren
        </h2>
        <p className="text-nachtblauw/70">
          Vul de gegevens in zodat het verhaal op maat wordt gemaakt.
        </p>
      </div>

      <div className="space-y-6">
        {/* Required fields */}
        <div className="bg-wolwit rounded-xl border border-nachtblauw/10 p-6 space-y-5">
          <h3 className="font-semibold text-nachtblauw">Verplichte gegevens</h3>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="childName" className="block text-sm font-medium text-nachtblauw mb-2">
                Naam van het kind *
              </label>
              <input
                type="text"
                id="childName"
                value={data.childName}
                onChange={(e) => updateData({ childName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none transition-all bg-wolwit"
                placeholder="Bijv. Emma"
              />
            </div>
            <div>
              <label htmlFor="childAge" className="block text-sm font-medium text-nachtblauw mb-2">
                Leeftijd (2-8 jaar) *
              </label>
              <select
                id="childAge"
                value={data.childAge}
                onChange={(e) => updateData({ childAge: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none transition-all bg-wolwit"
              >
                <option value="">Kies leeftijd...</option>
                {ages.map((age) => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="toyName" className="block text-sm font-medium text-nachtblauw mb-2">
              Naam van de knuffel *
            </label>
            <input
              type="text"
              id="toyName"
              value={data.toyName}
              onChange={(e) => updateData({ toyName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none transition-all bg-wolwit"
              placeholder="Bijv. Beer, Konijn, Draakje"
            />
            <p className="text-xs text-nachtblauw/60 mt-1">
              Dit is hoe de knuffel in het verhaal wordt genoemd
              {data.toyAnalysis && (
                <span className="text-saliegroen ml-1">(AI suggestie: {data.toyAnalysis.suggestedName})</span>
              )}
            </p>
          </div>
        </div>

        {/* Optional fields */}
        <div className="bg-wolwit rounded-xl border border-nachtblauw/10 p-6 space-y-5">
          <h3 className="font-semibold text-nachtblauw">Optioneel - extra personages</h3>
          <p className="text-sm text-nachtblauw/60 -mt-2">
            Voeg familieleden toe die een rol kunnen spelen in het verhaal.
          </p>

          {/* Parents */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="parent1Name" className="block text-sm font-medium text-nachtblauw mb-2">
                Ouder 1 (bijv. Mama)
              </label>
              <input
                type="text"
                id="parent1Name"
                value={data.parent1Name}
                onChange={(e) => updateData({ parent1Name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none transition-all bg-wolwit"
                placeholder="Mama, Mam, Moeder..."
              />
            </div>
            <div>
              <label htmlFor="parent2Name" className="block text-sm font-medium text-nachtblauw mb-2">
                Ouder 2 (bijv. Papa)
              </label>
              <input
                type="text"
                id="parent2Name"
                value={data.parent2Name}
                onChange={(e) => updateData({ parent2Name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none transition-all bg-wolwit"
                placeholder="Papa, Pap, Vader..."
              />
            </div>
          </div>

          {/* Siblings */}
          <div>
            <label className="block text-sm font-medium text-nachtblauw mb-2">
              Broertje(s) / zusje(s)
            </label>
            {data.siblings.map((sibling, index) => (
              <div key={index} className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={sibling.name}
                  onChange={(e) => updateSibling(index, 'name', e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none transition-all bg-wolwit"
                  placeholder="Naam"
                />
                <select
                  value={sibling.age}
                  onChange={(e) => updateSibling(index, 'age', e.target.value)}
                  className="w-32 px-4 py-3 rounded-xl border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none transition-all bg-wolwit"
                >
                  <option value="">Leeftijd</option>
                  {ages.map((age) => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeSibling(index)}
                  className="px-3 text-nachtblauw/40 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSibling}
              className="text-sm text-abrikoos hover:underline"
            >
              + Broertje/zusje toevoegen
            </button>
          </div>

          {/* Pet */}
          <div>
            <label htmlFor="petName" className="block text-sm font-medium text-nachtblauw mb-2">
              Huisdier
            </label>
            <input
              type="text"
              id="petName"
              value={data.petName}
              onChange={(e) => updateData({ petName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none transition-all bg-wolwit"
              placeholder="Bijv. Poes Minoes, Hond Max"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button onClick={onBack} variant="outline">
          ← Terug
        </Button>
        <Button onClick={onNext} disabled={!isValid} size="lg">
          Volgende stap →
        </Button>
      </div>
    </div>
  );
}

// Step 3: Theme Selection
function Step3Theme({
  data,
  updateData,
  onNext,
  onBack,
}: {
  data: BookData;
  updateData: (updates: Partial<BookData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const getAgeGroup = (age: string) => {
    const num = parseInt(age);
    if (num <= 3) return '2-3';
    if (num <= 5) return '4-5';
    return '6-8';
  };

  const ageGroup = data.childAge ? getAgeGroup(data.childAge) : null;
  const filteredThemes = ageGroup
    ? themes.filter((t) => t.ages.some((a) => a.includes(ageGroup.split('-')[0]) || a.includes(ageGroup.split('-')[1])))
    : themes;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-nachtblauw mb-3">
          Stap 3: Kies een thema
        </h2>
        <p className="text-nachtblauw/70">
          Selecteer het avontuur dat het beste bij {data.childName || 'je kind'} past.
        </p>
        {data.childAge && (
          <p className="text-sm text-abrikoos mt-2">
            Getoond: thema&apos;s geschikt voor {data.childAge}
          </p>
        )}
      </div>

      {/* Theme Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredThemes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => updateData({ theme: theme.id })}
            className={`p-6 rounded-2xl text-left transition-all ${
              data.theme === theme.id
                ? 'bg-abrikoos text-nachtblauw ring-4 ring-abrikoos/20'
                : 'bg-zand hover:bg-zand/80 border border-nachtblauw/5'
            }`}
          >
            <span className="text-4xl block mb-3">{theme.icon}</span>
            <h3 className="font-bold mb-1 text-nachtblauw">
              {theme.name}
            </h3>
            <p className={`text-sm ${data.theme === theme.id ? 'text-nachtblauw/80' : 'text-nachtblauw/60'}`}>
              {theme.description}
            </p>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button onClick={onBack} variant="outline">
          ← Terug
        </Button>
        <Button onClick={onNext} disabled={!data.theme} size="lg">
          Genereer preview →
        </Button>
      </div>
    </div>
  );
}

// Step 4: Preview with real book generation
function Step4Preview({
  data,
  updateData,
  onNext,
  onBack,
}: {
  data: BookData;
  updateData: (updates: Partial<BookData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Generate book on mount
  useEffect(() => {
    const generateBook = async () => {
      setIsGenerating(true);
      setGenerateError(null);

      try {
        const bookRequest = {
          toyImage: data.toyPhotoBase64 || '',
          childName: data.childName,
          childAge: parseInt(data.childAge),
          toyName: data.toyName,
          theme: data.theme,
          siblings: data.siblings.map(s => ({ name: s.name, age: parseInt(s.age) || 0 })),
          petName: data.petName || undefined,
          parent1Name: data.parent1Name || undefined,
          parent2Name: data.parent2Name || undefined,
        };

        const book = await api.createBook(bookRequest);
        updateData({ generatedBook: book });

        // If book is still generating, poll for status
        if (book.status === 'generating') {
          const pollStatus = async () => {
            try {
              const status = await api.getBookStatus(book.id);
              setGenerationProgress(status.progress || 0);

              if (status.status === 'ready') {
                const updatedBook = await api.getBook(book.id);
                updateData({ generatedBook: updatedBook });
                setIsGenerating(false);
              } else {
                setTimeout(pollStatus, 2000);
              }
            } catch {
              setTimeout(pollStatus, 2000);
            }
          };
          pollStatus();
        } else {
          setIsGenerating(false);
        }
      } catch (err) {
        setGenerateError(err instanceof Error ? err.message : 'Kon boek niet genereren');
        setIsGenerating(false);
      }
    };

    // Only generate if we don't have a book yet
    if (!data.generatedBook) {
      generateBook();
    } else {
      setIsGenerating(false);
    }
  }, []);

  const selectedTheme = themes.find((t) => t.id === data.theme);
  const book = data.generatedBook;

  // Demo pages as fallback
  const demoPages = book?.pages || [
    { pageNumber: 1, text: `Dit is het verhaal van ${data.childName} en ${data.toyName}.` },
    { pageNumber: 2, text: `${data.toyName} was de beste vriend van ${data.childName}.` },
    { pageNumber: 3, text: `Samen beleefden ze de mooiste avonturen...` },
    { pageNumber: 4, text: `"Kom mee!" riep ${data.toyName}. "Ik heb een idee!"` },
    { pageNumber: 5, text: `En zo begon hun grootste avontuur ooit...` },
    { pageNumber: 6, text: `Einde. ${data.childName} en ${data.toyName} leefden nog lang en gelukkig.` },
  ];

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6">
          <SheepMascot variant="cloud" size="xl" className="mx-auto animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-nachtblauw mb-3">
          We genereren jouw boek met AI...
        </h2>
        <p className="text-nachtblauw/70 mb-8">
          {data.toyName} en {data.childName} komen tot leven in een uniek verhaal met illustraties.
        </p>
        <div className="w-64 h-2 bg-zand rounded-full mx-auto overflow-hidden mb-2">
          <div
            className="h-full bg-abrikoos rounded-full transition-all duration-500"
            style={{ width: `${Math.max(generationProgress, 20)}%` }}
          />
        </div>
        <p className="text-sm text-nachtblauw/50">
          Dit kan 1-2 minuten duren...
        </p>
      </div>
    );
  }

  if (generateError) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6">
          <SheepMascot variant="camera" size="lg" className="mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-nachtblauw mb-3">
          Oeps, er ging iets mis
        </h2>
        <p className="text-nachtblauw/70 mb-8">
          {generateError}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={onBack} variant="outline">
            ← Terug
          </Button>
          <Button onClick={() => window.location.reload()}>
            Probeer opnieuw
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-nachtblauw mb-3">
          Stap 4: Bekijk je boek
        </h2>
        <p className="text-nachtblauw/70">
          Blader door je gepersonaliseerde boek en controleer of alles klopt.
        </p>
      </div>

      {/* Book title */}
      <div className="text-center mb-6">
        <span className="text-3xl mr-2">{selectedTheme?.icon}</span>
        <h3 className="inline text-xl font-bold text-nachtblauw">
          {book?.title || `${data.childName} en ${data.toyName}: ${selectedTheme?.name}`}
        </h3>
      </div>

      {/* Book viewer */}
      <div className="bg-wolwit rounded-3xl shadow-xl p-6 lg:p-8 border border-nachtblauw/5">
        {/* Page display */}
        <div className="aspect-square max-w-md mx-auto bg-zand rounded-2xl p-8 flex flex-col justify-between mb-6">
          <span className="text-xs text-nachtblauw/50">Pagina {currentPage + 1}</span>
          <div className="flex-1 flex flex-col items-center justify-center">
            {demoPages[currentPage]?.illustrationUrl ? (
              <img
                src={demoPages[currentPage].illustrationUrl}
                alt={`Pagina ${currentPage + 1}`}
                className="w-full h-40 object-contain mb-4 rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-wolwit/50 rounded-xl flex items-center justify-center mb-4">
                {data.toyPhotoPreview ? (
                  <img src={data.toyPhotoPreview} alt={data.toyName} className="w-24 h-24 object-cover rounded-lg" />
                ) : (
                  <SheepMascot variant="default" size="md" />
                )}
              </div>
            )}
            <p className="text-center text-nachtblauw italic">{demoPages[currentPage]?.text}</p>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {demoPages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentPage === index ? 'bg-abrikoos' : 'bg-nachtblauw/20'
              }`}
            />
          ))}
        </div>

        {/* Page navigation */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded-lg bg-zand text-nachtblauw disabled:opacity-50"
          >
            ← Vorige
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(demoPages.length - 1, currentPage + 1))}
            disabled={currentPage === demoPages.length - 1}
            className="px-4 py-2 rounded-lg bg-zand text-nachtblauw disabled:opacity-50"
          >
            Volgende →
          </button>
        </div>
      </div>

      {/* PDF Download */}
      {book && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const blob = await api.downloadBookPdf(book.id);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `knuffelboek-${book.id}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              } catch {
                alert('Kon PDF niet downloaden');
              }
            }}
          >
            📄 Download PDF
          </Button>
        </div>
      )}

      {/* Info */}
      <p className="text-center text-sm text-nachtblauw/60 mt-4">
        Dit is een vereenvoudigde preview. Het echte boek bevat {data.childAge?.includes('2') || data.childAge?.includes('3') ? '16' : '20-24'} volledig geïllustreerde pagina&apos;s.
      </p>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button onClick={onBack} variant="outline">
          ← Ander thema kiezen
        </Button>
        <Button onClick={onNext} size="lg">
          Tevreden? Ga naar bestellen →
        </Button>
      </div>
    </div>
  );
}

// Step 5: Order with Peecho integration
function Step5Order({
  data,
  updateData,
  onBack,
}: {
  data: BookData;
  updateData: (updates: Partial<BookData>) => void;
  onBack: () => void;
}) {
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const [quote, setQuote] = useState<api.Quote | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [shipping, setShipping] = useState({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'NL',
  });

  const selectedTheme = themes.find((t) => t.id === data.theme);
  const book = data.generatedBook;

  // Load quote on mount
  useEffect(() => {
    const loadQuote = async () => {
      if (!book?.id) {
        setIsLoadingQuote(false);
        return;
      }

      try {
        const q = await api.getQuote(book.id);
        setQuote(q);
      } catch {
        // Use default pricing if quote fails
      } finally {
        setIsLoadingQuote(false);
      }
    };
    loadQuote();
  }, [book?.id]);

  // Calculate pricing
  const basePrice = quote?.softcoverPrice || 29.95;
  const hardcoverPrice = quote?.hardcoverPrice || 34.95;
  const currentPrice = data.coverType === 'hardcover' ? hardcoverPrice : basePrice;
  const extraCopiesPrice = (data.quantity - 1) * 19.95;
  const shippingCost = quote?.shippingCost || 0;
  const total = currentPrice + extraCopiesPrice + shippingCost;

  const handleOrder = async () => {
    if (!book?.id) return;

    setIsOrdering(true);
    setOrderError(null);

    try {
      await api.createOrder(book.id, {
        coverType: data.coverType,
        quantity: data.quantity,
        shippingAddress: shipping,
        email,
      });
      setOrderComplete(true);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Kon bestelling niet plaatsen');
    } finally {
      setIsOrdering(false);
    }
  };

  const isFormValid = email && shipping.name && shipping.street && shipping.city && shipping.postalCode;

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6">
          <SheepMascot variant="happy" size="xl" className="mx-auto" />
        </div>
        <h2 className="text-3xl font-bold text-nachtblauw mb-4">
          Bedankt voor je bestelling!
        </h2>
        <p className="text-nachtblauw/70 mb-8">
          We gaan direct aan de slag met het boek van {data.childName} en {data.toyName}.
          Je ontvangt een bevestiging per e-mail op {email}.
        </p>
        <div className="bg-zand rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-nachtblauw mb-3">Wat gebeurt er nu?</h3>
          <ul className="space-y-2 text-nachtblauw/70">
            <li className="flex items-start gap-2">
              <span className="text-saliegroen">1.</span>
              Je ontvangt een betaallink per e-mail
            </li>
            <li className="flex items-start gap-2">
              <span className="text-saliegroen">2.</span>
              Na betaling wordt het boek geprint
            </li>
            <li className="flex items-start gap-2">
              <span className="text-saliegroen">3.</span>
              Verzending binnen 5-7 werkdagen
            </li>
            <li className="flex items-start gap-2">
              <span className="text-saliegroen">4.</span>
              Je ontvangt track &amp; trace per e-mail
            </li>
          </ul>
        </div>
        <div className="flex gap-4 justify-center">
          <Button href="/mijn-boeken">
            Naar Mijn Boeken
          </Button>
          <Button href="/" variant="outline">
            Terug naar home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-nachtblauw mb-3">
          Stap 5: Bestellen
        </h2>
        <p className="text-nachtblauw/70">
          Controleer je bestelling en vul je gegevens in.
        </p>
      </div>

      {orderError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-600">{orderError}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Order form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Book summary */}
          <div className="bg-wolwit rounded-xl border border-nachtblauw/10 p-6">
            <h3 className="font-semibold text-nachtblauw mb-4">Je boek</h3>
            <div className="flex gap-4">
              <div className="w-20 h-24 bg-zand rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">{selectedTheme?.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-nachtblauw">{book?.title || `${data.childName} en ${data.toyName}: ${selectedTheme?.name}`}</p>
                <p className="text-sm text-nachtblauw/60">Kind: {data.childName}, {data.childAge}</p>
                <p className="text-sm text-nachtblauw/60">Knuffel: {data.toyName}</p>
              </div>
            </div>
          </div>

          {/* Cover type */}
          <div className="bg-wolwit rounded-xl border border-nachtblauw/10 p-6">
            <h3 className="font-semibold text-nachtblauw mb-4">Kies je cover</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateData({ coverType: 'softcover' })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.coverType === 'softcover'
                    ? 'border-abrikoos bg-abrikoos/10'
                    : 'border-nachtblauw/10 hover:border-abrikoos/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-nachtblauw">Softcover</span>
                  <span className="text-nachtblauw/60 text-sm">€{basePrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-nachtblauw/60">Flexibele kaft, ideaal voor dagelijks gebruik</p>
              </button>
              <button
                type="button"
                onClick={() => updateData({ coverType: 'hardcover' })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.coverType === 'hardcover'
                    ? 'border-abrikoos bg-abrikoos/10'
                    : 'border-nachtblauw/10 hover:border-abrikoos/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-nachtblauw">Hardcover</span>
                  <span className="text-abrikoos text-sm font-medium">€{hardcoverPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-nachtblauw/60">Extra stevig, perfect als cadeau</p>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="bg-wolwit rounded-xl border border-nachtblauw/10 p-6">
            <h3 className="font-semibold text-nachtblauw mb-4">Aantal exemplaren</h3>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => updateData({ quantity: Math.max(1, data.quantity - 1) })}
                className="w-10 h-10 rounded-full bg-zand flex items-center justify-center text-nachtblauw hover:bg-zand/80 transition-colors"
              >
                -
              </button>
              <span className="text-2xl font-bold text-nachtblauw w-12 text-center">{data.quantity}</span>
              <button
                type="button"
                onClick={() => updateData({ quantity: data.quantity + 1 })}
                className="w-10 h-10 rounded-full bg-zand flex items-center justify-center text-nachtblauw hover:bg-zand/80 transition-colors"
              >
                +
              </button>
              {data.quantity > 1 && (
                <span className="text-sm text-nachtblauw/60 ml-4">
                  Extra exemplaren: €19,95 per stuk
                </span>
              )}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-wolwit rounded-xl border border-nachtblauw/10 p-6 space-y-4">
            <h3 className="font-semibold text-nachtblauw">Verzendadres</h3>

            <div>
              <label className="block text-sm font-medium text-nachtblauw mb-1">E-mailadres *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none"
                placeholder="jouw@email.nl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nachtblauw mb-1">Naam *</label>
              <input
                type="text"
                value={shipping.name}
                onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nachtblauw mb-1">Straat + huisnummer *</label>
              <input
                type="text"
                value={shipping.street}
                onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-nachtblauw mb-1">Postcode *</label>
                <input
                  type="text"
                  value={shipping.postalCode}
                  onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nachtblauw mb-1">Plaats *</label>
                <input
                  type="text"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-nachtblauw mb-1">Land</label>
              <select
                value={shipping.country}
                onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-nachtblauw/20 focus:border-abrikoos focus:ring-2 focus:ring-abrikoos/20 outline-none bg-wolwit"
              >
                <option value="NL">Nederland</option>
                <option value="BE">België</option>
              </select>
            </div>
          </div>
        </div>

        {/* Price summary */}
        <div className="lg:col-span-2">
          <div className="bg-zand rounded-xl p-6 sticky top-24">
            <h3 className="font-semibold text-nachtblauw mb-4">Overzicht</h3>

            {isLoadingQuote ? (
              <p className="text-nachtblauw/60 text-sm">Prijs wordt geladen...</p>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-nachtblauw/60">
                    Knuffelboek ({data.coverType === 'hardcover' ? 'hardcover' : 'softcover'})
                  </span>
                  <span className="text-nachtblauw">€{currentPrice.toFixed(2)}</span>
                </div>
                {data.quantity > 1 && (
                  <div className="flex justify-between">
                    <span className="text-nachtblauw/60">{data.quantity - 1}x extra exemplaar</span>
                    <span className="text-nachtblauw">€{extraCopiesPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-nachtblauw/60">Verzending ({shipping.country})</span>
                  <span className="text-saliegroen">{shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-nachtblauw/10 pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-nachtblauw">Totaal</span>
                    <span className="font-bold text-abrikoos">€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleOrder}
              disabled={isOrdering || !isFormValid}
              size="lg"
              className="w-full mt-6"
            >
              {isOrdering ? 'Verwerken...' : 'Afrekenen →'}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-nachtblauw/50">
              <span>🔒</span>
              <span>Veilige online betaling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8">
        <Button onClick={onBack} variant="outline">
          ← Terug naar preview
        </Button>
      </div>
    </div>
  );
}

// Main Wizard Component
export default function MaakJeBoekPage() {
  const [step, setStep] = useState(1);
  const [bookData, setBookData] = useState<BookData>(initialBookData);

  const updateBookData = (updates: Partial<BookData>) => {
    setBookData((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (newStep: number) => {
    setStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zand/50 to-wolwit">
      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-nachtblauw/60 hover:text-abrikoos transition-colors mb-4">
            <span>←</span>
            <span>Terug naar home</span>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-nachtblauw">
            Maak je Knuffelboek
          </h1>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Step Content */}
        <div className="bg-wolwit/80 rounded-3xl p-6 lg:p-10 shadow-sm border border-nachtblauw/5">
          {step === 1 && (
            <Step1Photo
              data={bookData}
              updateData={updateBookData}
              onNext={() => goToStep(2)}
            />
          )}
          {step === 2 && (
            <Step2Personalize
              data={bookData}
              updateData={updateBookData}
              onNext={() => goToStep(3)}
              onBack={() => goToStep(1)}
            />
          )}
          {step === 3 && (
            <Step3Theme
              data={bookData}
              updateData={updateBookData}
              onNext={() => goToStep(4)}
              onBack={() => goToStep(2)}
            />
          )}
          {step === 4 && (
            <Step4Preview
              data={bookData}
              updateData={updateBookData}
              onNext={() => goToStep(5)}
              onBack={() => goToStep(3)}
            />
          )}
          {step === 5 && (
            <Step5Order
              data={bookData}
              updateData={updateBookData}
              onBack={() => goToStep(4)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
