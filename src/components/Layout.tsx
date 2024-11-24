import React from 'react';
import { ImageIcon, ExternalLink } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 dark:border-gray-700 backdrop-blur-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-xl text-gray-900 dark:text-white">JPG Express</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://fichier.miraubolant.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Renommé fichier
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">{children}</main>
      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Conversion effectuée localement dans votre navigateur
          </p>
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            Créé par Victor Mirault
          </p>
        </div>
      </footer>
    </div>
  );
}