import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check } from 'lucide-react';

interface ChecklistItemProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onToggle: (id: string) => void;
}

function ChecklistItem({ id, label, description, checked, onToggle }: ChecklistItemProps) {
  return (
    <button
      onClick={() => onToggle(id)}
      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
        checked 
          ? 'bg-[hsl(25,95%,55%,0.1)] border border-[hsl(25,95%,55%,0.25)]' 
          : 'bg-white/5 border border-transparent hover:border-white/10'
      }`}
    >
      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
        checked 
          ? 'bg-[hsl(25,95%,55%)] border-[hsl(25,95%,55%)]' 
          : 'border-white/30'
      }`}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium ${checked ? 'text-[hsl(25,95%,65%)] line-through' : 'text-white'}`}>
          {label}
        </span>
        {description && (
          <p className={`text-xs mt-0.5 ${checked ? 'text-white/30' : 'text-[hsl(210,40%,60%)]'}`}>
            {description}
          </p>
        )}
      </div>
    </button>
  );
}

const STORAGE_KEY = 'bitcoin-roatan-checklist';

export function GettingStartedChecklist() {
  const { t } = useLanguage();
  
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
  }, [checkedItems]);

  const handleToggle = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistItems = [
    { id: 'wallet', labelKey: 'checklist.wallet', descKey: 'checklist.wallet.desc' },
    { id: 'backup', labelKey: 'checklist.backup', descKey: 'checklist.backup.desc' },
    { id: 'sats', labelKey: 'checklist.sats', descKey: 'checklist.sats.desc' },
    { id: 'test', labelKey: 'checklist.test', descKey: 'checklist.test.desc' },
    { id: 'merchant', labelKey: 'checklist.merchant', descKey: 'checklist.merchant.desc' },
    { id: 'community', labelKey: 'checklist.community', descKey: 'checklist.community.desc' },
  ];

  const completedCount = checklistItems.filter(item => checkedItems[item.id]).length;
  const progress = (completedCount / checklistItems.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[hsl(25,95%,55%)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-white/50">
          {completedCount}/{checklistItems.length}
        </span>
      </div>

      <div className="space-y-2">
        {checklistItems.map(item => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            label={t(item.labelKey)}
            description={t(item.descKey)}
            checked={!!checkedItems[item.id]}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {completedCount === checklistItems.length && (
        <div className="p-3 rounded-lg bg-[hsl(25,95%,55%,0.1)] border border-[hsl(25,95%,55%,0.25)] text-center">
          <span className="text-sm font-medium text-[hsl(25,95%,65%)]">
            {t('checklist.complete')} 🎉
          </span>
        </div>
      )}
    </div>
  );
}
