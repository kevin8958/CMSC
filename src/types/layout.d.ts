namespace Layout {
  /** PageWrapper */
  interface PageWrapperProps {
    children: React.ReactNode;
  }
  /** FlexWrapper */
  interface FlexWrapperProps {
    direction?: 'row' | 'col';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around';
    items?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
    classes?: string;
    children?: React.ReactNode;
  }

  /** MenuButton */
  interface MenuButtonProps {
    label: string;
    href: string | null;
    locale: string;
    isItem?: boolean;
    items?: Array<{ id: string; label: string; href: string }>;
  }

  /** BreadCrumb */
  interface BreadCrumbProps {
    items: Array<{ label: string; href?: string }>;
  }

  /** ScrollShadow */
  type ScrollShadowDirection = 'top' | 'bottom';
  interface ScrollShadowProps {
    direction?: ScrollShadowDirection;
  }

  /** GnbButton */
  interface GnbButtonProps {
    href: string;
    isActive: boolean;
    children: React.ReactNode;
  }
}
