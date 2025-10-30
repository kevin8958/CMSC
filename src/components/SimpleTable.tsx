import classNames from "classnames";

const SimpleTable = (props: Common.SimpleTableProps) => {
  const { columns = [], data = [] } = props;
  return (
    <div className="mx-auto w-full overflow-x-scroll">
      <table className="w-full table-auto text-left text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-primary-900 px-4 py-2 font-bold"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-primary-100 border-t">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={classNames("text-primary-900 px-4 py-2", {
                    "min-w-[400px]": col.key === "description",
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
