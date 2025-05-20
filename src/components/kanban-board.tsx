import Column from './column';

export default function KanbanBoard({ columns, setColumns } : any) {
  return (
    <div className="flex gap-4 overflow-x-auto no-scroll md:grid md:grid-cols-3">
      {Object.entries(columns).map(([key, column]) => (
        <Column
          key={key}
          columnKey={key}
          column={column}
          columns={columns}
          setColumns={setColumns}
        />
      ))}
    </div>
  );
}