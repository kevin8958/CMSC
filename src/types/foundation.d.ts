namespace Foundation {
  /** Typography */
  type TypographyColor = 'primary' | 'secondary';
  type TypographyVariant = 'H1' | 'H2' | 'H3' | 'H4' | 'B1' | 'B2' | 'C1';
  interface TypographyProps {
    classes?: string;
    color?: TypographyColor;
    variant: TypographyVariant;
    children?: React.ReactNode | string;
  }
}
