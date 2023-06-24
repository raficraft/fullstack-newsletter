import { DropList } from "@atoms/index";

const config = [
  { label: "Sans-serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
];

const changeFont = (font: string) => {
  const root = document.querySelector(":root");
  const selectedOption = config.find((option) => option.value === font);
  if (selectedOption) {
    document.body.style.setProperty("--font-family", selectedOption.value);
  }
};

const SwitchFont = () => {
  return (
    <DropList
      options={config}
      callback={(font: string) => {
        changeFont(font);
      }}
    />
  );
};

export default SwitchFont;
