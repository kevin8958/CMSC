namespace Interaction {
  /** SplitText */
  type SplitTextVariant = 'H1' | 'H2' | 'H3' | 'B1' | 'B2' | 'C1';
  interface SplitTextProps {
    text: string;
    classes?: string;
    variant?: SplitTextVariant;
    delay?: number; // ms per letter
    repeat?: boolean;
  }
}
