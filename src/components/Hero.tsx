import React from 'react';
import { ImageIcon, Folder, Download } from 'lucide-react';

export function Hero() {
  return (
    <div className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Convertisseur JPG
            <span className="block text-blue-600 dark:text-blue-400">Simple et Rapide</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Convertissez vos images en JPG instantanément. Supportant les conversions individuelles,
            multiples et même des dossiers entiers.
          </p>
          <div className="mt-8 flex justify-center space-x-8">
            <div className="text-center">
              <div className="flex justify-center">
                <ImageIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Images Uniques</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Folder className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Dossiers Complets</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Download className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Téléchargement Rapide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}