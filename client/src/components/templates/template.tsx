import { Header } from "@organisms/index";

type TemplateProps = {
  children?: React.ReactNode;
};

const Template = ({ children }: TemplateProps) => {
  return (
    <div className="rootContainer">
      <Header></Header>
      {children}
    </div>
  );
};

export default Template;
