'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

const BreadCrumb = (props: Layout.BreadCrumbProps) => {
  const { items } = props;

  const pathname = usePathname();

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-1">
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <li
              key={item.label}
              className={classNames('flex items-center gap-1 text-sm font-semibold', {
                'text-secondary-300 !font-bold': isActive,
                'text-primary-200': !isActive,
                'hover:text-gray-300': !isActive && item.href,
              })}
            >
              {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
              {index < items.length - 1 && <FaChevronRight className="text-primary-200 text-xs" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
