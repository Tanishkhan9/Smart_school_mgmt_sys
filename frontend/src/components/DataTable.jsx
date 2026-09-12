export default function DataTable({ columns, rows, empty = 'No records found.' }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy/8 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-cream text-navy/70">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-center text-navy/50" colSpan={columns.length}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row._id || row.id} className="border-t border-navy/6 hover:bg-cream/50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-top">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
