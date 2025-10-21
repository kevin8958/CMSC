'use client';

import React from 'react';
import Avatar from './Avatar'; // 기존 Avatar
import classNames from 'classnames';

const AvatarStack = ({
  users,
  max = 5,
  overlap = -8,
  size = 'md',
  classes,
}: Common.AvatarStackProps) => {
  const displayed = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={classNames('flex items-center', classes)}>
      {displayed.map((user, idx) => (
        <div
          key={user.name || '' + idx}
          className="relative"
          style={{ marginLeft: idx === 0 ? 0 : overlap }}
        >
          <Avatar {...user} size={size} />
        </div>
      ))}

      {remaining > 0 && (
        <div
          className={classNames(
            'text-primary-100 flex items-center justify-center rounded-full font-semibold',
            {
              'h-[40px] w-[40px] text-sm': size === 'sm',
              'h-[55px] w-[55px] text-base': size === 'md',
              'h-[65px] w-[65px] text-lg': size === 'lg',
            },
          )}
          style={{ marginLeft: -8 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarStack;
