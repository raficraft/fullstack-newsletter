import React, { useState, useRef, createRef, RefObject } from 'react';
import { useClickOutside } from '@hooks/index';

export interface Option {
  label: React.ReactNode;
  value: any;
}

interface UseDropListProps {
  options: Option[];
  callback?: (value: any) => void;
}

interface UseDropListResult {
  selectedIndex: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  refOutsideClick: React.RefObject<HTMLDivElement>;
  handleKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  handleOptionClick: (index: number, option: Option) => void;
  optionsRefs: React.MutableRefObject<RefObject<HTMLButtonElement>[]>;
}

function useDropList({
  options,
  callback,
}: UseDropListProps): UseDropListResult {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [open, setOpen, refOutsideClick] = useClickOutside(false);

  const optionsRefs = useRef<Array<RefObject<HTMLButtonElement>>>(
    options.map(() => createRef())
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'Enter':
      case 'Espace':
        event.preventDefault();
        setOpen(!open);
        if (open) {
          const option = options[selectedIndex].value;
          callback && callback(option);
        }
        break;

      case 'Escape':
        setOpen(false);
        break;

      case 'ArrowUp':
      case 'ArrowDown':
        if (!open) {
          setOpen(true);
        }

        const direction = event.key === 'ArrowUp' ? -1 : 1;
        const index =
          (selectedIndex + direction + options.length) % options.length;
        setSelectedIndex(index);
        break;

      case 'Tab':
        if (open) {
          event.preventDefault();
          const direction = event.shiftKey ? -1 : 1;
          const index =
            (selectedIndex + direction + options.length) % options.length;
          setSelectedIndex(index);
        }
        break;

      default:
        break;
    }
  };

  const handleOptionClick = (index: number, option: Option) => {
    setSelectedIndex(index);
    setOpen(false);
    callback && callback(option.value);
  };

  return {
    selectedIndex,
    open,
    refOutsideClick,
    setOpen,
    handleKeyDown,
    handleOptionClick,
    optionsRefs,
  };
}

export default useDropList;
