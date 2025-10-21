'use client';

import classNames from 'classnames';

const SimpleTable = (props: Common.SimpleTableProps) => {
  const { columns = [], data = [] } = props;
  return (
    <div className="border-primary-500 mx-auto w-full overflow-x-scroll rounded-lg border shadow-md">
      <table className="w-full table-auto text-left text-sm">
        <thead className="bg-gray-700/30">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="text-secondary-500 cursor-pointer p-4 font-normal">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-primary-500 border-t">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={classNames('text-primary-100 px-4 py-2', {
                    'min-w-[400px]': col.key === 'description',
                  })}
                >
                  {item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default SimpleTable;
