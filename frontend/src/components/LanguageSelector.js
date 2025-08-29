import React from 'react';

const LanguageSelector = ({ selectedLanguage, onLanguageChange, disabled }) => {
  const languages = [
    { code: 'eng', name: 'English', flag: '🇺🇸' },
    { code: 'hin', name: 'Hindi', flag: '🇮🇳' },
    { code: 'eng+hin', name: 'English + Hindi', flag: '🌐' },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select OCR Language
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            disabled={disabled}
            className={`
              flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200
              ${
                selectedLanguage === language.code
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-2xl">{language.flag}</span>
            <div className="text-left">
              <p className="font-medium">{language.name}</p>
              <p className="text-xs text-gray-500">{language.code}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
