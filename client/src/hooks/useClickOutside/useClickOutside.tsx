import { useEffect, useRef, useState } from "react";

const useClickOutside = (
  init: boolean
): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  React.MutableRefObject<any>
] => {
  const refOutsideClick = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(init);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      refOutsideClick.current &&
      !refOutsideClick.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [refOutsideClick]);

  return [open, setOpen, refOutsideClick];
};

export default useClickOutside;
