import { useEffect, useState } from 'react';

export default function StickyNote({ value = '', onChange, placeholder = "Add your today's note" }) {
  const [text, setText] = useState(value || '');
  useEffect(() => setText(value || ''), [value]);

  // autosave to parent after small debounce
  useEffect(() => {
    const t = setTimeout(() => {
      if (onChange) onChange(text);
    }, 400);
    return () => clearTimeout(t);
  }, [text, onChange]);

  return (
    <div className="relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border rounded-md h-28 text-base font-semibold resize-none bg-yellow-50 placeholder-gray-500"
      />
      <div className="absolute right-2 bottom-2 text-xs text-gray-500">Autosaved</div>
    </div>
  );
}
