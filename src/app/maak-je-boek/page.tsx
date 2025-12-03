'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button, SheepMascot } from '@/components';

// Types
interface BookData {
  toyPhoto: File | null;
  toyPhotoPreview: string | null;
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
}

const initialBookData: BookData = {
  toyPhoto: null,
  toyPhotoPreview: null,
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

// Step 1: Photo Upload
function Step1Photo({
  data,
  updateData,
  onNext,
}: {
  data: BookData;
  updateData: (updates: Partial<BookData>) => void;
  onNext: () => void;
}) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateData({
          toyPhoto: file,
          toyPhotoPreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [updateData]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        updateData({
          toyPhoto: file,
          toyPhotoPreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [updateData]);

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
            <div className="flex items-center justify-center gap-2 text-saliegroen">
              <span>✓</span>
              <span className="font-medium">Foto geüpload - achtergrond wordt automatisch verwijderd</span>
            </div>
            <button
              type="button"
              className="text-sm text-nachtblauw/60 hover:text-abrikoos underline"
              onClick={(e) => {
                e.stopPropagation();
                updateData({ toyPhoto: null, toyPhotoPreview: null });
              }}
            >
              Andere foto kiezen
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Schaapje kijkt nieuwsgierig naar camera */}
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
            De achtergrond wordt automatisch verwijderd
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!data.toyPhotoPreview} size="lg">
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
                Leeftijd *
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
            <p className="text-xs text-nachtblauw/60 mt-1">Dit is hoe de knuffel in het verhaal wordt genoemd</p>
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

// Step 4: Preview
function Step4Preview({
  data,
  onNext,
  onBack,
}: {
  data: BookData;
  onNext: () => void;
  onBack: () => void;
}) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Simulate generation
  useState(() => {
    const timer = setTimeout(() => setIsGenerating(false), 3000);
    return () => clearTimeout(timer);
  });

  const selectedTheme = themes.find((t) => t.id === data.theme);

  // Demo pages
  const demoPages = [
    { bg: 'bg-pastelblauw/30', text: `Dit is het verhaal van ${data.childName} en ${data.toyName}.` },
    { bg: 'bg-zand', text: `${data.toyName} was de beste vriend van ${data.childName}.` },
    { bg: 'bg-abrikoos/20', text: `Samen beleefden ze de mooiste avonturen...` },
    { bg: 'bg-saliegroen/20', text: `"Kom mee!" riep ${data.toyName}. "Ik heb een idee!"` },
    { bg: 'bg-zand', text: `En zo begon hun grootste avontuur ooit...` },
    { bg: 'bg-pastelblauw/30', text: `Einde. ${data.childName} en ${data.toyName} leefden nog lang en gelukkig.` },
  ];

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        {/* Schaapje op wolkje - loading state */}
        <div className="mb-6">
          <SheepMascot variant="cloud" size="xl" className="mx-auto animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-nachtblauw mb-3">
          We maken jouw boek...
        </h2>
        <p className="text-nachtblauw/70 mb-8">
          {data.toyName} en {data.childName} komen tot leven in een uniek verhaal.
        </p>
        <div className="w-48 h-2 bg-zand rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-abrikoos rounded-full animate-pulse" style={{ width: '60%' }} />
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
          {data.childName} en {data.toyName}: {selectedTheme?.name}
        </h3>
      </div>

      {/* Book viewer */}
      <div className="bg-wolwit rounded-3xl shadow-xl p-6 lg:p-8 border border-nachtblauw/5">
        {/* Page display */}
        <div className={`aspect-square max-w-md mx-auto ${demoPages[currentPage].bg} rounded-2xl p-8 flex flex-col justify-between mb-6`}>
          <span className="text-xs text-nachtblauw/50">Pagina {currentPage + 1}</span>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-32 h-32 bg-wolwit/50 rounded-xl flex items-center justify-center mb-4">
              {data.toyPhotoPreview ? (
                <img src={data.toyPhotoPreview} alt={data.toyName} className="w-24 h-24 object-cover rounded-lg" />
              ) : (
                <SheepMascot variant="default" size="md" />
              )}
            </div>
            <p className="text-center text-nachtblauw italic">{demoPages[currentPage].text}</p>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mb-4">
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

// Step 5: Order
function Step5Order({
  data,
  updateData,
  onBack,
}: {
  data: BookData;
  updateData: (updates: Partial<BookData>) => void;
  onBack: () => void;
}) {
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const selectedTheme = themes.find((t) => t.id === data.theme);

  const basePrice = 29.95;
  const hardcoverUpgrade = data.coverType === 'hardcover' ? 5 : 0;
  const extraCopies = (data.quantity - 1) * 19.95;
  const total = basePrice + hardcoverUpgrade + extraCopies;

  const handleOrder = async () => {
    setIsOrdering(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOrdering(false);
    setOrderComplete(true);
  };

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
          Je ontvangt een bevestiging per e-mail.
        </p>
        <div className="bg-zand rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-nachtblauw mb-3">Wat gebeurt er nu?</h3>
          <ul className="space-y-2 text-nachtblauw/70">
            <li className="flex items-start gap-2">
              <span className="text-saliegroen">1.</span>
              We maken de illustraties met jouw knuffel
            </li>
            <li className="flex items-start gap-2">
              <span className="text-saliegroen">2.</span>
              Het boek wordt geprint en gebonden
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
        <Button href="/">
          Terug naar home
        </Button>
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
          Controleer je bestelling en rond af.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Order summary */}
        <div className="lg:col-span-3 space-y-6">
          {/* Book summary */}
          <div className="bg-wolwit rounded-xl border border-nachtblauw/10 p-6">
            <h3 className="font-semibold text-nachtblauw mb-4">Je boek</h3>
            <div className="flex gap-4">
              <div className="w-20 h-24 bg-zand rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">{selectedTheme?.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-nachtblauw">{data.childName} en {data.toyName}: {selectedTheme?.name}</p>
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
                  <span className="text-nachtblauw/60 text-sm">Inbegrepen</span>
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
                  <span className="text-abrikoos text-sm font-medium">+€5,00</span>
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
        </div>

        {/* Price summary */}
        <div className="lg:col-span-2">
          <div className="bg-zand rounded-xl p-6 sticky top-24">
            <h3 className="font-semibold text-nachtblauw mb-4">Overzicht</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-nachtblauw/60">Knuffelboek (softcover)</span>
                <span className="text-nachtblauw">€29,95</span>
              </div>
              {data.coverType === 'hardcover' && (
                <div className="flex justify-between">
                  <span className="text-nachtblauw/60">Hardcover upgrade</span>
                  <span className="text-nachtblauw">€5,00</span>
                </div>
              )}
              {data.quantity > 1 && (
                <div className="flex justify-between">
                  <span className="text-nachtblauw/60">{data.quantity - 1}x extra exemplaar</span>
                  <span className="text-nachtblauw">€{((data.quantity - 1) * 19.95).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-nachtblauw/60">Verzending (NL/BE)</span>
                <span className="text-saliegroen">Gratis</span>
              </div>
              <div className="border-t border-nachtblauw/10 pt-3 mt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-nachtblauw">Totaal</span>
                  <span className="font-bold text-abrikoos">€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleOrder}
              disabled={isOrdering}
              size="lg"
              className="w-full mt-6"
            >
              {isOrdering ? 'Verwerken...' : 'Afrekenen →'}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-nachtblauw/50">
              <span>🔒</span>
              <span>Veilig betalen via iDEAL, Bancontact of creditcard</span>
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
