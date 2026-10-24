import React, { useState } from 'react';
import { Phone, ExternalLink, Heart, Globe, AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { EMERGENCY_HELPLINES } from '../../lib/constants';
import { useApp } from '../../context/AppContext';

export const EmergencyHelpModal: React.FC = () => {
  const { isEmergencyModalOpen, closeEmergencyModal } = useApp();
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'India' | 'US/Canada' | 'UK' | 'Global'>('All');

  const filteredHelplines = EMERGENCY_HELPLINES.filter((h) => {
    if (selectedRegion === 'All') return true;
    return h.region === selectedRegion;
  });

  return (
    <Modal
      isOpen={isEmergencyModalOpen}
      onClose={closeEmergencyModal}
      maxWidth="lg"
      title="You are not alone. Please reach out."
      subtitle="If you are experiencing severe distress, considering hurting yourself, or feel unsafe right now, compassionate human help is waiting for you."
    >
      <div className="space-y-6">
        {/* Supportive calming message */}
        <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-3">
          <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-content-primary space-y-1">
            <p className="font-semibold text-rose-500">
              Your safety and life are precious.
            </p>
            <p className="text-content-secondary leading-relaxed">
              These verified helplines are free, completely confidential, and staffed by trained counselors who understand and will not judge or pressure you.
            </p>
          </div>
        </div>

        {/* Region filter */}
        <div className="flex flex-wrap gap-2 text-xs">
          {(['All', 'India', 'US/Canada', 'UK', 'Global'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-3.5 py-1.5 rounded-full transition-all font-medium ${
                selectedRegion === r
                  ? 'bg-lavender-500 text-white shadow-soft'
                  : 'bg-lavender-100 text-lavender-800 hover:bg-lavender-200'
              }`}
            >
              {r === 'All' ? 'All Regions' : r}
            </button>
          ))}
        </div>

        {/* Helpline list */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {filteredHelplines.map((helpline) => (
            <div
              key={helpline.id}
              className="p-4 rounded-2xl bg-surface-muted/50 border border-lavender-100 hover:border-lavender-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-content-primary">
                    {helpline.name}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-lavender-100 text-lavender-700 font-medium">
                    {helpline.region}
                  </span>
                </div>
                <p className="text-xs text-content-secondary leading-relaxed max-w-md">
                  {helpline.description}
                </p>
                <p className="text-[11px] text-sage-700 font-medium">
                  Availability: {helpline.available}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${helpline.contact.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-lavender-500 text-white text-xs font-semibold hover:bg-lavender-600 transition-colors shadow-soft"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{helpline.contact}</span>
                </a>
                {helpline.link && (
                  <a
                    href={helpline.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-lavender-100 text-lavender-700 hover:bg-lavender-200 transition-colors"
                    title="Open website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Immediate Danger Note */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            If you are in immediate physical danger, please dial your local emergency services (e.g. 112 in India/Europe, 911 in North America, 999 in the UK) or go to the nearest emergency medical room.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={closeEmergencyModal}
            className="text-xs text-content-secondary hover:text-content-primary font-medium px-4 py-2"
          >
            Close this dialog
          </button>
        </div>
      </div>
    </Modal>
  );
};
