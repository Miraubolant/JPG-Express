import React from 'react';
import { ImageIcon, Folder, Download, Zap } from 'lucide-react';

const features = [
  {
    name: 'Conversion Multiple',
    description: 'Convertissez plusieurs images simultanément en quelques secondes',
    icon: ImageIcon,
  },
  {
    name: 'Support de Dossiers',
    description: 'Glissez-déposez des dossiers entiers pour une conversion en masse',
    icon: Folder,
  },
  {
    name: 'Traitement Local',
    description: 'Vos fichiers restent sur votre ordinateur pour une sécurité maximale',
    icon: Zap,
  },
  {
    name: 'Téléchargement Facile',
    description: 'Téléchargez vos images converties individuellement ou en lot',
    icon: Download,
  },
];

export function Features() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            Fonctionnalités
          </h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Une solution complète
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  {feature.name}
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}