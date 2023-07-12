import React, { FC, HTMLAttributes } from 'react';

interface TextProps extends HTMLAttributes<HTMLElement> {
  tag?: keyof TextElementMap;
  children: React.ReactNode;
}

type TextElementMap = {
  span: HTMLSpanElement;
  h1: HTMLHeadingElement;
  h2: HTMLHeadingElement;
  h3: HTMLHeadingElement;
  h4: HTMLHeadingElement;
  h5: HTMLHeadingElement;
  h6: HTMLHeadingElement;
  p: HTMLParagraphElement;
  blockquote: HTMLQuoteElement;
  em: HTMLElement;
  i: HTMLElement;
  pre: HTMLElement;
  sub: HTMLElement;
  sup: HTMLElement;
  strong: HTMLElement;
  summary: HTMLElement;
  legend: HTMLElement;
};

const Text: FC<TextProps> = ({ tag = 'p', children, ...rest }) => {
  const Tag = tag as keyof TextElementMap;
  return <Tag {...rest}>{children}</Tag>;
};

export default Text;
